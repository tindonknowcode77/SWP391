# Ứng dụng Quản lý Điều trị HIV

Ứng dụng web quản lý điều trị HIV giúp bệnh nhân HIV/AIDS theo dõi và quản lý việc điều trị của mình một cách hiệu quả. 

## Tính năng chính

- **Quản lý tài khoản và xác thực**: Đăng nhập, đăng ký, quên mật khẩu
- **Hồ sơ người dùng**: Thông tin cá nhân, hồ sơ bệnh án, thiết lập cá nhân
- **Kế hoạch điều trị**: Xem kế hoạch, theo dõi xét nghiệm, quản lý thuốc
- **Quản lý thuốc**: Lịch uống thuốc, nhắc nhở, ghi nhận tuân thủ điều trị
- **Đặt lịch hẹn**: Đặt và quản lý lịch hẹn khám với bác sĩ
- **Tài nguyên**: Thông tin và tài liệu về HIV/AIDS
- **Thông tin bệnh viện**: Giới thiệu, dịch vụ, đội ngũ y tế

1. Guest
- Truy cập trang chủ và giao diện của web.
- Xem thông tin giới thiệu về bệnh viện và bác sĩ.
- Đọc các blog chia sẻ kinh nghiệm và các tài liệu giáo dục.
- Guest có thể chuyển hướng đến đăng kí và đăng nhập.

2. Customer (Người dùng/Bệnh nhân)
Quyền hạn:
Đăng ký tài khoản.
Đăng nhập, cập nhật thông tin cá nhân.
Đăng ký lịch khám, điều trị HIV, chọn bác sĩ.
Tra cứu kết quả xét nghiệm (ARV, CD4, tải lượng HIV). ===
Xem lịch sử khám bệnh, điều trị, lịch sử đặt hẹn.
Nhận nhắc nhở lịch tái khám, lịch uống thuốc.
Đặt lịch hẹn tư vấn trực tuyến với bác sĩ (có thể ẩn danh).
Đọc tài liệu giáo dục, blog chia sẻ kinh nghiệm.
Gửi câu hỏi, phản hồi cho cơ sở y tế. ===

3. Staff (Nhân viên y tế)
Đăng nhập hệ thống với tài khoản được cấp.
Xem danh sách bệnh nhân, lịch hẹn, lịch khám.
Xem và cập nhật hồ sơ bệnh nhân, kết quả xét nghiệm, lịch sử điều trị.
Tư vấn, trả lời câu hỏi, hỗ trợ bệnh nhân qua hệ thống.  ===
Quản lý lịch làm việc cá nhân.   ====
Viết bài chia sẻ, tài liệu giáo dục (nếu được phân quyền).
Gửi nhắc nhở cho bệnh nhân (nếu cần).

5. Doctor
Đăng nhập hệ thống với tài khoản được cấp.
Xem danh sách bệnh nhân, lịch hẹn, lịch khám.
Lựa chọn, tùy chỉnh phác đồ ARV cho từng bệnh nhân.

6. Manager
Đăng nhập hệ thống với tài khoản được cấp.
- Gián sát kiểm tra lịch làm, năng suất, lịch hẹn của staff.
- Xem thống kê, xem hiệu quả của phác đồ ARV,
- Tạo và xóa tài khoản của staff, doctor.

7. Admin
Quyền hạn:
Quản lý toàn bộ hệ thống, phân quyền tài khoản staff, customer, doctor and manager.
Quản lý thông tin cơ sở y tế, tài liệu giáo dục, blog.
Quản lý danh sách bác sĩ, lịch làm việc, chuyên môn, bằng cấp.
Quản lý hồ sơ bệnh nhân, lịch sử điều trị, kết quả xét nghiệm.
Xem dashboard, báo cáo thống kê toàn hệ thống.
Quản lý, xử lý các phản hồi, khiếu nại từ người dùng.  ===




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

Mọi đóng góp đều được hoan nghênh. 

MIT
