// Game types for Call Break card game

export enum Suit {
  SPADES = 'SPADES',
  HEARTS = 'HEARTS',
  DIAMONDS = 'DIAMONDS',
  CLUBS = 'CLUBS',
}

export enum Rank {
  TWO = '2',
  THREE = '3',
  FOUR = '4',
  FIVE = '5',
  SIX = '6',
  SEVEN = '7',
  EIGHT = '8',
  NINE = '9',
  TEN = '10',
  JACK = 'J',
  QUEEN = 'Q',
  KING = 'K',
  ACE = 'A',
}

export interface Card {
  suit: Suit;
  rank: Rank;
  id: string;
}

export interface Player {
  id: string;
  name: string;
  hand: Card[];
  bid: number | null;
  tricksWon: number;
  score: number;
  isReady: boolean;
}

export interface GameConfig {
  playerCount: number;
  cardsPerPlayer: number;
  deckCount: number;
}

export interface Trick {
  leadSuit: Suit | null;
  cards: { playerId: string; card: Card }[];
  winnerId: string | null;
}

export interface GameState {
  id: string;
  players: Player[];
  currentRound: number;
  currentTrick: Trick;
  currentPlayerIndex: number;
  phase: GamePhase;
  config: GameConfig;
}

export enum GamePhase {
  LOBBY = 'LOBBY',
  BIDDING = 'BIDDING',
  PLAYING = 'PLAYING',
  ROUND_END = 'ROUND_END',
  GAME_END = 'GAME_END',
}

export const RANK_VALUES: Record<Rank, number> = {
  [Rank.TWO]: 2,
  [Rank.THREE]: 3,
  [Rank.FOUR]: 4,
  [Rank.FIVE]: 5,
  [Rank.SIX]: 6,
  [Rank.SEVEN]: 7,
  [Rank.EIGHT]: 8,
  [Rank.NINE]: 9,
  [Rank.TEN]: 10,
  [Rank.JACK]: 11,
  [Rank.QUEEN]: 12,
  [Rank.KING]: 13,
  [Rank.ACE]: 14,
};
