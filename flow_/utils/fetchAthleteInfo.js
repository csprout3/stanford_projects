import React, { useEffect, useState } from 'react';
import {View, StyleSheet, Text, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Video } from 'expo-av';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';

const clientID = '140990';
const clientSecret = '7babcd85fc323e5b749f818ed9ebc9c5b298db55';
const refreshTokenInitial = '8baddf0507f76a3e3adb62ed03403a975518e251';
const activitiesLink = 'https://www.strava.com/api/v3/athlete/activities';


export const fetchAthleteInfo = async (currentRefreshToken) => {
  const [accessToken, setAccessToken] = useState('f3e941e68d17b9c63be1fe7299dde990e9ab96d2');
  const [refreshToken, setRefreshToken] = useState(refreshTokenInitial);
  const [weeklyMileage, setWeeklyMileage] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [todayIndex, setTodayIndex] = useState(new Date().getDay());

  const router = useRouter();


  const fetchActivities = async () => {
    const weeklyMileage = Array(7).fill(0);

    try {
      // Fetch activities
      const response = await axios.get(activitiesLink, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Use the current accessToken
        },
      });

      // Filter and process weekly data
      const today = new Date();
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      const thisWeekActivities = response.data.filter((activity) => {
        const activityDate = new Date(activity.start_date);
        return activityDate >= startOfWeek;
      });

      thisWeekActivities.forEach((activity) => {
        const activityDate = new Date(activity.start_date);
        const dayIndex = activityDate.getDay();
        weeklyMileage[dayIndex] += activity.distance / 1609.34;
      });

      // Update weekly mileage state
      setWeeklyMileage(weeklyMileage);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('Access token expired. Refreshing token...');
        try {
          // Refresh the token and retry fetching activities
          const tokens = await refreshAccessToken();
          setAccessToken(tokens.access_token);
          setRefreshToken(tokens.refresh_token);
          await fetchActivities(); // Retry after refreshing token
        } catch (refreshError) {
          setErrorMessage('Failed to refresh access token.');
          console.error('Error refreshing access token:', refreshError.response?.data || refreshError.message);
        }
      } else {
        setErrorMessage('Error fetching activities.');
        console.error('Error fetching activities:', error.response?.data || error.message);
      }
    }
  }
};