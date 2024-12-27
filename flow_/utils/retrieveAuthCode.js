import React, { useEffect, useState } from 'react';
import { View, Button, Text, StyleSheet, Linking, Alert, ActivityIndicator } from 'react-native';

const clientID = '140990';
const redirectUri = 'flowapp://auth';
const scope = 'activity:read_all';

export default function RetrieveAuthCode() {
  const [loading, setLoading] = useState(false); // Loading state

  const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;

  const openAuthPage = async () => {
    try {
      setLoading(true);
      await Linking.openURL(authUrl);
      console.log("Auth page opened successfully.");
    } catch (err) {
      Alert.alert('Error', 'Failed to open authorization page.');
      console.error('Error opening auth page:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleDeepLink = (event) => {
      const { url } = event;
      console.log('Deep link received:', url);

      const match = url.match(/code=([^&]*)/);
      if (match) {
        const authorizationCode = match[1];
        console.log('Authorization Code:', authorizationCode);

        // Handle navigation or API call with the authorization code here
        Alert.alert('Success', `Authorization Code: ${authorizationCode}`);
        setLoading(false);
      } else {
        Alert.alert('Error', 'Authorization code not found.');
        setLoading(false);
      }
    };

    // Add deep link event listener
    Linking.addEventListener('url', handleDeepLink);

    // Cleanup event listener on unmount
    return () => {
      Linking.removeEventListener('url', handleDeepLink);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        You need to authorize access to your Strava account to proceed.
      </Text>
      {loading ? (
        <ActivityIndicator size="large" color="#FF69B4" />
      ) : (
        <Button title="Authorize Strava" onPress={openAuthPage} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  text: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
});