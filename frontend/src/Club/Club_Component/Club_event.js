import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Club_Style/Club_event.css";
import ClubHeader from "./Club_head.js";
import { Button } from "react-bootstrap";
import API_BASE_URL from "../../config/apiConfig.js";

const ClubEvent = () => {
  const { club_name } = useParams();
  const [events, setEvents] = useState([]);
  const [displayedEvents, setDisplayedEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [searchOption, setSearchOption] = useState("all");
  const [searchText, setSearchText] = useState("");
  const eventsPerPage = 5;

  const navigate = useNavigate();
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/club_information/club/${club_name}/events/`,
          {
            params: {
              search_type: searchOption,
              search_query: searchText,
            },
          }
        );
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [club_name, searchOption, searchText]);

  useEffect(() => {
    const startIndex = (page - 1) * eventsPerPage;
    const endIndex = startIndex + eventsPerPage * 3; // 한 페이지에 3줄씩 데이터를 보여줌
    const displayed = events.slice(startIndex, endIndex);
    setDisplayedEvents(displayed);
  }, [events, page]);

  const totalPages = Math.ceil(events.length / (eventsPerPage * 3));
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
  const handleClickCreateEvent = () => {
    navigate(`/club_information/club/${club_name}/create_club_event`);
  };
  return (
    <div className="club-event-container">
      <div className="club-event-container">
        <ClubHeader clubName={club_name} />
        <div className="club-event-box">
          <h2 className="club-head-text">일정</h2>
          <div className="create-event-container">
            <div className="search-container">
              <select value={searchOption} onChange={handleSearchOptionChange}>
                <option value="all">전체</option>
                <option value="titleContent">제목/내용</option>
                <option value="title">제목</option>
                <option value="content">내용</option>
                <option value="date">날짜</option>
              </select>
              <input
                type="text"
                value={searchText}
                onChange={handleSearchTextChange}
                placeholder="검색어를 입력하세요..."
              />
            </div>
            <div className="create-event-button">
              <Button onClick={() => handleClickCreateEvent()}>
                일정 등록
              </Button>
            </div>
          </div>
          {/* <div className='club-event-container'>
    <ClubHeader clubName={club_name} />
    <div className="club-event-box">
      <h2 className='club-head-text'>일정</h2>
      <div className='create-event-container'>
      <div className="search-container">
        <select value={searchOption} onChange={handleSearchOptionChange}>
          <option value="all">전체</option>
          <option value="titleContent">제목/내용</option>
          <option value="title">제목</option>
          <option value="content">내용</option>
          <option value="date">날짜</option>
        </select>
        <input
          type="text"
          value={searchText}
          onChange={handleSearchTextChange}
          placeholder="검색어를 입력하세요..."
        />
      </div>
      <div className="create-event-button">
        <Button onClick={() => handleClickCreateEvent()}>일정 등록</Button>
      </div>
      </div> */}
          <div className="club-event-list">
            {displayedEvents.map((event) => (
              <Link
                to={`/club_board/post_detail/${event.id}/`}
                key={event.id}
                className="event-link"
              >
                <img src={event.photo} alt={event.title} />
                <div className="gallery-title">{event.title}</div>
                <div className="gallery-recommend">{`추천수: ${event.recommended_cnt}`}</div>
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
    </div>
  );
};

export default ClubEvent;
