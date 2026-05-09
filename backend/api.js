// src/api.js
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function fetchData() {
  const response = await fetch(`${BACKEND_URL}/api/data`);
  return response.json();
}