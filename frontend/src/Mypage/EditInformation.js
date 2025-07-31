// import MypageNav from "./MypageNav.js";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./Mypage_Style/Editinformation.css";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import API_BASE_URL from "../config/apiConfig"; // API 설정 임포트

const Editinformation = () => {
  const location = useLocation();
  const userData = location.state ? location.state.userData : {};
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [name, setName] = useState(userData.name);
  const [email, setEmail] = useState(userData.email);
  const [phone, setPhone] = useState(userData.phone);
  const [study, setStudy] = useState(userData.study);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUserData = {
        email: email,
        name: name,
        study: study,
        phone: phone,
        // student_id: 20191424,
        // grade: 4,
        // gender: '남자 ',
      };

      const response = await fetch(`${API_BASE_URL}/club_account/user/`, {
        method: "PATCH",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUserData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("수정 완료되었습니다.");
        window.location.replace(`${API_BASE_URL}/mypage`);
      } else {
        console.error("수정 실패:", data);
      }
    } catch (error) {
      console.error("네트워크 오류:", error);
    }
  };

  return (
    <div className="my-page">
      <Container className="">
        <Row className="edit-info-content">
          <Col className="edit-info-col" md={6}>
            <Form className="edit-info-form" onSubmit={handleSubmit}>
              <Form.Group controlId="formName">
                <Form.Label>이름:</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>이메일:</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formPhone">
                <Form.Label>휴대전화:</Form.Label>
                <Form.Control
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formStudy">
                <Form.Label className="study">소속 학과:</Form.Label>
                <Form.Control
                  as="select"
                  value={study}
                  onChange={(e) => setStudy(e.target.value)}
                  style={{ width: "30%" }}
                >
                  <option value="선택">선택</option>
                  {[
                    "유아교육과",
                    "간호학과",
                    "사회복지학과",
                    "다문화학과",
                    "컴퓨터공학과",
                    "멀티미디어공학과",
                    "기계공학과",
                    "자동차공학과",
                    "전기공학과",
                    "정보통신공학과",
                    "산업경영공학과",
                  ].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <div className="edit-info-button-container">
                <Button
                  className="edit-info-button"
                  variant="primary"
                  type="submit"
                >
                  저장
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Editinformation;
