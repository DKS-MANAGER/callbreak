// Deck management and card shuffling

import { Card, Suit, Rank } from '../types/game';

/**
 * Create a standard 52-card deck
 */
export function createDeck(): Card[] {
  const deck: Card[] = [];
  const suits = Object.values(Suit);
  const ranks = Object.values(Rank);

  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({
        suit,
        rank,
        id: `${suit}-${rank}`,
      });
    }
  }

  return deck;
}

/**
 * Create multiple decks and combine them
 */
export function createMultipleDecks(deckCount: number): Card[] {
  const allCards: Card[] = [];

  for (let i = 0; i < deckCount; i++) {
    const deck = createDeck();
    // Add deck number to card IDs for uniqueness
    const deckWithIds = deck.map((card) => ({
      ...card,
      id: `${card.suit}-${card.rank}-${i}`,
    }));
    allCards.push(...deckWithIds);
  }

  return allCards;
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

/**
 * Deal cards to players
 */
export function dealCards(
  playerCount: number,
  cardsPerPlayer: number,
  deckCount: number
): Card[][] {
  const deck = createMultipleDecks(deckCount);
  const shuffledDeck = shuffle(deck);

  const hands: Card[][] = [];

  for (let i = 0; i < playerCount; i++) {
    hands.push([]);
  }

  // Deal cards to each player
  for (let i = 0; i < cardsPerPlayer * playerCount; i++) {
    const playerIndex = i % playerCount;
    hands[playerIndex].push(shuffledDeck[i]);
  }

  return hands;
}

/**
 * Sort a hand of cards by suit and rank
 */
export function sortHand(hand: Card[]): Card[] {
  const suitOrder = [Suit.SPADES, Suit.HEARTS, Suit.DIAMONDS, Suit.CLUBS];
  const rankOrder = Object.values(Rank);

  return [...hand].sort((a, b) => {
    const suitCompare = suitOrder.indexOf(a.suit) - suitOrder.indexOf(b.suit);
    if (suitCompare !== 0) return suitCompare;

    return rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank);
  });
}
