import { Route, Routes, NavLink, Link, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Mypage_Style/Mypage.css';
import MypageHome from './MypageHome.js';
import Editinformation from './EditInformation.js';
import PasswordChangeForm from './ChangePassword.js';
import MyClubPage from './MyClubPage.js';
import API_BASE_URL from '../config/apiConfig'; // API 설정 임포트

const MyPage = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userData, setUserData] = useState(null);
  const [myClubList, setMyClubList] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      getUserDetails();
      fetchMyClubList();
    }
  }, [token]);

  const getUserDetails = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/club_account/user/`, {
        headers: {
          Authorization: `Token ${token}`
        }
      });
      const data = response.data;
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyClubList = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/club_introduce/myclub_list/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setMyClubList(data.results);
    } catch (error) {
      console.error('Error fetching my club list:', error);
    }
  };

  return (
    <div className="my-page" style={{ padding: '80px' }}>
    <h1 className="title">마이페이지</h1>
      <div className="my-category-container" style={{ padding: '30px' }}>
        <div className="category_btn">
          <NavLink exact to="/" className={({ isActive }) => isActive ? 'my-category-item active-link' : 'my-category-item'}>
            홈
          </NavLink>
          <NavLink to="/mypage/edit-information" className={({ isActive }) => isActive ? 'my-category-item active-link' : 'my-category-item'}>
            회원정보 수정
          </NavLink>
          <NavLink to="/mypage/password-change" className={({ isActive }) => isActive ? 'my-category-item active-link' : 'my-category-item'}>
            패스워드 변경
          </NavLink>
          <NavLink to="/mypage/my-club" className={({ isActive }) => isActive ? 'my-category-item active-link' : 'my-category-item'}>
            내 동아리 관리
          </NavLink>
        </div>
      </div>
      <div className="userData_table" style={{ padding: '40px' }}>
      <MypageHome userData={userData} myClubList={myClubList} />
      </div>
      <div>
        <Routes>
          <Route path="edit-information" element={<Editinformation />} />
          <Route path="password-change" element={<PasswordChangeForm />} />
          <Route path="my-club" element={<MyClubPage myClubList={myClubList} />} />
        </Routes>
      </div>
    </div>
  );
};

export default MyPage;
