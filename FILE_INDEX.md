# Call Break Project - File Index (WiFi-Only)

## Root Files
- main.py - Application entry with screen wiring and networking hooks
- buildozer.spec - Android build configuration (WiFi-only permissions)
- README.md - User/developer guide
- QUICKSTART.md - Build and play quickstart
- IMPLEMENTATION_SUMMARY.md - Current technical snapshot

## game/ - Core Logic
- card.py - Card and Deck classes, deck configuration helper
- player.py - Player state (hand, bids, tricks, scores)
- game_logic.py - Game flow (lobby -> dealing -> bidding -> playing -> scoring)
- trick_validator.py - Suit/trump/higher-trump validation
- scoring.py - Exact/over/under scoring and leaderboard helpers

## networking/ - WiFi Only
- wifi_server.py - TCP host for 2-12 players, broadcast/unicast
- wifi_client.py - TCP client with callbacks and reconnection handling
- game_code.py - ACTIVE_GAMES registry and game-code resolution utilities
- message_handler.py - JSON protocol helpers and message types
- connection_manager.py - Connection lifecycle utilities

## ui/screens/
- horror_intro_screen.py - Intro animation to menu
- splash_screen.py - Branding transition
- main_menu_screen.py - Modern hub with player selector, host/join cards, scan popup
- modern_host_screen.py - Host view with game code, players grid, start controls
- modern_join_screen.py - Join view with 6-digit code boxes and nearby scan
- waiting_lobby_screen.py - Waiting state while host starts the match
- game_screen.py - In-round UI scaffold (needs polish)
- trump_selection_screen.py - Trump choice prompts
- bidding_overlay.py - Bidding overlay wiring
- score_screen.py - Score display scaffold
- final_results_screen.py - End-of-game summary

## ui/widgets/
- modern_controls.py - Modern buttons/icons used across screens
- card_widget.py - Card visuals (TODO)
- player_widget.py - Player info display (TODO)
- trick_display.py - Trick area (TODO)

## utils/
- helpers.py - IP detection, deck config, WiFi recommendations
- permissions.py - WiFi/network permission requests
- logger.py - Logging configuration

## tests/
- test_game_logic.py - Game logic tests
- test_scoring.py - Scoring tests
- test_networking.py - Protocol tests

## Status Highlights
- Ready: core rules, WiFi networking, modern connection UI, logging/build config
- To improve: in-round UI polish, visual/audio assets, expanded automated tests

## Quick Commands
- Run app: python main.py
- Run tests: python tests/test_game_logic.py; python tests/test_scoring.py; python tests/test_networking.py
- Build APK: buildozer android debug
