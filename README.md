# Call Break - Local Multiplayer Card Game

![Platform](https://img.shields.io/badge/Platform-Android-green.svg)
![Python](https://img.shields.io/badge/Python-3.9-blue.svg)
![Kivy](https://img.shields.io/badge/Kivy-2.3.0-orange.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

A local multiplayer implementation of the Call Break (Call Bridge/Lakdi) card game for Android, supporting 2-12 players over WiFi-only game-code connections.

## 🎮 Features

### Game Features
- **2-12 Player Support**: Play with 2 to 12 players simultaneously
- **Complete Game Rules**: Full implementation of Call Break rules including:
  - Spades as permanent trump suit
  - Suit-following and trump rules
  - Bidding phase (1 to max cards)
  - Scoring system (exact match, over-tricks, under-tricks)
  - 5 rounds per game session
- **Multi-Deck Support**: 
  - 1 deck (52 cards) for 2-6 players
  - 2 decks (104 cards) for 7-12 players

### Networking Features
- **WiFi Game-Code Flow (Primary)**:
  - ✅ Host generates a 6-digit code and advertises on the local network
  - ✅ Guests enter the code or pick from nearby scans (ACTIVE_GAMES registry)
  - ✅ Supports all player counts (2-12)
  - ✅ No device pairing or IP typing required
  - ✅ Local-network only for low latency

### Technical Features
- Server-authoritative game logic
- Real-time multiplayer synchronization
- Automatic reconnection handling
- Comprehensive logging
- Android 13+ permission support

## 📋 Requirements

### Development Requirements
- **Python**: 3.9+
- **Kivy**: 2.3.0
- **Buildozer**: Latest version
- **Operating System**: Linux (Ubuntu recommended) or WSL2 on Windows
- **Android SDK**: API 33 (target), API 28 (minimum)
- **Android NDK**: 25b

### Runtime Requirements (Android Device)
- **Android Version**: 9.0 (API 28) or higher
- **Recommended**: Android 13 (API 33) for full features
- **Network**: WiFi connection on the same local network
- **Storage**: ~50 MB free space

## 🚀 Quick Start

### Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd callbreak
```

2. **Install Python dependencies** (for development/testing):
```bash
pip install kivy==2.3.0
pip install buildozer
pip install python-for-android
```

3. **Install Buildozer dependencies** (Linux/Ubuntu):
```bash
sudo apt update
sudo apt install -y python3-pip build-essential git python3 python3-dev \
    ffmpeg libsdl2-dev libsdl2-image-dev libsdl2-mixer-dev libsdl2-ttf-dev \
    libportmidi-dev libswscale-dev libavformat-dev libavcodec-dev zlib1g-dev \
    libgstreamer1.0 gstreamer1.0-plugins-base gstreamer1.0-plugins-good \
    openjdk-17-jdk unzip
```

### Building APK

#### Debug Build (for testing)
```bash
# Initialize buildozer (first time only)
buildozer init

# Clean previous builds (optional)
buildozer android clean

# Build debug APK
buildozer -v android debug

# Build and install on connected device
buildozer android debug deploy run
```

#### Release Build (for distribution)
```bash
# Build release APK
buildozer android release

# Sign the APK (you'll need a keystore)
```

The APK will be created in `bin/` directory.

### Desktop Testing (Limited)

For testing game logic without Android:
```bash
python main.py
```

**Note**: WiFi networking works on desktop for local testing; full experience is on-device.

## 🎯 How to Play

### Setup Game

1. **All players must be on the same WiFi network** (no internet required)
2. **One player hosts the game**:
  - Open the app → Main Menu
  - Choose player count with the selector
  - Tap **HOST** to start the WiFi server
  - Share the 6-digit code shown on the host screen

3. **Other players join**:
  - Open the app → Main Menu
  - Tap **JOIN**
  - Enter the 6-digit code (or pick a nearby game from the scan list)

### Game Rules

#### Card Ranking
```
Spades (Trump) > Hearts, Diamonds, Clubs
A > K > Q > J > 10 > 9 > 8 > 7 > 6 > 5 > 4 > 3 > 2
```

#### Bidding Phase
- Each player bids number of tricks they expect to win
- Minimum bid: 1
- Maximum bid: Number of cards dealt
- Counter-clockwise turn order
- No passing allowed

#### Playing Phase
1. **Must Follow Suit**: Play the led suit if you have it
2. **Must Play Trump**: If you can't follow suit, must play Spade if available
3. **Must Play Higher Trump**: If Spade already played and you can't follow suit, must play higher Spade if possible
4. **Free Discard**: If no suit and no trump, play any card

#### Scoring
- **Exact Match**: Bid = Won → **+Bid points**
  - Example: Bid 5, Win 5 → +5.0
- **Over-Trick**: Won > Bid → **+Bid + 0.1 per extra**
  - Example: Bid 3, Win 6 → +3.3
- **Under-Trick (PENALTY)**: Won < Bid → **-Bid points**
  - Example: Bid 4, Win 2 → -4.0

## 📁 Project Structure

```
callbreak/
├── main.py                      # Application entry point
├── buildozer.spec              # Android build configuration
├── README.md                   # This file
│
├── game/                       # Core game logic
│   ├── __init__.py
│   ├── card.py                 # Card and Deck classes
│   ├── player.py               # Player class
│   ├── game_logic.py           # Game state manager
│   ├── trick_validator.py      # Card play validation
│   └── scoring.py              # Score calculations
│
├── networking/                 # Network layer
│   ├── __init__.py
│   ├── wifi_server.py          # WiFi host
│   ├── wifi_client.py          # WiFi client
│   ├── game_code.py            # Game-code registry/resolution
│   ├── message_handler.py      # JSON protocol
│   └── connection_manager.py   # Connection handling
│
├── ui/                         # User interface
│   ├── __init__.py
│   ├── styles.kv               # Kivy styles
│   ├── screens/                # Game screens
│   │   ├── __init__.py
│   │   ├── horror_intro_screen.py
│   │   ├── splash_screen.py
│   │   ├── main_menu_screen.py      # Modern connection hub
│   │   ├── modern_host_screen.py    # Host view with code/share
│   │   ├── modern_join_screen.py    # Join view with code boxes/scan
│   │   ├── waiting_lobby_screen.py
│   │   ├── game_screen.py           # In-round play (needs polish)
│   │   ├── trump_selection_screen.py
│   │   ├── bidding_overlay.py
│   │   ├── score_screen.py
│   │   └── final_results_screen.py
│   └── widgets/                # Custom widgets
│       ├── __init__.py
│       ├── modern_controls.py  # Modern buttons/icons
│       ├── card_widget.py      # Card display (TODO)
│       ├── player_widget.py    # Player info (TODO)
│       └── trick_display.py    # Trick area (TODO)
│
├── utils/                      # Utilities
│   ├── __init__.py
│   ├── helpers.py              # Helper functions
│   ├── permissions.py          # Android permissions
│   └── logger.py               # Logging setup
│
├── assets/                     # Game assets (TODO)
│   ├── cards/                  # Card images (52 + back)
│   ├── backgrounds/            # Background images
│   ├── sounds/                 # Sound effects
│   ├── icon.png                # App icon
│   └── splash.png              # Splash screen
│
└── tests/                      # Unit tests (TODO)
    ├── test_game_logic.py
    ├── test_scoring.py
    └── test_networking.py
```

## 🔧 Development Guide

### Project Status

✅ **Completed**:
- Core game logic (Card, Deck, Player, GameState)
- Scoring and trick validation
- WiFi networking (server + client) with game-code registry
- Message protocol and connection management
- Modern connection hub + host/join screens and navigation wiring
- Waiting lobby/basic game screen scaffolding
- Main application framework
- Android build configuration (WiFi-only permissions)
- Utilities and logging

⚠️ **TODO (Needs Implementation/Polish)**:
- Complete game screen UI (circular player layout, interactions)
- Bidding and score UI polish
- Card, player, and trick widgets with assets
- Card image assets (52 cards + back) and audio polish
- Deep game state sync testing across devices
- Additional automated tests

### Adding Features

1. **Game Logic**: Edit files in `game/` directory
2. **Networking**: Edit files in `networking/` directory
3. **UI**: Edit files in `ui/` directory
4. **Permissions**: Edit `utils/permissions.py` and `buildozer.spec`

### Testing Game Logic

```python
# Test card comparison
from game.card import Card

spade_5 = Card('Spades', '5')
heart_ace = Card('Hearts', 'A')
print(spade_5 > heart_ace)  # True (trump beats non-trump)

# Test deck dealing
from game.card import Deck, get_deck_config

num_decks, cards_per_player, remaining = get_deck_config(4)
print(f"{num_decks} deck(s), {cards_per_player} cards each")  # 1 deck, 13 cards each

deck = Deck(num_decks=1)
deck.shuffle()
hands, remaining_cards = deck.deal(4)
print(f"Player 1 has {len(hands[0])} cards")  # 13
```

### Running Tests

```bash
# Unit tests (when implemented)
python -m pytest tests/

# Manual testing
python main.py
```

## 📱 Player Count Configuration

| Players | Decks | Cards/Player | Total Tricks | WiFi |
|---------|-------|--------------|--------------|------|
| 2       | 1     | 26           | 26           | ✅   |
| 3       | 1     | 17           | 17           | ✅   |
| 4       | 1     | 13           | 13           | ✅   |
| 5       | 1     | 10           | 10           | ✅   |
| 6       | 1     | 8            | 8            | ✅   |
| 7       | 2     | 14           | 14           | ✅   |
| 8       | 2     | 13           | 13           | ✅   |
| 9       | 2     | 11           | 11           | ✅   |
| 10      | 2     | 10           | 10           | ✅   |
| 11      | 2     | 9            | 9            | ✅   |
| 12      | 2     | 8            | 8            | ✅   |

## 🐛 Troubleshooting

### Build Issues

**Error: "SDK not found"**
```bash
# Let buildozer download SDK automatically
buildozer android debug

# Or specify SDK path in buildozer.spec:
# android.sdk_path = /path/to/android-sdk
```

**Error: "NDK not found"**
```bash
# Buildozer will download NDK 25b automatically
# Or specify in buildozer.spec:
# android.ndk_path = /path/to/android-ndk
```

**Error: "Java not found"**
```bash
# Install OpenJDK 17
sudo apt install openjdk-17-jdk

# Set JAVA_HOME
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
```

### Connection Issues

**WiFi: "Connection refused"**
- Check both devices on same WiFi network
- Verify host IP address is correct
- Check firewall settings
- Ensure host is running before clients connect

**Game code doesn't resolve**
- Make sure the host is on the Main Menu or Host screen and has started hosting
- Confirm everyone is on the same subnet; disable VPNs
- If scan list is empty, have players enter the code manually

### Runtime Issues

**App crashes on startup**
- Check logcat: `adb logcat | grep python`
- Verify permissions granted in Android settings
- Check logs in `logs/` directory

**Players can't connect**
- Verify network connectivity
- Check host is running
- Ensure correct code/IP pair; if using IP, confirm it matches the host display

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing issues for solutions

## 🎯 Roadmap

### Version 1.0 (Current - Core Features)
- [x] Game logic implementation
- [x] WiFi networking (game-code host/join)
- [x] Modern main menu + host/join flow
- [ ] In-round UI polish
- [ ] Card assets
- [ ] Regression testing on devices

### Version 1.1 (Enhancements)
- [ ] Animations
- [ ] Sound effects
- [ ] Settings screen
- [ ] Game statistics
- [ ] Player profiles

### Version 1.2 (Advanced)
- [ ] AI players (offline mode)
- [ ] Tournament mode
- [ ] Custom themes
- [ ] Replay system
- [ ] Cloud save

## 🙏 Acknowledgments

- Kivy framework for cross-platform UI
- Python-for-Android for APK building
- Call Break game enthusiasts worldwide

---

**Made with ❤️ for Call Break players**

*Play locally, connect globally!*
