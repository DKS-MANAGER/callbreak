# Game Architecture

## Overview
Call Break is a multiplayer trick-taking card game with real-time synchronization through WebSocket connections.

## Architecture Components

### 1. Client (React Native App)
- **Main Menu**: Create or join games
- **Lobby**: Wait for players and configure game
- **Game Board**: Play cards and track game state
- **Components**: Reusable UI elements (cards, modals, scoreboards)

### 2. Server (Node.js + Socket.IO)
- Manages game state for all active games
- Handles player connections and disconnections
- Synchronizes game state across all clients
- Validates game rules and moves

### 3. Game Logic (Shared)
- Card management (deck creation, shuffling, dealing)
- Game rules enforcement
- Trick winner determination
- Score calculation
- Player count configuration

## Data Flow

```
Client (Player 1) -> Socket.IO -> Server -> Socket.IO -> All Clients
```

### Example: Playing a Card
1. Player taps a card in their hand
2. Client validates it's their turn
3. Client emits 'play-card' event to server
4. Server validates the move
5. Server updates game state
6. Server broadcasts updated state to all players
7. All clients update their UI

## Game State Structure

```typescript
GameState {
  id: string              // Unique game identifier
  players: Player[]       // Array of all players
  currentRound: number    // Current round number
  currentTrick: Trick     // Cards played in current trick
  currentPlayerIndex: number  // Index of player whose turn it is
  phase: GamePhase        // LOBBY, BIDDING, PLAYING, ROUND_END
  config: GameConfig      // Player count, cards per player, deck count
}
```

## Game Phases

1. **LOBBY**: Waiting for players to join and ready up
2. **BIDDING**: Each player places their bid
3. **PLAYING**: Players take turns playing cards
4. **ROUND_END**: Show scores and option to start next round
5. **GAME_END**: Final scores (not yet implemented)

## Networking

### Socket.IO Events

**Client -> Server:**
- `create-game`: Create a new game
- `join-game`: Join an existing game
- `player-ready`: Mark player as ready
- `place-bid`: Submit bid for the round
- `play-card`: Play a card from hand
- `start-next-round`: Start another round

**Server -> Client:**
- `game-created`: Game created successfully
- `game-updated`: Game state changed
- `game-started`: Game has started
- `bidding-complete`: All bids placed
- `round-ended`: Round finished
- `player-left`: Player disconnected
- `error`: Error occurred

## Auto-Configuration Logic

The game automatically adjusts based on player count to ensure fair gameplay:

- **2-4 players**: Use 1 deck, maximum cards per player
- **5-8 players**: Use 1 deck, reduce cards per player
- **9-12 players**: Use 2 decks to have enough cards

This ensures every game feels balanced regardless of player count.

## Scoring System

- **Bid Met/Exceeded**: Points = Bid + (Extra Tricks × 0.1)
- **Bid Not Met**: Points = -Bid

Example:
- Bid 5, won 5: +5 points
- Bid 5, won 7: +5.2 points (5 + 2×0.1)
- Bid 5, won 3: -5 points

## Card Ranking

### Trump Suit
Spades are always trump and beat any non-trump card.

### Rank Order (Lowest to Highest)
2 < 3 < 4 < 5 < 6 < 7 < 8 < 9 < 10 < J < Q < K < A

### Trick Winner Logic
1. Highest trump (Spade) wins
2. If no trump, highest card of lead suit wins
3. If neither trump nor lead suit, first card wins

## Testing

The game includes comprehensive unit tests for:
- Configuration logic (player count adjustments)
- Deck management (creation, shuffling, dealing)
- Game logic (trick winners, card validation, scoring)

All tests are in the `__tests__/` directory and can be run with `npm test`.
