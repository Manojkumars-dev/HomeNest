// messageApi.js — Chat/messaging API calls
// Used by: TenantMessages, OwnerMessages pages

import api from './api';

/**
 * Get all conversations for the current user
 * Returns: [{userId, userName, lastMessage, lastMessageTime, unreadCount}]
 */
export const getConversations = async () => {
  const response = await api.get('/api/messages/conversations');
  return response.data;
};

/**
 * Get all messages between current user and another user
 * Also marks their messages as read
 */
export const getMessages = async (otherUserId) => {
  const response = await api.get(`/api/messages/${otherUserId}`);
  return response.data;
};

/**
 * Send a message to another user
 */
export const sendMessage = async ({ receiverId, content, propertyId }) => {
  const response = await api.post('/api/messages', { receiverId, content, propertyId });
  return response.data;
};
