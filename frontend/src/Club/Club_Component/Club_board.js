import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Typography,
} from "@mui/material";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import ClubHeader from "./Club_head";
import "../Club_Style/Club_board.css";
import API_BASE_URL from "../../config/apiConfig"; // API 설정 임포트

const ClubPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("all");
  const [order, setOrder] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const clubName = queryParams.get("clubName");

  const handlePageChange = (page) => {
    console.log(page, totalPages);
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    let url = `${API_BASE_URL}/club_board/board_posts/${clubName}/${category}/${order}/?page=${currentPage}`;
    let options = {
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
        console.log(data);
        console.log(data.results.length);
        setPosts(data.results);
        setTotalPages(Math.ceil(data.count / 10)); // 10개씩 페이지네이션
      })
      .catch((err) => {
        console.log(err);
      });
  }, [clubName, category, order, currentPage]); //pageSize

  //   fetchPosts();
  // }, [category, order]);

  // if (loading) return <Typography>로딩 중...</Typography>;
  // if (error) return <Typography>오류 발생: {error.message}</Typography>;
  const handleClick = () => {
    navigate(`/club_board/club_posts/create-club-post?clubName=${clubName}`);
  };

  return (
    <div className="board-container">
      <ClubHeader clubName={clubName} />
      <div className="board-box">
        <h3 className="club-head-text">{clubName} 게시판</h3>
        <Typography variant="h4"></Typography>
        {/* 카테고리 선택 */}
        <div className="clubpost-button-container">
          <Button
            onClick={() => setCategory("all")}
            variant={category === "all" ? "contained" : "outlined"}
          >
            전체
          </Button>
          <Button
            onClick={() => setCategory("notice")}
            variant={category === "notice" ? "contained" : "outlined"}
          >
            공지
          </Button>
          <Button
            onClick={() => setCategory("board")}
            variant={category === "board" ? "contained" : "outlined"}
          >
            게시판
          </Button>
          {/* 정렬 선택 */}
          <Button
            onClick={() => setOrder("latest")}
            variant={order === "latest" ? "contained" : "outlined"}
          >
            작성순
          </Button>
          <Button
            onClick={() => setOrder("views")}
            variant={order === "views" ? "contained" : "outlined"}
          >
            조회순
          </Button>
          <Button
            onClick={() => setOrder("comments")}
            variant={order === "comments" ? "contained" : "outlined"}
          >
            댓글순
          </Button>
          <div className="create-post-button">
            <Button onClick={() => handleClick()}>글쓰기</Button>
          </div>
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>번호</TableCell>
              <TableCell>작성일</TableCell>
              <TableCell>제목</TableCell>
              <TableCell>작성자</TableCell>
              <TableCell>조회수</TableCell>
              <TableCell>추천수</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map((post) => (
              <TableRow
                key={post.id}
                onClick={() => navigate(`/club_board/post_detail/${post.id}/`)}
                style={{ cursor: "pointer" }}
              >
                <TableCell>{post.id}</TableCell>
                <TableCell>
                  {new Date(post.created_date).toLocaleDateString()}
                </TableCell>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.author}</TableCell>
                <TableCell>{post.view_cnt}</TableCell>
                <TableCell>{post.recommended_cnt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                className={`pagination-button ${
                  currentPage === page ? "active" : ""
                }`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubPosts;
