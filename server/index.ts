// Game server for multiplayer Call Break

import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import {
  GameState,
  GamePhase,
  Card,
} from '../src/types/game';
import {
  createGameState,
  startNewRound,
  processBid,
  playCard,
} from '../src/game/logic';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Store active games
const games = new Map<string, GameState>();
const playerGameMap = new Map<string, string>(); // Maps socket.id to game ID

app.get('/health', (req, res) => {
  res.json({ status: 'ok', games: games.size });
});

io.on('connection', (socket: Socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Create or join a game
  socket.on('create-game', (playerName: string) => {
    const gameState = createGameState([socket.id], [playerName]);
    games.set(gameState.id, gameState);
    playerGameMap.set(socket.id, gameState.id);

    socket.join(gameState.id);
    socket.emit('game-created', gameState);

    console.log(`Game created: ${gameState.id} by ${playerName}`);
  });

  socket.on('join-game', ({ gameId, playerName }: { gameId: string; playerName: string }) => {
    const gameState = games.get(gameId);

    if (!gameState) {
      socket.emit('error', { message: 'Game not found' });
      return;
    }

    if (gameState.phase !== GamePhase.LOBBY) {
      socket.emit('error', { message: 'Game already started' });
      return;
    }

    if (gameState.players.length >= 12) {
      socket.emit('error', { message: 'Game is full' });
      return;
    }

    // Add player to game
    const newPlayer = {
      id: socket.id,
      name: playerName,
      hand: [],
      bid: null,
      tricksWon: 0,
      score: 0,
      isReady: false,
    };

    const updatedGameState = {
      ...gameState,
      players: [...gameState.players, newPlayer],
    };

    games.set(gameId, updatedGameState);
    playerGameMap.set(socket.id, gameId);

    socket.join(gameId);
    io.to(gameId).emit('game-updated', updatedGameState);

    console.log(`Player ${playerName} joined game ${gameId}`);
  });

  socket.on('player-ready', () => {
    const gameId = playerGameMap.get(socket.id);
    if (!gameId) return;

    const gameState = games.get(gameId);
    if (!gameState) return;

    const playerIndex = gameState.players.findIndex((p) => p.id === socket.id);
    if (playerIndex === -1) return;

    const updatedPlayers = [...gameState.players];
    updatedPlayers[playerIndex] = {
      ...updatedPlayers[playerIndex],
      isReady: true,
    };

    const updatedGameState = {
      ...gameState,
      players: updatedPlayers,
    };

    games.set(gameId, updatedGameState);
    io.to(gameId).emit('game-updated', updatedGameState);

    // Check if all players are ready (minimum 2 players)
    const allReady = updatedPlayers.every((p) => p.isReady) && updatedPlayers.length >= 2;

    if (allReady) {
      // Start the game
      const gameWithRound = startNewRound(updatedGameState);
      games.set(gameId, gameWithRound);
      io.to(gameId).emit('game-started', gameWithRound);
      io.to(gameId).emit('game-updated', gameWithRound);
    }
  });

  socket.on('place-bid', (bid: number) => {
    const gameId = playerGameMap.get(socket.id);
    if (!gameId) return;

    const gameState = games.get(gameId);
    if (!gameState || gameState.phase !== GamePhase.BIDDING) return;

    try {
      const updatedGameState = processBid(gameState, socket.id, bid);
      games.set(gameId, updatedGameState);
      io.to(gameId).emit('game-updated', updatedGameState);

      if (updatedGameState.phase === GamePhase.PLAYING) {
        io.to(gameId).emit('bidding-complete');
      }
    } catch (error) {
      socket.emit('error', { message: (error as Error).message });
    }
  });

  socket.on('play-card', (card: Card) => {
    const gameId = playerGameMap.get(socket.id);
    if (!gameId) return;

    const gameState = games.get(gameId);
    if (!gameState || gameState.phase !== GamePhase.PLAYING) return;

    try {
      const updatedGameState = playCard(gameState, socket.id, card);
      games.set(gameId, updatedGameState);
      io.to(gameId).emit('game-updated', updatedGameState);

      if (updatedGameState.phase === GamePhase.ROUND_END) {
        io.to(gameId).emit('round-ended');
      }
    } catch (error) {
      socket.emit('error', { message: (error as Error).message });
    }
  });

  socket.on('start-next-round', () => {
    const gameId = playerGameMap.get(socket.id);
    if (!gameId) return;

    const gameState = games.get(gameId);
    if (!gameState || gameState.phase !== GamePhase.ROUND_END) return;

    const newRoundState = startNewRound(gameState);
    games.set(gameId, newRoundState);
    io.to(gameId).emit('game-updated', newRoundState);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);

    const gameId = playerGameMap.get(socket.id);
    if (gameId) {
      const gameState = games.get(gameId);
      if (gameState) {
        // Remove player from game
        const updatedPlayers = gameState.players.filter((p) => p.id !== socket.id);

        if (updatedPlayers.length === 0) {
          // Delete empty game
          games.delete(gameId);
          console.log(`Game ${gameId} deleted (no players left)`);
        } else {
          const updatedGameState = {
            ...gameState,
            players: updatedPlayers,
          };

          games.set(gameId, updatedGameState);
          io.to(gameId).emit('player-left', { playerId: socket.id });
          io.to(gameId).emit('game-updated', updatedGameState);
        }
      }

      playerGameMap.delete(socket.id);
    }
  });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
