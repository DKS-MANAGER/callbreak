# Game Flow Diagram

## Overall Game Flow

```
┌─────────────┐
│  Main Menu  │
│             │
│ ┌─────────┐ │
│ │ Create  │ │──┐
│ │  Game   │ │  │
│ └─────────┘ │  │
│             │  │
│ ┌─────────┐ │  │
│ │  Join   │ │──┤
│ │  Game   │ │  │
│ └─────────┘ │  │
└─────────────┘  │
                 ▼
          ┌──────────┐
          │  Lobby   │
          │          │
          │ Players  │
          │ Waiting  │
          │          │
          │ [Ready]  │
          └────┬─────┘
               │ All Ready
               ▼
        ┌──────────────┐
        │   Bidding    │
        │   Phase      │
        │              │
        │ Each player  │
        │ places bid   │
        └──────┬───────┘
               │ All bids placed
               ▼
        ┌──────────────┐
        │   Playing    │
        │   Phase      │
        │              │
        │ Take turns   │
        │ playing cards│
        └──────┬───────┘
               │ All cards played
               ▼
        ┌──────────────┐
        │  Round End   │
        │              │
        │ Show scores  │
        │              │
        │ [Next Round] │
        └──────┬───────┘
               │
               └─────────┐
                         │
            ┌────────────▼──────────┐
            │   New Round?          │
            │                       │
            │  Yes ──► Back to      │
            │          Bidding      │
            │                       │
            │  No  ──► Game End     │
            └───────────────────────┘
```

## Player Turn Flow (Playing Phase)

```
┌──────────────────────────┐
│  Is it my turn?          │
└────┬──────────────┬──────┘
     │ Yes          │ No
     ▼              ▼
┌─────────┐   ┌──────────┐
│ Select  │   │   Wait   │
│  Card   │   │ for turn │
└────┬────┘   └──────────┘
     │
     ▼
┌─────────────────────────┐
│ Can I play this card?   │
│ (Follow suit rules)     │
└────┬──────────────┬─────┘
     │ Yes          │ No
     ▼              ▼
┌─────────┐   ┌──────────┐
│  Play   │   │  Select  │
│  Card   │   │ Another  │
└────┬────┘   └──────────┘
     │
     ▼
┌─────────────────────────┐
│  Server validates       │
│  & updates game state   │
└────┬────────────────────┘
     │
     ▼
┌─────────────────────────┐
│  All clients receive    │
│  updated state          │
└────┬────────────────────┘
     │
     ▼
┌─────────────────────────┐
│  Trick complete?        │
└────┬──────────────┬─────┘
     │ Yes          │ No
     ▼              ▼
┌─────────┐   ┌──────────┐
│Determine│   │Next turn │
│ Winner  │   └──────────┘
└────┬────┘
     │
     ▼
┌─────────────────────────┐
│  All cards played?      │
└────┬──────────────┬─────┘
     │ Yes          │ No
     ▼              ▼
┌─────────┐   ┌──────────┐
│Calculate│   │Next trick│
│ Scores  │   │(winner   │
└─────────┘   │ leads)   │
              └──────────┘
```

## Auto-Configuration Logic

```
Player Count ──┐
               │
               ▼
        ┌──────────────┐
        │  2-4 players?│
        └──┬───────────┘
           │ Yes
           ▼
    ┌─────────────────┐
    │ 1 Deck          │
    │ 13 cards/player │
    │ (or less for 5+)│
    └─────────────────┘

        ┌──────────────┐
        │  5-8 players?│
        └──┬───────────┘
           │ Yes
           ▼
    ┌─────────────────┐
    │ 1 Deck          │
    │ 6-10 cards/     │
    │ player          │
    └─────────────────┘

        ┌──────────────┐
        │ 9-12 players?│
        └──┬───────────┘
           │ Yes
           ▼
    ┌─────────────────┐
    │ 2 Decks         │
    │ 8-11 cards/     │
    │ player          │
    └─────────────────┘
```

## Network Communication Flow

```
Client A                Server              Client B
   │                       │                    │
   │  create-game          │                    │
   ├──────────────────────►│                    │
   │                       │                    │
   │◄──────game-created────┤                    │
   │                       │                    │
   │                       │   join-game        │
   │                       │◄───────────────────┤
   │                       │                    │
   │◄────game-updated──────┼────game-updated───►│
   │                       │                    │
   │  player-ready         │                    │
   ├──────────────────────►│                    │
   │                       │  player-ready      │
   │                       │◄───────────────────┤
   │                       │                    │
   │◄────game-started──────┼────game-started───►│
   │                       │                    │
   │  place-bid            │                    │
   ├──────────────────────►│                    │
   │                       │                    │
   │◄────game-updated──────┼────game-updated───►│
   │                       │                    │
   │                       │   place-bid        │
   │                       │◄───────────────────┤
   │                       │                    │
   │◄──bidding-complete────┼──bidding-complete─►│
   │                       │                    │
   │  play-card            │                    │
   ├──────────────────────►│                    │
   │                       │                    │
   │◄────game-updated──────┼────game-updated───►│
   │                       │                    │
```

## Trick Winner Determination

```
Cards in Trick
     │
     ▼
┌─────────────────┐
│ Any Spades?     │
│ (Trump suit)    │
└────┬──────┬─────┘
     │      │
    Yes     No
     │      │
     ▼      ▼
┌─────────┐ ┌──────────────┐
│ Highest │ │ Highest card │
│ Spade   │ │ of lead suit │
│ wins    │ │ wins         │
└─────────┘ └──────────────┘
```

## Score Calculation

```
Round Ends
     │
     ▼
For each player:
┌─────────────────────────┐
│ Compare bid to tricks   │
│ won                     │
└────┬──────────────┬─────┘
     │              │
  Met bid       Missed bid
     │              │
     ▼              ▼
┌─────────┐    ┌─────────┐
│ Points  │    │ Points  │
│ = bid + │    │ = -bid  │
│ (extra  │    └─────────┘
│ × 0.1)  │
└─────────┘

Example:
Bid 5, Won 5:  +5.0
Bid 5, Won 7:  +5.2
Bid 5, Won 3:  -5.0
```
