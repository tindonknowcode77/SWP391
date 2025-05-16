import React, { createContext, useState, useEffect, useContext } from 'react';

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

  // Hàm đăng nhập - trong thực tế sẽ gọi API
  const login = async (email, password) => {
    try {
      setError(null);
      // Mô phỏng gọi API
      // Trong dự án thực tế, thay bằng gọi API đến server
      if (email && password) {
        // Giả lập user
        const user = {
          id: "user123",
          name: "Nguyễn Văn A",
          email: email,
          role: "patient"
        };
        
        // Lưu thông tin user vào localStorage
        localStorage.setItem('hivAppUser', JSON.stringify(user));
        setCurrentUser(user);
        return true;
      } else {
        throw new Error("Thông tin đăng nhập không đúng");
      }
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Hàm đăng ký - trong thực tế sẽ gọi API
  const register = async (name, email, password) => {
    try {
      setError(null);
      // Mô phỏng gọi API
      if (name && email && password) {
        // Giả lập user mới
        const newUser = {
          id: "user" + Math.floor(Math.random() * 1000),
          name: name,
          email: email,
          role: "patient"
        };
        
        // Lưu thông tin user vào localStorage
        localStorage.setItem('hivAppUser', JSON.stringify(newUser));
        setCurrentUser(newUser);
        return true;
      } else {
        throw new Error("Vui lòng điền đầy đủ thông tin");
      }
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Hàm đăng xuất
  const logout = () => {
    localStorage.removeItem('hivAppUser');
    setCurrentUser(null);
  };

  // Hàm quên mật khẩu
  const resetPassword = async (email) => {
    try {
      setError(null);
      // Mô phỏng gọi API
      if (email) {
        // Mô phỏng gửi email đặt lại mật khẩu
        console.log(`Đã gửi yêu cầu đặt lại mật khẩu đến ${email}`);
        return true;
      } else {
        throw new Error("Vui lòng nhập địa chỉ email");
      }
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Hàm cập nhật thông tin profile
  const updateProfile = async (userData) => {
    try {
      setError(null);
      // Mô phỏng cập nhật thông tin
      if (currentUser && userData) {
        const updatedUser = { ...currentUser, ...userData };
        localStorage.setItem('hivAppUser', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
        return true;
      } else {
        throw new Error("Không thể cập nhật thông tin");
      }
    } catch (err) {
      setError(err.message);
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
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;