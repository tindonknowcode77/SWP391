import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllDoctors, AllARVProtocol, AddTreatmentPlan, bacsilaydanhsachbenhnhan, loginInfor } from "../api/auth";
import '../styles/TreatmentPlanAdd.css';

const TreatmentPlanAdd = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const patientIdFromUrl = query.get('patientId');
  const doctorIdFromUrl = query.get('doctorId');

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [arvProtocols, setArvProtocols] = useState([]);
  const [form, setForm] = useState({
    PatientID: '',
    DoctorID: '',
    ARVProtocol: '',
    TreatmentLine: '',
    Diagnosis: '',
    TreatmentResult: ''
  });
  const [loading, setLoading] = useState(false);
  const [patientInfo, setPatientInfo] = useState(null);
  const [selectedARVObj, setSelectedARVObj] = useState(null);
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [isDoctor, setIsDoctor] = useState(false);

  // Lấy thông tin user đang đăng nhập
  useEffect(() => {
    loginInfor().then(res => {
      const user = res?.data || res;
      if (user && user.RoleId === 'R003') { // bác sĩ
        setIsDoctor(true);
        setCurrentDoctor(user);
        setForm(f => ({ ...f, DoctorID: user.UserId }));
      }
    }).catch(() => {
      setIsDoctor(false);
      setCurrentDoctor(null);
    });
  }, []);

  // Lấy danh sách bệnh nhân, bác sĩ, phác đồ ARV
  useEffect(() => {
    bacsilaydanhsachbenhnhan().then(res => {
      setPatients(res?.data || res);
    }).catch(() => setPatients([]));
    getAllDoctors().then(res => {
      setDoctors(res?.data || res);
    }).catch(() => setDoctors([]));
    AllARVProtocol().then(res => {
      setArvProtocols(res?.data || res);
    }).catch(() => setArvProtocols([]));
  }, []);

  // Nếu có patientId/doctorId trên URL thì set vào form
  useEffect(() => {
    if (patientIdFromUrl || doctorIdFromUrl) {
      setForm(f => ({
        ...f,
        PatientID: patientIdFromUrl || f.PatientID,
        DoctorID: doctorIdFromUrl || f.DoctorID
      }));
    }
  }, [patientIdFromUrl, doctorIdFromUrl]);

  // Khi chọn bệnh nhân thì lấy thông tin chi tiết
  useEffect(() => {
    if (form.PatientID) {
      const found = patients.find(
        p => String(p.PatientID || p.id) === String(form.PatientID)
      );
      setPatientInfo(found || null);
    } else {
      setPatientInfo(null);
    }
  }, [form.PatientID, patients]);

  // Khi chọn ARV thì lấy chi tiết ARV
  useEffect(() => {
    if (form.ARVProtocol) {
      const found = arvProtocols.find(arv => String(arv.ARVID) === String(form.ARVProtocol));
      setSelectedARVObj(found || null);
    } else {
      setSelectedARVObj(null);
    }
  }, [form.ARVProtocol, arvProtocols]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await AddTreatmentPlan({
        ...form,
        DoctorID: isDoctor && currentDoctor ? currentDoctor.UserId : form.DoctorID
      });
      alert('Thêm mới hồ sơ điều trị thành công!');
      setForm({
        PatientID: '',
        DoctorID: isDoctor && currentDoctor ? currentDoctor.UserId : form.DoctorID,
        ARVProtocol: '',
        TreatmentLine: '',
        Diagnosis: '',
        TreatmentResult: ''
      });
      setPatientInfo(null);
      setSelectedARVObj(null);
    } catch (error) {
      alert('Có lỗi xảy ra khi thêm mới!');
    }
    setLoading(false);
  };

  return (
    <div className="tp-add-container">
      <form className="tp-add-form" onSubmit={handleSubmit}>
        <button
          type="button"
          onClick={() => navigate('/doctor')}
          style={{
            marginBottom: 18,
            background: '#e3f0fc',
            color: '#1976d2',
            border: 'none',
            borderRadius: 7,
            padding: '8px 18px',
            fontWeight: 'bold',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
            boxShadow: '0 1px 4px #1976d220'
          }}
        >
          <span style={{fontSize:'1.2em'}}>&larr;</span> Quay lại trang bác sĩ
        </button>
        <div className="tp-add-row">
          <label>Chọn bệnh nhân</label>
          <select
            value={form.PatientID}
            onChange={e => setForm({ ...form, PatientID: e.target.value })}
            required
            disabled={!!form.PatientID}
          >
            <option value="">Chọn bệnh nhân</option>
            {Array.isArray(patients) && patients.map((p, idx) => (
              <option key={p.PatientID || p.id || idx} value={p.PatientID || p.id}>
                {p.PatientFullname || p.fullName}
              </option>
            ))}
          </select>
          {form.PatientID && (
            <button
              type="button"
              style={{ marginLeft: 10, padding: '4px 10px', borderRadius: 4, background: '#eee', color: '#1976d2', border: 'none', cursor: 'pointer' }}
              onClick={() => {
                setForm({ ...form, PatientID: '' });
                setPatientInfo(null);
              }}
            >
              Chọn lại bệnh nhân
            </button>
          )}
        </div>
        <div className="tp-add-row">
          <label>Bác sĩ phụ trách</label>
          {isDoctor && currentDoctor ? (
            <input
              type="text"
              value={currentDoctor.Fullname}
              disabled
              style={{ background: '#f7fafd', fontWeight: 'bold' }}
            />
          ) : (
            <select
              value={form.DoctorID}
              onChange={e => setForm({ ...form, DoctorID: e.target.value })}
              required
            >
              <option value="">Chọn bác sĩ</option>
              {Array.isArray(doctors) && doctors.map((d, idx) => (
                <option key={d.id || idx} value={d.id}>{d.fullName}</option>
              ))}
            </select>
          )}
        </div>
        <div className="tp-add-row">
          <label>Chọn phác đồ ARV</label>
          <select
            value={form.ARVProtocol}
            onChange={e => setForm({ ...form, ARVProtocol: e.target.value })}
            required
          >
            <option value="">Chọn phác đồ ARV</option>
            {Array.isArray(arvProtocols) && arvProtocols.map((a, idx) => (
              <option key={a.ARVID || idx} value={a.ARVID}>{a.ARVName} ({a.ARVCode})</option>
            ))}
          </select>
          {selectedARVObj && (
            <div className="tpd-arv-detail" style={{background:'#f7fafd',borderRadius:8,padding:'10px 12px',marginTop:6}}>
              <p><strong>Mã phác đồ:</strong> {selectedARVObj.ARVID}</p>
              <p><strong>Tên phác đồ:</strong> {selectedARVObj.ARVName}</p>
              <p><strong>Mã code:</strong> {selectedARVObj.ARVCode}</p>
              <p><strong>Mô tả:</strong> {selectedARVObj.Description}</p>
              <p><strong>Độ tuổi:</strong> {selectedARVObj.AgeRange}</p>
              <p><strong>Nhóm:</strong> {selectedARVObj.ForGroup}</p>
            </div>
          )}
        </div>
        <div className="tp-add-row">
          <label>Dòng điều trị</label>
          <input
            type="number"
            min="1"
            max="3"
            value={form.TreatmentLine}
            onChange={e => setForm({ ...form, TreatmentLine: e.target.value })}
            placeholder="1, 2, 3"
            required
          />
        </div>
        <div className="tp-add-row">
          <label>Chẩn đoán</label>
          <input
            type="text"
            value={form.Diagnosis}
            onChange={e => setForm({ ...form, Diagnosis: e.target.value })}
            placeholder="Chẩn đoán"
            required
          />
        </div>
        <div className="tp-add-row">
          <label>Kết quả điều trị</label>
          <input
            type="text"
            value={form.TreatmentResult}
            onChange={e => setForm({ ...form, TreatmentResult: e.target.value })}
            placeholder="Kết quả điều trị"
            required
          />
        </div>
        <button className="tp-add-btn" type="submit" disabled={loading}>
          {loading ? 'Đang thêm...' : 'Thêm mới hồ sơ điều trị'}
        </button>
      </form>
      <div className="tp-patient-info">
        <h3>Thông tin bệnh nhân</h3>
        {patientInfo ? (
          <>
            <p><b>Mã BN:</b> {patientInfo.patientCode || patientInfo.id}</p>
            <p><b>Họ tên:</b> {patientInfo.PatientFullname || patientInfo.fullName}</p>
            <p><b>Ngày sinh:</b> {patientInfo.dateOfBirth}</p>
            <p><b>Giới tính:</b> {patientInfo.gender}</p>
            <p><b>SĐT:</b> {patientInfo.phoneNumber}</p>
            <p><b>Nhóm máu:</b> {patientInfo.bloodGroup}</p>
            <p><b>Dị ứng:</b> {patientInfo.allergy || 'Không'}</p>
          </>
        ) : (
          <p>Vui lòng chọn bệnh nhân để xem thông tin.</p>
        )}
        {form.PatientID && patientInfo && (
          <input
            type="text"
            value={patientInfo.PatientFullname || patientInfo.fullName}
            disabled
            style={{
              marginTop: 8,
              background: '#f7fafd',
              fontWeight: 'bold',
              color: '#1976d2',
              border: '1px solid #ccc',
              borderRadius: 4,
              padding: '6px 10px'
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TreatmentPlanAdd;
