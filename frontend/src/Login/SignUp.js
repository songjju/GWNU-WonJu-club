import React, { useState } from "react";
import "./SignUp.css"; // CSS 파일 임포트
import API_BASE_URL from "../config/apiConfig"; // API 설정 임포트

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    password1: "",
    password2: "",
    name: "",
    student_id: "",
    grade: "",
    study: "",
    gender: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const {
    email,
    password1,
    password2,
    name,
    student_id,
    grade,
    study,
    gender,
    phone,
  } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validatePassword = (password1, password2) => {
    if (password1 !== password2) {
      return "비밀번호가 일치하지 않습니다.";
    }
    if (
      password1.length < 8 ||
      !/[a-zA-Z]/.test(password1) ||
      !/\d/.test(password1)
    ) {
      return "비밀번호는 8자 이상이어야 하며, 영문자와 숫자를 포함해야 합니다.";
    }
    return "";
  };

  const onSubmit = (e) => {
    e.preventDefault(); // form의 기본 제출 동작 방지

    const error = validatePassword(password1, password2);
    if (error) {
      setPasswordError(error);
      return;
    }

    const user = {
      email,
      password1,
      password2,
      name,
      student_id: parseInt(student_id), // 숫자로 변환
      grade: parseInt(grade), // 숫자로 변환
      study,
      gender,
      phone,
    };

    setIsLoading(true);

    fetch(`${API_BASE_URL}/club_account/registration/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => {
        console.log("응답 상태:", res.status); // 디버깅용
        setIsLoading(false);

        if (res.status >= 200 && res.status < 300) {
          window.location.href = `/signup/email_confirm?email=${encodeURIComponent(
            email
          )}`;
          alert("이메일 인증을 진행해 주세요.");
        } else {
          // 오류 응답의 내용을 확인
          return res.json().then((errorData) => {
            alert("회원가입 실패: " + JSON.stringify(errorData));
            console.error("회원가입 실패:", res.status, errorData);
          });
        }
      })
      .catch((error) => {
        console.error("네트워크 오류:", error);
        setIsLoading(false);
        alert("네트워크 오류가 발생했습니다.");
      });
  };

  return (
    <div className="signup-container py-5">
      <h1 className="signup-title">회원가입</h1>
      <form onSubmit={onSubmit}>
        <div className="signup-form-group">
          <label htmlFor="email">이메일</label>
          <input
            className="signup-form-control"
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className="signup-form-group">
          <label htmlFor="password1">패스워드</label>
          <input
            className="signup-form-control"
            type="password"
            name="password1"
            value={password1}
            onChange={onChange}
            required
          />
        </div>
        <div className="signup-form-group">
          <label htmlFor="password2">패스워드 재확인</label>
          <input
            className="signup-form-control"
            type="password"
            name="password2"
            value={password2}
            onChange={onChange}
            required
          />
        </div>
        {passwordError && <p className="signup-text-danger">{passwordError}</p>}
        <div className="signup-form-group">
          <label htmlFor="name">이름</label>
          <input
            className="signup-form-control"
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
        </div>
        <div className="signup-form-group">
          <label htmlFor="student_id">학번</label>
          <input
            className="signup-form-control"
            type="number"
            name="student_id"
            value={student_id}
            onChange={onChange}
            required
          />
        </div>
        <div className="signup-form-group">
          <label htmlFor="grade">학년</label>
          <select
            className="signup-form-control"
            name="grade"
            value={grade}
            onChange={onChange}
            required
          >
            <option value="">학년을 선택하세요</option>
            {[1, 2, 3, 4].map((num) => (
              <option key={num} value={num}>
                {num}학년
              </option>
            ))}
          </select>
        </div>
        <div className="signup-form-group">
          <label htmlFor="study">학과</label>
          <select
            className="signup-form-control"
            name="study"
            value={study}
            onChange={onChange}
            required
          >
            <option value="">학과를 선택하세요</option>
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
            ].map((study) => (
              <option key={study} value={study}>
                {study}
              </option>
            ))}
          </select>
        </div>
        <div className="signup-form-group">
          <label htmlFor="gender">성별</label>
          <select
            className="signup-form-control"
            name="gender"
            value={gender}
            onChange={onChange}
            required
          >
            <option value="">성별을 선택하세요</option>
            {["남자", "여자"].map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
        </div>
        <div className="signup-form-group">
          <label htmlFor="phone">휴대전화</label>
          <input
            className="signup-form-control"
            type="text"
            name="phone"
            value={phone}
            onChange={onChange}
            required
          />
        </div>
        <br />
        <button type="submit" className="signup-btn">
          Signup
        </button>
        <br />
        <div>
          {isLoading && (
            <div className="signup-spinner spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default SignUp;
