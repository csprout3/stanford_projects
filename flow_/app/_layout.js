import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';
import { AuthProvider } from '@/components/AuthContext';
import { ActivityProvider } from '@/components/ActivityContext';
import { Asset } from 'expo-asset';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  // Preload assets (images)
  const preloadAssets = async () => {
    const images = [
      require('@/assets/home3.png'),
    ];
    const cacheImages = images.map((img) => Asset.fromModule(img).downloadAsync());
    await Promise.all(cacheImages);
  };

  useEffect(() => {
    preloadAssets().then(() => setIsReady(true));
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        {/* Placeholder while assets load */}
      </View>
    );
  }

  return (
    <ActivityProvider>
      <AuthProvider>
        <View style={styles.container}>
          <Slot />
        </View>
      </AuthProvider>
    </ActivityProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', // Fallback background color
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
});