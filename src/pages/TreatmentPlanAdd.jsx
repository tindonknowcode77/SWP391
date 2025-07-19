import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AllARVProtocol, AddTreatmentPlan, TreatmentPlansByPatient, bacsilaydanhsachbenhnhan } from "../api/auth";
import '../styles/TreatmentPlanAdd.css';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllDoctors} from '../api/auth';

const TreatmentPlanAdd = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

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
  const [matchedPatient, setMatchedPatient] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);



  // Lấy danh sách bác sĩ, phác đồ ARV, danh sách bệnh nhân
  useEffect(() => {
    getAllDoctors().then(res => {
      const doctorsData = res?.data || res;
      console.log('Doctors data:', doctorsData);
      setDoctors(doctorsData);
    }).catch(() => setDoctors([]));
    AllARVProtocol().then(res => {
      setArvProtocols(res?.data || res);
    }).catch(() => setArvProtocols([]));
    bacsilaydanhsachbenhnhan().then(res => {
      setPatients(res?.data || res);
    }).catch(() => setPatients([]));
  }, []);

  // Lấy patientId từ URL và set vào form
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const patientIdFromUrl = query.get('patientId');
    console.log('patientId from URL:', patientIdFromUrl); // Log ra để kiểm tra
    if (patientIdFromUrl) {
      setForm(f => ({ ...f, PatientID: patientIdFromUrl }));
    }
  }, [location.search]);

  // Khi chọn bệnh nhân thì lấy thông tin chi tiết
  useEffect(() => {
    if (form.PatientID) {
      TreatmentPlansByPatient(form.PatientID)
        .then(res => {
          // Giả sử res.data là thông tin bệnh nhân
          setPatientInfo(res?.data || res);
        })
        .catch(() => setPatientInfo(null));
    } else {
      setPatientInfo(null);
    }
  }, [form.PatientID]);

  // Khi chọn ARV thì lấy chi tiết ARV
  useEffect(() => {
    if (form.ARVProtocol) {
      const found = arvProtocols.find(arv => String(arv.ARVID) === String(form.ARVProtocol));
      setSelectedARVObj(found || null);
    } else {
      setSelectedARVObj(null);
    }
  }, [form.ARVProtocol, arvProtocols]);

  // Tìm DoctorID dựa trên currentUser.name so sánh với Fullname từ API
  useEffect(() => {
    if (currentUser?.name && doctors.length > 0) {
      const matchedDoctor = doctors.find(doctor => 
        doctor.Fullname && doctor.Fullname.toLowerCase() === currentUser.name.toLowerCase()
      );
      
      if (matchedDoctor) {
        console.log('Found matching doctor:', matchedDoctor);
        setForm(f => ({ ...f, DoctorID: matchedDoctor.DoctorId }));
      } else {
        console.log('No matching doctor found for:', currentUser.name);
        console.log('Available doctors:', doctors.map(d => d.Fullname));
      }
    }
  }, [currentUser, doctors]);

  // Tìm PatientFullname dựa trên PatientID từ form so sánh với PatientID từ API
  useEffect(() => {
    if (form.PatientID && patients.length > 0) {
      const matchedPatient = patients.find(patient => 
        patient.Patient && patient.Patient.PatientID && String(patient.Patient.PatientID) === String(form.PatientID)
      );
      
      if (matchedPatient) {
        console.log('Found matching patient:', matchedPatient);
        setMatchedPatient(matchedPatient);
      } else {
        console.log('No matching patient found for PatientID:', form.PatientID);
        console.log('Available patients:', patients.map(p => ({ 
          PatientID: p.Patient?.PatientID, 
          PatientFullname: p.PatientFullname || p.Patient?.User?.Fullname 
        })));
        setMatchedPatient(null);
      }
    } else {
      setMatchedPatient(null);
    }
  }, [form.PatientID, patients]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("Dữ liệu gửi lên:", form);
      const response = await AddTreatmentPlan({
        PatientID: form.PatientID,
        DoctorID: form.DoctorID,
        ARVProtocol: form.ARVProtocol,
        TreatmentLine: form.TreatmentLine,
        Diagnosis: form.Diagnosis,
        TreatmentResult: form.TreatmentResult
      });
      console.log("API Response:", response);
      setShowSuccessPopup(true);
      setForm({
        PatientID: '',
        DoctorID: '',
        ARVProtocol: '',
        TreatmentLine: '',
        Diagnosis: '',
        TreatmentResult: ''
      });
      setPatientInfo(null);
      setSelectedARVObj(null);
      setMatchedPatient(null);
    } catch (error) {
      console.log("Lỗi:", error);
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
          {form.PatientID ? (
            <input
              type="text"
              value={matchedPatient?.PatientFullname || matchedPatient?.Patient?.User?.Fullname || form.PatientID}
              disabled
              style={{ background: '#f7fafd', fontWeight: 'bold' }}
            />
          ) : (
            <select
              value={form.PatientID}
              onChange={e => setForm({ ...form, PatientID: e.target.value })}
              required
            >
              <option value="">Chọn bệnh nhân</option>
              {patients.map((p, idx) => (
                <option key={p.Patient?.PatientID || idx} value={p.Patient?.PatientID}>
                  {p.PatientFullname || p.Patient?.User?.Fullname || p.Patient?.PatientID} - {p.Patient?.PatientID}
                </option>
              ))}
            </select>
          )}

         
          {form.PatientID && (
            <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>
              Mã bệnh nhân: {form.PatientID}
            </small>
          )}
        </div>
        <div className="tp-add-row">
          <label>Bác sĩ phụ trách</label>
          <input
            type="text"
            value={currentUser?.name || 'Không xác định'}
            disabled
            style={{ background: '#f7fafd', fontWeight: 'bold' }}
          />
          {form.DoctorID && (
            <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>
              Mã bác sĩ: {form.DoctorID}
            </small>
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
        {matchedPatient ? (
          <>
            <p><b>Mã BN:</b> {matchedPatient.Patient?.PatientID || 'N/A'}</p>
            <p><b>Họ tên:</b> {matchedPatient.PatientFullname || matchedPatient.Patient?.User?.Fullname || 'N/A'}</p>
            <p><b>Ngày sinh:</b> {matchedPatient.Patient?.DateOfBirth?.split('T')[0] || 'N/A'}</p>
            <p><b>Giới tính:</b> {matchedPatient.Patient?.Gender || 'N/A'}</p>
            <p><b>SĐT:</b> {matchedPatient.Patient?.Phone || matchedPatient.Patient?.User?.PhoneNumber || 'N/A'}</p>
            <p><b>Email:</b> {matchedPatient.Patient?.User?.Email || 'N/A'}</p>
            <p><b>Địa chỉ:</b> {matchedPatient.Patient?.User?.Address || 'N/A'}</p>
            {matchedPatient.Note && (
              <p><b>Ghi chú:</b> {matchedPatient.Note}</p>
            )}
          </>
        ) : form.PatientID ? (
          <p>Đang tải thông tin bệnh nhân...</p>
        ) : (
          <p>Vui lòng chọn bệnh nhân để xem thông tin.</p>
        )}
        {form.PatientID && matchedPatient && (
          <input
            type="text"
            value={"Bệnh nhân mới"}
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
      
      {/* Success Popup */}
      {showSuccessPopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '30px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            maxWidth: '400px',
            width: '90%'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#4CAF50',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '0 auto 20px',
              fontSize: '30px',
              color: 'white'
            }}>
              ✓
            </div>
            <h3 style={{
              margin: '0 0 15px 0',
              color: '#333',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              Bạn đã cập nhật kế hoạch điều trị thành công !
            </h3>
            <button
              onClick={() => {
                setShowSuccessPopup(false);
                navigate('/doctor');
              }}
              style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '10px 24px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TreatmentPlanAdd;
