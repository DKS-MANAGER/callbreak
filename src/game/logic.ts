// Core game logic for Call Break

import {
  Card,
  Suit,
  Player,
  Trick,
  GameState,
  GamePhase,
  RANK_VALUES,
} from '../types/game';
import { calculateGameConfig } from './config';
import { dealCards, sortHand } from './deck';

/**
 * Determine the winner of a trick
 * In Call Break:
 * - Spades are always trump
 * - Highest trump wins
 * - If no trump, highest card of lead suit wins
 */
export function determineTrickWinner(trick: Trick): string {
  if (trick.cards.length === 0) {
    throw new Error('Cannot determine winner of empty trick');
  }

  const leadSuit = trick.leadSuit;
  let winningCard = trick.cards[0];

  for (let i = 1; i < trick.cards.length; i++) {
    const current = trick.cards[i];

    // Trump (Spades) always beats non-trump
    if (current.card.suit === Suit.SPADES && winningCard.card.suit !== Suit.SPADES) {
      winningCard = current;
    } else if (winningCard.card.suit === Suit.SPADES && current.card.suit !== Suit.SPADES) {
      // Current card is not trump, winning card is trump - no change
      continue;
    } else if (current.card.suit === winningCard.card.suit) {
      // Same suit - compare ranks
      if (RANK_VALUES[current.card.rank] > RANK_VALUES[winningCard.card.rank]) {
        winningCard = current;
      }
    } else if (
      current.card.suit === leadSuit &&
      winningCard.card.suit !== Suit.SPADES &&
      winningCard.card.suit !== leadSuit
    ) {
      // Current card follows suit, winning card doesn't and isn't trump
      winningCard = current;
    }
  }

  return winningCard.playerId;
}

/**
 * Check if a card can be legally played
 */
export function canPlayCard(
  card: Card,
  playerHand: Card[],
  trick: Trick
): boolean {
  // First card of trick can always be played
  if (trick.cards.length === 0) {
    return true;
  }

  const leadSuit = trick.leadSuit;

  // If player has cards of lead suit, must play one
  const hasLeadSuit = playerHand.some((c) => c.suit === leadSuit);

  if (hasLeadSuit && card.suit !== leadSuit) {
    return false;
  }

  return true;
}

/**
 * Calculate score for a player at the end of a round
 * - If bid met or exceeded: score = bid + (tricks - bid) * 0.1
 * - If bid not met: score = -bid
 */
export function calculateRoundScore(bid: number, tricksWon: number): number {
  if (tricksWon >= bid) {
    // Bid met or exceeded
    const baseScore = bid;
    const extraTricks = tricksWon - bid;
    return baseScore + extraTricks * 0.1;
  } else {
    // Bid not met - negative points
    return -bid;
  }
}

/**
 * Create a new game state
 */
export function createGameState(playerIds: string[], playerNames: string[]): GameState {
  const config = calculateGameConfig(playerIds.length);

  const players: Player[] = playerIds.map((id, index) => ({
    id,
    name: playerNames[index] || `Player ${index + 1}`,
    hand: [],
    bid: null,
    tricksWon: 0,
    score: 0,
    isReady: false,
  }));

  return {
    id: generateGameId(),
    players,
    currentRound: 0,
    currentTrick: {
      leadSuit: null,
      cards: [],
      winnerId: null,
    },
    currentPlayerIndex: 0,
    phase: GamePhase.LOBBY,
    config,
  };
}

/**
 * Start a new round
 */
export function startNewRound(gameState: GameState): GameState {
  const hands = dealCards(
    gameState.config.playerCount,
    gameState.config.cardsPerPlayer,
    gameState.config.deckCount
  );

  const newPlayers = gameState.players.map((player, index) => ({
    ...player,
    hand: sortHand(hands[index]),
    bid: null,
    tricksWon: 0,
  }));

  return {
    ...gameState,
    players: newPlayers,
    currentRound: gameState.currentRound + 1,
    currentTrick: {
      leadSuit: null,
      cards: [],
      winnerId: null,
    },
    currentPlayerIndex: 0,
    phase: GamePhase.BIDDING,
  };
}

