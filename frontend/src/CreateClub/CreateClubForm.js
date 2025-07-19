import React, { useState } from "react";
import { Container, Form, Button, Image } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CreateClub.css";
import defaultImage from "../Assets/default_image.png";
import defaultLogo from "../Assets/club_logo.png";
import API_BASE_URL from "../config/apiConfig";

const CreateClubForm = ({ addClub }) => {
  const [clubName, setClubName] = useState("");
  const [clubType, setClubType] = useState("");
  const [clubCategory, setClubCategory] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [logo, setLogo] = useState(defaultLogo);
  const [background, setBackground] = useState(defaultImage);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clubName || !clubType || !clubCategory || !introduction) {
      alert("모든 필드를 작성해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("name", clubName);
    formData.append("type", clubType);
    formData.append("category", clubCategory);
    formData.append("introduction", introduction);
    formData.append("logo", logo);
    formData.append("background", background);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/club_intoduce/apply_club/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.status === 201) {
        addClub(response.data); // 상위 컴포넌트의 addClub 함수를 호출
        navigate("/");
      } else {
        throw new Error("Failed to add club");
      }
    } catch (error) {
      console.error("Error adding club:", error);
      alert("동아리 등록에 실패했습니다.");
    }
  };

  return (
    <Container  className ="create-club-container"style={{ padding: "5%" }}>
      <h1 className="create-head">동아리 만들기</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="clubName">
          <Form.Label>동아리 이름</Form.Label>
          <Form.Control
            type="text"
            value={clubName}
            onChange={(e) => {
              console.log(e.target.value); // 현재 입력된 값 로그 출력
              setClubName(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group controlId="clubType">
          <Form.Label>동아리 유형</Form.Label>
          <Form.Control
            as="select"
            value={clubType}
            onChange={(e) => setClubType(e.target.value)}
          >
            <option value="regular">정규 동아리</option>
            <option value="membership">가등록 동아리</option>
            <option value="learning">학습 동아리</option>
            <option value="employment">취업/창업 동아리</option>
            <option value="community">소모임</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="clubCategory">
          <Form.Label>동아리 분류</Form.Label>
          <Form.Control
            as="select"
            value={clubCategory}
            onChange={(e) => setClubCategory(e.target.value)}
          >
            <option value="sports">운동/스포츠</option>
            <option value="music">음악/예술</option>
            <option value="academic">학술/교육</option>
            <option value="social">사회/봉사</option>
            <option value="others">기타</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="introduction">
          <Form.Label>소개글</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={introduction}
            onChange={(e) => setIntroduction(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="logo">
          <Form.Label>로고 이미지</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => {
              const file = e.target.files[0];
              setLogo(file ? file : defaultLogo);
            }}
          />
          <Image
            src={
              logo
                ? logo instanceof File
                  ? URL.createObjectURL(logo)
                  : logo
                : defaultLogo
            }
            alt="club-logo"
            thumbnail
            width="80px"
            height="80px"
          />
        </Form.Group>
        <Form.Group controlId="background">
          <Form.Label>배경 이미지</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => {
              const file = e.target.files[0];
              setBackground(file ? file : defaultImage);
            }}
          />
          <Image
            src={
              background
                ? background instanceof File
                  ? URL.createObjectURL(background)
                  : background
                : defaultImage
            }
            alt="club-background"
            thumbnail
            width="200px"
            height="100px"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          동아리 등록
        </Button>
      </Form>
    </Container>
  );
};

export default CreateClubForm;
