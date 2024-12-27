import { Tabs } from 'expo-router';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesomeIcon from '@expo/vector-icons/FontAwesome';


export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Hide the header globally
        // tabBarActiveBackgroundColor: '#000',
        tabBarStyle: {
          backgroundColor: 'black', // Set the background to black
          borderTopWidth: 0, // Remove the border (optional)
        },
        tabBarInactiveTintColor: 'gray', // Set inactive tab color
      }}
    >
      <Tabs.Screen 
      name="home"
      options={{
        tabBarIcon: ({ color, size }) => (
          <FontAwesome name="pagelines" color={color} size={size} />
        ),
        title: "Progress",
        tabBarActiveTintColor: 'lightblue'
      }}
       />
      <Tabs.Screen 
      name="forecast" 
      options={{
        tabBarIcon: ({ color, size }) => (
          <FontAwesome name="umbrella" color={color} size={size} />
        ),
        title: "Forecast",
        tabBarActiveTintColor: 'pink'
      }}
      />
      <Tabs.Screen 
      name="profile" 
      options={{
        tabBarIcon: ({ color, size }) => (
          <FontAwesome name="user" color={color} size={size} />
        ),
        title: "Profile",
        tabBarActiveTintColor: 'white'
      }}
      />
    </Tabs>
  );
}