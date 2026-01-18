import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { signInWithCredential, GoogleAuthProvider, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../config/firebase';

/**
 * Configure Google Sign-In
 *
 * IMPORTANT: Replace YOUR-WEB-CLIENT-ID with the actual Web Client ID from Firebase Console
 * Firebase Console > Project Settings > General > Your apps > Web app
 */
GoogleSignin.configure({
  webClientId: 'YOUR-WEB-CLIENT-ID.apps.googleusercontent.com',
  iosClientId: 'YOUR-IOS-CLIENT-ID.apps.googleusercontent.com', // Optional for iOS
});

export const authService = {
  /**
   * Sign in with Google using Firebase Authentication
   */
  async signInWithGoogle() {
    try {
      // Check if device supports Google Play Services (Android)
      await GoogleSignin.hasPlayServices();

      // Trigger Google Sign-In flow
      const userInfo = await GoogleSignin.signIn();

      // Create Firebase credential from Google ID token
      const googleCredential = GoogleAuthProvider.credential(userInfo.data?.idToken);

      // Sign in to Firebase with the Google credential
      const userCredential = await signInWithCredential(auth, googleCredential);

      return userCredential.user;
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  },

  /**
   * Sign out from both Google and Firebase
   */
  async signOut() {
    try {
      await GoogleSignin.signOut();
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign-Out Error:', error);
      throw error;
    }
  }
};
