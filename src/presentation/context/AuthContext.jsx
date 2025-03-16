import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../../data/services/authService';

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
      
      const response = await authService.login(email, password);
      
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

  const logout = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');
    } catch (error) {
      console.error('Đăng xuất thất bại', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);