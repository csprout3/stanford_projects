import { useState, useEffect } from "react";
import axios from "axios";
import { GARMIN_API_URL } from "../api/apiOptions";

export default function useWeeklyData(accessToken) {
  const [weeklyData, setWeeklyData] = useState(Array(7).fill(0)); // Sun-Sat mileage
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeeklyMileage() {
      try {
        const response = await axios.get(GARMIN_API_URL, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        // Process activities to calculate weekly mileage
        const today = new Date();
        const startOfWeek = today.getDate() - today.getDay(); // Sunday
        const weekData = Array(7).fill(0);

        response.data.forEach((activity) => {
          const activityDate = new Date(activity.startTimeLocal);
          if (
            activityDate >= new Date(today.setDate(startOfWeek)) &&
            activityDate <= new Date(today.setDate(startOfWeek + 6)) &&
            activity.activityType.typeKey === "running"
          ) {
            const dayIndex = activityDate.getDay(); // Sunday = 0
            weekData[dayIndex] += activity.distance / 1000; // Convert meters to km
          }
        });

        setWeeklyData(weekData);
      } catch (error) {
        console.error("Error fetching Garmin data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchWeeklyMileage();
  }, [accessToken]);

  return { weeklyData, loading };
}