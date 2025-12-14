// Bidding modal component

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';

interface BiddingModalProps {
  maxBid: number;
  onPlaceBid: (bid: number) => void;
  onClose: () => void;
}

export default function BiddingModal({
  maxBid,
  onPlaceBid,
  onClose,
}: BiddingModalProps) {
  const [selectedBid, setSelectedBid] = useState<number>(1);

  const bids = Array.from({ length: maxBid }, (_, i) => i + 1);

  return (
    <Modal transparent visible animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Place Your Bid</Text>
          <Text style={styles.subtitle}>
            How many tricks do you think you can win?
          </Text>

          <View style={styles.bidGrid}>
            {bids.map((bid) => (
              <TouchableOpacity
                key={bid}
                style={[
                  styles.bidButton,
                  selectedBid === bid && styles.bidButtonSelected,
                ]}
                onPress={() => setSelectedBid(bid)}
              >
                <Text
                  style={[
                    styles.bidText,
                    selectedBid === bid && styles.bidTextSelected,
                  ]}
                >
                  {bid}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => onPlaceBid(selectedBid)}
          >
            <Text style={styles.confirmButtonText}>Confirm Bid: {selectedBid}</Text>
          </TouchableOpacity>
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
    width: '85%',
    maxWidth: 400,
  },
  title: {
    color: '#d4af37',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  bidGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  bidButton: {
    backgroundColor: '#1a472a',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2a5a3a',
  },
  bidButtonSelected: {
    backgroundColor: '#d4af37',
    borderColor: '#d4af37',
  },
  bidText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  bidTextSelected: {
    color: '#1a472a',
  },
  confirmButton: {
    backgroundColor: '#d4af37',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
