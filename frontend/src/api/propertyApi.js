// propertyApi.js — All property-related API calls
// Frontend calls these functions → they call Spring Boot → which queries MySQL

import api from './api';

// ── PUBLIC ENDPOINTS ──────────────────────────────────────────

/**
 * Search properties with filters
 * Used by: SearchPage.jsx
 * 
 * Example: searchProperties({ city: 'Mumbai', bhk: 2, minRent: 10000, maxRent: 50000 })
 */
export const searchProperties = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.city)      params.append('city', filters.city);
  if (filters.bhk)       params.append('bhk', filters.bhk);
  if (filters.minRent)   params.append('minRent', filters.minRent);
  if (filters.maxRent)   params.append('maxRent', filters.maxRent);
  if (filters.type)      params.append('type', filters.type);
  if (filters.furnished) params.append('furnished', filters.furnished);

  const response = await api.get(`/api/properties/search?${params.toString()}`);
  return response.data;
};

/**
 * Get all active properties (no filters)
 * Used by: LandingPage featured section
 */
export const getAllProperties = async () => {
  const response = await api.get('/api/properties');
  return response.data;
};

/**
 * Get single property by ID
 * Used by: PropertyDetail.jsx
 */
export const getPropertyById = async (id) => {
  const response = await api.get(`/api/properties/${id}`);
  return response.data;
};

// ── OWNER ENDPOINTS (require login as OWNER) ─────────────────

/**
 * Create a new property listing
 * Used by: AddProperty.jsx (9-step form submit)
 */
export const createProperty = async (propertyData) => {
  const response = await api.post('/api/owner/properties', propertyData);
  return response.data;
};

/**
 * Get all properties owned by the logged-in owner
 * Used by: OwnerDashboard, MyProperties page
 */
export const getOwnerProperties = async () => {
  const response = await api.get('/api/owner/properties');
  return response.data;
};

/**
 * Update an existing property
 * Used by: EditProperty.jsx
 */
export const updateProperty = async (id, propertyData) => {
  const response = await api.put(`/api/owner/properties/${id}`, propertyData);
  return response.data;
};

/**
 * Delete (soft) a property
 * Used by: MyProperties page delete button
 */
export const deleteProperty = async (id) => {
  const response = await api.delete(`/api/owner/properties/${id}`);
  return response.data;
};
