// ownerApi.js — All owner-specific API calls
// Used by: MyProperties, VisitRequests, OwnerDashboard

import api from './api';

// ── VISIT MANAGEMENT ──────────────────────────────────────────

export const getOwnerVisits = async () => {
  const response = await api.get('/api/owner/visits');
  return response.data;
};

export const confirmVisit = async (visitId) => {
  const response = await api.put(`/api/owner/visits/${visitId}/confirm`);
  return response.data;
};

export const cancelVisitAsOwner = async (visitId, note) => {
  const response = await api.put(`/api/owner/visits/${visitId}/cancel`, { ownerNote: note });
  return response.data;
};

// ── APPLICATION MANAGEMENT ────────────────────────────────────

export const getOwnerApplications = async () => {
  const response = await api.get('/api/owner/applications');
  return response.data;
};

export const approveApplication = async (applicationId) => {
  const response = await api.put(`/api/owner/applications/${applicationId}/approve`);
  return response.data;
};

export const rejectApplication = async (applicationId, response_msg) => {
  const response = await api.put(`/api/owner/applications/${applicationId}/reject`, { ownerResponse: response_msg });
  return response.data;
};
