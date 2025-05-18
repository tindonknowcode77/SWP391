import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import '../styles/ExaminationSchedule.css';

const doctors = [
  { id: 1, name: 'BS. Nguyễn Văn A', schedule: 'Thứ 2, 4, 6 (8:00 - 11:00)', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', specialty: 'Chuyên khoa Nội' },
  { id: 2, name: 'BS. Trần Thị B', schedule: 'Thứ 3, 5, 7 (13:00 - 16:00)', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', specialty: 'Chuyên khoa Nhi' },
  { id: 3, name: 'BS. Lê Văn C', schedule: 'Thứ 2 - Thứ 7 (9:00 - 12:00)', avatar: 'https://randomuser.me/api/portraits/men/65.jpg', specialty: 'Chuyên khoa Truyền nhiễm' },
];

export default function ExaminationSchedule() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    age: '',
    address: '',
    phone: '',
    datetime: '',
    doctorId: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      // Chỉ cho nhập số, tối đa 11 ký tự
      const numericValue = value.replace(/[^0-9]/g, '').slice(0, 11);
      setForm((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setShowForm(false);
    setShowSuccessPopup(true);
    // Lưu vào localStorage ở đây nè
    const newAppointment = {
      name: form.name,
      age: form.age,
      address: form.address,
      phone: form.phone,
      datetime: form.datetime,
      doctorId: form.doctorId,
      createdAt: new Date().toISOString(),
    };
    const stored = localStorage.getItem('appointments');
    const appointments = stored ? JSON.parse(stored) : [];
    appointments.push(newAppointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    // localStorage.clear(); // để xóa localstorage trong lúc demo
  };

  return (
    <>
      <Navbar />
      <div className="examination-schedule-container">
        <h1>Lịch khám của các bác sĩ</h1>
        <div className="doctor-list">
          {doctors.map((doc) => (
            <div className="doctor-card improved" key={doc.id}>
              <img className="doctor-avatar" src={doc.avatar} alt={doc.name} />
              <div className="doctor-info">
                <div className="doctor-name">{doc.name}</div>
                <div className="doctor-specialty">{doc.specialty}</div>
                <div className="doctor-schedule"><i className="fas fa-calendar-alt"></i> {doc.schedule}</div>
              </div>
            </div>
          ))}
        </div>
        <button className="book-btn" onClick={() => setShowForm(true)}>
          Đặt lịch khám
        </button>
        {showForm && (
          <div className="popup-overlay">
            <div className="popup-form">
              <h2>Đặt lịch khám</h2>
              <form onSubmit={handleSubmit}>
                <label>
                  Họ và tên:
                  <input type="text" name="name" value={form.name} onChange={handleChange} required />
                </label>
                <label>
                  Tuổi:
                  <input type="number" name="age" value={form.age} onChange={handleChange} required min="1" />
                </label>
                <label>
                  Địa chỉ:
                  <input type="text" name="address" value={form.address} onChange={handleChange} required />
                </label>
                <label>
                  Số điện thoại:
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} required maxLength={11} placeholder="VD: 09123456789" />
                </label>
                <label>
                  Ngày giờ đến khám:
                  <input type="datetime-local" name="datetime" value={form.datetime} onChange={handleChange} required />
                </label>
                <label>
                  Chọn bác sĩ:
                  <select name="doctorId" value={form.doctorId} onChange={handleChange} required>
                    <option value="">-- Chọn bác sĩ --</option>
                    {doctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>{doc.name}</option>
                    ))}
                  </select>
                </label>
                <div className="form-actions">
                  <button type="submit">Xác nhận</button>
                  <button type="button" onClick={() => setShowForm(false)}>Hủy</button>
                </div>
              </form>
            </div>
          </div>
        )}
        {showSuccessPopup && (
          <div className="popup-overlay">
            <div className="popup-form success-popup">
              <h2>Đặt lịch thành công!</h2>
              <p>Bạn đã đặt lịch thành công!<br/>Chúng tôi sẽ liên hệ bạn sớm nhất!<br/>Trân trọng cảm ơn!</p>
              <button onClick={() => setShowSuccessPopup(false)} style={{marginTop: '18px'}}>Đóng</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
