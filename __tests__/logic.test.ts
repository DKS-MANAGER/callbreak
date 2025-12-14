import {
  determineTrickWinner,
  canPlayCard,
  calculateRoundScore,
  createGameState,
  startNewRound,
  processBid,
  playCard,
} from '../src/game/logic';
import { Suit, Rank, Trick, Card, GamePhase } from '../src/types/game';

describe('Game Logic', () => {
  describe('determineTrickWinner', () => {
    it('should determine trump wins over non-trump', () => {
      const trick: Trick = {
        leadSuit: Suit.HEARTS,
        cards: [
          { playerId: 'p1', card: { suit: Suit.HEARTS, rank: Rank.ACE, id: '1' } },
          { playerId: 'p2', card: { suit: Suit.SPADES, rank: Rank.TWO, id: '2' } },
        ],
        winnerId: null,
      };
      const winner = determineTrickWinner(trick);
      expect(winner).toBe('p2'); // Spade wins
    });

    it('should determine highest trump wins', () => {
      const trick: Trick = {
        leadSuit: Suit.HEARTS,
        cards: [
          { playerId: 'p1', card: { suit: Suit.SPADES, rank: Rank.FIVE, id: '1' } },
          { playerId: 'p2', card: { suit: Suit.SPADES, rank: Rank.ACE, id: '2' } },
        ],
        winnerId: null,
      };
      const winner = determineTrickWinner(trick);
      expect(winner).toBe('p2'); // Higher spade wins
    });

    it('should determine highest lead suit wins when no trump', () => {
      const trick: Trick = {
        leadSuit: Suit.HEARTS,
        cards: [
          { playerId: 'p1', card: { suit: Suit.HEARTS, rank: Rank.KING, id: '1' } },
          { playerId: 'p2', card: { suit: Suit.HEARTS, rank: Rank.ACE, id: '2' } },
        ],
        winnerId: null,
      };
      const winner = determineTrickWinner(trick);
      expect(winner).toBe('p2'); // Ace of hearts wins
    });
  });

  describe('canPlayCard', () => {
    it('should allow any card as first card', () => {
      const trick: Trick = { leadSuit: null, cards: [], winnerId: null };
      const card: Card = { suit: Suit.HEARTS, rank: Rank.ACE, id: '1' };
      const hand = [card];
      expect(canPlayCard(card, hand, trick)).toBe(true);
    });

    it('should require following suit if possible', () => {
      const trick: Trick = {
        leadSuit: Suit.HEARTS,
        cards: [
          { playerId: 'p1', card: { suit: Suit.HEARTS, rank: Rank.KING, id: '1' } },
        ],
        winnerId: null,
      };
      const card: Card = { suit: Suit.CLUBS, rank: Rank.ACE, id: '2' };
      const heartCard: Card = { suit: Suit.HEARTS, rank: Rank.TWO, id: '3' };
      const hand = [card, heartCard];

      expect(canPlayCard(card, hand, trick)).toBe(false);
      expect(canPlayCard(heartCard, hand, trick)).toBe(true);
    });

    it('should allow any card if lead suit not in hand', () => {
      const trick: Trick = {
        leadSuit: Suit.HEARTS,
        cards: [
          { playerId: 'p1', card: { suit: Suit.HEARTS, rank: Rank.KING, id: '1' } },
        ],
        winnerId: null,
      };
      const card: Card = { suit: Suit.CLUBS, rank: Rank.ACE, id: '2' };
      const hand = [card]; // No hearts in hand

      expect(canPlayCard(card, hand, trick)).toBe(true);
    });
  });

  describe('calculateRoundScore', () => {
    it('should give positive score when bid is met', () => {
      expect(calculateRoundScore(5, 5)).toBe(5);
      expect(calculateRoundScore(3, 3)).toBe(3);
    });

    it('should add bonus for extra tricks', () => {
      const score = calculateRoundScore(5, 7);
      expect(score).toBe(5.2); // 5 + 2 * 0.1
    });

    it('should give negative score when bid is not met', () => {
      expect(calculateRoundScore(5, 3)).toBe(-5);
      expect(calculateRoundScore(8, 7)).toBe(-8);
    });
  });

  describe('createGameState', () => {
    it('should create initial game state', () => {
      const state = createGameState(['p1', 'p2'], ['Alice', 'Bob']);
      expect(state.players).toHaveLength(2);
      expect(state.players[0].name).toBe('Alice');
      expect(state.players[1].name).toBe('Bob');
      expect(state.phase).toBe(GamePhase.LOBBY);
      expect(state.currentRound).toBe(0);
    });

    it('should configure correctly for player count', () => {
      const state = createGameState(['p1', 'p2', 'p3', 'p4'], ['A', 'B', 'C', 'D']);
      expect(state.config.playerCount).toBe(4);
      expect(state.config.cardsPerPlayer).toBe(13);
    });
  });

  describe('startNewRound', () => {
    it('should deal cards and increment round', () => {
      const state = createGameState(['p1', 'p2'], ['Alice', 'Bob']);
      const newState = startNewRound(state);

      expect(newState.currentRound).toBe(1);
      expect(newState.phase).toBe(GamePhase.BIDDING);
      expect(newState.players[0].hand.length).toBeGreaterThan(0);
      expect(newState.players[1].hand.length).toBeGreaterThan(0);
    });

    it('should reset bids and tricks', () => {
      const state = createGameState(['p1', 'p2'], ['Alice', 'Bob']);
      const newState = startNewRound(state);

      newState.players.forEach((player) => {
        expect(player.bid).toBeNull();
        expect(player.tricksWon).toBe(0);
      });
    });
  });

  describe('processBid', () => {
    it('should update player bid', () => {
      let state = createGameState(['p1', 'p2'], ['Alice', 'Bob']);
      state = startNewRound(state);
      state = processBid(state, 'p1', 5);

      expect(state.players[0].bid).toBe(5);
    });

    it('should throw error for invalid bid', () => {
      let state = createGameState(['p1', 'p2'], ['Alice', 'Bob']);
      state = startNewRound(state);

      expect(() => processBid(state, 'p1', 0)).toThrow();
      expect(() => processBid(state, 'p1', 100)).toThrow();
    });

    it('should change phase to PLAYING when all bids placed', () => {
      let state = createGameState(['p1', 'p2'], ['Alice', 'Bob']);
      state = startNewRound(state);
      state = processBid(state, 'p1', 5);
      expect(state.phase).toBe(GamePhase.BIDDING);

      state = processBid(state, 'p2', 3);
      expect(state.phase).toBe(GamePhase.PLAYING);
    });
  });
});
