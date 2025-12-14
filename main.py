"""
Call Break - Local Multiplayer Card Game
Main Application Entry Point

Wires together UI navigation, networking callbacks, and core game state.
"""

import uuid

from kivy.app import App
from kivy.clock import Clock
from kivy.core.window import Window
from kivy.properties import BooleanProperty, ListProperty, NumericProperty, ObjectProperty, StringProperty
from kivy.uix.screenmanager import FadeTransition, Screen, ScreenManager
from kivy.utils import platform

from game.game_logic import GameState
from networking.message_handler import MessageType
from networking.wifi_client import WiFiGameClient
from networking.wifi_server import WiFiGameServer
from ui.screens.bidding_overlay import BiddingOverlay
from ui.screens.final_results_screen import FinalResultsScreen
from ui.screens.game_screen import GameScreen
from ui.screens.horror_intro_screen import HorrorIntroScreen
from ui.screens.main_menu_screen import MainMenuScreen
from ui.screens.modern_host_screen import ModernHostScreen
from ui.screens.modern_join_screen import ModernJoinScreen
from ui.screens.score_screen import ScoreScreen
from ui.screens.splash_screen import SplashScreen
from ui.screens.trump_selection_screen import TrumpSelectionScreen
from ui.screens.waiting_lobby_screen import WaitingLobbyScreen
from utils.logger import setup_logger
from utils.permissions import request_all_permissions


class ContentScreen(Screen):
    """Screen wrapper that forwards attribute access to its content widget."""

    def __init__(self, content, **kwargs):
        # Set content first so any early attribute lookups during super().__init__ work.
        self.content = content
        super().__init__(**kwargs)
        self.add_widget(content)

    def __getattr__(self, item):
        # Avoid recursion by fetching content directly from object.__getattribute__.
        try:
            return super().__getattribute__(item)
        except AttributeError:
            content = object.__getattribute__(self, "content")
            return getattr(content, item)


