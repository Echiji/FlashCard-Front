import axios from 'axios';

const instance = axios.create();

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('Token envoyé dans l\'intercepteur :', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
