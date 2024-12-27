import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground} from 'react-native';
import { BlurView } from 'expo-blur';
import { useActivity } from '@/components/ActivityContext';
import { useRouter, useSearchParams} from 'expo-router';
import { Video } from 'expo-av';
import * as SecureStore from 'expo-secure-store';

export default function Profile() {
  const { athleteInfo } = useActivity();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      console.log('Logout button pressed, starting token deletion.');
      await SecureStore.deleteItemAsync('access_token');
      console.log('Access token deleted.');
      await SecureStore.deleteItemAsync('refresh_token');
      console.log('Refresh token deleted.');
      router.replace('/login');
      console.log('Redirecting to login.');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  if (!athleteInfo) {
    return (
      <ImageBackground
        source={require('@/assets/home3.png')}
        style={styles.background}
        resizeMode="cover"
      >
      <View style={styles.container}>
        <Text style={styles.errorText}>Loading athlete information...</Text>
      </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
        source={require('@/assets/home3.png')}
        style={styles.background}
        resizeMode="cover"
      >
      <View style={styles.container}>
        <Image source={{ uri: athleteInfo.profile }} style={styles.profilePhoto} />
        <Text style={styles.profileText}>
          Signed in to {athleteInfo.firstname}'s Strava Account
        </Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  profilePhoto: { width: 100, height: 100, borderRadius: 50, marginBottom: 20 },
  profileText: { fontSize: 22, color: 'white', marginBottom: 20, fontWeight: 'bold', fontFamily: 'Sydney-Bold'},
  logoutButton: { backgroundColor: '#FF4500', padding: 10, borderRadius: 5 },
  logoutText: { color: 'white', fontSize: 16, fontWeight: '800' },
  errorText: { color: 'white', fontSize: 16, fontFamily: 'Sydney-Bold'},
});