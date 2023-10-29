import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Deslogar usuário automaticamente em caso de erro 401
      sessionStorage.removeItem('token');

      // Redirecionar para a página inicial
      window.location.replace('/');
    }

    return Promise.reject(error);
  }
);

export default api;
