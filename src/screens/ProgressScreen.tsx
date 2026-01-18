import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { TimelineIcon } from '../components/TimelineIcon';
import { format } from 'date-fns';

interface TimelineDay {
  date: string;
  completed: boolean;
}

/**
 * Progress Screen
 * Shows vertical timeline of all days since user created account
 * - Filled icon for completed days
 * - Empty icon for missed days
 */
export const ProgressScreen: React.FC = () => {
  const { user } = useAuth();
  const [timeline, setTimeline] = useState<TimelineDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTimeline();
  }, []);

  /**
   * Load timeline from Firestore
   * Builds a day-by-day view from user creation to today
   */
  const loadTimeline = async () => {
    if (!user) return;

    try {
      // Get all check-ins for this user
      const checkInsRef = collection(db, 'checkIns');
      const q = query(
        checkInsRef,
        where('uid', '==', user.uid)
      );

      const querySnapshot = await getDocs(q);
      const checkInDates = new Set<string>();

      querySnapshot.forEach((doc) => {
        checkInDates.add(doc.data().date);
      });

      // Build timeline from user creation to today
      const timelineData: TimelineDay[] = [];
      const today = new Date();
      const startDate = user.createdAt;

      const currentDate = new Date(startDate);
      while (currentDate <= today) {
        const dateString = format(currentDate, 'yyyy-MM-dd');
        timelineData.push({
          date: dateString,
          completed: checkInDates.has(dateString)
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Reverse to show most recent first
      setTimeline(timelineData.reverse());
    } catch (error) {
      console.error('Error loading timeline:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3182ce" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Your Journey</Text>

      <View style={styles.timeline}>
        {timeline.map((day) => (
          <View key={day.date} style={styles.timelineItem}>
            <TimelineIcon completed={day.completed} />
            <Text style={styles.dateText}>{day.date}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e'
  },
  content: {
    padding: 20
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    color: '#e6f1ff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30
  },
  timeline: {
    paddingLeft: 20
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  dateText: {
    color: '#8892b0',
    fontSize: 16,
    marginLeft: 20
  }
});
