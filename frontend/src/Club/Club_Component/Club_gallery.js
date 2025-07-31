import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Club_Style/Club_gallery.css";
import ClubHeader from "./Club_head.js";
import { Button } from "react-bootstrap";
import API_BASE_URL from "../../config/apiConfig.js";

const ClubGallery = () => {
  const { club_name } = useParams();
  const [albums, setAlbums] = useState([]);
  const [displayedAlbums, setDisplayedAlbums] = useState([]);
  const [page, setPage] = useState(1);
  const [searchOption, setSearchOption] = useState("all");
  const [searchText, setSearchText] = useState("");
  const albumsPerPage = 5;

  const navigate = useNavigate();
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/club_information/club/${club_name}/albums/`,
          {
            params: {
              search_type: searchOption,
              search_query: searchText,
            },
          }
        );
        setAlbums(response.data);
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    };

    fetchAlbums();
  }, [club_name, searchOption, searchText]);

  useEffect(() => {
    const startIndex = (page - 1) * albumsPerPage;
    const endIndex = startIndex + albumsPerPage * 3; // 한 페이지에 3줄씩 데이터를 보여줌
    const displayed = albums.slice(startIndex, endIndex);
    setDisplayedAlbums(displayed);
  }, [albums, page]);

  const totalPages = Math.ceil(albums.length / (albumsPerPage * 3));
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleSearchOptionChange = (e) => {
    setSearchOption(e.target.value);
  };

  const handleSearchTextChange = (e) => {
    setSearchText(e.target.value);
  };
  const handleClickCreatePhoto = () => {
    navigate(`/club_information/club/create_album/${club_name}`);
  };
  return (
    <div className="gallery-container">
      <ClubHeader clubName={club_name} />
      <div className="gallery-box">
        <h2 className="club-head-text">사진첩</h2>

        <div className="album-head-container">
          <div className="gallery-search-container">
            <select value={searchOption} onChange={handleSearchOptionChange}>
              <option value="all">전체</option>
              <option value="titleContent">제목/글</option>
              <option value="title">제목</option>
              <option value="content">글</option>
              <option value="author">작성자</option>
            </select>
            <input
              type="text"
              value={searchText}
              onChange={handleSearchTextChange}
              placeholder="검색어를 입력하세요..."
            />
          </div>

          <div className="create-photo-button">
            <Button onClick={() => handleClickCreatePhoto()}>사진 등록</Button>
          </div>
        </div>

        <div className="gallery">
          {displayedAlbums.map((album) => (
            <Link
              to={`/club_board/post_detail/${album.id}/`}
              key={album.id}
              className="gallery-card"
            >
              <img src={album.photo} alt={album.title} />
              <div className="gallery-title">{album.title}</div>
              <div className="gallery-recommend">{`추천수: ${album.recommended_cnt}`}</div>
            </Link>
          ))}
        </div>
        <div className="pagination">
          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={page === pageNumber ? "active" : ""}
            >
              {pageNumber}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClubGallery;
