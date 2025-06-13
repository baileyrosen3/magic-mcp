import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export interface Component {
  id: string;
  name: string;
  description: string;
  framework: "react";
  library: string;
  tags: string[];
  code: string;
  createdAt: string;
  updatedAt: string;
}

interface FetchComponentsResponse {
  data: Component[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const fetchComponents = async (
  params: Record<string, any>
): Promise<FetchComponentsResponse> => {
  const url = apiClient.getUri({ url: "/search", params });
  console.log("Requesting URL:", url);
  const { data } = await apiClient.get("/search", { params });
  return data;
};
