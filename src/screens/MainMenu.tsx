// Main Menu screen

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

interface MainMenuProps {
  onCreateGame: (name: string) => void;
  onJoinGame: (gameId: string, name: string) => void;
}

export default function MainMenu({ onCreateGame, onJoinGame }: MainMenuProps) {
  const [name, setName] = useState('');
  const [gameId, setGameId] = useState('');
  const [mode, setMode] = useState<'main' | 'create' | 'join'>('main');

  const handleCreateGame = () => {
    if (name.trim()) {
      onCreateGame(name.trim());
    }
  };

  const handleJoinGame = () => {
    if (name.trim() && gameId.trim()) {
      onJoinGame(gameId.trim().toUpperCase(), name.trim());
    }
  };

  if (mode === 'main') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>CALL BREAK</Text>
        <Text style={styles.subtitle}>Multiplayer Card Game</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setMode('create')}
          >
            <Text style={styles.buttonText}>Create Game</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => setMode('join')}
          >
            <Text style={styles.buttonText}>Join Game</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>• 2-12 Players</Text>
          <Text style={styles.infoText}>• Local WiFi Multiplayer</Text>
          <Text style={styles.infoText}>• Trick-Based Card Game</Text>
        </View>
      </View>
    );
  }

  if (mode === 'create') {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Text style={styles.title}>Create Game</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Your Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="#888"
            maxLength={20}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, !name.trim() && styles.buttonDisabled]}
          onPress={handleCreateGame}
          disabled={!name.trim()}
        >
          <Text style={styles.buttonText}>Create Game</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => setMode('main')}
        >
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.title}>Join Game</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Your Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor="#888"
          maxLength={20}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Game Code</Text>
        <TextInput
          style={styles.input}
          value={gameId}
          onChangeText={(text) => setGameId(text.toUpperCase())}
          placeholder="Enter game code"
          placeholderTextColor="#888"
          autoCapitalize="characters"
          maxLength={7}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          (!name.trim() || !gameId.trim()) && styles.buttonDisabled,
        ]}
        onPress={handleJoinGame}
        disabled={!name.trim() || !gameId.trim()}
      >
        <Text style={styles.buttonText}>Join Game</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => setMode('main')}
      >
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a472a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#ccc',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    gap: 15,
  },
  button: {
    backgroundColor: '#d4af37',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  secondaryButton: {
    backgroundColor: '#555',
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
  inputContainer: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  infoContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  infoText: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 5,
  },
});
