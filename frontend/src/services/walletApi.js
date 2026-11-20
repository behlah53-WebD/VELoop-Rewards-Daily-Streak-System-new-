import api from './api.js';

export const walletApi = {
  getWallet: async () => {
    return await api.get('/wallet');
  },
};

export default walletApi;
