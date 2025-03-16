import authService from '../../data/services/authService';

export class AuthFacade {
  async login(email, password) {
    try {
      const response = await authService.login(email, password);
      
      if (!response.status) {
        throw new Error(response.message || 'Đăng nhập thất bại');
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }
  
  async register(registerData) {
    try {
      // Validation logic có thể được thêm vào đây nếu cần
      const response = await authService.register(registerData);
      
      if (!response.status) {
        throw new Error(response.message || 'Đăng ký thất bại');
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }
}

// Export singleton instance
export default new AuthFacade();