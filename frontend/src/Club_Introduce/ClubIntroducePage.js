/* ClubIntroducePage */
import React, { useState, useEffect } from "react";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LogoImage } from "../styles";
import { Button } from "react-bootstrap";
import club_logo from "../Assets/club_logo.png";
import club_background from "../Assets/image.jpg";
import "./ClubIntroducePage.css";
import API_BASE_URL from "../config/apiConfig"; // API 설정 임포트

// Dropdown 컴포넌트 정의
function Dropdown({ value, onChange, options, label }) {
  return (
    <div className="dropdown">
      {" "}
      {/* dropdown 클래스 추가 */}
      {label && <label>{label}</label>}
      <select value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={option.label} value={option.label}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

const ClubIntroducePage = () => {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedType, setSelectedType] = useState("전체");
  const [clubs, setClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const BASE_URL = `${API_BASE_URL}`;

  // 동아리 목록을 가져오는 함수
  useEffect(() => {
    const debouncedFetchClubs = debounce(async () => {
      setIsLoading(true);
      const categoryPath =
        selectedCategory !== "전체" || selectedType !== "전체"
          ? `/category_club/${selectedCategory}/${selectedType}`
          : "/";
      const url = `${API_BASE_URL}/club_introduce/club_list${categoryPath}`;
      try {
        const response = await axios.get(url);
        setClubs(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching clubs:", error);
        setIsLoading(false);
      }
    }, 300);
    debouncedFetchClubs();
  }, [selectedCategory, selectedType]);

  // 가입 신청 클릭 핸들러
  const handleApplyClick = async (clubName, event) => {
    event.stopPropagation(); // 이벤트 전파를 막습니다.
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/club_introduce/apply_club/`,
        { club_name: clubName },
        { headers: { Authorization: `Token ${token}` } }
      );
      if (response.status === 200) {
        alert("가입 신청이 완료되었습니다.");
      } else {
        alert("가입 신청에 실패하였습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("Error applying for club:", error);
      alert("가입 신청 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handleCategoryChange = (e) => {
    const categoryLabel = e.target.value;
    setSelectedCategory(categoryLabel);
  };

  const handleTypeChange = (e) => {
    const typeLabel = e.target.value;
    setSelectedType(typeLabel);
  };

  const handleClubClick = (clubName) => {
    navigate(`/club_information/club/${clubName}/home`);
  };

  const filteredClubs = clubs.filter((club) => {
    return (
      (selectedCategory === "전체" || club.category === selectedCategory) &&
      (selectedType === "전체" || club.type === selectedType)
    );
  });

  const getAbsolutePath = (relativePath) => {
    return `${BASE_URL}${relativePath}`;
  };

  return (
    <div className="club-introduce-page">
      <div className="club-content-wrapper" style={{ padding: "80px" }}>
        <h1 className="club-introduce-title">동아리 소개</h1>
        <section id="clubIntroducePage" className="club-section">
          <div className="club-filters">
            {" "}
            {/* 필터 섹션 */}
            <Dropdown
              label="카테고리 선택"
              value={selectedCategory}
              onChange={handleCategoryChange}
              options={[
                { label: "전체" },
                { label: "정규동아리" },
                { label: "가등록동아리" },
                { label: "학습동아리" },
                { label: "취업/창업동아리" },
                { label: "소모임" },
              ]}
            />
            <Dropdown
              label="동아리 유형 선택"
              value={selectedType}
              onChange={handleTypeChange}
              options={[
                { label: "전체" },
                { label: "운동/스포츠" },
                { label: "자기계발/학습/독서" },
                { label: "패션/뷰티" },
                { label: "여행/레저" },
                { label: "종교" },
                { label: "기타" },
              ]}
            />
          </div>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="club-introduce-card-container">
              {" "}
              {/* 카드 컨테이너 */}
              {filteredClubs.map((club, index) => (
                <article
                  key={index}
                  className="club-introduce-card"
                  onClick={() => handleClubClick(club.club_name)}
                >
                  {" "}
                  {/* 카드 클래스 및 클릭 이벤트 */}
                  <figure className="club-introduce-card-header">
                    <img
                      src={club_background}
                      className="club-introduce-background"
                      alt="club background"
                    />{" "}
                    {/* 배경 이미지 */}
                  </figure>
                  <div className="club-introduce-card-contents">
                    <p>{club.introducation}</p>
                    <div className="club-info">
                      <LogoImage
                        src={club_logo}
                        className="club-introduce-logo"
                        alt="club logo"
                      />
                      <h3>{club.club_name}</h3>
                    </div>
                  </div>
                  <div className="club-introduce-card-footer">
                    {" "}
                    {/* 카드 푸터 */}
                    <Button
                      className="club-apply-button"
                      onClick={(event) =>
                        handleApplyClick(club.club_name, event)
                      }
                    >
                      가입 신청
                    </Button>{" "}
                    {/* 가입 신청 버튼 */}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ClubIntroducePage;
