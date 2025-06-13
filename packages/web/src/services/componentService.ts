import axios from "axios";
import { Component } from "../types/component";

const API_URL = "http://localhost:3001/api";

export const fetchComponents = async (): Promise<Component[]> => {
  try {
    const response = await axios.get(`${API_URL}/fetch-ui`);
    return response.data;
  } catch (error) {
    console.error("Error fetching components:", error);
    throw error;
  }
};
