import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { LoginScreen } from '../screens/LoginScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ProgressScreen } from '../screens/ProgressScreen';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Progress: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * App Navigator
 * Handles navigation and auth flow
 * - Shows LoginScreen if not authenticated
 * - Shows Home/Progress screens if authenticated
 */
export const AppNavigator: React.FC = () => {
  const { user, loading, signOut } = useAuth();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3182ce" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1a1a2e',
          },
          headerTintColor: '#e6f1ff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {!user ? (
          // Auth Stack
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          // Main App Stack
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={({ navigation }) => ({
                title: 'Bakugan Focus',
                headerRight: () => (
                  <View style={styles.headerButtons}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Progress')}
                      style={styles.headerButton}
                    >
                      <Text style={styles.headerButtonText}>Progress</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={signOut}
                      style={styles.headerButton}
                    >
                      <Text style={styles.headerButtonText}>Sign Out</Text>
                    </TouchableOpacity>
                  </View>
                ),
              })}
            />
            <Stack.Screen
              name="Progress"
              component={ProgressScreen}
              options={{
                title: 'Progress'
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  headerButtonText: {
    color: '#3182ce',
    fontSize: 16,
    fontWeight: '600'
  }
});
