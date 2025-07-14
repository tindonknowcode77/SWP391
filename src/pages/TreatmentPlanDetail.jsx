import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  getTreatmentPlanById,
  AllARVProtocol,
  addPrescription,
  UpdateTreatmentPlan,
  bacsilaydanhsachbenhnhan,
  getAllDoctors,
  AddTreatmentPlan
} from '../api/auth';
import {updateARVProtocol} from '../api/auth';


import '../styles/TreatmentPlanDetail.css';
const TreatmentPlanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [arvProtocols, setArvProtocols] = useState([]);
  const [selectedARV, setSelectedARV] = useState('');
  const [selectedARVObj, setSelectedARVObj] = useState(null);
  const [arvEditSuccess, setArvEditSuccess] = useState('');
  const [arvEditError, setArvEditError] = useState('');
  const [prescription, setPrescription] = useState({
    TreatmentPlanID: id,
    Medication: '',
    Dosage: '',
    Frequency: '',
    Note: ''
  });
  const [prescSuccess, setPrescSuccess] = useState('');
  const [prescError, setPrescError] = useState('');

  useEffect(() => {
    setLoading(true);
    getTreatmentPlanById(id)
      .then(res => {
        setPlan(res?.data || res);
        setSelectedARV(res?.data?.ARVProtocol || res?.ARVProtocol || '');
        setLoading(false);
      })
      .catch(() => {
        setError('Không thể tải hồ sơ điều trị');
        setLoading(false);
      });
    AllARVProtocol()
      .then(res => {
        console.log('ARV Protocols:', res);
        setArvProtocols(res?.data || res)
      })
      .catch(() => setArvProtocols([]));
  }, [id]);

  const handleARVChange = (e) => {
    const arvid = e.target.value;
    setSelectedARV(arvid);
    const found = arvProtocols.find(arv => arv.ARVID === arvid);
    setSelectedARVObj(found || null);
  };

  const handleARVUpdate = () => {
    if (!selectedARVObj) {
      setArvEditError('Vui lòng chọn phác đồ ARV!');
      setArvEditSuccess('');
      return;
    }
    if (!plan) {
      setArvEditError('Không tìm thấy hồ sơ điều trị!');
      setArvEditSuccess('');
      return;
    }
    const payload = {
      TreatmentPlanID: plan.TreatmentPlanID,
      PatientID: plan.PatientID,
      DoctorID: plan.DoctorID,
      ARVProtocol: selectedARVObj.ARVID,
      TreatmentLine: plan.TreatmentLine,
      Diagnosis: plan.Diagnosis,
      TreatmentResult: plan.TreatmentResult
    };
    UpdateTreatmentPlan(payload)
      .then(() => {
        setArvEditSuccess('Cập nhật phác đồ ARV thành công!');
        setArvEditError('');
        setTimeout(() => {
          window.location.reload();
        }, 500);
      })
      .catch((error) => {
        setArvEditError('Cập nhật phác đồ ARV thất bại!');
        setArvEditSuccess('');
        console.log('API error:', error.response?.data || error);
      });
  };

  const handlePrescChange = (e) => {
    setPrescription({ ...prescription, [e.target.name]: e.target.value });
  };

  const handlePrescSubmit = (e) => {
    e.preventDefault();
    addPrescription(prescription)
      .then(() => {
        setPrescSuccess('Thêm đơn thuốc thành công!');
        setPrescError('');
        setPrescription({ ...prescription, Medication: '', Dosage: '', Frequency: '', Note: '' });
      })
      .catch(() => {
        setPrescError('Thêm đơn thuốc thất bại!');
        setPrescSuccess('');
      });
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div style={{color:'red'}}>{error}</div>;
  if (!plan) return <div>Không tìm thấy hồ sơ điều trị.</div>;

  console.log('plan:', plan);

  return (
    <div className="treatment-plan-detail-page">
      <div className="treatment-plan-detail-center">
        <button className="tpd-back-btn" onClick={() => navigate(-1)}>Quay lại</button>
        <h2 className="tpd-title">Chi tiết hồ sơ điều trị</h2>
        <div className="tpd-info-block">
          <strong>Mã hồ sơ:</strong> {plan.TreatmentPlanID}<br/>
          <strong>Bác sĩ:</strong> {plan.DoctorID }<br/>
          <strong>Chẩn đoán:</strong> {plan.Diagnosis}<br/>
          <strong>Kết quả:</strong> {plan.TreatmentResult }<br/>
          <strong>Phác đồ ARV hiện tại:</strong> {plan.ARVProtocol }
        </div>
        <section className="tpd-arv-section">
          <h3 className="tpd-section-title">Chọn/Sửa phác đồ ARV</h3>
          <div className="tpd-arv-row">
            <select value={selectedARV} onChange={handleARVChange} className="tpd-arv-select">
              <option value="">-- Chọn phác đồ ARV --</option>
              {arvProtocols.map((arv) => (
                <option key={arv.ARVID} value={arv.ARVID}>
                  {arv.ARVName} ({arv.ARVCode})
                </option>
              ))}
            </select>
            <button className="tpd-update-arv-btn" onClick={handleARVUpdate}>Cập nhật</button>
          </div>
          {arvEditSuccess && <div className="tpd-success-msg">{arvEditSuccess}</div>}
          {arvEditError && <div className="tpd-error-msg">{arvEditError}</div>}
          {selectedARVObj && (
            <div className="tpd-arv-detail">
              <p><strong>Mã phác đồ:</strong> {selectedARVObj.ARVID}</p>
              <p><strong>Tên phác đồ:</strong> {selectedARVObj.ARVName}</p>
              <p><strong>Mã code:</strong> {selectedARVObj.ARVCode}</p>
              <p><strong>Mô tả:</strong> {selectedARVObj.Description}</p>
              <p><strong>Độ tuổi:</strong> {selectedARVObj.AgeRange}</p>
              <p><strong>Nhóm:</strong> {selectedARVObj.ForGroup}</p>
            </div>
          )}
        </section>
        <section className="tpd-prescription-section">
          <h3 className="tpd-section-title">Đơn thuốc</h3>
          <button
            className="tpd-add-prescription-btn"
            onClick={() => {
              if (location.state && location.state.fromDoctor && location.state.BookID) {
                navigate(`/prescription/${plan.TreatmentPlanID}`, { state: { fromDoctor: true, BookID: location.state.BookID } });
              } else if (location.state && location.state.fromDoctor) {
                navigate(`/prescription/${plan.TreatmentPlanID}`, { state: { fromDoctor: true } });
              } else {
                navigate(`/prescription/${plan.TreatmentPlanID}`);
              }
            }}
          >
            Thêm đơn thuốc
          </button>
        </section>
      </div>
    </div>
  );
};

export default TreatmentPlanDetail; 