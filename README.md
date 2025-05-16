# Ứng dụng Quản lý Điều trị HIV - Bệnh viện Bạch Mai

Ứng dụng web quản lý điều trị HIV giúp bệnh nhân HIV/AIDS theo dõi và quản lý việc điều trị của mình một cách hiệu quả. Ứng dụng được phát triển dựa trên mô hình trang web của Bệnh viện Bạch Mai.

## Tính năng chính

- **Quản lý tài khoản và xác thực**: Đăng nhập, đăng ký, quên mật khẩu
- **Hồ sơ người dùng**: Thông tin cá nhân, hồ sơ bệnh án, thiết lập cá nhân
- **Kế hoạch điều trị**: Xem kế hoạch, theo dõi xét nghiệm, quản lý thuốc
- **Quản lý thuốc**: Lịch uống thuốc, nhắc nhở, ghi nhận tuân thủ điều trị
- **Đặt lịch hẹn**: Đặt và quản lý lịch hẹn khám với bác sĩ
- **Tài nguyên**: Thông tin và tài liệu về HIV/AIDS
- **Thông tin bệnh viện**: Giới thiệu, dịch vụ, đội ngũ y tế

## Công nghệ sử dụng

- React
- React Router
- Context API
- Vite
- CSS Modules
- Chart.js (để trực quan hóa dữ liệu sức khỏe)
- Axios (mô phỏng API)

## Cài đặt và chạy dự án

1. Clone repository:
   ```
   git clone <repository-url>
   ```

2. Di chuyển vào thư mục dự án:
   ```
   cd hiv-treatment-app
   ```

3. Cài đặt các phụ thuộc:
   ```
   npm install
   ```

4. Chạy ứng dụng ở môi trường phát triển:
   ```
   npm run dev
   ```

## Cấu trúc dự án

- `/src`: Mã nguồn của ứng dụng
  - `/assets`: Chứa hình ảnh, font và các tài nguyên khác
  - `/components`: Các component có thể tái sử dụng
  - `/context`: Context API cho quản lý trạng thái toàn cục
  - `/hooks`: Custom hooks
  - `/pages`: Các trang của ứng dụng
  - `/services`: Các dịch vụ API
  - `/styles`: CSS modules
  - `/utils`: Các hàm tiện ích

## Đóng góp

Mọi đóng góp đều được hoan nghênh. Vui lòng mở issue hoặc pull request để cải thiện dự án.

## Giấy phép

MIT
