// ResetPasswordPage.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ResetPasswordPage.css"; // CSS 파일 import
import API_BASE_URL from "../config/apiConfig";

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [step, setStep] = useState(1); // 단계를 추적하는 상태 변수 추가
  const { uid, token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (uid && token) {
      setStep(2);
    } else {
      setStep(1);
    }
  }, [uid, token]);

  // 비밀번호 규칙을 위한 정규 표현식
  const regexSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
  const regexNumber = /\d/; // 최소 하나의 숫자가 있는지 확인
  const regexAlphabet = /[a-zA-Z]/; // 최소 하나의 알파벳이 있는지 확인

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    const newPasswordValue = e.target.value;
    setNewPassword(newPasswordValue);

    // 비밀번호가 규칙을 위반하는지 확인
    if (
      newPasswordValue.length < 8 ||
      !regexSpecialChar.test(newPasswordValue) ||
      !regexNumber.test(newPasswordValue) ||
      !regexAlphabet.test(newPasswordValue)
    ) {
      setErrorMessage(
        "비밀번호는 특수문자 1개 이상, 숫자 및 영문자를 포함하여 8자 이상이어야 합니다."
      );
    } else {
      setErrorMessage("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    // 비밀번호 확인 로직
    if (newPassword !== e.target.value) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
    } else {
      setErrorMessage("");
    }
  };

  const handleSendVerificationEmail = () => {
    const url = `${API_BASE_URL}/club_account/password/reset/`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ email }),
    };
    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        alert("인증 이메일이 전송되었습니다. \n 이메일을 확인해주세요.");
      });

    // setStep(2); // 비밀번호 입력으로 이동
  };

  const handleChangePassword = () => {
    // Check if any field is empty
    if (!newPassword || !confirmPassword) {
      setErrorMessage("모든 필드를 입력해주세요.");
      return;
    }
    // Check if password meets the criteria
    if (
      newPassword.length < 8 ||
      !regexSpecialChar.test(newPassword) ||
      !regexNumber.test(newPassword) ||
      !regexAlphabet.test(newPassword)
    ) {
      setErrorMessage(
        "비밀번호는 특수문자 1개 이상, 숫자 및 영문자를 포함하여 8자 이상이어야 합니다."
      );
      return;
    }
    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }
    // If all checks pass, proceed with password change

    try {
      const response = fetch(
        `${API_BASE_URL}/club_account/password/reset/confirm/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            uid,
            token,
            new_password1: newPassword,
            new_password2: confirmPassword,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          alert("비밀번호가 변경되었습니다.");
          navigate("/login");
        });
    } catch (error) {
      setErrorMessage("비밀번호 변경에 실패했습니다.");
    }
  };

  return (
    <div className="reset-password-container">
      <h2 className="reset-password-header">비밀번호 재설정</h2>
      {step === 1 && (
        <>
          <p>본인확인</p>
          <p>※개인정보보호를 위해 본인확인을 진행합니다.</p>
          <label htmlFor="email">이메일을 입력해주세요</label>
          <input
            type="email"
            id="email"
            className="input-field"
            value={email}
            onChange={handleEmailChange}
          />
          <button
            className="button primary-button"
            onClick={handleSendVerificationEmail}
          >
            이메일 인증하기
          </button>
        </>
      )}
      {step === 2 && (
        <>
          <p>비밀번호 재설정하기</p>
          <label htmlFor="newPassword">새로운 비밀번호를 입력해주세요</label>
          <input
            type="password"
            id="newPassword"
            className="input-field"
            value={newPassword}
            onChange={handleNewPasswordChange}
          />
          <label htmlFor="confirmPassword">비밀번호 확인</label>
          <input
            type="password"
            id="confirmPassword"
            className="input-field"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button
            className="button primary-button"
            onClick={handleChangePassword}
          >
            변경완료
          </button>
        </>
      )}
    </div>
  );
};

export default ResetPasswordPage;
