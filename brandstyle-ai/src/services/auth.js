// src/api/auth.ts
import axios from "axios";

const API_URL = "http://localhost:8000/api/auth";

// Login expects form-encoded, with username (not email) & password
export async function login({ email, password }) {
  const params = new URLSearchParams();
  params.append("username", email);  // FastAPI expects `username` not `email`
  params.append("password", password);

    console.log('data',params)
  const res = await axios.post(`${API_URL}/login`, params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  });
  return res.data; // includes tokens & user object
}

// Register expects a JSON body { email, password }
export async function register({ email, password }) {
  const res = await axios.post(`${API_URL}/register`, { email, password });
  return res.data; // includes message, user_id, email
}

/**
 * IMPORTANT FOR FRONTEND TEAM:
 * 
 * When a user logs in, the response will include:
 *    { "access_token": "...", "token_type": "bearer", ... }
 * 
 * After login, STORE the access_token (e.g., in localStorage, sessionStorage, or React Context)
 * and attach it as a Bearer token header in all authenticated API requests, like brands, users, etc.
 * 
 *    Example (saving after login):
 *      localStorage.setItem("token", res.data.access_token);
 * 
 *    Example (retrieving for API calls):
 *      const token = localStorage.getItem("token");
 *      fetchBrands(token); // pass the token to API functions
 * 
 * If using context, just ensure every authenticated API call receives the JWT access_token.
 */
