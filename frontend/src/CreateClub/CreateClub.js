/*CreateClub.js*/
import React, { useState } from "react";
import { Container, Form, Button, Image } from "react-bootstrap";
import "./CreateClub.css";
import { LogoImage, BannerImage } from "../styles";
import API_BASE_URL from "../config/apiConfig"; // API 설정 임포트

const CreateClubPage = () => {
  const [clubName, setClubName] = useState("");
  const [category, setCategory] = useState("선택");
  const [type, setType] = useState("선택");
  const [introduction, setIntroduction] = useState("");
  const [logo, setLogo] = useState("");
  const [background, setBackground] = useState("");
  const token = localStorage.getItem('token');

  const handleNameChange = (e) => setClubName(e.target.value);
  const handleCategoryChange = (e) => setCategory(e.target.value);
  const handleTypeChange = (e) => setType(e.target.value);
  const handleIntroductionChange = (e) => setIntroduction(e.target.value);
  const handleLogoChange = (e) => setLogo(URL.createObjectURL(e.target.files[0]));
  const handleBackgroundChange = (e) => setBackground(URL.createObjectURL(e.target.files[0]));

  const handleSubmit = () => {
    const newClub = {
      club_name: clubName,
      category: category,
      type: type,
      introducation: introduction,
    };

    fetch(`${API_BASE_URL}/club_introduce/create_club/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(newClub),
    })
    .then(res => {
      console.log("생성된 동아리: ", res.status);
      alert("동아리가 등록되었습니다!");
      window.location.reload();
    })
    .catch(error => {
      console.error('Error adding club:', error);
      alert("동아리 등록에 실패했습니다.");
    });
  };

  const handleCancel = () => {
    alert("등록이 취소되었습니다.");
  };

  return (
    <Container className="create-club-container" style={{ padding: '80px' }}>
      <h1 className="create-club-head">동아리 만들기</h1>
      <Form className="create-club-form">
        <Form.Group controlId="clubName" className="create-club-formgroup">
          <Form.Label>동아리 이름</Form.Label>
          <Form.Control
            type="text"
            value={clubName}
            onChange={handleNameChange}
            className="form-control"
          />
        </Form.Group>

        <Form.Group controlId="club-category" className="create-club-formgroup">
          <Form.Label>동아리 유형</Form.Label>
          <Form.Control
            as="select"
            value={category}
            onChange={handleCategoryChange}
            className="form-control select-center"
          >
            <option value="선택">선택</option>
            {["정규", "가등록", "학습", "취업", "소모임"].map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="type" className="create-club-formgroup">
          <Form.Label>동아리 분야</Form.Label>
          <Form.Control
            as="select"
            value={type}
            onChange={handleTypeChange}
            className="form-control select-center"
          >
            <option value="선택">선택</option>
            {["문화", "공연", "운동", "음악", "종교", "봉사", "학술", "예술", "기타"].map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="create-club-introduction" className="create-club-formgroup">
          <Form.Label>동아리소개글</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={introduction}
            onChange={handleIntroductionChange}
            className="form-control form-textarea"
          />
        </Form.Group>

        <Form.Group controlId="logo" className="create-club-formgroup">
          <Form.Label>로고 이미지</Form.Label>
          <Form.Control
            type="file"
            onChange={handleLogoChange}
            className="form-control file-input-center"
          />
          {logo && <LogoImage src={logo} thumbnail />}
        </Form.Group>

        <Form.Group controlId="background" className="create-club-formgroup">
          <Form.Label>배경 사진</Form.Label>
          <Form.Control
            type="file"
            onChange={handleBackgroundChange}
            className="form-control file-input-center"
          />
          {background && <BannerImage src={background} thumbnail />}
        </Form.Group>

        <div className="create-club-buttongroup">
          <Button
            variant="primary"
            onClick={handleSubmit}
            className="small-button"
          >
            등록
          </Button>
          <Button
            variant="secondary"
            onClick={handleCancel}
            className="small-button"
          >
            취소
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default CreateClubPage;