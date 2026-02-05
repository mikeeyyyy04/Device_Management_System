import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const deviceAPI = {
  getAllDevices: async () => {
    const response = await api.get('/devices/');
    return response.data;
  },

  addDevice: async (deviceData) => {
    const response = await api.post('/devices/', deviceData);
    return response.data;
  },

  getDevice: async (id) => {
    const response = await api.get(`/devices/${id}`);
    return response.data;
  },

  deleteDevice: async (id) => {
    const response = await api.delete(`/devices/${id}`);
    return response.data;
  },
};

export default api;
