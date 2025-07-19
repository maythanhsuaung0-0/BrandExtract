// src/api/brands.ts
import axios from "axios";

const API_URL = "http://localhost:8000/api/brands";

// --- TypeScript Models matching backend Pydantic models ---
export interface Brand {
  id: string;
  user_id: string;
  name: string;
  colors?: string[];
  fonts?: string[];
  logo_url?: string;
}

export interface BrandCreate {
  name: string;
  colors?: string[];
  fonts?: string[];
  logo_url?: string;
}

export interface BrandUpdate {
  name?: string;
  colors?: string[];
  fonts?: string[];
  logo_url?: string;
}

// --- API functions ---
// All requests require a valid JWT token from auth API

// Get all brands for current user
export async function fetchBrands(token: string): Promise<Brand[]> {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

// Get a single brand by ID
export async function fetchBrand(id: string, token: string): Promise<Brand> {
  const res = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

// Create a brand
export async function createBrand(data: BrandCreate, token: string): Promise<Brand> {
  const res = await axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

// Update a brand by ID
export async function updateBrand(id: string, data: BrandUpdate, token: string): Promise<Brand> {
  const res = await axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

// Delete a brand by ID
export async function deleteBrand(id: string, token: string): Promise<void> {
  await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}
