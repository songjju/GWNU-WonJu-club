import React, { useState,useEffect } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import '../free_posts_Style/WritePost.css'; 
import API_BASE_URL from '../../../config/apiConfig'; 

const WritePost = () => {
  const [club,setClub] = useState('');
  const [category, setCategory] = useState("일반");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const location = useLocation();	
  
  useEffect(() => {
   setClub(location.state.club_name);
  }, []);

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);

    // 이미지 미리보기 로직
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(selectedImage);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const club_name = club;
    const post = {
      club_name,
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

    fetch(url,options)
      .then(res => {
        if (res.ok){ navigate(-1); console.log("게시글 작성 완료");}
      })
      .catch(err => {console.log(err)});
  };

  return (
        <div className="write-post-container">
        <h1 className="title">게시글 작성</h1>
        <form className="write-post-form" onSubmit={handleSubmit} style={{ padding: '80px' }}>
          <div className="write-form-group">
          <label htmlFor="title">글 유형</label>
            <select
              id="notice-option"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-group select"
            >
              <option value={"일반"}>일반</option>
              <option value={"공지사항"}>공지사항</option>
            </select>
          </div>
  
          <div className="write-form-group">
            <label htmlFor="title">제목</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="form-group input"
            />
          </div>
  
          <div className="write-form-group">
            <label htmlFor="content">내용</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="form-group textarea"
            />
          </div>
  
          <div className="write-form-group">
            <label htmlFor="image" className="image-upload-button">
              사진 업로드
              <input
                type="file"
                id="image"
                onChange={handleImageChange}
                accept="image/*"
                className="form-group input"
              />
            </label>
            {imagePreview && <img src={imagePreview} alt="이미지 미리보기" className="image-preview" />}
          </div>
  
          <button type="submit" className="submit-button">작성 완료</button>


        {/* {postId && (
          <div>
            postId가 있을 경우 수정 및 삭제 버튼 표시
            <button onClick={() => onEdit(postId)}>수정</button>
            <button onClick={() => onDelete(postId)}>삭제</button>
          </div>
        )} */}
      </form>
    </div>
  );
};

export default WritePost;
