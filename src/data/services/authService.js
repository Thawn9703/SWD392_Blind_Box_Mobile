import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080'; // Thay thế bằng URL API thực của bạn

const authService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/users/login`, {
        email,
        password
      });
      
      // Lưu token vào bộ nhớ an toàn cho các yêu cầu tiếp theo
      if (response.data.metadata.accessToken) {
        // Lưu token, dữ liệu người dùng, v.v.
        return response.data;
      }
      
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Đăng nhập thất bại');
    }
  },
  
  // Thêm bộ chặn yêu cầu để bao gồm token trong các yêu cầu tương lai
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