# Call Break - Multiplayer Card Game

This is a fast-paced multiplayer Call Break card game built around local WiFi play, designed to feel like a polished mobile title rather than a simple demo.

## Features

- **2-12 Players**: Support for anywhere from 2 to 12 players in a single game
- **Auto-Adjustment**: Hand size and deck configuration automatically adjust based on player count
- **Local WiFi Multiplayer**: Play with friends on the same network
- **Trick-Based Gameplay**: Predict how many tricks you can win and play strategically to meet your bid
- **Real-Time Synchronization**: All game actions are synchronized across all players
- **Polished UI**: Professional mobile interface with smooth interactions

## Game Rules

### Overview
Call Break is a trick-taking card game where players bid on the number of tricks they think they can win. The goal is to accurately predict and achieve your bid while preventing opponents from achieving theirs.

### Card Rankings
- **Trump Suit**: Spades are always trump
- **Card Order**: 2 (lowest) through Ace (highest)
- Trump cards always beat non-trump cards of any rank

### Gameplay
1. **Bidding Phase**: Each player bids how many tricks they expect to win (1 to cards-per-hand)
2. **Playing Phase**: Players take turns playing one card at a time
3. **Following Suit**: Players must follow the lead suit if they have cards of that suit
4. **Winning Tricks**: The highest trump card wins, or if no trump, the highest card of the lead suit
5. **Scoring**:
   - Meet or exceed bid: Points = Bid + (Extra tricks × 0.1)
   - Miss bid: Points = -Bid

### Player Count Configurations

| Players | Cards/Player | Decks | Total Cards Used |
|---------|--------------|-------|------------------|
| 2       | 13           | 1     | 26               |
| 3       | 13           | 1     | 39               |
| 4       | 13           | 1     | 52               |
| 5       | 10           | 1     | 50               |
| 6       | 8            | 1     | 48               |
| 7       | 7            | 1     | 49               |
| 8       | 6            | 1     | 48               |
| 9       | 11           | 2     | 99               |
| 10      | 10           | 2     | 100              |
| 11      | 9            | 2     | 99               |
| 12      | 8            | 2     | 96               |

## Installation

### Prerequisites
- Node.js 16 or higher
- npm or yarn
- Expo CLI (optional, for mobile development)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/DKS-MANAGER/callbreak.git
cd callbreak
```

2. Install dependencies:
```bash
npm install
```

### Running the Server

Start the game server:
```bash
node server/index.ts
```

The server will run on port 3000 by default. Make sure all players are on the same network and can access the server.

### Running the Mobile App

#### For development:
```bash
npm start
```

Then use the Expo Go app to scan the QR code, or:
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Press `w` for web

#### For production builds:
```bash
# Android
npm run android

# iOS
npm run ios
```

## Development

### Project Structure

```
callbreak/
├── src/
│   ├── types/         # TypeScript type definitions
│   ├── game/          # Core game logic
│   ├── components/    # Reusable UI components
│   ├── screens/       # App screens
│   └── utils/         # Utility functions
├── server/            # Game server
├── __tests__/         # Test files
├── App.tsx            # Main app component
└── package.json       # Dependencies
```

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npm run type-check
```

## How to Play

1. **Create a Game**: One player creates a game and receives a game code
2. **Join the Game**: Other players join using the game code
3. **Ready Up**: All players mark themselves as ready (minimum 2 players)
4. **Bidding**: Each player places a bid for the number of tricks they'll win
5. **Play Cards**: Players take turns playing cards following game rules
6. **Round Ends**: Scores are calculated based on bids vs. actual tricks won
7. **Continue**: Start new rounds and track cumulative scores

## Technology Stack

- **Frontend**: React Native with Expo
- **Backend**: Node.js with Express and Socket.IO
- **Language**: TypeScript
- **Testing**: Jest
- **Styling**: React Native StyleSheet

## Network Configuration

The game uses WebSocket connections for real-time multiplayer. Ensure:
- All devices are on the same WiFi network
- The server is accessible from all client devices
- Update the server URL in `App.tsx` to match your server's IP address

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

## License

MIT License
