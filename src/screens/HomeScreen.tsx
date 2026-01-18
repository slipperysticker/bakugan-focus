import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { checkInService } from '../services/checkInService';
import { BakuganOrb } from '../components/BakuganOrb';

/**
 * Home Screen (Primary Screen)
 * Main interface for daily check-ins
 * Shows power level, streak, and check-in button
 */
export const HomeScreen: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);

  /**
   * Check if user already checked in today on mount
   */
  useEffect(() => {
    checkTodayStatus();
  }, []);

  const checkTodayStatus = async () => {
    if (!user) return;

    try {
      const checkedIn = await checkInService.hasCheckedInToday(user.uid);
      setHasCheckedIn(checkedIn);
    } catch (error) {
      console.error('Error checking today status:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle YES button press
   * Creates check-in and updates user data
   */
  const handleYes = async () => {
    if (!user || hasCheckedIn) return;

    setCheckingIn(true);
    try {
      await checkInService.createCheckIn(user.uid);
      await refreshUser(); // Refresh user data to show updated power and streak
      setHasCheckedIn(true);
      Alert.alert('Success!', 'Check-in complete. Power +1!');
    } catch (error: any) {
      console.error('Check-in error:', error);
      Alert.alert('Error', error.message || 'Failed to check in. Please try again.');
    } finally {
      setCheckingIn(false);
    }
  };

  /**
   * Handle NOT YET button press
   * Does nothing - allows user to return later
   */
  const handleNotYet = () => {
    // Intentionally does nothing
  };

  if (!user) return null;

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3182ce" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Bakugan Orb */}
      <BakuganOrb power={user.power} />

      {/* Stats Display */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Power Level</Text>
          <Text style={styles.statValue}>{user.power}</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Current Streak</Text>
          <Text style={styles.statValue}>{user.currentStreak} days</Text>
        </View>
      </View>

      {/* Main Question */}
      <Text style={styles.question}>Did you build today?</Text>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.yesButton, hasCheckedIn && styles.buttonDisabled]}
          onPress={handleYes}
          disabled={hasCheckedIn || checkingIn}
        >
          {checkingIn ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {hasCheckedIn ? 'DONE TODAY' : 'YES'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.notYetButton]}
          onPress={handleNotYet}
          disabled={hasCheckedIn}
        >
          <Text style={styles.buttonText}>NOT YET</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 40,
    marginBottom: 60
  },
  statBox: {
    alignItems: 'center',
    marginHorizontal: 30
  },
  statLabel: {
    color: '#8892b0',
    fontSize: 14,
    marginBottom: 8
  },
  statValue: {
    color: '#e6f1ff',
    fontSize: 32,
    fontWeight: 'bold'
  },
  question: {
    color: '#e6f1ff',
    fontSize: 24,
    marginBottom: 40,
    fontWeight: '600'
  },
  buttonContainer: {
    width: '100%',
    gap: 16
  },
  button: {
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%'
  },
  yesButton: {
    backgroundColor: '#3182ce'
  },
  notYetButton: {
    backgroundColor: '#4a5568'
  },
  buttonDisabled: {
    backgroundColor: '#2d3748',
    opacity: 0.6
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold'
  }
});
