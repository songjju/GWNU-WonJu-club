import React from "react";
import "../Club_Style/Club_background.css";
import { BannerImage, LogoImage } from "../../styles";
import Background from "../../Assets/default_background.png";

const ClubBackground = ({ introduction }) => {
  // Ensure introduction has a fallback if it's undefined or empty
  const safeIntroduction = introduction || "No introduction provided."; // Provide a default introduction text

  return (
    <div className="club-info-container">
      {/* 동아리 로고를 표시합니다. */}
      <div className="club-logo-container">
        {/* <BannerImage src={background} alt="Club bannel" className="club-logo" /> */}
        <BannerImage src={Background} alt="Club bannel" className="club-logo" />
      </div>
      <div className="introduction">{safeIntroduction}</div>
    </div>
  );
};

export default ClubBackground;
