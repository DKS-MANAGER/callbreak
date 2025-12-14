// Main App component

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { io, Socket } from 'socket.io-client';
import MainMenu from './src/screens/MainMenu';
import Lobby from './src/screens/Lobby';
import GameBoard from './src/screens/GameBoard';
import { GameState, GamePhase } from './src/types/game';

export default function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerName, setPlayerName] = useState<string>('');
  const [screen, setScreen] = useState<'menu' | 'lobby' | 'game'>('menu');

  useEffect(() => {
    // Connect to server (replace with your server URL)
    const newSocket = io('http://localhost:3000');

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
    setPlayerName(name);
    socket?.emit('create-game', name);
  };

  const handleJoinGame = (gameId: string, name: string) => {
    setPlayerName(name);
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
