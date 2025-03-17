import axios from "axios";

const API_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getActivities = async () => {
  try {
    const response = await api.get(`/activities/`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch activities:", error);
    throw error;
  }
};

export const getActivity = async (id) => {
  try {
    const response = await api.get(`/activities/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch activity:", error);
    throw error;
  }
};

export const getActivityStats = async () => {
  try {
    const response = await api.get("/stats/");
    return response.data;
  } catch (error) {
    console.error("Error fetching activity stats:", error);
    throw error;
  }
};

export const getSleep = async () => {
  try {
    const response = await api.get("/sleep/");
    return response.data;
  } catch (error) {
    console.error("Error fetching sleep data:", error);
    throw error;
  }
};

export const getSleepByDay = async (day) => {
  try {
    const response = await api.get(`/sleep/${day}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching sleep data:", error);
    throw error;
  }
};

export const getSleepStats = async () => {
  try {
    const response = await api.get("/sleep/stats/");
    return response.data;
  } catch (error) {
    console.error("Error fetching sleep stats:", error);
    throw error;
  }
};

export const getLatestSleep = async () => {
  try {
    const response = await api.get("/sleep/");
    if (response.data && response.data.length > 0) {
      return response.data[0];
    }
    throw new Error("No sleep data found");
  } catch (error) {
    console.error("Failed to fetch latest sleep data:", error);
    throw error;
  }
};
