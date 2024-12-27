import { useState, useEffect } from "react";
import { ResponseType, useAuthRequest, makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

const CLIENT_ID = "YOUR_STRAVA_CLIENT_ID";
const CLIENT_SECRET = "YOUR_STRAVA_CLIENT_SECRET";
const STRAVA_API = {
  AUTHORIZATION_ENDPOINT: "https://www.strava.com/oauth/authorize",
  TOKEN_ENDPOINT: "https://www.strava.com/oauth/token",
};

WebBrowser.maybeCompleteAuthSession();

const useStravaAuth = () => {
  const [token, setToken] = useState(null);
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: ["read", "activity:read_all"],
      redirectUri: makeRedirectUri({ useProxy: true }),
      responseType: ResponseType.Code,
    },
    { authorizationEndpoint: STRAVA_API.AUTHORIZATION_ENDPOINT }
  );

//   console.log("Redi rect URI:", redirectUri);

  useEffect(() => {
    if (response?.type === "success" && response.params?.code) {
      const authorizationCode = response.params.code;

      fetch(STRAVA_API.TOKEN_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code: authorizationCode,
          grant_type: "authorization_code",
        }),
      })
        .then((res) => res.json())
        .then((data) => setToken(data.access_token))
        .catch((error) => console.error("Token Exchange Error:", error));
    }
  }, [response]);

  return { token, login: promptAsync };
};

export default useStravaAuth;