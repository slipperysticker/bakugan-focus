import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

/**
 * Login Screen
 * Simple full-screen with Google Sign-In button
 * No onboarding, no username creation
 */
export const LoginScreen: React.FC = () => {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signIn();
    } catch (error: any) {
      console.error('Sign in failed:', error);
      Alert.alert(
        'Sign In Failed',
        'Could not sign in with Google. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bakugan Focus</Text>
      <Text style={styles.subtitle}>Stay focused. Build daily.</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleGoogleSignIn}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Continue with Google</Text>
        )}
      </TouchableOpacity>
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
  title: {
    color: '#e6f1ff',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 12
  },
  subtitle: {
    color: '#8892b0',
    fontSize: 18,
    marginBottom: 60
  },
  button: {
    backgroundColor: '#3182ce',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 12,
    minWidth: 250,
    alignItems: 'center'
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold'
  }
});
