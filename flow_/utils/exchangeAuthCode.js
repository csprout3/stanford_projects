import axios from 'axios';

const CLIENT_ID = '140990';
const CLIENT_SECRET = '7babcd85fc323e5b749f818ed9ebc9c5b298db55';
const TOKEN_URL = 'https://www.strava.com/api/v3/oauth/token';

export const exchangeAuthCode = async (authorizationCode) => {
  console.log("Debug Log: Running exchangeAuth");
  try {
    const response = await axios.post(TOKEN_URL, {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: authorizationCode,
      grant_type: 'authorization_code',
    });

    const { access_token, refresh_token, expires_at } = response.data;
    return { access_token, refresh_token, expires_at };
  } catch (error) {
    console.error('Error exchanging authorization code for token:', error.response?.data || error.message);
    throw error;
  }
};