# 🚀 Quick Start Guide - Call Break Game

## For Developers: Build APK in 5 Minutes

### Prerequisites Check
```bash
# Check Python version (need 3.9+)
python --version

# Check if on Linux/Ubuntu (required for buildozer)
uname -a
```

### Step 1: Install Dependencies (Ubuntu/Linux)
```bash
# Update system
sudo apt update

# Install buildozer dependencies
sudo apt install -y \
    python3-pip \
    build-essential \
    git \
    python3 \
    python3-dev \
    ffmpeg \
    libsdl2-dev \
    libsdl2-image-dev \
    libsdl2-mixer-dev \
    libsdl2-ttf-dev \
    libportmidi-dev \
    libswscale-dev \
    libavformat-dev \
    libavcodec-dev \
    zlib1g-dev \
    libgstreamer1.0 \
    gstreamer1.0-plugins-base \
    gstreamer1.0-plugins-good \
    openjdk-17-jdk \
    unzip

# Install Python packages
pip install kivy==2.3.0 buildozer
```

### Step 2: Navigate to Project
```bash
cd callbreak
```

### Step 3: Build APK
```bash
# Initialize buildozer (first time only)
buildozer init

# Build debug APK (will take 15-30 minutes first time)
buildozer -v android debug

# APK will be in bin/ folder
ls -lh bin/*.apk
```

### Step 4: Install on Android Device
```bash
# Connect Android device via USB with USB debugging enabled

# Install APK
adb install -r bin/callbreak-0.1-debug.apk

# Or copy APK to device and install manually
```

---

## For Players: How to Play

### Setup (One-Time)
1. Install APK on all players' Android devices
2. Ensure all devices connected to **same WiFi network**
3. Enable WiFi and Internet permissions when app asks

### Playing a Game

#### Host Player:
1. Open Call Break app → **Main Menu**
2. Select number of players (2-12)
3. Tap **HOST** to start the server
4. Share the **6-digit game code** shown on the host screen

#### Joining Players:
1. Open Call Break app → **Main Menu**
2. Tap **JOIN**
3. Enter the 6-digit code or pick from the nearby scan list
4. Wait for host to start the game

### Gameplay
1. **Bidding**: Each player bids number of tricks they'll win
2. **Playing**: Follow suit rules, highest card/trump wins trick
3. **Scoring**: Match your bid for points, penalties for under/over
4. **5 Rounds**: Play 5 rounds, highest score wins!

---

## 🐛 Common Issues

### "Build failed"
- Ensure using Linux/Ubuntu (not Windows)
- Run: `buildozer android clean` then rebuild
- Check all dependencies installed

### "Connection refused"
- Verify all devices on **same WiFi**
- Check host screen shows an active code
- Disable firewall temporarily if on desktop

---

## 📱 Test on Desktop (Limited)

For testing game logic without building APK:

```bash
# Install Kivy
pip install kivy

# Run app
python main.py
```

**Note**: WiFi networking will work for local desktop testing; full experience is on device.

---

## ✅ What Works Right Now

- ✅ Complete game logic (deal → trump → bidding → playing → scoring)
- ✅ WiFi multiplayer (2-12 players) with game-code host/join
- ✅ Modern menu/host/join screens with nearby scan list
- ✅ Waiting lobby and game/bidding/playing screens present (visual polish pending)
- ✅ Unit tests (pytest) available for logic/networking

## ⚠️ What Needs Attention

- ⚠️ Run full WiFi multi-device smoke test to validate UI/state alignment
- ⚠️ Optional: implement snapshot/reconnect flow end-to-end (protocol stubs added)
- ⚠️ Optional: polish visuals/animations and card art

---

## 🎯 For Developers: Next Steps

### Priority 1: Add Card Images
Create 52 card images + card back:
- Format: PNG, 200x300px
- Names: AS.png, AH.png, AD.png, AC.png, ... 2C.png
- Location: `assets/cards/`
- Card back: `assets/cards/card_back.png`

### Priority 2: Complete Game Screen
Edit: `ui/screens/game_screen.py`
- Implement circular player layout
- Display player hands
- Show trick area
- Add turn indicators

### Priority 3: Implement Game Flow
Edit: `main.py`
- Connect lobby → game screen
- Sync game state server ↔ clients
- Handle bidding and playing phases

### Priority 4: Testing
```bash
# Run tests
python -m pytest tests/ -v

# Test game logic
python tests/test_game_logic.py

# Build and test on device
buildozer android debug deploy run
```

---

## 📚 Documentation

- **README.md**: Complete documentation
- **IMPLEMENTATION_SUMMARY.md**: Technical overview
- **Code comments**: Detailed inline documentation

---

## 🤝 Contributing

The codebase is well-structured and documented. To add features:

1. Study existing code in similar modules
2. Follow the established patterns
3. Add tests for new features
4. Update documentation

---

## ⚡ Quick Commands Reference

```bash
# Build
buildozer android debug                    # Build APK
buildozer android clean                    # Clean build
buildozer android debug deploy run         # Build + install + run

# Testing
python main.py                             # Run on desktop
python -m pytest tests/ -v                 # Run unit tests
adb logcat | grep python                   # View Android logs

# Development
python tests/test_game_logic.py           # Test game logic
python tests/test_scoring.py              # Test scoring
python tests/test_networking.py           # Test networking
```

---

**Have Fun Playing Call Break! 🎴**

*Questions? Check README.md or code comments for details.*
