import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Modal,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';

export default function Forecast() {
  const [weeklyGoal, setWeeklyGoal] = useState(0);
  const [forecastedMileage, setForecastedMileage] = useState(Array(7).fill(0));
  const [remainingMileage, setRemainingMileage] = useState(weeklyGoal);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [mileageInput, setMileageInput] = useState('');
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const extendedDayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const screenWidth = Dimensions.get('window').width;

  const distributeRemaining = () => {
    const zeroMileageDays = forecastedMileage.filter((mileage) => mileage === 0).length;
    const perDay = zeroMileageDays > 0 ? remainingMileage / zeroMileageDays : 0;

    const updatedMileage = forecastedMileage.map((mileage) =>
      mileage === 0 ? perDay : mileage
    );

    const loggedMileage = updatedMileage.reduce((a, b) => a + b, 0);
    setForecastedMileage([...updatedMileage]);
    setRemainingMileage(Math.max(0, weeklyGoal - loggedMileage));
  };

  const startOver = () => {
    setWeeklyGoal(0);
    setForecastedMileage(Array(7).fill(0));
    setRemainingMileage(0);
    setIsEditingGoal(false);
  };

  const handleBarPress = (index) => {
    setSelectedDay(index);
    setMileageInput(String(forecastedMileage[index] || ''));
    setModalVisible(true);
  };

  const handleSaveMileage = () => {
    const mileage = parseFloat(mileageInput) || 0;
    const updatedMileage = [...forecastedMileage];
    updatedMileage[selectedDay] = mileage;

    const loggedMileage = updatedMileage.reduce((a, b) => a + b, 0);
    setForecastedMileage(updatedMileage);
    setRemainingMileage(Math.max(0, weeklyGoal - loggedMileage));
    setModalVisible(false);
  };

  return (
    <ImageBackground
      source={require('@/assets/home3.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Weekly Mileage Forecast</Text>

        {/* Weekly Goal Input Toggle */}
        {isEditingGoal ? (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={weeklyGoal === 0 ? '' : String(weeklyGoal)}
              onChangeText={(value) => {
                const goal = parseFloat(value) || 0;
                setWeeklyGoal(goal);
                setRemainingMileage(goal - forecastedMileage.reduce((a, b) => a + b, 0));
              }}
              placeholder="Weekly Mileage Goal"
              placeholderTextColor="grey"
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsEditingGoal(false)}
            >
              <Text style={styles.closeButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.editGoalButton}
            onPress={() => setIsEditingGoal(true)}
          >
            <Text style={styles.editGoalText}>Edit Weekly Goal</Text>
          </TouchableOpacity>
        )}

        {/* Bar Chart */}
        <View>
          <BarChart
            data={{
              labels: dayLabels,
              datasets: [{ data: forecastedMileage }],
            }}
            width={screenWidth - 20}
            height={220}
            fromZero
            yAxisSuffix=" mi"
            chartConfig={{
              backgroundColor: '#000',
              backgroundGradientFrom: '#444',
              backgroundGradientTo: '#222',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(255, 192, 203, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            style={styles.chart}
          />

          {/* Touchable Overlay for Bars */}
          <View style={styles.touchableOverlay}>
            {forecastedMileage.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.touchable,
                  {
                    width: (screenWidth - 80) / 7,
                    left: ((screenWidth - 90) / 7) * index,
                    height: 220,
                    // borderWidth: 1,
                    // borderColor: 'red'
                  },
                ]}
                onPress={() => handleBarPress(index)}
              />
            ))}
          </View>
        </View>

        {/* Remaining Mileage Display */}
        <Text style={styles.remaining}>
          Remaining Mileage: {remainingMileage.toFixed(2)} miles
        </Text>

        {/* Buttons */}
        <TouchableOpacity onPress={distributeRemaining} style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Distribute Remaining Mileage</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={startOver} style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Start Over</Text>
        </TouchableOpacity>

        {/* Modal for Editing Mileage */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>
                Enter Mileage for {extendedDayLabels[selectedDay]}
              </Text>
              <TextInput
                style={styles.modalInput}
                keyboardType="numeric"
                value={mileageInput}
                onChangeText={setMileageInput}
                placeholder="Enter mileage"
                placeholderTextColor="grey"
              />
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveMileage}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    color: 'pink',
    marginBottom: 20,
    fontWeight: 'bold',
    fontFamily: 'Sydney-Bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'pink',
    borderRadius: 5,
    padding: 8,
    width: 200,
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Sydney-Bold',
    fontSize: 16,
  },
  closeButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: 'pink',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#111',
    fontWeight: 'bold',
    fontSize: 16,
  },
  editGoalButton: {
    padding: 10,
    backgroundColor: 'pink',
    borderRadius: 5,
    marginBottom: 10,
  },
  editGoalText: {
    color: '#000',
    fontWeight: '800',
    fontSize: 16,
    // fontFamily: 'Sydney-Bold'
  },
  chart: { marginVertical: 8, borderRadius: 16 },
  touchableOverlay: {
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
    marginLeft: 70,
  },
  touchable: {
    position: 'absolute',
    height: '100%',
  },
  remaining: {
    fontSize: 20,
    color: '#fff',
    marginTop: 10,
    marginBottom: 30,
    fontFamily: 'Sydney-Bold',
  },
  actionButton: {
    backgroundColor: 'pink',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#111',
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#222',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 23,
    color: 'pink',
    fontWeight: 'bold',
    marginBottom: 15,
    fontFamily: 'Sydney-Bold'
  },
  modalInput: {
    width: '100%',
    padding: 10,
    borderColor: 'pink',
    borderWidth: 1,
    borderRadius: 5,
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'Sydney-Bold'
  },
  saveButton: {
    backgroundColor: 'pink',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#111',
    fontWeight: '800',
    fontSize: 16,

  },
  cancelButton: {
    backgroundColor: '#555',
    padding: 10,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 16,
    
  },
});