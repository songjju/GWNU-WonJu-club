import "./Mypage_Style/Myclub.css";
import MypageNav from "./Mypage";
import { Container, Col } from "react-bootstrap";
import defaultimage from "./logo.png";

const MyClub = () => {
  return (
    <div className="my-page">
      <h1 className="mypage-header">마이페이지</h1>
      <MypageNav userData={userData} />
      <h1 className="myclub-header">내 동아리 관리 </h1>

      <Container>
        <Col>
          <img src={defaultimage} alt="logo" className="club-logo1" />
        </Col>
      </Container>
    </div>
  );
};

export default MyClub;
