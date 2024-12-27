import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, ImageBackground} from 'react-native';
import { Video } from 'expo-av';
import { BlurView } from 'expo-blur';
import MapView, { Marker, Polyline } from 'react-native-maps';
import polyline from '@mapbox/polyline';

import { router } from 'expo-router';
import { useActivity, } from '@/components/ActivityContext';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function DetailsScreen() {
  const { selectedActivity } = useActivity();
  console.log("details selected", selectedActivity);

  const convertSpeedToPace = (speed) => {
    if (speed <= 0) return "N/A";
    const milesPerSecond = speed * 0.000621371;
    const timePerMileInSeconds = 1 / milesPerSecond;
    const paceMinutes = Math.floor(timePerMileInSeconds / 60);
    const paceSeconds = Math.round(timePerMileInSeconds % 60);
    return `${paceMinutes}:${paceSeconds.toString().padStart(2, "0")} min/mile`;
  };

  const KMConversion = 0.621;

  if (!selectedActivity || selectedActivity.length === 0) {
    return (
      <ImageBackground
        source={require('@/assets/home3.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace('/(tabs)/home')}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.error}>No activities available for this day.</Text>
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
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.backContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.replace('/(tabs)/home')}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>Activities for This Day</Text>

          {selectedActivity.map((activity, index) => {
            const summaryPolyline = activity?.map?.summary_polyline || '';
            const decodedPolyline = summaryPolyline
              ? polyline.decode(summaryPolyline).map(([latitude, longitude]) => ({ latitude, longitude }))
              : [];
            const startLatLng = activity?.start_latlng || [];
            const initialRegion = {
              latitude: startLatLng[0] || 0,
              longitude: startLatLng[1] || 0,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            };

            return (
              <View key={index} style={styles.detailsWrapper}>
                <Text style={styles.activityTitle}>{activity.name}</Text>

                <View style={[styles.detailContainer, styles.detailContainerFull]}>
                  <Text style={styles.label}>Distance</Text>
                  <Text style={styles.detailText}>
                    {((activity.distance / 1000) * KMConversion).toFixed(2)} miles
                  </Text>
                </View>

                <View style={styles.detailContainer}>
                  <Text style={styles.label}>Elapsed Time</Text>
                  <Text style={styles.detailText}>
                    {(activity.elapsed_time / 60).toFixed(2)} minutes
                  </Text>
                </View>

                <View style={styles.detailContainer}>
                  <Text style={styles.label}>Pace</Text>
                  <Text style={styles.detailText}>
                    {convertSpeedToPace(activity.average_speed)}
                  </Text>
                </View>

                <View style={[styles.detailContainer, styles.detailContainerFull]}>
                  <Text style={styles.label}>Heart Rate</Text>
                  <Text style={styles.detailText}>
                    {activity.average_heartrate || 'N/A'} bpm
                  </Text>
                </View>

                <View style={styles.detailContainer}>
                  <Text style={styles.label}>Watts</Text>
                  <Text style={styles.detailText}>
                    {activity.average_watts || 'N/A'} W
                  </Text>
                </View>

                <View style={styles.detailContainer}>
                  <Text style={styles.label}>Average Cadence</Text>
                  <Text style={styles.detailText}>
                    {activity.average_cadence || 'N/A'} spm
                  </Text>
                </View>

                {startLatLng.length > 1 && (
                  <View style={[styles.detailContainer, styles.detailContainerFull]}>
                    <Text style={styles.label}>Route Map</Text>
                    <View style={styles.mapContainer}>
                      <MapView
                        style={styles.map}
                        initialRegion={initialRegion}
                        zoomEnabled
                        scrollEnabled
                      >
                        <Polyline
                          coordinates={decodedPolyline}
                          strokeWidth={4}
                          strokeColor="#0086b3"
                        />
                        <Marker
                          coordinate={{
                            latitude: startLatLng[0],
                            longitude: startLatLng[1],
                          }}
                          title="Start Location"
                        />
                      </MapView>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
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
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: windowWidth,
    height: windowHeight,
  },
  backButton: {
    padding: 10,
    backgroundColor: 'lightblue',
    borderRadius: 5,
    marginBottom: 20,
    marginTop: 30,
    left: -windowWidth / 3,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scrollContent: {
    paddingBottom: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: windowWidth - 50,
  },
  error: {
    color: 'white',
    fontFamily: 'Sydney-Bold',
    fontSize: '24'
  },
  title: {
    fontSize: 30,
    color: 'lightblue',
    marginBottom: 20,
    fontWeight: 'bold',
    fontFamily: 'Sydney-Bold',
  },
  activityTitle: {
    fontSize: 24,
    color: 'lightblue',
    marginBottom: 15,
    fontWeight: 'bold',
    fontFamily: 'Sydney-Bold',
  },
  detailsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  detailContainer: {
    // backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    flexBasis: '48%', // Take up approximately half the row
  },
  detailContainerFull: {
    flexBasis: '100%', // Take up the entire row
  },
  detailText: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'Sydney',
  },
  label: {
    fontSize: 14,
    color: 'lightblue',
    fontWeight: 'bold',
    marginBottom: 5,
    fontFamily: 'Sydney-Bold',
  },
  mapContainer: {
    height: 200,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
  },
  map: {
    height: '100%',
    width: '100%',
  },
});