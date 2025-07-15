import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Manager.css';

const Manager = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState('appointments');
  // Placeholder states for manager data
  const [appointments] = useState([
    { id: 'A001', name: 'Nguyen Van A', type: 'Khám tổng quát', time: '2024-06-01 09:00', phone: '0123456789', status: 'Đã xác nhận' },
    { id: 'A002', name: 'Tran Thi B', type: 'Xét nghiệm', time: '2024-06-02 10:00', phone: '0987654321', status: 'Đang chờ' },
  ]);
  const [patients] = useState([
    { id: 'P001', name: 'Nguyen Van A', gender: 'Nam', dob: '1990-01-01', phone: '0123456789', note: 'Không dị ứng', blood: 'O', allergy: 'Không' },
    { id: 'P002', name: 'Tran Thi B', gender: 'Nữ', dob: '1985-05-12', phone: '0987654321', note: 'Dị ứng penicillin', blood: 'A', allergy: 'Penicillin' },
  ]);


  return (
    <div className="manager-container">
      <aside className="manager-sidebar">
        <div className="manager-sidebar-user-row">
          <span className="manager-sidebar-user">Quản lý</span>
          <button className="manager-sidebar-logout-btn" title="Đăng xuất" aria-label="Đăng xuất">
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
        <ul className="manager-sidebar-menu">
          <li className={selected === 'appointments' ? 'active' : ''} onClick={() => setSelected('appointments')}>Lịch hẹn</li>
          <li className={selected === 'patients' ? 'active' : ''} onClick={() => setSelected('patients')}>Bệnh nhân</li>
        </ul>
      </aside>
      <main className="manager-main">
        {selected === 'appointments' && (
          <div className="manager-content">
            <h2 className="manager-table-title">Lịch hẹn</h2>
            <div className="manager-appointments-table-wrapper">
              <table className="manager-appointments-table">
                <thead>
                  <tr>
                    <th>Mã đặt lịch</th>
                    <th>Tên bệnh nhân</th>
                    <th>Loại dịch vụ</th>
                    <th>Thời gian</th>
                    <th>Số điện thoại</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((item, idx) => (
                    <tr key={item.id || idx} className="manager-appointment-row">
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.type}</td>
                      <td>{item.time}</td>
                      <td>{item.phone}</td>
                      <td className={`manager-status-badge manager-status-${item.status.replace(/\s/g, '').toLowerCase()}`}>{item.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {selected === 'patients' && (
          <div className="manager-content">
            <h2 className="manager-table-title">Bệnh nhân</h2>
            <div className="manager-patient-list">
              {patients.map((p) => (
                <div className="manager-patient-card" key={p.id}>
                  <div className="manager-patient-info">
                    <div className="manager-patient-avatar"><i className="fas fa-user-injured"></i></div>
                    <div className="manager-patient-details">
                      <div className="manager-patient-row"><span className="manager-patient-label">Tên:</span> {p.name}</div>
                      <div className="manager-patient-row"><span className="manager-patient-label">Giới tính:</span> {p.gender}</div>
                      <div className="manager-patient-row"><span className="manager-patient-label">Ngày sinh:</span> {p.dob}</div>
                      <div className="manager-patient-row"><span className="manager-patient-label">SĐT:</span> {p.phone}</div>
                      <div className="manager-patient-row"><span className="manager-patient-label">Nhóm máu:</span> {p.blood}</div>
                      <div className="manager-patient-row"><span className="manager-patient-label">Ghi chú:</span> {p.note}</div>
                      <div className="manager-patient-row"><span className="manager-patient-label">Dị ứng:</span> {p.allergy}</div>
                      <button className="manager-action-btn" style={{marginTop: 8}}>Xem chi tiết</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Manager;
