import api from './api.js';

export const streakApi = {
  getDailyStreak: async () => {
    return await api.get('/daily-streak');
  },

  getStatus: async () => {
    return await api.get('/daily-streak/status');
  },

  initiateClaim: async (day = null) => {
    const payload = day !== null && day !== undefined ? { day } : {};
    return await api.post('/daily-streak/claim', payload);
  },

  confirmClaim: async (claimId, idempotencyKey = null) => {
    const headers = {};
    if (idempotencyKey) {
      headers['Idempotency-Key'] = idempotencyKey;
    }
    return await api.post('/daily-streak/claim/confirm', { claimId }, { headers });
  },

  acknowledgeResetNotice: async () => {
    return await api.post('/daily-streak/reset-notice/ack');
  },

  getHistory: async (page = 1, limit = 20) => {
    return await api.get(`/daily-streak/history?page=${page}&limit=${limit}`);
  },
};

export default streakApi;
