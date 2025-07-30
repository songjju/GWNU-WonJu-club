import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Event_Style/EventList.module.css';
import { Table, Button, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import API_BASE_URL from '../../config/apiConfig';

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
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button className="page-link custom-page-link" onClick={() => handlePageChange(currentPage - 1)}>
            &lt;
          </button>
        </li>
        {[...Array(totalPages)].map((_, index) => (
          <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
            <button className="page-link custom-page-link" onClick={() => handlePageChange(index + 1)}>
              {index + 1}
            </button>
          </li>
        ))}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button className="page-link custom-page-link" onClick={() => handlePageChange(currentPage + 1)}>
            &gt;
          </button>
        </li>
      </ul>
    </nav>
  );
};

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;
  const isClubOfficer = localStorage.getItem('isClubOfficer') === 'true';

  useEffect(() => {
    fetchEvents();
  }, [currentPage, searchTerm, sortOrder, selectedTag]);

  const fetchEvents = () => {
    setIsLoading(true);
    fetch(`${API_BASE_URL}/club_board/event/?page=${currentPage}&search=${searchTerm}&ordering=${sortOrder}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setEvents(data.results || []);
        setTotalPages(Math.ceil(data.count / 10));
        setIsLoading(false);
        setTags(data.tags || []);
      })
      .catch((error) => {
        console.error('Error: Network error');
        setEvents([]);
        setIsLoading(false);
        setTags([]);
      });
  };

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const toggleLoginModal = () => setIsLoginModalOpen((prevState) => !prevState);
  const toggleWarningModal = () => setIsWarningModalOpen((prevState) => !prevState);

  const handleWriteButtonClick = () => {
    if (!isLoggedIn) {
      toggleLoginModal();
    } else if (!isClubOfficer) {
      toggleWarningModal();
    } else {
      navigate('/create-event');
    }
  };

  const handleSortOrderChange = (order) => {
    setSortOrder(order);
    fetchEvents();
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setSearchPerformed(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="event-notice-container" style={{ padding: '80px' }}>
      <h1 className="title">이벤트</h1>
      <div className="top d-flex justify-content-end align-items-center">
        <div className="search-bar d-flex align-items-center">
          <Input
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchInput}
            onChange={handleSearchInputChange}
            onKeyPress={handleKeyPress}
            className="search-input"
            data-testid="input"
          />
          <Button color="secondary" className="search-button" onClick={handleSearch} data-testid="search-button">
            <FontAwesomeIcon icon={faSearch} data-testid="fontawesome-icon" />
          </Button>
          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} className="sort-dropdown" data-testid="dropdown">
            <DropdownToggle caret className="dropdown" data-testid="dropdown-toggle">
              정렬
            </DropdownToggle>
            <DropdownMenu data-testid="dropdown-menu">
              <DropdownItem onClick={() => setSelectedTag('')} data-testid="dropdown-item">전체</DropdownItem>
              <DropdownItem onClick={() => handleSortOrderChange('desc')} data-testid="dropdown-item">최신순</DropdownItem>
              <DropdownItem onClick={() => handleSortOrderChange('asc')} data-testid="dropdown-item">오래된 순</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {isLoading ? (
        <div className="d-flex justify-content-center">Loading...</div>
      ) : (
        <div className="table-container">
          <Table className="event-table" data-testid="table">
            <thead>
              <tr>
                <th>No</th>
                <th>제목</th>
                <th>작성자</th>
                <th>기간</th>
                <th>작성일</th>
                <th>조회수</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 && searchPerformed ? (
                <tr>
                  <td colSpan="6" className="text-center">검색 결과가 없습니다.</td>
                </tr>
              ) : (
                events.length === 0 ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td colSpan="5" className="text-center">이벤트가 없습니다.</td>
                    </tr>
                  ))
                ) : (
                  events.map((event, index) => (
                    <tr key={event.specific_id}>
                      <td>{index + 1}</td>
                      <td>
                        <a href={event.link} target="_blank" rel="noreferrer">
                          {event.title}
                        </a>
                      </td>
                      <td>{event.author}</td>
                      <td>{event.created_date}</td>
                      <td>{event.views}</td>
                    </tr>
                  ))
                )
              )}
            </tbody>
          </Table>
          <Button color="primary" onClick={handleWriteButtonClick} className="btn write-btn" data-testid="write-button">작성</Button>
        </div>
      )}

      <div className="pagination-container">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      <Modal isOpen={isLoginModalOpen} toggle={toggleLoginModal} data-testid="modal">
        <ModalHeader toggle={toggleLoginModal}>로그인 필요</ModalHeader>
        <ModalBody>임원만 작성할 수 있습니다. 로그인하시겠습니까?</ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => window.location.href = '/login'}>로그인</Button>{' '}
          <Button color="secondary" onClick={toggleLoginModal}>취소</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={isWarningModalOpen} toggle={toggleWarningModal} data-testid="modal">
        <ModalHeader toggle={toggleWarningModal}>권한 없음</ModalHeader>
        <ModalBody>임원만 작성할 수 있습니다.</ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleWarningModal}>확인</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default EventList;