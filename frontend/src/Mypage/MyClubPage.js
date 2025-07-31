import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/apiConfig";

const MyClubPage = ({ myClubList }) => {
  const [ClubList, setMyClubList] = useState(myClubList);
  const navigate = useNavigate();

  const handleDropClub = async (id, job) => {
    try {
      await fetch(`${API_BASE_URL}/club_introduce/drop_club/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Token ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ job }),
      }).then((response) => {
        if (response.ok) {
          console.log("response.오케이");

          // 삭제된 동아리를 제외한 나의 동아리 목록을 다시 불러옴
          const updatedClubList = ClubList.filter((club) => club.id !== id);
          setMyClubList(updatedClubList);
          return alert("동아리 탈퇴가 완료되었습니다.");
          // return response.json();
        }
        throw new Error("동아리 회장 권한을 위임해야 탈퇴할 수 있습니다.");
      });
      // Remove the club from the clubData state
    } catch (error) {
      console.log("catch 에러");
      alert(error.message);
    }
  };

  const handleGoToClub = (club_name) => {
    console.log(club_name);
    navigate(`/club_information/club/${club_name}/home`);
  };

  return (
    <div className="myclub-container">
      <div className="row">
        {myClubList.map((club) => (
          <div key={club.member_id} className="col-md-4 mb-4">
            <div className="myclub-card">
              <div className="myclub-card-body">
                <h4 className="myclub-card-title">
                  동아리명: {club.club_name}
                </h4>
                <p className="myclub-card-text">직책: {club.job}</p>
                <button
                  className="btn btn-primary"
                  onClick={() => handleGoToClub(club.club_name)}
                >
                  바로가기
                </button>
                <button
                  className="btn btn-secondary ms-2"
                  onClick={() => handleDropClub(club.member_id, club.job)}
                >
                  탈퇴하기
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default MyClubPage;
