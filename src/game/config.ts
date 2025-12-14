// Game configuration logic for auto-adjusting based on player count

import { GameConfig } from '../types/game';

/**
 * Calculate the optimal game configuration based on player count.
 * The goal is to distribute cards fairly while keeping the game balanced.
 * 
 * Call Break traditionally uses a 52-card deck for 4 players (13 cards each).
 * For 2-12 players, we adjust the number of decks and cards per player.
 */
export function calculateGameConfig(playerCount: number): GameConfig {
  if (playerCount < 2 || playerCount > 12) {
    throw new Error('Player count must be between 2 and 12');
  }

  let deckCount: number;
  let cardsPerPlayer: number;

  // Determine configuration based on player count
  if (playerCount === 2) {
    deckCount = 1;
    cardsPerPlayer = 13; // Each player gets 13 cards (26 total used)
  } else if (playerCount === 3) {
    deckCount = 1;
    cardsPerPlayer = 13; // Each player gets 13 cards (39 total used)
  } else if (playerCount === 4) {
    deckCount = 1;
    cardsPerPlayer = 13; // Each player gets 13 cards (52 total - full deck)
  } else if (playerCount === 5) {
    deckCount = 1;
    cardsPerPlayer = 10; // Each player gets 10 cards (50 total used)
  } else if (playerCount === 6) {
    deckCount = 1;
    cardsPerPlayer = 8; // Each player gets 8 cards (48 total used)
  } else if (playerCount === 7) {
    deckCount = 1;
    cardsPerPlayer = 7; // Each player gets 7 cards (49 total used)
  } else if (playerCount === 8) {
    deckCount = 1;
    cardsPerPlayer = 6; // Each player gets 6 cards (48 total used)
  } else if (playerCount === 9) {
    deckCount = 2;
    cardsPerPlayer = 11; // Each player gets 11 cards (99 total used)
  } else if (playerCount === 10) {
    deckCount = 2;
    cardsPerPlayer = 10; // Each player gets 10 cards (100 total used)
  } else if (playerCount === 11) {
    deckCount = 2;
    cardsPerPlayer = 9; // Each player gets 9 cards (99 total used)
  } else {
    // playerCount === 12
    deckCount = 2;
    cardsPerPlayer = 8; // Each player gets 8 cards (96 total used)
  }

  return {
    playerCount,
    cardsPerPlayer,
    deckCount,
  };
}

/**
 * Get the minimum bid allowed based on cards per player
 */
export function getMinimumBid(cardsPerPlayer: number): number {
  return 1;
}

/**
 * Get the maximum bid allowed based on cards per player
 */
export function getMaximumBid(cardsPerPlayer: number): number {
  return cardsPerPlayer;
}
