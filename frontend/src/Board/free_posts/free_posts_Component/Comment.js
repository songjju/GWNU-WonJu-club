import React, { useState, useEffect } from "react";
import { handleComment, createComment } from "./Data";
import API_BASE_URL from "../../../config/apiConfig"; // API 설정 임포트
import "../free_posts_Style/Comment.css";

const Comment = ({ post_id, token }) => {
  const [comments, setComments] = useState([]); // 댓글 목록 상태
  const [count, setCount] = useState(null); // 댓글 개수
  const [comment, setComment] = useState(""); // 댓글 생성 입력 상태

  // 댓글 수정 관련 state
  const [editMode, setEditMode] = useState(false);
  const [editedComment, setEditedComment] = useState("");
  const [editedCommentId, setEditedCommentId] = useState(null);

  useEffect(() => {
    getCommentsData();
  }, []);

  // 댓글 관련 함수
  const handleEdit = (id, comment) => {
    setEditedCommentId(id);
    setEditedComment(comment);
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  const handleChange = (e) => {
    setEditedComment(e.target.value);
  };

  // 댓글 수정 함수
  const editComment = (id) => {
    const isConfirmed = window.confirm("댓글을 수정 하시겠습니까?");
    if (isConfirmed) {
      console.log(id, editedComment);
      handleComment("PATCH", id, token, editedComment);
      setEditMode(false);
      window.location.reload();
    }
  };

  // 댓글 삭제 함수
  const deleteComment = (id) => {
    const isConfirmed = window.confirm("정말로 댓글을 삭제하시겠습니까?");
    if (isConfirmed) {
      handleComment("DELETE", id, token);
      window.location.reload();
    }
  };

  // 댓글 추가 함수
  //   const addComment = () => {
  //     let newComment = createComment(post_id,comment,token);
  //     console.log("새로운 댓글",newComment);
  //     setComments([...comments, newComment]);  // 기존 댓글 리스트에 새로운 댓글 추가
  //     setComment('');
  //     setCount(count+1);
  //   };
  const addComment = async () => {
    try {
      const newComment = await createComment(post_id, comment, token);
      console.log("새로운 댓글", newComment);
      setComments([...comments, newComment]);
      setComment("");
      setCount(count + 1);
    } catch (error) {
      console.error("댓글 추가 오류:", error);
    }
  };

  // 특정 게시글에 대한 모든 댓글 가져오기
  const getCommentsData = () => {
    // TODO post_id,token 받기
    const url = `${API_BASE_URL}/club_board/comment_list/${post_id}`;
    const options = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: `Token ${token}`,
      },
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setCount(data.count);
          // console.log(data.results);
          setComments(data.results);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="post-view-comments">
      <h3>댓글 ({count})</h3>

      <ul className="post-view-comments-list">
        {comments.map((comment) => (
          <li key={comment.id} className="post-view-comment">
            <div className="content-comment-user-info">
              {editMode && editedCommentId === comment.id ? (
                <textarea value={editedComment} onChange={handleChange} />
              ) : (
                <div>{comment.content}</div>
              )}
            </div>
            <div className="content-ect">
              <span className="author-name">작성자: {comment.author_name}</span>
              <span>
                {new Date(comment.created_date).toLocaleTimeString("en-US", {
                  hour12: false,
                })}
              </span>
              {editMode && editedCommentId === comment.id ? (
                <>
                  <button onClick={() => editComment(comment.id)}>저장</button>
                  <button onClick={handleCancelEdit}>취소</button>
                </>
              ) : (
                <button onClick={() => handleEdit(comment.id, comment.content)}>
                  수정
                </button>
              )}
              <button onClick={() => deleteComment(comment.id)}>삭제</button>
            </div>
          </li>
        ))}
      </ul>

      {/* 댓글 추가 입력창 */}
      <div className="post-view-add-comment">
        <input
          type="text"
          placeholder="댓글을 입력하세요"
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
          }}
          className="post-view-comment-input"
        />

        <button className="post-view-add-comment-button" onClick={addComment}>
          댓글 작성
        </button>
      </div>
    </div>
  );
};

export default Comment;
