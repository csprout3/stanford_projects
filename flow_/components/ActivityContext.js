import React, { createContext, useState, useContext } from 'react';

const ActivityContext = createContext();

export const ActivityProvider = ({ children }) => {
  const [athleteInfo, setAthleteInfo] = useState(null);
  const [weeklyActivities, setWeeklyActivities] = useState([]);
  const [weeklyMileage, setWeeklyMileage] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState([]);

  return (
    <ActivityContext.Provider
      value={{
        athleteInfo,
        setAthleteInfo,
        weeklyActivities,
        setWeeklyActivities,
        weeklyMileage,
        setWeeklyMileage,
        setSelectedActivity, 
        selectedActivity
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => useContext(ActivityContext);