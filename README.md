# Ứng dụng Quản lý Điều trị HIV

Ứng dụng web quản lý điều trị HIV giúp bệnh nhân HIV/AIDS theo dõi và quản lý việc điều trị của mình một cách hiệu quả. 

## Tính năng chính
https://docs.google.com/document/d/1TG2hssFB6AFW3CmZzN3omwqr5pgyyiq_QIJby_TDml8/edit?usp=sharing 
- **Quản lý tài khoản và xác thực**: Đăng nhập, đăng ký, quên mật khẩu
- **Hồ sơ người dùng**: Thông tin cá nhân, hồ sơ bệnh án, thiết lập cá nhân
- **Kế hoạch điều trị**: Xem kế hoạch, theo dõi xét nghiệm, quản lý cách dùng thuốc theo phác đồ ARV tùy theo nhóm bệnh nhân
- **Quản lý thuốc**: Lịch uống thuốc, nhắc nhở, ghi nhận tuân thủ điều trị
- **Đặt lịch hẹn**: Đặt và quản lý lịch hẹn khám với bác sĩ
- **Tài nguyên**: Thông tin và tài liệu về HIV/AIDS
- **Thông tin bệnh viện**: Giới thiệu, dịch vụ, đội ngũ y tế

| Vai trò  | Quyền và chức năng                                                    |
| -------- | --------------------------------------------------------------------- |
| Guest    | Xem trang chủ, blog, tài liệu giáo dục                                |
| Customer | Đăng ký lịch khám, tra cứu kết quả, đặt hẹn, nhắc lịch, hồ sơ cá nhân |
| Staff    | Quản lý lịch khám, hỗ trợ bác sĩ và bệnh nhân                         |
| Doctor   | Khám bệnh, xem kết quả xét nghiệm, lựa chọn phác đồ ARV, kê đơn, quản lý hồ sơ điều trị bệnh nhân     |
| Manager  | Quản lý Customer, Staff and Doctor, thống kê, báo cáo                 |
| Admin    | Quản lý toàn bộ hệ thống, phân quyền, người dùng, dữ liệu hệ thống    |


1. Guest
- Truy cập trang chủ và giao diện của web.
- Xem thông tin giới thiệu về bệnh viện và bác sĩ.
- Đọc các blog chia sẻ kinh nghiệm và các tài liệu giáo dục.
- Guest muốn đặt lịch khám hoặc nhận tư vấn thì cần đăng kí hoặc đăng nhập(chuyển hướng).

2. Customer (Người dùng/Bệnh nhân)
- Đăng ký tài khoản.
- Đăng nhập, cập nhật thông tin cá nhân.
- Đăng ký lịch khám, điều trị HIV, chọn bác sĩ.
- Tra cứu kết quả xét nghiệm (ARV, CD4, tải lượng HIV). 
- Xem lịch sử khám bệnh, điều trị, lịch sử đặt hẹn.
- Nhận nhắc nhở lịch tái khám, lịch uống thuốc.
- Đặt mua thuốc.
- Đặt lịch hẹn tư vấn trực tuyến với bác sĩ (có thể ẩn danh).
- Đọc tài liệu giáo dục, blog chia sẻ kinh nghiệm.
- Gửi câu hỏi, phản hồi cho cơ sở y tế.

3. Staff (Nhân viên y tế)
- Đăng nhập hệ thống với tài khoản được cấp.
- Xem danh sách bệnh nhân, lịch hẹn, lịch khám.
- Xem và cập nhật hồ sơ bệnh nhân, kết quả xét nghiệm, lịch sử điều trị.
- Tư vấn, trả lời câu hỏi, hỗ trợ bệnh nhân qua hệ thống. 
- Quản lý lịch làm việc cá nhân.
- Viết bài chia sẻ, tài liệu giáo dục (nếu được phân quyền).
- Gửi nhắc nhở cho bệnh nhân (nếu cần).

5. Doctor(Bác sĩ)
- Đăng nhập hệ thống với tài khoản được cấp.
- Xem danh sách bệnh nhân, lịch hẹn, lịch khám.
- Xem và cập nhật hồ sơ bệnh nhân, kết quả xét nghiệm, lịch sử điều trị.
- Tư vấn, trả lời câu hỏi, hỗ trợ bệnh nhân qua hệ thống.
- Lựa chọn, tùy chỉnh phác đồ ARV cho từng bệnh nhân.
- Tham gia lịch tư vấn trực tuyến.

6. Manager(Quản lý)
- Đăng nhập hệ thống với tài khoản được cấp.
- Gián sát kiểm tra lịch làm việc, hiệu suất, lịch hẹn của staff, bác sĩ.
- Quản lý danh sách bác sĩ, nhân viên (lịch làm việc, chuyên môn, bằng cấp).
- Quản lý hồ sơ bệnh nhân, lịch sử điều trị, kết quả xét nghiệm.
- Xem thống kê, xem hiệu quả của phác đồ ARV,
- Quản lý, xử lý các phản hồi, khiếu nại từ người dùng.

7. Admin
- Tạo, xóa và chỉnh sửa tài khoản của manager, staff, doctor, customer (phân quyền).
- Quản lý thông tin cơ sở y tế, tài liệu giáo dục, blog.
- Xem dashboard, báo cáo thống kê toàn hệ thống.


 **Functional Requirements**
1. Trang chủ và Nội dung công khai
- Hiển thị thông tin cơ sở y tế.
- Cung cấp tài liệu giáo dục HIV.
- Blog chia sẻ kinh nghiệm, câu chuyện tích cực.
- Xem thông tin chi tiết bác sĩ.

2. Đăng ký & Đặt lịch khám
- Customer có thể đăng ký tài khoản.
- Customer có thể đặt lịch tư vấn trực tuyến và chỉ định bác sĩ cụ thể(có thể ẩn danh khi đặt lịch).
- Staff có thể xác nhận lịch và điều phối khám.

3. Tra cứu và Theo dõi điều trị
- Người dùng có thể xem lịch sử khám bệnh, xét nghiệm CD4, tải lượng HIV, phác đồ ARV đang sử dụng.
- Hệ thống nhắc nhở người dùng lịch tái khám và lịch uống thuốc.

4. Tư vấn & hỗ trợ
- Người dùng có thể đặt hẹn tư vấn trực tuyến với bác sĩ.
- Hỗ trợ ẩn danh khi đặt hẹn để giảm kỳ thị.

5. Hỗ trợ Bác sĩ
- Bác sĩ có thể xem phác đồ ARV có sẵn và tùy chỉnh theo từng bệnh nhân.
- Bác sĩ cập nhật thông tin điều trị, theo dõi tiến triển.

6. Quản lý hồ sơ & người dùng
- Quản lý hồ sơ người dùng: thông tin cá nhân, lịch sử điều trị, lịch sử tư vấn.
- Quản lý thông tin bác sĩ: tên, bằng cấp, chuyên môn.

7. Dashboard & Báo cáo
- Dashboard hiển thị số liệu tổng hợp: số bệnh nhân, lịch hẹn, phác đồ sử dụng,...
- Hệ thống xuất báo cáo (PDF/Excel): theo ngày, bác sĩ, loại thuốc,...

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
