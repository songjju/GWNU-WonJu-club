import React from "react";
import "../Club_Style/Club_head.css";
import ClubBackground from "./Club_background";
import { useNavigate, NavLink } from "react-router-dom"; // useHistory를 react-router-dom에서 불러옵니다.
import { useState } from "react";
// import {LogoImage } from './StyledComponents';
import { LogoImage } from "../../styles.js"; // 스타일을 위한 CSS 파일
import logo from "../../Assets/club_logo.png"; // 동아리 로고 이미지

const ClubHeader = ({ clubName }) => {
  const navigate = useNavigate();

  // if (!clubData || !clubData.club_data) {
  //   return <div>클럽 정보를 로딩 중...</div>;
  // }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleClick = (section) => {
    if (section === "members") {
      navigate(`/club_information/club/${clubName}/members/`);
    } else if (section === "album") {
      navigate(`/club_information/club/${clubName}/albums/`);
    } else if (section === "posts") {
      navigate(`/club_board/club_posts/?clubName=${clubName}`);
    } else if (section === "event") {
      navigate(`/club_information/club/${clubName}/events/`);
    } else if (section === "manage") {
      navigate(`/club_management/club/${clubName}`);
    } else if (section === "home") {
      navigate(`/club_information/club/${clubName}/home/`);
    }
  };

  const buttonStyle = {
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    padding: "0",
    margin: "0",
  };

  return (
    // 관호
    <div className="club-header">
      <LogoImage
        src={logo}
        alt="Logo"
        style={{ width: "70px", height: "70px" }}
        onClick={() => handleClick("home")}
      />
      <h1>{clubName}</h1>
      <nav className="club-header-nav">
        <ul>
          <li onClick={() => handleClick("members")}>회원정보</li>
          <li onClick={() => handleClick("posts")}>게시판</li>
          <li onClick={() => handleClick("album")}>사진첩</li>
          <li onClick={() => handleClick("event")}>일정</li>
          <li className="manage" onClick={() => handleClick("manage")}>
            동아리관리
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default ClubHeader;