class CallBreakApp(App):
    """Main application class managing game state and navigation."""

    game_state = ObjectProperty(None)
    network_client = ObjectProperty(None)
    network_server = ObjectProperty(None)
    is_host = BooleanProperty(False)
    player_id = StringProperty("")
    player_name = StringProperty("Player")
    current_trump_suit = StringProperty("")
    connected_players = ListProperty([])
    current_round_number = NumericProperty(0)
    current_game_phase = StringProperty("lobby")

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.logger = setup_logger()
        self.screen_manager = None
        self.player_id = str(uuid.uuid4())

    def build(self):
        request_all_permissions()
        if platform != "android":  # avoid constraining size on devices
            Window.size = (360, 640)
        Window.clearcolor = (0.1, 0.15, 0.1, 1)

        self.screen_manager = ScreenManager(transition=FadeTransition(duration=0.3))
        self.screen_manager.add_widget(ContentScreen(HorrorIntroScreen(self), name="intro"))
        self.screen_manager.add_widget(ContentScreen(SplashScreen(), name="splash"))
        self.screen_manager.add_widget(ContentScreen(MainMenuScreen(self), name="menu"))
        self.screen_manager.add_widget(ContentScreen(ModernHostScreen(self), name="host"))
        self.screen_manager.add_widget(ContentScreen(ModernJoinScreen(self), name="join"))
        self.screen_manager.add_widget(ContentScreen(WaitingLobbyScreen(), name="waiting"))
        self.screen_manager.add_widget(ContentScreen(TrumpSelectionScreen(), name="trump_selection"))
        self.screen_manager.add_widget(ContentScreen(GameScreen(), name="game"))
        self.screen_manager.add_widget(ContentScreen(BiddingOverlay(), name="bidding"))
        self.screen_manager.add_widget(ContentScreen(ScoreScreen(), name="score"))
        self.screen_manager.add_widget(ContentScreen(FinalResultsScreen(), name="final_results"))

        self.screen_manager.current = "intro"
        return self.screen_manager

    # ---------- Navigation helpers ----------

    def goto_screen(self, screen_name: str, direction: str = "left"):
        if not self.screen_manager:
            return
        self.screen_manager.transition.direction = direction
        self.screen_manager.current = screen_name

    # ---------- Message routing ----------

    def on_network_message(self, message):
        self._update_round_phase(message)
        msg_type = message.get("type")
        handlers = {
            MessageType.LOBBY_UPDATE: self.handle_lobby_update,
            MessageType.GAME_START: self.handle_game_start,
            MessageType.ROUND_START: self.handle_round_start,
            MessageType.CARDS_DEALT: self.handle_cards_dealt,
            MessageType.TRUMP_CHOOSER_SELECTED: self.handle_trump_chooser_selected,
            MessageType.TRUMP_SELECTION_REQUEST: self.handle_trump_request,
            MessageType.TRUMP_SELECTED: self.handle_trump_chosen,
            MessageType.BID_TURN: self.handle_bid_turn,
            MessageType.BIDDING_STATUS: self.handle_bidding_status,
            MessageType.BID_MADE: self.handle_bid_made,
            MessageType.BIDDING_COMPLETE: self.handle_bidding_complete,
            MessageType.PLAY_TURN: self.handle_play_turn,
            MessageType.PLAYING_STATUS: self.handle_playing_status,
            MessageType.CARD_PLAYED: self.handle_card_played,
            MessageType.TRICK_WON: self.handle_trick_won,
            MessageType.ROUND_END: self.handle_round_end,
            MessageType.GAME_END: self.handle_game_end,
            MessageType.PLAYER_DISCONNECT: self.handle_player_disconnect,
            MessageType.STATE_SYNC_SNAPSHOT: self.handle_state_sync_snapshot,
            MessageType.ERROR: self.handle_error,
        }
        handler = handlers.get(msg_type)
        if handler:
            Clock.schedule_once(lambda *_: handler(message))
        else:
            self.logger.warning(f"Unknown message type: {msg_type}")

    # ---------- Message handlers ----------

    def _update_round_phase(self, message):
        round_number = message.get("round_number") or 0
        if round_number and round_number > self.current_round_number:
            self.current_round_number = round_number
            if self.game_state:
                self.game_state.current_round = round_number
            if self.network_server:
                self.network_server.current_round = round_number
        phase = message.get("phase")
        if phase:
            self.current_game_phase = phase

    def handle_lobby_update(self, message):
        self.connected_players = message.get("players", [])
        max_players = message.get("max_players")
        host_screen = self.screen_manager.get_screen("host")
        if host_screen:
            host_screen.update_players(self.connected_players, max_players)
        if self.screen_manager.current == "waiting":
            waiting = self.screen_manager.get_screen("waiting")
            waiting.update_players(self.connected_players, max_players)

    def handle_round_start(self, message):
        round_number = message.get("round_number") or 1
        total_rounds = message.get("total_rounds") or 5
        self.current_round_number = max(self.current_round_number, round_number)
        if self.game_state:
            self.game_state.current_round = self.current_round_number
            self.game_state.num_rounds = total_rounds
        if self.network_server:
            self.network_server.current_round = self.current_round_number
        game = self.screen_manager.get_screen("game")
        game.round_number = self.current_round_number
        game.total_rounds = total_rounds
        game.refresh_header()

    def handle_game_start(self, message):
        player_order = message.get("player_order", [])
        num_rounds = message.get("num_rounds", 5)
        self.game_state = GameState(num_players=len(player_order), num_rounds=num_rounds)
        self.game_state.player_order = player_order
        self.game_state.phase = "DEALING"
        self.goto_screen("game")

    def handle_round_start(self, message):
        round_number = message.get("round_number") or 1
        total_rounds = message.get("total_rounds") or 5
        self.current_round_number = max(self.current_round_number, round_number)
        if self.game_state:
            self.game_state.current_round = self.current_round_number
            self.game_state.num_rounds = total_rounds
        if self.network_server:
            self.network_server.current_round = self.current_round_number
        game = self.screen_manager.get_screen("game")
        game.round_number = self.current_round_number
        game.total_rounds = total_rounds
        game.refresh_header()

    def handle_cards_dealt(self, message):
        cards = message.get("cards", [])
        round_number = message.get("round_number", 0) or 0
        if round_number and round_number > self.current_round_number:
            self.current_round_number = round_number
            if self.game_state:
                self.game_state.current_round = round_number
            if self.network_server:
                self.network_server.current_round = round_number
        self.current_game_phase = "dealing"
        game = self.screen_manager.get_screen("game")
        game.display_hand(cards)
        if self.is_host and self.network_server:
            Clock.schedule_once(lambda *_: self.network_server.mark_dealing_complete(), 0.1)

    def handle_trump_chooser_selected(self, message):
        chooser_id = message.get("player_id")
        chooser_name = message.get("player_name", "")
        if self.game_state:
            self.game_state.trump_chooser_id = chooser_id
        current_screen = self.screen_manager.current
        if chooser_id == self.player_id:
            if current_screen == "game":
                game = self.screen_manager.get_screen("game")
                game.show_notification("You're choosing the trump suit!", duration=2.0)
                Clock.schedule_once(lambda *_: self.goto_screen("trump_selection"), 2.2)
            else:
                self.goto_screen("trump_selection")
        else:
            game = self.screen_manager.get_screen("game")
            game.show_trump_waiting(chooser_name)

    def handle_trump_request(self, message):
        available = message.get("available_suits", [])
        timeout = message.get("timeout_seconds", 30)
        if self.screen_manager.current != "trump_selection":
            self.goto_screen("trump_selection")
        trump_screen = self.screen_manager.get_screen("trump_selection")
        trump_screen.setup_selection(available_suits=available, timeout_seconds=timeout)

    def handle_trump_chosen(self, message):
        trump_suit = message.get("trump_suit", "")
        chooser_name = message.get("chooser_name", "")
        auto_selected = message.get("auto_selected", False)
        round_number = message.get("round_number", 0)
        if round_number and round_number > self.current_round_number:
            self.current_round_number = round_number
        self.current_game_phase = "bidding"
        self.current_trump_suit = trump_suit
        if self.game_state:
            self.game_state.update_trump_suit(trump_suit)
        if self.screen_manager.current != "game":
            self.goto_screen("game")
        game = self.screen_manager.get_screen("game")
        announcement = f"{chooser_name} chose {trump_suit} as Trump!" if not auto_selected else f"Time's up! {trump_suit} auto-selected"
        game.show_trump_announcement(trump_suit, announcement_text=announcement, duration=3.0)
        game.update_trump_indicator(trump_suit)
        game.update_hand_trump_glows(trump_suit)

    def handle_bid_turn(self, message):
        player_id = message.get("player_id")
        self.current_game_phase = "bidding"
        if player_id == self.player_id:
            self.goto_screen("bidding")
            bidding = self.screen_manager.get_screen("bidding")
            bidding.setup_bid(message.get("min_bid", 1), message.get("max_bid", 13))
        else:
            game = self.screen_manager.get_screen("game")
            game.show_bidding_waiting(player_id)

    def handle_bidding_status(self, message):
        game = self.screen_manager.get_screen("game")
        game.show_bidding_status(
            current_bidder=message.get("current_bidder", ""),
            bids_so_far=message.get("bids_so_far", 0),
            total_players=message.get("total_players", 0),
        )

    def handle_bid_made(self, message):
        game = self.screen_manager.get_screen("game")
        game.update_player_bid(message.get("player_id"), message.get("amount"))

    def handle_bidding_complete(self, message):
        self.current_game_phase = "playing"
        if self.screen_manager.current == "bidding":
            self.goto_screen("game")
        game = self.screen_manager.get_screen("game")
        game.start_playing_phase(message.get("all_bids", {}))

    def handle_play_turn(self, message):
        game = self.screen_manager.get_screen("game")
        player_id = message.get("player_id")
        if player_id == self.player_id:
            game.enable_card_play(message.get("valid_cards", []))
        else:
            game.show_play_waiting(player_id)

    def handle_playing_status(self, message):
        game = self.screen_manager.get_screen("game")
        game.show_playing_status(
            current_player=message.get("current_player", ""),
            trick_size=message.get("trick_size", 0),
        )

    def handle_card_played(self, message):
        game = self.screen_manager.get_screen("game")
        game.animate_card_to_table(
            message.get("player_id"),
            message.get("card"),
            message.get("trick_cards", []),
        )

    def handle_trick_won(self, message):
        game = self.screen_manager.get_screen("game")
        game.animate_trick_win(
            winner_id=message.get("winner_id"),
            cards=message.get("cards", []),
            tricks_count=message.get("tricks_won_count", {}),
        )

    def handle_round_end(self, message):
        self.current_game_phase = "round_end"
        round_number = message.get("round_number", self.current_round_number)
        if round_number and round_number > self.current_round_number:
            self.current_round_number = round_number
        self.goto_screen("score")
        score = self.screen_manager.get_screen("score")
        score.display_scores(
            round_number=round_number or (self.game_state.current_round if self.game_state else 1),
            round_scores=message.get("scores", {}),
            total_scores=message.get("total_scores", {}),
            tricks_won=message.get("tricks_won", {}),
        )

    def handle_game_end(self, message):
        self.goto_screen("final_results")
        results = self.screen_manager.get_screen("final_results")
        results.display_final_results(
            final_scores=message.get("final_scores", {}),
            winner_id=message.get("winner_id") or message.get("winner"),
            all_rounds=message.get("all_round_scores", []),
        )

    def handle_state_sync_snapshot(self, message):
        # Minimal hydration: update round, phase, trump, and trick/bid overlays if present.
        self.current_round_number = message.get("round_number") or self.current_round_number
        self.current_game_phase = message.get("phase", self.current_game_phase)
        if self.game_state:
            self.game_state.current_round = self.current_round_number
            if message.get("trump_suit"):
                self.game_state.update_trump_suit(message.get("trump_suit"))
        if message.get("trump_suit"):
            self.current_trump_suit = message.get("trump_suit")
        game = self.screen_manager.get_screen("game")
        if message.get("trump_suit"):
            game.update_trump_indicator(message.get("trump_suit"))
        if message.get("current_trick"):
            game.trick_display.set_trick([
                {"player_name": pid, "card_code": card} for pid, card in message.get("current_trick", [])
            ])
        if message.get("tricks_won_count"):
            game.update_all_trick_counts(message.get("tricks_won_count"))
        if message.get("bids"):
            for pid, bid in message.get("bids", {}).items():
                game.update_player_bid(pid, bid)
        hands = message.get("hands", {})
        if hands.get("self"):
            game.display_hand(hands.get("self"))
        game.refresh_header()

    def handle_player_disconnect(self, message):
        self.logger.warning(f"Player disconnected: {message}")

    def handle_error(self, message):
        self.logger.error(f"Error message received: {message}")

    # ---------- WiFi helpers ----------

    def start_wifi_server(self, num_players: int):
        self.is_host = True
        self.game_state = GameState(num_players=num_players)
        self.network_server = WiFiGameServer(
            max_players=num_players,
            game_callback=self.on_network_message,
        )
        self.network_server.game_state = self.game_state
        self.network_server.host_player_id = self.player_id
        self.network_server.host_player_name = self.player_name
        self.network_server.ready_players.add(self.player_id)
        started, game_code, ip = self.network_server.start()
        if started:
            host_screen = self.screen_manager.get_screen("host")
            host_screen.setup_host(game_code, ip or self.network_server.local_ip, num_players, self.player_name)
            self.goto_screen("host")
            return True, "Server started"
        return False, "Failed to start WiFi server"

    def connect_wifi_client(self, host_ip: str, port: int | None = None):
        self.is_host = False
        self.network_client = WiFiGameClient(host_ip=host_ip, port=port or 5555, message_callback=self.on_network_message)
        success, message = self.network_client.connect(self.player_name)
        if success:
            self.goto_screen("waiting")
            return True, message
        return False, message

    # ---------- Cleanup ----------

    def on_stop(self):
        if self.network_client:
            self.network_client.disconnect()
        if self.network_server:
            self.network_server.stop()


def main():
    CallBreakApp().run()


if __name__ == "__main__":
    main()
