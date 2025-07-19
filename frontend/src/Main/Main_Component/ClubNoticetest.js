import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Main_Style/ClubNotice.module.css';
import { Table, Button, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config/apiConfig';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) {
    return null; // 한페이지는 페이지번호 안보임
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

const ClubNotice = () => {
  const [notices, setNotices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;
  const isClubOfficer = localStorage.getItem('isClubOfficer') === 'true';

  const fetchNotices = (page, search, sort, tag) => {
    setIsLoading(true);
    fetch(`${API_BASE_URL}/club_board/notice/?page=${page}&search=${search}&ordering=${sort}&tag=${tag}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setNotices(data.results);
        setTotalPages(Math.ceil(data.count / 5)); // 5개씩 페이지네이션
        setIsLoading(false);
        adjustPadding(); // 데이터를 가져온 후 패딩 조정
      })
      .catch((error) => {
        console.error(error);
        setNotices([]);
        setIsLoading(false);
        adjustPadding(); // 에러 발생 시에도 패딩 조정
      });
  };

  const fetchTags = () => {
    fetch(`${API_BASE_URL}/club_board/tags/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTags(data);
      })
      .catch((error) => console.error(error));
  };

  const adjustPadding = () => {
    const container = document.querySelector('.club-notice-container');
    if (container) {
      container.style.paddingTop = '100px';
    }
  };

  useEffect(() => {
    fetchNotices(currentPage, searchTerm, sortOrder, selectedTag);
    fetchTags();
  }, [currentPage, searchTerm, sortOrder, selectedTag]);

  useEffect(() => {
    adjustPadding(); // 컴포넌트가 마운트될 때 패딩 조정
  }, []);

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const toggleLoginModal = () => setIsLoginModalOpen((prevState) => !prevState);
  const toggleWarningModal = () => setIsWarningModalOpen((prevState) => !prevState);

  const handleWriteButtonClick = () => {
    navigate('/create-notice');
  };

  const handleSortOrderChange = (order) => {
    setSortOrder(order);
    fetchNotices(currentPage, searchTerm, order, selectedTag);
  };

  return (
    <div className="club-notice-container">
      <h3 className="club-notice-title">공지</h3>
      <div className="club-botice-title-underline"></div>
      <div className="top">
        <div className="search-bar">
          <Input
            type="text"
            placeholder="search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle caret className="dropdown">
              정렬
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={() => setSelectedTag('')}>전체</DropdownItem>
              {tags.map((tag) => (
                <DropdownItem key={tag.id} onClick={() => setSelectedTag(tag.name)}>
                  {tag.name}
                </DropdownItem>
              ))}
              <DropdownItem divider />
              <DropdownItem onClick={() => handleSortOrderChange('desc')}>최신순</DropdownItem>
              <DropdownItem onClick={() => handleSortOrderChange('asc')}>오래된 순</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {isLoading ? (
        <div className="d-flex justify-content-center">Loading...</div>
      ) : (
        <div className="club-notice-table-container">
          <Table className="table table-hover">
            <thead>
              <tr>
                <th>No</th>
                <th>제목</th>
                <th>글쓴이</th>
                <th>작성시간</th>
                <th>조회수</th>
              </tr>
            </thead>
            <tbody>
              {notices.length === 0
                ? Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td colSpan="4" className="no-notice">공지사항이 없습니다.</td>
                    </tr>
                  ))
                : notices.map((notice, index) => (
                    <tr key={notice.specific_id}>
                      <td>{index + 1}</td>
                      <td>
                        <a href={notice.link} target="_blank" rel="noreferrer">
                          {notice.title}
                        </a>
                      </td>
                      <td>{notice.author}</td>
                      <td>{notice.created_date}</td>
                      <td>{notice.views}</td>
                    </tr>
                  ))}
            </tbody>
          </Table>
          <Button color="primary" onClick={handleWriteButtonClick} className="btn write-btn">글쓰기</Button>
        </div>
      )}

      <div className="pagination-container">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      <Modal isOpen={isLoginModalOpen} toggle={toggleLoginModal}>
        <ModalHeader toggle={toggleLoginModal}>로그인 필요</ModalHeader>
        <ModalBody>임원만 작성할 수 있습니다. 로그인하시겠습니까?</ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => window.location.href = '/login'}>로그인</Button>{' '}
          <Button color="secondary" onClick={toggleLoginModal}>취소</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={isWarningModalOpen} toggle={toggleWarningModal}>
        <ModalHeader toggle={toggleWarningModal}>권한 없음</ModalHeader>
        <ModalBody>임원만 작성할 수 있습니다.</ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleWarningModal}>확인</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ClubNotice;
