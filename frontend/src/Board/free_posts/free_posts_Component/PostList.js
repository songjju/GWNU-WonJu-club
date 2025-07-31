import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../free_posts_Style/PostList.css";
import {
  Table,
  Button,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import API_BASE_URL from "../../../config/apiConfig"; // API 설정 임포트

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="pagination-nav">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link custom-page-link"
            onClick={() => handlePageChange(currentPage - 1)}
          >
            &lt;
          </button>
        </li>
        {[...Array(totalPages)].map((_, index) => (
          <li
            key={index + 1}
            className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
          >
            <button
              className="page-link custom-page-link"
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          </li>
        ))}
        <li
          className={`page-item ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          <button
            className="page-link custom-page-link"
            onClick={() => handlePageChange(currentPage + 1)}
          >
            &gt;
          </button>
        </li>
      </ul>
    </nav>
  );
};

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sortOrder, setSortOrder] = useState("created_date");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchPosts = (page, search, sort) => {
    setIsLoading(true);
    fetch(
      `${API_BASE_URL}/club_board/board_posts/FreeBoard/일반/${sort}/?page=${page}&search=${search}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setPosts(data.results);
        setTotalPages(Math.ceil(data.count / 10));
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setPosts([]);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchPosts(currentPage, searchTerm, sortOrder);
  }, [currentPage, searchTerm, sortOrder]);

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const handleSortOrderChange = (order) => {
    setSortOrder(order);
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = () => {
    setSearchTerm(searchInput);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handlePostClick = (postId) => {
    navigate(`/club_board/postView/${postId}`);
  };

  const handleWriteButtonClick = () => {
    navigate("write", { state: { club_name: "FreeBoard" } });
  };

  return (
    <div className="post-notice-container" style={{ padding: "80px" }}>
      <h3 className="title">자유 게시판</h3>
      <div className="top d-flex justify-content-end align-items-center">
        <div className="search-bar d-flex align-items-center">
          <Input
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchInput}
            onChange={handleSearchInputChange}
            onKeyPress={handleKeyPress}
            className="search-input"
          />
          <Button
            color="secondary"
            className="search-button"
            onClick={handleSearch}
          >
            <FontAwesomeIcon icon={faSearch} />
          </Button>
          <Dropdown
            isOpen={dropdownOpen}
            toggle={toggleDropdown}
            className="sort-dropdown"
          >
            <DropdownToggle caret className="dropdown">
              정렬
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={() => setSelectedTag("")}>
                전체
              </DropdownItem>
              <DropdownItem
                onClick={() => handleSortOrderChange("created_date")}
              >
                최신순
              </DropdownItem>
              <DropdownItem
                onClick={() => handleSortOrderChange("most_viewed")}
              >
                조회순
              </DropdownItem>
              <DropdownItem
                onClick={() => handleSortOrderChange("most_recommended")}
              >
                추천순
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {isLoading ? (
        <div className="d-flex justify-content-center">Loading...</div>
      ) : (
        <div className="table-container">
          <Table className="table table-hover table-centered">
            <thead>
              <tr>
                <th>No</th>
                <th>제목</th>
                <th>작성자</th>
                <th>작성일</th>
                <th>조회수</th>
                <th>추천수</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0
                ? Array.from({ length: 6 }).map((_, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td colSpan="5" className="text-center">
                        게시글이 없습니다.
                      </td>
                    </tr>
                  ))
                : posts.map((post, index) => (
                    <tr key={post.id} onClick={() => handlePostClick(post.id)}>
                      <td>{index + 1}</td>
                      <td>{post.title}</td>
                      <td>{post.author_name}</td>
                      <td>
                        {new Date(post.created_date).toLocaleDateString(
                          "ko-KR"
                        )}
                      </td>
                      <td>{post.view_cnt}</td>
                      <td>{post.recommended_cnt}</td>
                    </tr>
                  ))}
            </tbody>
          </Table>
          <Button
            color="primary"
            onClick={handleWriteButtonClick}
            className="btn write-btn"
          >
            글쓰기
          </Button>
        </div>
      )}

      <div className="pagination-container">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default PostList;
