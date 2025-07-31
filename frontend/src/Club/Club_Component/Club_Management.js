import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ClubManagementPage = ({ clubName }) => {
  const navigate = useNavigate();
  const [clubInfo, setClubInfo] = useState({});
  const [pendingMembers, setPendingMembers] = useState([]);
  const [newLogo, setNewLogo] = useState("");
  const [newBackground, setNewBackground] = useState("");
  const [newDescription, setNewDescription] = useState("");

  useEffect(() => {
    axios
      .get(`/club_management/club/${clubName}/`)
      .then((response) => {
        setClubInfo(response.data);
        setPendingMembers(response.data.pendingMembers);
        setNewDescription(response.data.description);
      })
      .catch((error) => {
        console.error("Error fetching club management data:", error);
        // UI에 에러 메시지 표시 추가
      });
  }, [clubName]);

  const handleBack = () => {
    navigate(-1);
  };

  const approveMember = (memberId) => {
    axios
      .post(`/club_management/club/${clubName}/member/${memberId}/`, {
        memberId,
      })
      .then(() => {
        setPendingMembers((prevMembers) =>
          prevMembers.filter((member) => member.id !== memberId)
        );
        alert("회원 승인이 완료되었습니다.");
      })
      .catch((error) => {
        console.error("Error approving member:", error);
        alert("회원 승인에 실패했습니다.");
      });
  };

  const updateClubInfo = (e) => {
    e.preventDefault();
    axios
      .post(`/club_management/club/${clubName}/update_info`, {
        logo: newLogo,
        background: newBackground,
        description: newDescription,
      })
      .then(() => {
        alert("동아리 정보가 업데이트 되었습니다.");
      })
      .catch((error) => {
        console.error("Error updating club info:", error);
        alert("동아리 정보 업데이트에 실패했습니다.");
      });
  };

  return (
    <div>
      <ClubHeader clubName={`${clubName} / 동아리 관리`} showCategory={false} />
      <button onClick={handleBack}>뒤로가기</button>
      <ClubMembers members={clubInfo.members} />
      <h2>신규 회원 대기</h2>
      <ul>
        {pendingMembers.map((member) => (
          <li key={member.id}>
            {member.name}
            <button onClick={() => approveMember(member.id)}>승인</button>
          </li>
        ))}
      </ul>
      <h2>동아리 로�� 및 배경 수정</h2>
      <form onSubmit={updateClubInfo}>
        <label>
          로고:
          <input
            type="text"
            value={newLogo}
            onChange={(e) => setNewLogo(e.target.value)}
          />
        </label>
        <label>
          배경:
          <input
            type="text"
            value={newBackground}
            onChange={(e) => setNewBackground(e.target.value)}
          />
        </label>
        <label>
          설명:
          <input
            type="text"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
        </label>
        <button type="submit">업데이트</button>
      </form>
    </div>
  );
};

export default ClubManagementPage;
