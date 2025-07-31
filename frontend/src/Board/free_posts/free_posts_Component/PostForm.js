import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API_BASE_URL from "../../../config/apiConfig";

const PostForm = () => {
  const location = useLocation();
  const { mode, existingPost } = location.state;
  const [category, setCategory] = useState(
    existingPost ? existingPost.category : "일반"
  );
  const [title, setTitle] = useState(existingPost ? existingPost.title : "");
  const [content, setContent] = useState(
    existingPost ? existingPost.content : ""
  );
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    existingPost ? existingPost.image : null
  );
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("PostForm 시작 ");
    console.log("existpost: ", existingPost);
    if (existingPost) {
      // 이미지 미리보기 로직 추가
    }
  }, [existingPost]);

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
      category,
      title,
      content,
      // image: 추가 로직 필요
    };

    const url =
      mode === "edit"
        ? `${API_BASE_URL}/club_board/post_detail/${existingPost.id}/`
        : "${API_BASE_URL}/club_board/post/";
    const method = mode === "edit" ? "PATCH" : "POST";

    const options = {
      method: method,
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
          console.log("작성 완료");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
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

        <button type="submit">
          {mode === "edit" ? "수정 완료" : "작성 완료"}
        </button>
      </form>
    </div>
  );
};

export default PostForm;
