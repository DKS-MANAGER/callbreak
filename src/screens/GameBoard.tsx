// Game Board screen

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Socket } from 'socket.io-client';
import { GameState, GamePhase, Card } from '../types/game';
import CardComponent from '../components/CardComponent';
import BiddingModal from '../components/BiddingModal';
import ScoreBoard from '../components/ScoreBoard';

interface GameBoardProps {
  gameState: GameState;
  socket: Socket;
  playerId: string;
}

export default function GameBoard({ gameState, socket, playerId }: GameBoardProps) {
  const [showBiddingModal, setShowBiddingModal] = useState(false);
  const [showScoreBoard, setShowScoreBoard] = useState(false);

  const currentPlayer = gameState.players.find((p) => p.id === playerId);
  const isMyTurn = gameState.players[gameState.currentPlayerIndex]?.id === playerId;

  useEffect(() => {
    if (gameState.phase === GamePhase.BIDDING && currentPlayer?.bid === null) {
      setShowBiddingModal(true);
    }

    if (gameState.phase === GamePhase.ROUND_END) {
      setShowScoreBoard(true);
    }
  }, [gameState.phase, currentPlayer?.bid]);

  const handlePlayCard = (card: Card) => {
    if (!isMyTurn) return;
    socket.emit('play-card', card);
  };

  const handlePlaceBid = (bid: number) => {
    socket.emit('place-bid', bid);
    setShowBiddingModal(false);
  };

  const handleNextRound = () => {
    socket.emit('start-next-round');
    setShowScoreBoard(false);
  };

  if (!currentPlayer) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.roundText}>Round {gameState.currentRound}</Text>
        <TouchableOpacity
          style={styles.scoreButton}
          onPress={() => setShowScoreBoard(!showScoreBoard)}
        >
          <Text style={styles.scoreButtonText}>Scores</Text>
        </TouchableOpacity>
      </View>

      {/* Player Info */}
      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>{currentPlayer.name}</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Bid:</Text>
            <Text style={styles.statValue}>{currentPlayer.bid ?? '-'}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Tricks:</Text>
            <Text style={styles.statValue}>{currentPlayer.tricksWon}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Score:</Text>
            <Text style={styles.statValue}>{currentPlayer.score.toFixed(1)}</Text>
          </View>
        </View>
      </View>

      {/* Trick Area */}
      <View style={styles.trickArea}>
        <Text style={styles.trickTitle}>Current Trick</Text>
        <View style={styles.trickCards}>
          {gameState.currentTrick.cards.map((play, index) => {
            const player = gameState.players.find((p) => p.id === play.playerId);
            return (
              <View key={index} style={styles.trickCardContainer}>
                <CardComponent card={play.card} size="small" />
                <Text style={styles.trickPlayerName}>{player?.name}</Text>
              </View>
            );
          })}
        </View>
        {isMyTurn && gameState.phase === GamePhase.PLAYING && (
          <Text style={styles.turnIndicator}>YOUR TURN</Text>
        )}
      </View>

      {/* Other Players */}
      <ScrollView
        horizontal
        style={styles.otherPlayers}
        showsHorizontalScrollIndicator={false}
      >
        {gameState.players
          .filter((p) => p.id !== playerId)
          .map((player) => (
            <View key={player.id} style={styles.otherPlayerCard}>
              <Text style={styles.otherPlayerName}>{player.name}</Text>
              <Text style={styles.otherPlayerStat}>
                Bid: {player.bid ?? '-'} | Tricks: {player.tricksWon}
              </Text>
              <Text style={styles.otherPlayerCards}>
                {player.hand.length} cards
              </Text>
            </View>
          ))}
      </ScrollView>

      {/* Player's Hand */}
      <View style={styles.handContainer}>
        <Text style={styles.handTitle}>Your Hand</Text>
        <ScrollView
          horizontal
          style={styles.hand}
          showsHorizontalScrollIndicator={false}
        >
          {currentPlayer.hand.map((card) => (
            <TouchableOpacity
              key={card.id}
              onPress={() => handlePlayCard(card)}
              disabled={!isMyTurn || gameState.phase !== GamePhase.PLAYING}
              style={styles.cardWrapper}
            >
              <CardComponent
                card={card}
                size="medium"
                disabled={!isMyTurn || gameState.phase !== GamePhase.PLAYING}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Modals */}
      {showBiddingModal && (
        <BiddingModal
          maxBid={gameState.config.cardsPerPlayer}
          onPlaceBid={handlePlaceBid}
          onClose={() => setShowBiddingModal(false)}
        />
      )}

      {showScoreBoard && (
        <ScoreBoard
          players={gameState.players}
          onClose={() => setShowScoreBoard(false)}
          onNextRound={handleNextRound}
          showNextRound={gameState.players[0]?.id === playerId}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a472a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingTop: 40,
    backgroundColor: '#2a5a3a',
  },
  roundText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scoreButton: {
    backgroundColor: '#d4af37',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  scoreButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  playerInfo: {
    backgroundColor: '#2a5a3a',
    padding: 15,
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 10,
  },
  playerName: {
    color: '#d4af37',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#ccc',
    fontSize: 12,
  },
  statValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  trickArea: {
    flex: 1,
    margin: 15,
    backgroundColor: '#2a5a3a',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trickTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  trickCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  trickCardContainer: {
    alignItems: 'center',
    margin: 5,
  },
  trickPlayerName: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 5,
  },
  turnIndicator: {
    color: '#d4af37',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  otherPlayers: {
    maxHeight: 80,
    marginHorizontal: 15,
  },
  otherPlayerCard: {
    backgroundColor: '#2a5a3a',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    width: 150,
  },
  otherPlayerName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  otherPlayerStat: {
    color: '#ccc',
    fontSize: 11,
    marginBottom: 3,
  },
  otherPlayerCards: {
    color: '#d4af37',
    fontSize: 11,
  },
  handContainer: {
    backgroundColor: '#2a5a3a',
    paddingTop: 10,
    paddingBottom: 20,
  },
  handTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 10,
  },
  hand: {
    paddingLeft: 15,
  },
  cardWrapper: {
    marginRight: 10,
  },
});
