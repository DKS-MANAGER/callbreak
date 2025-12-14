// Card component

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Suit, Rank } from '../types/game';

interface CardComponentProps {
  card: Card;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

export default function CardComponent({
  card,
  size = 'medium',
  disabled = false,
}: CardComponentProps) {
  const suitSymbol = {
    [Suit.SPADES]: '♠',
    [Suit.HEARTS]: '♥',
    [Suit.DIAMONDS]: '♦',
    [Suit.CLUBS]: '♣',
  };

  const suitColor = {
    [Suit.SPADES]: '#000',
    [Suit.HEARTS]: '#e53935',
    [Suit.DIAMONDS]: '#e53935',
    [Suit.CLUBS]: '#000',
  };

  const cardSize = {
    small: { width: 50, height: 70, fontSize: 16 },
    medium: { width: 70, height: 100, fontSize: 20 },
    large: { width: 90, height: 130, fontSize: 24 },
  };

  return (
    <View
      style={[
        styles.card,
        {
          width: cardSize[size].width,
          height: cardSize[size].height,
        },
        disabled && styles.cardDisabled,
      ]}
    >
      <View style={styles.topLeft}>
        <Text
          style={[
            styles.rank,
            { fontSize: cardSize[size].fontSize, color: suitColor[card.suit] },
          ]}
        >
          {card.rank}
        </Text>
        <Text
          style={[
            styles.suit,
            { fontSize: cardSize[size].fontSize, color: suitColor[card.suit] },
          ]}
        >
          {suitSymbol[card.suit]}
        </Text>
      </View>
      <Text
        style={[
          styles.centerSuit,
          {
            fontSize: cardSize[size].fontSize * 1.5,
            color: suitColor[card.suit],
          },
        ]}
      >
        {suitSymbol[card.suit]}
      </Text>
      <View style={styles.bottomRight}>
        <Text
          style={[
            styles.rank,
            { fontSize: cardSize[size].fontSize, color: suitColor[card.suit] },
          ]}
        >
          {card.rank}
        </Text>
        <Text
          style={[
            styles.suit,
            { fontSize: cardSize[size].fontSize, color: suitColor[card.suit] },
          ]}
        >
          {suitSymbol[card.suit]}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  cardDisabled: {
    opacity: 0.5,
  },
  topLeft: {
    position: 'absolute',
    top: 5,
    left: 5,
    alignItems: 'center',
  },
  bottomRight: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    alignItems: 'center',
    transform: [{ rotate: '180deg' }],
  },
  rank: {
    fontWeight: 'bold',
  },
  suit: {
    fontWeight: 'bold',
  },
  centerSuit: {
    fontWeight: 'bold',
  },
});
