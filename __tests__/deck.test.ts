import { createDeck, createMultipleDecks, shuffle, dealCards, sortHand } from '../src/game/deck';
import { Suit, Rank } from '../src/types/game';

describe('Deck Management', () => {
  describe('createDeck', () => {
    it('should create a deck of 52 cards', () => {
      const deck = createDeck();
      expect(deck).toHaveLength(52);
    });

    it('should have 4 suits', () => {
      const deck = createDeck();
      const suits = new Set(deck.map((card) => card.suit));
      expect(suits.size).toBe(4);
    });

    it('should have 13 ranks per suit', () => {
      const deck = createDeck();
      const spades = deck.filter((card) => card.suit === Suit.SPADES);
      expect(spades).toHaveLength(13);
    });

    it('should have unique card IDs', () => {
      const deck = createDeck();
      const ids = new Set(deck.map((card) => card.id));
      expect(ids.size).toBe(52);
    });
  });

  describe('createMultipleDecks', () => {
    it('should create correct number of decks', () => {
      const decks = createMultipleDecks(2);
      expect(decks).toHaveLength(104); // 52 * 2
    });

    it('should have unique IDs across multiple decks', () => {
      const decks = createMultipleDecks(2);
      const ids = new Set(decks.map((card) => card.id));
      expect(ids.size).toBe(104);
    });
  });

  describe('shuffle', () => {
    it('should return array of same length', () => {
      const deck = createDeck();
      const shuffled = shuffle(deck);
      expect(shuffled).toHaveLength(deck.length);
    });

    it('should not modify original array', () => {
      const deck = createDeck();
      const original = [...deck];
      shuffle(deck);
      expect(deck).toEqual(original);
    });
  });

  describe('dealCards', () => {
    it('should deal correct number of cards per player', () => {
      const hands = dealCards(4, 13, 1);
      expect(hands).toHaveLength(4);
      hands.forEach((hand) => {
        expect(hand).toHaveLength(13);
      });
    });

    it('should not have duplicate cards', () => {
      const hands = dealCards(4, 13, 1);
      const allCards = hands.flat();
      const ids = new Set(allCards.map((card) => card.id));
      expect(ids.size).toBe(52);
    });

    it('should work with multiple players', () => {
      const hands = dealCards(6, 8, 1);
      expect(hands).toHaveLength(6);
      hands.forEach((hand) => {
        expect(hand).toHaveLength(8);
      });
    });
  });

  describe('sortHand', () => {
    it('should sort by suit then rank', () => {
      const hand = [
        { suit: Suit.HEARTS, rank: Rank.ACE, id: '1' },
        { suit: Suit.SPADES, rank: Rank.TWO, id: '2' },
        { suit: Suit.HEARTS, rank: Rank.KING, id: '3' },
      ];
      const sorted = sortHand(hand);
      expect(sorted[0].suit).toBe(Suit.SPADES);
      expect(sorted[1].suit).toBe(Suit.HEARTS);
      expect(sorted[2].suit).toBe(Suit.HEARTS);
    });

    it('should not modify original array', () => {
      const hand = createDeck().slice(0, 5);
      const original = [...hand];
      sortHand(hand);
      expect(hand).toEqual(original);
    });
  });
});
