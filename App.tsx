// Main App component

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { io, Socket } from 'socket.io-client';
import MainMenu from './src/screens/MainMenu';
import Lobby from './src/screens/Lobby';
import GameBoard from './src/screens/GameBoard';
import { GameState, GamePhase } from './src/types/game';
import config from './src/config';

export default function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [screen, setScreen] = useState<'menu' | 'lobby' | 'game'>('menu');

  useEffect(() => {
    // Connect to server using config
    const newSocket = io(config.serverUrl);

    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('game-created', (state: GameState) => {
      setGameState(state);
      setScreen('lobby');
    });

    newSocket.on('game-updated', (state: GameState) => {
      setGameState(state);
      
      if (state.phase === GamePhase.BIDDING || state.phase === GamePhase.PLAYING) {
        setScreen('game');
      }
    });

    newSocket.on('game-started', (state: GameState) => {
      setGameState(state);
      setScreen('game');
    });

    newSocket.on('error', (error: { message: string }) => {
      Alert.alert('Error', error.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const handleCreateGame = (name: string) => {
    socket?.emit('create-game', name);
  };

  const handleJoinGame = (gameId: string, name: string) => {
    socket?.emit('join-game', { gameId, playerName: name });
  };

  return (
    <View style={styles.container}>
      {screen === 'menu' && (
        <MainMenu onCreateGame={handleCreateGame} onJoinGame={handleJoinGame} />
      )}
      {screen === 'lobby' && gameState && socket && (
        <Lobby gameState={gameState} socket={socket} />
      )}
      {screen === 'game' && gameState && socket && socket.id && (
        <GameBoard gameState={gameState} socket={socket} playerId={socket.id} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a472a',
  },
});
