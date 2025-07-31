import React, { useState, useEffect } from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import axios from "axios";
import defaultImage from "../Mypage/profile.jpg";
import logo from "../Mypage/logo.png";
import API_BASE_URL from "../config/apiConfig";

const UserDetails = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      getUserDetails();
    }
  }, [token]);

  const getUserDetails = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/club_account/user/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const data = response.data;
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center align-items-center">
        <Col md={4}>
          {/* 프로필 정보 패널 */}
          <div className="profile-panel">
            <h2 className="details-head">사용자 정보</h2>

            <img
              src={defaultImage}
              alt="프로필 사진"
              className="profile-image"
            />

            <div className="details-info">
              <p>
                <strong>이름: </strong> {userData?.name}
              </p>
              <p>
                <strong>이메일: </strong> {userData?.email}
              </p>
              <p>
                <strong>휴대전화: </strong> {userData?.phone}
              </p>
              <p>
                <strong>소속 학과:</strong> {userData?.study}
              </p>
              <p>{/* <strong>가입일:</strong> {userData?.date_joined} */}</p>
            </div>
          </div>
        </Col>

        {/* 세 번째 열 */}
        <Col md={4}>
          {/* 나의 동아리 패널 */}
          <div className="myclub-panel">
            <h2 className="myclub-head">나의 동아리</h2>

            <img src={logo} alt="동아리 로고" className="club-logo" />
            <div className="club-info">
              <p>
                <strong>가입 동아리 이름</strong>
              </p>
              <p>
                <strong>등급</strong>
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>

    // <div>
    //   {/* <button onClick={getUserDetails}>Get User Details</button> */}
    //   {userData && (
    //     <div>
    //       <p>name: {userData.name}</p>
    //       <p>Email: {userData.email}</p>
    //       <p>student_id: {userData.student_id}</p>
    //       <p>grade: {userData.grade}</p>
    //       <p>study: {userData.study}</p>
    //       <p>gender: {userData.gender}</p>
    //       <p>phone: {userData.phone}</p>

    //     </div>
    //   )}
    // </div>
  );
};

export default UserDetails;
