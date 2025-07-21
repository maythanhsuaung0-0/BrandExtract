import axios from "axios";

const API_URL = "http://localhost:8000/api/extract";

// --- API functions ---
// All requests require a valid JWT token from auth API

// Get all extracted brands for current user
export async function fetchExtractedData(token) {
  const res = await axios.get(API_URL,{
    headers: { Authorization: `Bearer ${token}` }
  });
  return res;
}


// extract a brand
export async function extractBrand(data,token) {
  const res = await axios.post(`${API_URL}/dna`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res;
}


