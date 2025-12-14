// Lobby screen

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Socket } from 'socket.io-client';
import { GameState } from '../types/game';

interface LobbyProps {
  gameState: GameState;
  socket: Socket;
}

export default function Lobby({ gameState, socket }: LobbyProps) {
  const currentPlayer = gameState.players.find((p) => p.id === socket.id);
  const isHost = gameState.players[0]?.id === socket.id;

  const handleReady = () => {
    socket.emit('player-ready');
  };

  const canStart = gameState.players.length >= 2;
  const allReady = gameState.players.every((p) => p.isReady);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Lobby</Text>

      <View style={styles.gameCodeContainer}>
        <Text style={styles.gameCodeLabel}>Game Code:</Text>
        <Text style={styles.gameCode}>{gameState.id}</Text>
      </View>

      <View style={styles.configContainer}>
        <Text style={styles.configText}>
          Players: {gameState.config.playerCount} | Cards per Player: {gameState.config.cardsPerPlayer}
        </Text>
      </View>

      <ScrollView style={styles.playerList}>
        <Text style={styles.sectionTitle}>
          Players ({gameState.players.length}/12)
        </Text>

        {gameState.players.map((player, index) => (
          <View key={player.id} style={styles.playerItem}>
            <Text style={styles.playerNumber}>{index + 1}.</Text>
            <Text style={styles.playerName}>{player.name}</Text>
            {player.isReady && (
              <View style={styles.readyBadge}>
                <Text style={styles.readyText}>READY</Text>
              </View>
            )}
            {player.id === socket.id && (
              <View style={styles.youBadge}>
                <Text style={styles.youText}>YOU</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomContainer}>
        {!currentPlayer?.isReady ? (
          <TouchableOpacity
            style={[styles.button, !canStart && styles.buttonDisabled]}
            onPress={handleReady}
            disabled={!canStart}
          >
            <Text style={styles.buttonText}>
              {canStart ? 'Ready' : 'Waiting for more players...'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.waitingContainer}>
            <Text style={styles.waitingText}>
              {allReady
                ? 'Starting game...'
                : 'Waiting for other players...'}
            </Text>
          </View>
        )}

        <Text style={styles.hint}>
          Share the game code with friends to join!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a472a',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  gameCodeContainer: {
    backgroundColor: '#2a5a3a',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  gameCodeLabel: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 5,
  },
  gameCode: {
    color: '#d4af37',
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  configContainer: {
    backgroundColor: '#2a5a3a',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  configText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  playerList: {
    flex: 1,
    backgroundColor: '#2a5a3a',
    borderRadius: 10,
    padding: 15,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a472a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  playerNumber: {
    color: '#d4af37',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    width: 25,
  },
  playerName: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  readyBadge: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  readyText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  youBadge: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  youText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bottomContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: '#d4af37',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#666',
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  waitingContainer: {
    backgroundColor: '#2a5a3a',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  waitingText: {
    color: '#d4af37',
    fontSize: 16,
    fontWeight: 'bold',
  },
  hint: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 15,
  },
});
