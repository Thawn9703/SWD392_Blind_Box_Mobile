import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authFacade from '@domain/facades/authFacade';
import authService from '@data/services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Kiểm tra dữ liệu xác thực đã lưu khi ứng dụng khởi động
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      const token = await AsyncStorage.getItem('token');
      
      if (userJson && token) {
        setUser(JSON.parse(userJson));
        authService.setupAuthInterceptor(token);
      }
    } catch (error) {
      console.error('Không thể tải dữ liệu xác thực', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authFacade.login(email, password);
      
      if (response.status) {
        const userData = response.metadata;
        setUser(userData);
        
        // Lưu dữ liệu xác thực
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        await AsyncStorage.setItem('token', userData.accessToken);
        
        // Thiết lập interceptor cho các yêu cầu tương lai
        authService.setupAuthInterceptor(userData.accessToken);
        
        return true;
      } else {
        throw new Error('Đăng nhập thất bại');
      }
    } catch (error) {
      setError(error.message || 'Đăng nhập thất bại');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (registerData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authFacade.register(registerData);
      
      if (response.status) {
        // Nếu cần đăng nhập ngay sau khi đăng ký
        if (response.metadata?.accessToken) {
          const userData = response.metadata;
          setUser(userData);
          
          // Lưu dữ liệu xác thực
          await AsyncStorage.setItem('user', JSON.stringify(userData));
          await AsyncStorage.setItem('token', userData.accessToken);
          
          // Thiết lập interceptor cho các yêu cầu tương lai
          authService.setupAuthInterceptor(userData.accessToken);
        }
        
        return { success: true, data: response.metadata };
      } else {
        throw new Error(response.message || 'Đăng ký thất bại');
      }
    } catch (error) {
      setError(error.message || 'Đăng ký thất bại');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);