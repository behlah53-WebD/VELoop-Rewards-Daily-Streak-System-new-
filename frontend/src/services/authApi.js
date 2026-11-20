import api from './api.js';

export const authApi = {
  login: async ({ email, password }) => {
    return await api.post('/auth/login', { email, password });
  },

  register: async ({ name, email, password }) => {
    return await api.post('/auth/register', { name, email, password });
  },

  getMe: async () => {
    return await api.get('/auth/me');
  },
};

export default authApi;