/**
 * Process a bid from a player
 */
export function processBid(
  gameState: GameState,
  playerId: string,
  bid: number
): GameState {
  const playerIndex = gameState.players.findIndex((p) => p.id === playerId);

  if (playerIndex === -1) {
    throw new Error('Player not found');
  }

  if (bid < 1 || bid > gameState.config.cardsPerPlayer) {
    throw new Error(`Bid must be between 1 and ${gameState.config.cardsPerPlayer}`);
  }

  const newPlayers = [...gameState.players];
  newPlayers[playerIndex] = {
    ...newPlayers[playerIndex],
    bid,
  };

  // Check if all players have bid
  const allBidsPlaced = newPlayers.every((p) => p.bid !== null);

  return {
    ...gameState,
    players: newPlayers,
    phase: allBidsPlaced ? GamePhase.PLAYING : GamePhase.BIDDING,
    currentPlayerIndex: allBidsPlaced ? 0 : (playerIndex + 1) % gameState.players.length,
  };
}

/**
 * Process a card play
 */
export function playCard(
  gameState: GameState,
  playerId: string,
  card: Card
): GameState {
  const playerIndex = gameState.players.findIndex((p) => p.id === playerId);

  if (playerIndex === -1) {
    throw new Error('Player not found');
  }

  if (playerIndex !== gameState.currentPlayerIndex) {
    throw new Error('Not your turn');
  }

  const player = gameState.players[playerIndex];

  if (!canPlayCard(card, player.hand, gameState.currentTrick)) {
    throw new Error('Cannot play this card');
  }

  // Remove card from player's hand
  const newHand = player.hand.filter((c) => c.id !== card.id);

  // Add card to trick
  const newTrick = {
    ...gameState.currentTrick,
    leadSuit: gameState.currentTrick.leadSuit || card.suit,
    cards: [...gameState.currentTrick.cards, { playerId, card }],
  };

  const newPlayers = [...gameState.players];
  newPlayers[playerIndex] = {
    ...newPlayers[playerIndex],
    hand: newHand,
  };

  // Check if trick is complete
  const trickComplete = newTrick.cards.length === gameState.players.length;

  if (trickComplete) {
    const winnerId = determineTrickWinner(newTrick);
    const winnerIndex = gameState.players.findIndex((p) => p.id === winnerId);

    newPlayers[winnerIndex] = {
      ...newPlayers[winnerIndex],
      tricksWon: newPlayers[winnerIndex].tricksWon + 1,
    };

    // Check if round is complete
    const roundComplete = newPlayers[0].hand.length === 0;

    if (roundComplete) {
      // Calculate scores
      const playersWithScores = newPlayers.map((p) => ({
        ...p,
        score: p.score + calculateRoundScore(p.bid!, p.tricksWon),
      }));

      return {
        ...gameState,
        players: playersWithScores,
        currentTrick: {
          leadSuit: null,
          cards: [],
          winnerId,
        },
        currentPlayerIndex: winnerIndex,
        phase: GamePhase.ROUND_END,
      };
    }

    // Start new trick
    return {
      ...gameState,
      players: newPlayers,
      currentTrick: {
        leadSuit: null,
        cards: [],
        winnerId,
      },
      currentPlayerIndex: winnerIndex,
    };
  }

  // Continue current trick
  return {
    ...gameState,
    players: newPlayers,
    currentTrick: newTrick,
    currentPlayerIndex: (playerIndex + 1) % gameState.players.length,
  };
}

/**
 * Generate a random game ID using crypto for better security
 */
function generateGameId(): string {
  // Use crypto.randomUUID if available (Node 15+), otherwise fallback
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID().split('-')[0].toUpperCase();
  }
  // Fallback for older environments
  return Math.random().toString(36).substring(2, 9).toUpperCase();
}
