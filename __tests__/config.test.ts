import { calculateGameConfig, getMinimumBid, getMaximumBid } from '../src/game/config';

describe('Game Config', () => {
  describe('calculateGameConfig', () => {
    it('should configure for 2 players', () => {
      const config = calculateGameConfig(2);
      expect(config.playerCount).toBe(2);
      expect(config.cardsPerPlayer).toBe(13);
      expect(config.deckCount).toBe(1);
    });

    it('should configure for 4 players (traditional)', () => {
      const config = calculateGameConfig(4);
      expect(config.playerCount).toBe(4);
      expect(config.cardsPerPlayer).toBe(13);
      expect(config.deckCount).toBe(1);
    });

    it('should configure for 6 players', () => {
      const config = calculateGameConfig(6);
      expect(config.playerCount).toBe(6);
      expect(config.cardsPerPlayer).toBe(8);
      expect(config.deckCount).toBe(1);
    });

    it('should configure for 12 players', () => {
      const config = calculateGameConfig(12);
      expect(config.playerCount).toBe(12);
      expect(config.cardsPerPlayer).toBe(8);
      expect(config.deckCount).toBe(2);
    });

    it('should use multiple decks for 9+ players', () => {
      const config = calculateGameConfig(9);
      expect(config.deckCount).toBeGreaterThanOrEqual(2);
    });

    it('should throw error for invalid player count', () => {
      expect(() => calculateGameConfig(1)).toThrow();
      expect(() => calculateGameConfig(13)).toThrow();
    });
  });

  describe('Bid limits', () => {
    it('should return minimum bid of 1', () => {
      expect(getMinimumBid(13)).toBe(1);
      expect(getMinimumBid(8)).toBe(1);
    });

    it('should return maximum bid equal to cards per player', () => {
      expect(getMaximumBid(13)).toBe(13);
      expect(getMaximumBid(8)).toBe(8);
    });
  });
});
