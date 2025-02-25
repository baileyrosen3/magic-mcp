import axios from "axios";

const TWENTY_FIRST_API_KEY = process.env.TWENTY_FIRST_API_KEY || "test";
const TWENTY_FIRST_API_URL =
  process.env.TWENTY_FIRST_API_URL || "https://magic.21st.dev";

if (!TWENTY_FIRST_API_KEY) {
  throw new Error("TWENTY_FIRST_API_KEY environment variable is not set");
}

export const twentyFirstClient = axios.create({
  baseURL: TWENTY_FIRST_API_URL,
  headers: {
    "x-api-key": TWENTY_FIRST_API_KEY,
    "Content-Type": "application/json",
  },
});
