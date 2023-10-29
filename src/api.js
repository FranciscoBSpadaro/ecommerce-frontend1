import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Recupera o token de onde estiver armazenado

  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Define o token no header da requisição
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Lidar com erro de não autorizado (por exemplo, redirecionar para a página de login)
    } else {
      return Promise.reject(error);
    }
  }
);

export default api;
