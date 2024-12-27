import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Video } from 'expo-av';
import { BlurView } from 'expo-blur';
import { useActivity } from '@/components/ActivityContext';
import * as SecureStore from 'expo-secure-store';
import { useCallback } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function WelcomePage() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initialize fade animation value
  const { setAthleteInfo, setWeeklyActivities, setWeeklyMileage } = useActivity();
  const [loading, setLoading] = useState(true);
  const [initialDelayComplete, setInitialDelayComplete] = useState(false);

  const [fontsLoaded] = useFonts({
    Sydney: require('@/assets/Fonts/Sydney-Serial-Regular.ttf'),
    'Sydney-Bold': require('@/assets/Fonts/Sydney-Serial-Bold.ttf'),
  });

  useEffect(() => {
    // Initial delay of 1.5 seconds
    const delayTimeout = setTimeout(() => {
      setInitialDelayComplete(true);
    }, 1500);

    return () => clearTimeout(delayTimeout);
  }, []);

  const refreshAccessToken = async () => {
    const clientID = 'YOUR_CLIENT_ID';
    const clientSecret = 'YOUR_CLIENT_SECRET';
    const refreshToken = await SecureStore.getItemAsync('refresh_token');
    try {
      const response = await fetch('https://www.strava.com/api/v3/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientID,
          client_secret: clientSecret,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh access token');
      }

      const { access_token, refresh_token } = await response.json();
      await SecureStore.setItemAsync('access_token', access_token);
      await SecureStore.setItemAsync('refresh_token', refresh_token);

      return access_token;
      router.replace('/(auth)/')
    } catch (error) {
      // Alert.alert('Error', 'Unable to refresh access token. Please log in again.');
      // console.error('Refresh token error:', error.message);
      router.replace('/login');
    }
  };

  const initializeData = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync('access_token') || await refreshAccessToken();
      const activitiesLink = 'https://www.strava.com/api/v3/athlete/activities';
      const athleteLink = 'https://www.strava.com/api/v3/athlete';
      const options = { headers: { Authorization: `Bearer ${accessToken}` } };

      // Fetch athlete info
      const athleteResponse = await fetch(athleteLink, options);
      if (!athleteResponse.ok) throw new Error('Failed to fetch athlete info');
      const athleteData = await athleteResponse.json();
      setAthleteInfo(athleteData);

      // Fetch activities
      const activitiesResponse = await fetch(activitiesLink, options);
      if (!activitiesResponse.ok) throw new Error('Failed to fetch activities');
      const activitiesData = await activitiesResponse.json();

      // Process activities for December 1-7
      const weekStart = new Date(2024, 11, 1); // December 1, 2024
      const weekEnd = new Date(2024, 11, 8); // December 8, 2024
      const mileage = Array(7).fill(0);
      const activitiesByDay = Array(7).fill(null).map(() => []);

      activitiesData.forEach((activity) => {
        const activityDate = new Date(activity.start_date);
        if (activityDate >= weekStart && activityDate < weekEnd) {
          const dayIndex = Math.floor((activityDate - weekStart) / (24 * 60 * 60 * 1000));
          if (dayIndex >= 0 && dayIndex < 7) {
            mileage[dayIndex] += activity.distance / 1609.34; // Convert meters to miles
            activitiesByDay[dayIndex].push(activity);
          }
        }
      });

      setWeeklyMileage(mileage);
      setWeeklyActivities(activitiesByDay);

      setLoading(false);
    } catch (error) {
      Alert.alert('Error', 'Unable to initialize data. Please try again.');
      console.error('Initialization error:', error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    initializeData();
  }, []);

  useEffect(() => {
    if (!loading && initialDelayComplete) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        router.replace('/home');
      });
    }
  }, [loading, initialDelayComplete]);

  return (
    <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
      <View style={styles.container}>
        <Video
          source={require('@/assets/flow-background.mp4')}
          rate={0.9}
          shouldPlay
          isLooping
          resizeMode="cover"
          style={StyleSheet.absoluteFillObject}
        />
        <BlurView style={styles.overlay} intensity={15}>
          <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
            <Text style={[styles.text, styles.textShadow1]}>Welcome to Flow</Text>
            <Text style={styles.text}>Welcome to Flow</Text>
          </Animated.View>
        </BlurView>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: 'white',
    fontFamily: 'Sydney-Bold',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: windowWidth
  },
  text: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'pink',
    fontFamily: 'Sydney-Bold',
    position: 'absolute'

  },
  textShadow1: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'lightblue',
    opacity: 0.8,
    position: 'relative',
    top: 2.6,
    left: -2.6,
    fontFamily: 'Sydney-Bold',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});