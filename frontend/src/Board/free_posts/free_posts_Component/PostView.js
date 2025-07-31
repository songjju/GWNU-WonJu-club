import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostByNo, increaseRecommendCount, deletePost } from "./Data";
import Comment from "./Comment.js";
import "../free_posts_Style/PostView.css";

const PostView = () => {
  // 게시글 데이터 상태
  const [data, setData] = useState([]);
  // URL 파라미터 가져오기
  const params = useParams();
  // 페이지 이동 함수
  const navigate = useNavigate();
  const postId = params.postId;
  const token = localStorage.getItem("token");
  const [recommendCount, setRecommendCount] = useState(0);

  // 게시글 데이터 불러오기
  useEffect(() => {
    if (postId) {
      // postId 값이 존재하는 경우에만 데이터를 불러옴
      const fetchData = async () => {
        const postData = await getPostByNo(params.postId, token);
        setData(postData);
        setRecommendCount(postData.recommended_cnt);
      };
      fetchData();
    }
  }, [postId]);

  // 뒤로 가기 함수
  const goBack = () => {
    navigate(-1);
  };

  // 게시글 수정하기
  const handlePostChange = () => {
    const mode = "edit";
    const existingPost = data;
    navigate("edit", { state: { mode, existingPost } });
  };

  // 추천하기 함수
  const handleRecommend = () => {
    increaseRecommendCount(parseInt(postId), token);
    setRecommendCount(recommendCount + 1);
  };

  // 게시글 삭제 함수
  const handleDeletePost = () => {
    const isConfirmed = window.confirm("정말로 이 게시글을 삭제하시겠습니까?");

    if (isConfirmed) {
      deletePost(postId, token);
      navigate(-1);
    }
  };

  return (
    <div className="post-view-container">
      {/* 게시글 데이터가 있을 때 */}
      {data ? (
        <>
          {/* 게시글 헤더 */}
          <div className="post-view-header">
            <h2 className="post-view-title">{data.title}</h2>
            <div className="post-view-info">
              <span className="post-view-author">
                작성자: {data.author_name}
              </span>
              <span className="post-view-date">
                작성일:{" "}
                {new Date(data.created_date).toLocaleDateString("ko-KR")}
              </span>
            </div>
          </div>

          {/* 게시글 내용 및 이미지 */}
          <div className="post-view-content">
            {data.content}
            {data.imageUrl && (
              <img
                src={data.imageUrl}
                alt="게시물 이미지"
                className="post-view-image"
              />
            )}
          </div>

          {/* 게시글 액션 버튼 */}
          <div className="post-view-actions">
            <button
              className="post-view-recommend-button"
              onClick={handleRecommend}
            >
              추천하기 ({recommendCount})
            </button>
            <div className="post-view-buttons">
              <button
                className="post-view-edit-button"
                onClick={handlePostChange}
              >
                수정
              </button>
              <button
                className="post-view-delete-button"
                onClick={handleDeletePost}
              >
                삭제
              </button>
            </div>
          </div>

          <Comment post_id={postId} token={token} />
        </>
      ) : (
        // 게시글 데이터가 없을 때
        <p>게시물을 불러오는 중입니다.</p>
      )}

      {/* 뒤로 가기 버튼 */}
      <button className="post-view-back-button" onClick={goBack}>
        목록으로 돌아가기
      </button>
    </div>
  );
};

export default PostView;
