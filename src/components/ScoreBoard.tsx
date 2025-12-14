// ScoreBoard component

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Player } from '../types/game';

interface ScoreBoardProps {
  players: Player[];
  onClose: () => void;
  onNextRound?: () => void;
  showNextRound?: boolean;
}

export default function ScoreBoard({
  players,
  onClose,
  onNextRound,
  showNextRound = false,
}: ScoreBoardProps) {
  // Sort players by score (descending)
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <Modal transparent visible animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Scoreboard</Text>

          <ScrollView style={styles.scoreList}>
            <View style={styles.tableHeader}>
              <Text style={[styles.headerText, styles.rankCol]}>Rank</Text>
              <Text style={[styles.headerText, styles.nameCol]}>Player</Text>
              <Text style={[styles.headerText, styles.bidCol]}>Bid</Text>
              <Text style={[styles.headerText, styles.tricksCol]}>Tricks</Text>
              <Text style={[styles.headerText, styles.scoreCol]}>Score</Text>
            </View>

            {sortedPlayers.map((player, index) => (
              <View key={player.id} style={styles.tableRow}>
                <View style={styles.rankCol}>
                  <Text style={styles.rankText}>#{index + 1}</Text>
                </View>
                <Text style={[styles.cellText, styles.nameCol]}>
                  {player.name}
                </Text>
                <Text style={[styles.cellText, styles.bidCol]}>
                  {player.bid ?? '-'}
                </Text>
                <Text
                  style={[
                    styles.cellText,
                    styles.tricksCol,
                    player.tricksWon >= (player.bid ?? 0)
                      ? styles.successText
                      : styles.failText,
                  ]}
                >
                  {player.tricksWon}
                </Text>
                <Text style={[styles.cellText, styles.scoreCol, styles.boldText]}>
                  {player.score.toFixed(1)}
                </Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.buttonContainer}>
            {showNextRound && onNextRound && (
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={onNextRound}
              >
                <Text style={styles.buttonText}>Start Next Round</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#2a5a3a',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  title: {
    color: '#d4af37',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  scoreList: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1a472a',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#1a472a',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    alignItems: 'center',
  },
  headerText: {
    color: '#d4af37',
    fontWeight: 'bold',
    fontSize: 12,
  },
  cellText: {
    color: '#fff',
    fontSize: 14,
  },
  rankCol: {
    width: 50,
    alignItems: 'center',
  },
  nameCol: {
    flex: 1,
  },
  bidCol: {
    width: 50,
    textAlign: 'center',
  },
  tricksCol: {
    width: 60,
    textAlign: 'center',
  },
  scoreCol: {
    width: 70,
    textAlign: 'right',
  },
  rankText: {
    color: '#d4af37',
    fontWeight: 'bold',
    fontSize: 16,
  },
  successText: {
    color: '#4caf50',
    fontWeight: 'bold',
  },
  failText: {
    color: '#f44336',
    fontWeight: 'bold',
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonContainer: {
    gap: 10,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#d4af37',
  },
  secondaryButton: {
    backgroundColor: '#555',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
