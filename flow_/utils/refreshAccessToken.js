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

export const refreshAccessToken = async (currentRefreshToken) => {
  const [accessToken, setAccessToken] = useState('f3e941e68d17b9c63be1fe7299dde990e9ab96d2');
  const [refreshToken, setRefreshToken] = useState(refreshTokenInitial);
  const [weeklyMileage, setWeeklyMileage] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [todayIndex, setTodayIndex] = useState(new Date().getDay());

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post('https://www.strava.com/api/v3/oauth/token', {
        client_id: clientID,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      });
  
      const { access_token, refresh_token } = response.data;
      setAccessToken(access_token);
      setRefreshToken(refresh_token);
  
      console.log('Access token refreshed successfully.');
      return { access_token, refresh_token }; // Return tokens for immediate use
    } catch (error) {
      throw new Error(error.response?.data || error.message);
    }
  };
};