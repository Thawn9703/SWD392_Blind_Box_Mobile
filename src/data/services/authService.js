import axios from 'axios';

//const API_BASE_URL = 'http://localhost:8080'; // Thay thế bằng URL API thực của bạn
const API_BASE_URL = 'http://10.0.2.2:8080'; // Thay thế bằng URL API thực của bạn

const authService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/users/login`, {
        email,
        password
      });
      
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Đăng nhập thất bại');
    }
  },
  
  register: async (registerData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/users/signup`, registerData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Đăng ký thất bại');
    }
  },
  
  setupAuthInterceptor: (token) => {
    axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }
};

export default authService;