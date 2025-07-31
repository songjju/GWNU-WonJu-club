import React, { useState, useEffect } from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import "./Mypage_Style/MypageHome.css";
import defaultImage from "./profile.jpg";
import logo from "./logo.png";

const MypageHome = ({ userData, myClubList }) => {
  return (
    <Container>
      <Row className="justify-content-center align-items-center">
        <Col md={3}>
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
                <strong>학년:</strong> {userData?.grade}학년
              </p>
              <p>
                <strong>학번:</strong> {userData?.student_id}
              </p>
              <p>
                <strong>소속 학과:</strong> {userData?.study}
              </p>
              <p>{/* <strong>가입일:</strong> {userData?.date_joined} */}</p>
            </div>
          </div>
        </Col>

        <Col md={4}>
          <div className="myclub-panel">
            <h2 className="myclub-head">나의 동아리</h2>
            <div className="myclub-list">
              {myClubList.map((club, index) => (
                <div key={club.member_id} className="myclub-item">
                  <p>
                    <strong>동아리 이름:</strong> {club.club_name}
                  </p>
                  {/* <div className="club-logo-container">
                    {club.logo ? (
                      <img src={club.logo} alt="동아리 로고" className="club-logo" />
                    ) : (
                      <img src={logo} alt="기본 이미지" className="club-logo" />
                    )}
                  </div> */}
                  <p>
                    <strong>직책:</strong> {club.job}
                  </p>
                  <br />
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default MypageHome;
