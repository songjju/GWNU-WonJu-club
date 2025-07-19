import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // Axios를 import합니다.
// import {ProfileImage} from './StyledComponents';
import { ProfileImage } from '../../styles';
import '../Club_Style/Club_members.css'; // CSS 파일을 import합니다.
import ClubHeader from './Club_head'; // ClubHeader 컴포넌트를 import합니다.
import ProfileCard from '../Club_Card/club_profile_card'; // ClubHeader 
import API_BASE_URL from '../../config/apiConfig';

const ClubMembers = () => {
  const { club_name } = useParams();
  const [members, setMembers] = useState([]); // 회원 정보를 저장할 상태

  useEffect(() => {
    // 클럽 이름을 이용하여 API를 호출하고 회원 정보를 가져옵니다.
    console.log(club_name);
    const fetchMembers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/club_information/club/${club_name}/members`);
        setMembers(response.data); // 가져온 회원 정보를 상태에 설정합니다.
      } catch (error) {
        console.error('Error fetching club members:', error);
      }
    };

    fetchMembers(); // useEffect가 처음 렌더링될 때 한 번 실행됩니다.
  }, [club_name]); // clubName이 변경될 때마다 API를 호출하도록 설정합니다.

  return (
    <div className="member-info-container">
      <ClubHeader clubName={club_name} />
      <div className='member-box'>
      <h2 className='club-head-text'>회원정보</h2>
      {members.length === 0 ? (
        <p>회원 정보가 없습니다.</p>
      ) : (
        <div className="club-profile-list">
          {members.map((member) => (
            <ProfileCard
              key={member.id}
              name={member.user}
              memberLevel={member.job}
            />
          ))}
        </div>
        
      )}
      </div>
    </div>
  );
}

export default ClubMembers;
