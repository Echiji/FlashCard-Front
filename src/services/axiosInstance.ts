import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json'
  }
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('Token envoyé dans l\'intercepteur :', token);
  console.log('URL de la requête :', config.url);
  console.log('Méthode de la requête :', config.method);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Headers configurés :', config.headers);
  } else {
    console.log('Aucun token trouvé dans localStorage');
  }
  return config;
});

instance.interceptors.response.use(
  (response) => {
    console.log('Réponse reçue :', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Erreur de réponse :', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default instance;
