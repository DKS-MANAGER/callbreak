# Development Guide

## Prerequisites

- Node.js 16.x or higher
- npm or yarn
- For mobile testing:
  - iOS: macOS with Xcode
  - Android: Android Studio with SDK
  - Or use Expo Go app on physical device

## Setup

1. Clone the repository:
```bash
git clone https://github.com/DKS-MANAGER/callbreak.git
cd callbreak
```

2. Install dependencies:
```bash
npm install
```

## Running the Game

### Development Mode

#### Start the Server
```bash
node server/index.ts
```

The server will run on `http://localhost:3000`. 

**Note**: For mobile device testing, you'll need to:
1. Find your computer's local IP address
2. Update the server URL in `App.tsx` (line 22) to use your IP instead of localhost
   ```typescript
   const newSocket = io('http://192.168.1.100:3000'); // Use your IP
   ```

#### Start the Mobile App
```bash
npm start
```

This opens Expo Dev Tools. You can:
- Press `a` to open Android emulator
- Press `i` to open iOS simulator
- Scan QR code with Expo Go app on physical device

### Testing Different Player Counts

To test multiplayer functionality:
1. Start the server
2. Open multiple instances:
   - Multiple browser tabs (web version)
   - Multiple emulators/simulators
   - Physical devices + emulators
3. Create game on one device, join from others

## Project Structure

```
callbreak/
├── src/
│   ├── types/              # TypeScript type definitions
│   │   └── game.ts         # Core game types
│   ├── game/               # Game logic
│   │   ├── config.ts       # Auto-configuration logic
│   │   ├── deck.ts         # Card and deck management
│   │   └── logic.ts        # Core game rules
│   ├── components/         # Reusable UI components
│   │   ├── CardComponent.tsx
│   │   ├── BiddingModal.tsx
│   │   └── ScoreBoard.tsx
│   ├── screens/            # App screens
│   │   ├── MainMenu.tsx
│   │   ├── Lobby.tsx
│   │   └── GameBoard.tsx
│   └── utils/              # Utility functions
├── server/                 # Game server
│   └── index.ts
├── __tests__/              # Test files
│   ├── config.test.ts
│   ├── deck.test.ts
│   └── logic.test.ts
├── docs/                   # Documentation
├── App.tsx                 # Main app component
└── package.json            # Dependencies
```

## Available Scripts

### Development
- `npm start` - Start Expo dev server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run in web browser

### Testing
- `npm test` - Run all tests
- `npm test -- --watch` - Run tests in watch mode
- `npm test -- --coverage` - Generate coverage report

### Code Quality
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Adding Features

### Adding a New Game Rule

1. Update types in `src/types/game.ts`
2. Implement logic in `src/game/logic.ts`
3. Add tests in `__tests__/logic.test.ts`
4. Update server to handle new events in `server/index.ts`
5. Update UI components as needed

### Adding a New UI Component

1. Create component in `src/components/`
2. Follow existing styling patterns
3. Use TypeScript for props
4. Import and use in screens

### Adding a New Screen

1. Create screen in `src/screens/`
2. Add navigation logic in `App.tsx`
3. Connect to Socket.IO events as needed

## Debugging

### Server Issues
- Check server logs in console
- Verify port 3000 is not in use
- Check firewall settings for local network access

### Client Issues
- Check Expo console for errors
- Use React DevTools for component debugging
- Check Socket.IO connection status
- Verify server URL is correct

### Common Problems

**"Cannot connect to server"**
- Ensure server is running
- Check if devices are on same network
- Verify IP address in App.tsx

**"Game not updating"**
- Check Socket.IO connection
- Verify events are being emitted/received
- Check server logs for errors

**"Cards not appearing"**
- Check if round has started
- Verify game state is being updated
- Check console for errors

## Performance Tips

- The game is optimized for 2-12 players
- Server handles multiple concurrent games
- Use production build for best performance
- Consider memoization for complex components

## Building for Production

### Android
```bash
npm run android
# Or build AAB/APK:
expo build:android
```

### iOS
```bash
npm run ios
# Or build IPA:
expo build:ios
```

### Web
```bash
npm run web
# Or build static files:
expo build:web
```

## Contributing

1. Create a feature branch
2. Make changes with tests
3. Ensure all tests pass
4. Run linter and type checker
5. Submit pull request

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
