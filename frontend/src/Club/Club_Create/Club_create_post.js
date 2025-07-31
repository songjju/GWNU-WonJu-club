// ClubCreatePost.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ClubHeader from "../Club_Component/Club_head";
import { Button } from "react-bootstrap";
import API_BASE_URL from "../../config/apiConfig"; // API 설정 임포트

const ClubCreatePost = () => {
  const [club, setClub] = useState("");
  const [category, setCategory] = useState("일반");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();

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
  const queryParams = new URLSearchParams(location.search);
  const clubName = queryParams.get("clubName");
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
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(post),
    };

    fetch(url, options)
      .then((res) => {
        if (res.ok) {
          navigate(-1);
          console.log("게시글 작성 완료");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <ClubHeader clubName={clubName} />
      <div className="write-post-container">
        <form className="write-post-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="notice-option">글 유형:</label>
            <select
              id="notice-option"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value={"일반"}>일반</option>
              <option value={"공지사항"}>공지사항</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="title">제목:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">내용:</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image" className="image-upload-button">
              사진 업로드
              <input
                type="file"
                id="image"
                onChange={handleImageChange}
                accept="image/*"
              />
            </label>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="이미지 미리보기"
                className="image-preview"
              />
            )}
          </div>
          <div className="button-container">
            <Button type="submit">작성 완료</Button>
            <Button className="Back-button" type="submit">
              뒤로
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClubCreatePost;
