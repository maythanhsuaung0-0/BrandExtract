// src/api/brands.ts
import axios from "axios";

const API_URL = "http://localhost:8000/api/brands";

// --- API functions ---
// All requests require a valid JWT token from auth API

// Get all brands for current user
export async function fetchBrands(token) {
  const res = await axios.get(API_URL,{
    headers: { Authorization: `Bearer ${token}` }
  });
  return res;
}

// Get a single brand by ID
export async function fetchBrand(id, token) {
  const res = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res
}

// Create a brand
export async function createBrand(data, token) {
  const res = await axios.post(`${API_URL}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res;
}

// Update a brand by ID
export async function updateBrand(id, data, token) {
  const res = await axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res;
}

// Delete a brand by ID
export async function deleteBrand(id, token) {
  console.log('delete',id)
  let res=  await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res
}
