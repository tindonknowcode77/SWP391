import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, session, dangky } from '../api/auth';
import axiosClient from '../api/http';

// Tạo Context
export const AuthContext = createContext(null);

// Custom hook để sử dụng AuthContext
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Kiểm tra nếu người dùng đã đăng nhập trước đó (từ localStorage)
    const storedUser = localStorage.getItem('hivAppUser');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Error parsing stored user:", err);
        localStorage.removeItem('hivAppUser');
      }
    }
    setLoading(false);
  }, []);

  // Hàm đăng nhập - gọi API thực tế
  const login = async (email, password) => {
    try {
      setError(null);
      if (email && password) {
        const response = await apiLogin({ email, password });
        console.log("API login response:", response);
        
        if (response && response.user) {
          const userData = response.user;
          // Xây dựng đối tượng user từ response API
          const user = {
            id: userData.userId || '',
            name: userData.fullname || email,
            email: userData.email || email,
            role: userData.roleId || "patient",
            accountStatus: "active",
            accountType: userData.roleId === "R001" ? "Quản trị viên" : "Bệnh nhân"
          };
          
          // Lưu thông tin user vào localStorage
          localStorage.setItem('hivAppUser', JSON.stringify(user));
          localStorage.setItem('hivAppShowAccountStatus', 'true');
          setCurrentUser(user);
          return response;
        } else {
          throw new Error("Đăng nhập không thành công");
        }
      } else {
        throw new Error("Thông tin đăng nhập không đúng");
      }
    } catch (err) {
      setError(err.message || "Đăng nhập không thành công");
      return false;
    }
  };

  // Hàm đăng ký - gọi API thực tế
  const register = async (name, email, password) => {
    try {
      setError(null);
      if (name && email && password) {
        const response = await dangky({
          fullname: name,
          email, 
          password,
        });
        
        console.log("API register response:", response);
        if (response && response.user) {
          const userData = response.user;
          // Xây dựng đối tượng user từ response API
          const newUser = {
            id: userData.userId || '',
            name: userData.fullname || name,
            email: userData.email || email,
            role: userData.roleId || "patient",
            accountStatus: "active",
            accountType: "Bệnh nhân"
          };
          
          // Lưu thông tin user vào localStorage
          localStorage.setItem('hivAppUser', JSON.stringify(newUser));
          setCurrentUser(newUser);
          return true;
        } else {
          throw new Error("Đăng ký không thành công");
        }
      } else {
        throw new Error("Vui lòng điền đầy đủ thông tin");
      }
    } catch (err) {
      setError(err.message || "Đăng ký không thành công");
      return false;
    }
  };
  
  // Hàm đăng xuất - gọi API thực tế
  const logout = async () => {
    try {
      // Gọi API đăng xuất nếu server có endpoint này
      await axiosClient.post('/Login/logout', {}, { withCredentials: true });
    } catch (err) {
      console.error("Lỗi khi đăng xuất:", err);
    } finally {
      // Dù có lỗi hay không vẫn xóa thông tin người dùng khỏi localStorage và state
      localStorage.removeItem('hivAppUser');
      localStorage.removeItem('hivAppShowAccountStatus');
      setCurrentUser(null);
    }
  };

  // Hàm quên mật khẩu - gọi API thực tế
  const resetPassword = async (email) => {
    try {
      setError(null);
      if (email) {
        // Gọi API đặt lại mật khẩu
        const response = await axiosClient.post('/Login/forgot-password', { email });
        if (response) {
          return true;
        } else {
          throw new Error("Không thể đặt lại mật khẩu");
        }
      } else {
        throw new Error("Vui lòng nhập địa chỉ email");
      }
    } catch (err) {
      setError(err.message || "Không thể đặt lại mật khẩu");
      return false;
    }
  };

  // Hàm cập nhật thông tin profile - gọi API thực tế
  const updateProfile = async (userData) => {
    try {
      setError(null);
      if (currentUser && userData) {
        // Gọi API cập nhật thông tin người dùng
        const response = await axiosClient.put(`/User/update/${currentUser.id}`, userData);
        
        if (response) {
          // Cập nhật thông tin người dùng trong local state và localStorage
          const updatedUser = { ...currentUser, ...userData };
          localStorage.setItem('hivAppUser', JSON.stringify(updatedUser));
          setCurrentUser(updatedUser);
          return true;
        } else {
          throw new Error("Không thể cập nhật thông tin");
        }
      } else {
        throw new Error("Không thể cập nhật thông tin");
      }
    } catch (err) {
      setError(err.message || "Không thể cập nhật thông tin");
      return false;
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
    setCurrentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;