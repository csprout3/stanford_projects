import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useRouter } from 'expo-router';
import { useActivity } from '@/components/ActivityContext';

const screenWidth = Dimensions.get('window').width;

export default function WeeklyMileageChart() {
  const { weeklyMileage, weeklyActivities, setSelectedActivity } = useActivity();
  const router = useRouter();

  const handleBarPress = (index) => {
    const selected = weeklyActivities[index];
    if (!selected || selected.length === 0) {
      Alert.alert('No Activity', 'There is no activity data available for this day.', [
        { text: 'OK' },
      ]);
      return;
    }
    setSelectedActivity(selected);
    console.log("selected", selected);
    router.push('/(auth)/details');
  };

  return (
    <ImageBackground
      source={require('@/assets/home3.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Your Progress This Week</Text>
        {weeklyMileage && weeklyMileage.length > 0 ? (
          <View>
            {/* Bar Chart */}
            <BarChart
              data={{
                labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                datasets: [{ data: weeklyMileage }],
              }}
              width={screenWidth - 20}
              height={220}
              yAxisSuffix="mi"
              chartConfig={{
                backgroundColor: '#000',
                backgroundGradientFrom: '#444',
                backgroundGradientTo: '#222',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(173, 216, 230, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                propsForBackgroundLines: {
                  strokeWidth: 1,
                  stroke: 'rgba(255, 255, 255, 0.2)',
                },
              }}
              style={styles.chart}
            />

            {/* Touchable Bars */}
            <View style={styles.touchableOverlay}>
              {weeklyMileage.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.touchable,
                    {
                      width: (screenWidth - 50) / 7,
                      left: ((screenWidth - 80) / 7) * index,
                      height: 220,
                      // borderColor: 'red',
                      // borderWidth: 1,
                      marginLeft: 25
                    },
                  ]}
                  onPress={() => handleBarPress(index)}
                />
              ))}
            </View>
          </View>
        ) : (
          <Text style={styles.errorMessage}>Loading mileage data...</Text>
        )}
        <Text style={styles.remaining}>
          You've run{' '}
          {weeklyMileage?.reduce(
            (accumulator, currentValue) => accumulator + currentValue,
            0
          ).toFixed(2)}{' '}
          miles so far!
        </Text>
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
  title: {
    fontSize: 30,
    color: 'lightblue',
    marginBottom: 15,
    marginTop: 15,
    fontWeight: 'bold',
    fontFamily: 'Sydney-Bold',
  },
  remaining: {
    fontSize: 20,
    color: '#fff',
    marginTop: 10,
    marginBottom: 30,
    fontFamily: 'Sydney-Bold',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  touchableOverlay: {
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
    marginLeft: 40,
  },
  touchable: {
    position: 'absolute',
    height: '100%',
  },
  errorMessage: {
    fontSize: 16,
    color: 'white',
    marginTop: 20,
    fontFamily: 'Sydney-Bold',
  },
});