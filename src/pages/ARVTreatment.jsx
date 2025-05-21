import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/ARVTreatment.css";
import Navbar from '../components/Navbar';

const ARVTreatment = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "ARV là gì và tại sao nó quan trọng trong điều trị HIV?",
      answer: "ARV (Antiretroviral) là thuốc kháng virus được sử dụng để điều trị nhiễm HIV. Thuốc này ngăn virus HIV sao chép và lây lan trong cơ thể, giúp giảm số lượng virus trong máu xuống mức không phát hiện được. Điều trị ARV có vai trò quan trọng giúp nâng cao chất lượng cuộc sống, kéo dài tuổi thọ của người nhiễm HIV, và làm giảm nguy cơ lây truyền HIV cho người khác."
    },
    {
      question: "Thời gian điều trị ARV là bao lâu?",
      answer: "Hiện nay, điều trị ARV là điều trị suốt đời. Người nhiễm HIV cần uống thuốc ARV hàng ngày theo đúng chỉ định của bác sĩ, không được tự ý ngừng thuốc hoặc thay đổi liều lượng dù cảm thấy khỏe mạnh. Việc tuân thủ điều trị là yếu tố quan trọng nhất để đảm bảo hiệu quả của thuốc và kiểm soát virus HIV."
    },
    {
      question: "Tôi có thể bị nhiễm HIV nếu tiếp xúc với người đang được điều trị ARV không?",
      answer: "Khi người nhiễm HIV được điều trị ARV hiệu quả và duy trì tải lượng virus ở mức không phát hiện được (undetectable) trong ít nhất 6 tháng, họ không có khả năng lây truyền HIV qua đường tình dục. Điều này được gọi là U=U (Undetectable = Untransmittable) hay 'Không phát hiện = Không lây truyền'. Tuy nhiên, việc thực hiện các biện pháp phòng ngừa như sử dụng bao cao su vẫn được khuyến khích để phòng ngừa các bệnh lây truyền qua đường tình dục khác."
    },
    {
      question: "Điều trị ARV có tác dụng phụ không?",
      answer: "Có, một số người có thể gặp tác dụng phụ khi bắt đầu điều trị ARV như buồn nôn, mệt mỏi, đau đầu, tiêu chảy. Tuy nhiên, hầu hết các tác dụng phụ thường nhẹ và giảm dần sau vài tuần. Thuốc ARV hiện đại có ít tác dụng phụ hơn so với các thế hệ trước. Nếu gặp tác dụng phụ nghiêm trọng hoặc kéo dài, người bệnh nên thông báo ngay cho bác sĩ để được hỗ trợ và điều chỉnh phác đồ nếu cần."
    },
    {
      question: "Tôi cần làm gì để đảm bảo điều trị ARV hiệu quả?",
      answer: "Để đảm bảo hiệu quả điều trị ARV, bạn cần: 1) Uống thuốc đúng giờ và đúng liều lượng theo chỉ định; 2) Không bỏ liều thuốc; 3) Khám theo dõi định kỳ theo lịch hẹn; 4) Thông báo cho bác sĩ về bất kỳ tác dụng phụ nào; 5) Thực hiện xét nghiệm định kỳ để theo dõi tải lượng virus và số lượng tế bào CD4; 6) Duy trì lối sống lành mạnh và chế độ ăn uống cân bằng."
    }
  ];

  return (
    <>
      <Navbar />
      <div className="arv-page">
        <div className="arv-header">
          <h1>Điều trị ARV</h1>
          <p>Phác đồ điều trị ARV hiện đại giúp kiểm soát virus HIV hiệu quả và nâng cao chất lượng cuộc sống</p>
        </div>

        <div className="arv-content">
          <section className="section">
            <h2>Giới thiệu về điều trị ARV</h2>
            <p>
              Điều trị kháng virus (ARV - Antiretroviral) là phương pháp điều trị chính cho người nhiễm HIV, giúp
              ức chế sự nhân lên của virus trong cơ thể. Mục tiêu của điều trị ARV là giảm tải lượng virus HIV xuống 
              mức không phát hiện được, phục hồi hệ miễn dịch, tăng cường sức khỏe, ngăn ngừa các bệnh nhiễm trùng 
              cơ hội và giảm nguy cơ lây truyền HIV cho người khác.
            </p>

            <div className="important-note">
              <h4>Lưu ý quan trọng</h4>
              <p>
                Điều trị ARV là điều trị suốt đời. Việc tuân thủ điều trị nghiêm túc và đúng hướng dẫn
                của bác sĩ là yếu tố quyết định để đạt được hiệu quả tối ưu trong việc kiểm soát HIV và
                nâng cao chất lượng cuộc sống cho người bệnh.
              </p>
            </div>
          </section>

          <section className="section">
            <h2>Lợi ích của điều trị ARV</h2>
            <div className="benefits-list">
              <div className="benefit-item">
                <h4>Kiểm soát virus</h4>
                <p>Giảm tải lượng virus HIV xuống mức không phát hiện được trong máu, giúp ngăn chặn sự phát triển và lây lan của virus.</p>
              </div>

              <div className="benefit-item">
                <h4>Phục hồi miễn dịch</h4>
                <p>Tăng số lượng tế bào CD4, giúp hệ thống miễn dịch phục hồi và bảo vệ cơ thể khỏi các bệnh nhiễm trùng.</p>
              </div>

              <div className="benefit-item">
                <h4>Giảm biến chứng</h4>
                <p>Ngăn ngừa các bệnh nhiễm trùng cơ hội và các biến chứng liên quan đến HIV/AIDS.</p>
              </div>

              <div className="benefit-item">
                <h4>Kéo dài tuổi thọ</h4>
                <p>Người nhiễm HIV được điều trị ARV hiệu quả có thể có tuổi thọ gần như người không nhiễm HIV.</p>
              </div>

              <div className="benefit-item">
                <h4>Giảm lây truyền</h4>
                <p>Người có tải lượng virus không phát hiện được sẽ không lây truyền HIV qua đường tình dục (U=U).</p>
              </div>

              <div className="benefit-item">
                <h4>Cải thiện chất lượng sống</h4>
                <p>Cải thiện sức khỏe thể chất, tinh thần và khả năng tham gia vào các hoạt động xã hội.</p>
              </div>
            </div>
          </section>

          <section className="section">
            <h2>Các phác đồ điều trị ARV hiện đại</h2>
            <p>
              Tại cơ sở y tế của chúng tôi, chúng tôi áp dụng các phác đồ điều trị ARV hiện đại theo khuyến cáo của 
              Tổ chức Y tế Thế giới (WHO) và Bộ Y tế Việt Nam. Các phác đồ này được cá nhân hóa dựa trên tình trạng 
              cụ thể của từng bệnh nhân.
            </p>

            <div className="treatment-cards">
              <div className="treatment-card">
                <div className="icon">
                  <i className="fas fa-pills"></i>
                </div>
                <h3>Phác đồ bậc 1</h3>
                <p>
                  Phác đồ điều trị ban đầu dành cho người mới được chẩn đoán nhiễm HIV. 
                  Thường bao gồm 3 loại thuốc từ ít nhất 2 nhóm thuốc khác nhau, thường là 2 NRTI + 1 NNRTI hoặc 1 PI.
                </p>
              </div>

              <div className="treatment-card">
                <div className="icon">
                  <i className="fas fa-capsules"></i>
                </div>
                <h3>Phác đồ bậc 2</h3>
                <p>
                  Được sử dụng khi phác đồ bậc 1 thất bại do kháng thuốc hoặc tác dụng phụ nặng. 
                  Thường bao gồm các thuốc từ các nhóm khác với phác đồ bậc 1.
                </p>
              </div>

              <div className="treatment-card">
                <div className="icon">
                  <i className="fas fa-prescription-bottle-alt"></i>
                </div>
                <h3>Phác đồ đơn giản hóa</h3>
                <p>
                  Phác đồ hiện đại với ít viên thuốc hơn (đôi khi chỉ 1 viên mỗi ngày), giúp tăng tuân thủ điều trị và giảm tác dụng phụ.
                </p>
              </div>
            </div>

            <table className="regimen-table">
              <thead>
                <tr>
                  <th>Phác đồ</th>
                  <th>Thành phần thuốc</th>
                  <th>Đặc điểm</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>TDF + 3TC + DTG</td>
                  <td>Tenofovir + Lamivudine + Dolutegravir</td>
                  <td>Phác đồ bậc 1 ưu tiên hiện nay, hiệu quả cao, ít tác dụng phụ</td>
                </tr>
                <tr>
                  <td>TDF + 3TC + EFV</td>
                  <td>Tenofovir + Lamivudine + Efavirenz</td>
                  <td>Phác đồ thay thế, có thể gây tác dụng phụ lên thần kinh</td>
                </tr>
                <tr>
                  <td>ABC + 3TC + DTG</td>
                  <td>Abacavir + Lamivudine + Dolutegravir</td>
                  <td>Sử dụng cho người có vấn đề về thận</td>
                </tr>
                <tr>
                  <td>TDF + 3TC + LPV/r</td>
                  <td>Tenofovir + Lamivudine + Lopinavir/ritonavir</td>
                  <td>Phác đồ bậc 2 khi thất bại với NNRTI</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="section">
            <h2>Quy trình điều trị ARV</h2>
            <ol className="step-list">
              <li>
                <h4>Tư vấn trước điều trị</h4>
                <p>Bác sĩ sẽ giải thích về tình trạng nhiễm HIV, vai trò của điều trị ARV, tầm quan trọng của việc tuân thủ điều trị và các biện pháp phòng ngừa lây nhiễm.</p>
              </li>
              <li>
                <h4>Đánh giá trước điều trị</h4>
                <p>Thực hiện các xét nghiệm cơ bản như số lượng tế bào CD4, tải lượng virus HIV, chức năng gan thận, xét nghiệm lao và các bệnh nhiễm trùng cơ hội.</p>
              </li>
              <li>
                <h4>Lựa chọn phác đồ điều trị</h4>
                <p>Bác sĩ sẽ lựa chọn phác đồ ARV phù hợp với tình trạng sức khỏe, tiền sử bệnh lý, tương tác thuốc và các yếu tố khác của bệnh nhân.</p>
              </li>
              <li>
                <h4>Bắt đầu điều trị</h4>
                <p>Hướng dẫn cách uống thuốc, liều lượng, thời điểm uống và cách xử lý khi quên liều.</p>
              </li>
              <li>
                <h4>Theo dõi và đánh giá</h4>
                <p>Khám định kỳ để theo dõi đáp ứng điều trị, tác dụng phụ và xét nghiệm để theo dõi tải lượng virus và số lượng tế bào CD4.</p>
              </li>
              <li>
                <h4>Điều chỉnh phác đồ nếu cần</h4>
                <p>Trong trường hợp có tác dụng phụ nghiêm trọng hoặc thất bại điều trị, bác sĩ sẽ điều chỉnh phác đồ phù hợp.</p>
              </li>
            </ol>
          </section>

          <section className="section">
            <h2>Quản lý tác dụng phụ của thuốc ARV</h2>
            <p>
              Mặc dù thuốc ARV hiện đại có ít tác dụng phụ hơn so với trước đây, một số người vẫn có thể gặp phải các tác dụng phụ, 
              đặc biệt là trong giai đoạn đầu điều trị. Hầu hết các tác dụng phụ là nhẹ và tạm thời.
            </p>

            <div className="side-effects">
              <div className="side-effect-item">
                <h4>Tác dụng phụ thường gặp và cách xử lý</h4>
                <p>
                  <strong>Buồn nôn và nôn:</strong> Uống thuốc với thức ăn nhẹ, chia nhỏ bữa ăn và tránh thức ăn cay nóng.
                  <br />
                  <strong>Tiêu chảy:</strong> Uống nhiều nước, tránh thức ăn nhiều dầu mỡ và cay nóng.
                  <br />
                  <strong>Mệt mỏi:</strong> Nghỉ ngơi đầy đủ, duy trì chế độ ăn uống cân bằng và tập thể dục vừa phải.
                  <br />
                  <strong>Đau đầu:</strong> Dùng thuốc giảm đau không kê đơn như paracetamol nếu cần thiết.
                </p>
              </div>

              <div className="side-effect-item">
                <h4>Khi nào cần liên hệ bác sĩ?</h4>
                <p>
                  Hãy liên hệ ngay với bác sĩ nếu bạn gặp phải các triệu chứng sau:
                  <br />
                  - Phát ban nặng hoặc ngứa
                  <br />
                  - Vàng da, vàng mắt
                  <br />
                  - Đau bụng dữ dội
                  <br />
                  - Khó thở hoặc sốt cao
                  <br />
                  - Tác dụng phụ kéo dài không giảm sau 2-4 tuần
                </p>
              </div>
            </div>
          </section>

          <section className="section">
            <h2>Câu hỏi thường gặp</h2>
            <div className="faq-list">
              {faqData.map((faq, index) => (
                <div className="faq-item" key={index}>
                  <div className="faq-question" onClick={() => toggleFAQ(index)}>
                    {faq.question}
                    <span>{activeIndex === index ? '−' : '+'}</span>
                  </div>
                  {activeIndex === index && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <div className="cta-box">
            <h3>Bạn cần tư vấn về điều trị ARV?</h3>
            <p>Đội ngũ y bác sĩ chuyên khoa của chúng tôi luôn sẵn sàng hỗ trợ bạn</p>
            <Link to="/hospital/lich-kham" className="cta-btn">Đặt lịch khám ngay</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ARVTreatment;
