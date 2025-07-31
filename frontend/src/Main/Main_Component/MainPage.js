import React, { useEffect, useState } from "react";
import BannerCarousel from "./BannerCarousel";
import ClubNotice from "./ClubNotice";
import ClubAnalytics from "./ClubAnalytics";
import "../Main_Style/MainPage.css";
import "../Main_Style/Responsive.css";
import API_BASE_URL from "../../config/apiConfig";

function MainPage() {
  const [categoryData, setCategoryData] = useState([]);
  const [typeData, setTypeData] = useState([]);

  useEffect(() => {
    // Fetch category data
    fetch(`${API_BASE_URL}/club_introduce/count_club_category/`)
      .then((response) => response.json())
      .then((data) => setCategoryData(data.results))
      .catch((error) => console.error("Error fetching category data:", error));

    // Fetch type data
    fetch(`${API_BASE_URL}/club_introduce/count_club_type/`)
      .then((response) => response.json())
      .then((data) => setTypeData(data.results))
      .catch((error) => console.error("Error fetching type data:", error));
  }, []);

  useEffect(() => {
    const handleScroll = (event) => {
      if (window.innerWidth <= 768) return; // 모바일에서는 기본 스크롤 사용

      const delta = Math.sign(event.deltaY);
      const scrollHeight = window.innerHeight;
      const currentSection = Math.round(window.scrollY / scrollHeight);
      const nextSection = Math.min(
        Math.max(currentSection + delta, 0),
        document.querySelectorAll(".section").length - 1
      );

      window.scrollTo({
        top: nextSection * scrollHeight,
        behavior: "smooth",
      });

      event.preventDefault();
    };

    window.addEventListener("wheel", handleScroll, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, []);

  return (
    <div className="MainPage">
      <div className="section section1">
        <BannerCarousel />
      </div>
      <div className="section section2">
        <ClubNotice />
      </div>
      <div className="section section3">
        <div className="analytics-container">
          <ClubAnalytics data={categoryData} title="동아리 카테고리별 비율" />
          <ClubAnalytics data={typeData} title="동아리 분야별 비율" />
        </div>
      </div>
    </div>
  );
}

export default MainPage;
