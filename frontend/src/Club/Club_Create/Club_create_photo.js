// ClubCreatePost.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ClubHeader from '../Club_Component/Club_head';
import { Button } from 'react-bootstrap';
import '../Club_Style/Club_create_post.css';
import API_BASE_URL from '../../config/apiConfig'; // API 설정 임포트

const ClubCreatePhoto = () => {
  const { club_name } = useParams(); 
  const [club, setClub] = useState(club_name);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
// useParams를 사용하여 club_name을 가져옴
  // club_name을 초기 club 값으로 설정

  useEffect(() => {
  if (location.state && location.state.club_name) {
    setClub(location.state.club_name);
  }
}, [location.state]);

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(selectedImage);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const post = {
      club_name: club,
      category,
      title,
      content,
      // image
    };

    console.log(post);
    const url = `${API_BASE_URL}/club_board/post/`;
    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: `Token ${token}`
      },
      body: JSON.stringify(post)
    };

    fetch(url, options)
      .then(res => {
        if (res.ok) {
          navigate(-1);
          console.log("게시글 작성 완료");
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div>
        <ClubHeader clubName={club} />
    <div className="write-post-container">
      <form className="write-post-form" onSubmit={handleSubmit}>
        
        <div className="form-group">
          <label htmlFor="title">제목:</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div className="form-group">
          <label htmlFor="image" className="image-upload-button">
            사진 업로드
            <input type="file" id="image" onChange={handleImageChange} accept="image/*" />
          </label>
          {imagePreview && <img src={imagePreview} alt="이미지 미리보기" className="image-preview" />}
        </div>

          <div className="form-group">
          <label htmlFor="content">태그</label>
          <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} required />
        </div>
        <div className="button-container">
        <Button type="submit">작성 완료</Button>
        <Button className='Back-button' type="submit">뒤로</Button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default ClubCreatePhoto;