import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const EmailConfirm = () => {
  const searchParams = new URLSearchParams(useLocation().search);
  const email = searchParams.get("email");
  // const email = props.email

  useEffect(() => {
    console.log("email :", { email });
  }, []);

  return (
    <div className="container py-5">
      <div className="card mx-auto" style={{ maxWidth: "700px" }}>
        <div className="card-body">
          <h5 className="card-title">이메일 인증 확인</h5>
          <p className="card-text">
            <strong>{email}</strong>로 인증 메일이 전송되었습니다. <br />
            이메일을 확인하고 링크를 클릭하여 가입을 완료하세요.
          </p>
          <a href="/login" className="btn btn-primary">
            로그인 페이지 이동
          </a>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirm;
