// TopScreen.js
import React, { useEffect, useState } from "react";

import { Navbar, Nav, Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate, useLocation, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/actions/authActions"; // 경로는 실제 구조에 맞게 조정 필요

import logo from "../Main/Main_assets/logo.png";
import "./TopScreen.css"; // CSS 모듈이 아닌 일반 CSS로 가져오기

const TopScreen = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false); // 스크롤 상태 추가
  const [isMainPage, setIsMainPage] = useState(false); // 메인 페이지 상태 추가

  useEffect(() => {
    if (
      isLoggedIn &&
      (location.pathname === "/login" || location.pathname === "/signup")
    ) {
      navigate("/");
    }
  }, [isLoggedIn, location, navigate]);

  useEffect(() => {
    setIsMainPage(location.pathname === "/"); // 현재 경로가 메인 페이지인지 확인

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    if (location.pathname === "/") {
      window.addEventListener("scroll", handleScroll);
    } else {
      setIsScrolled(false);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    localStorage.removeItem("token");
    try {
      await dispatch(logout());
      handleNavigation("/");
      console.log("로그아웃 되었습니다.");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  const handleCreateClubClick = () => {
    if (!isLoggedIn) {
      if (window.confirm("회원만 사용할 수 있습니다. 로그인하시겠습니까?")) {
        handleNavigation("/login");
      }
    } else {
      handleNavigation("/create_club");
    }
  };

  return (
    <Navbar
      className={`navbar ${isScrolled ? "scrolled" : ""} ${
        isMainPage ? "mainPage" : "otherPage"
      }`}
      expand="lg"
    >
      <Container fluid>
        <Row className="align-items-center w-100">
          <Col xs={6} md={4}>
            <Navbar.Brand as={Link} to="/" className="navbar-brand">
              <img
                src={logo}
                className="d-inline-block align-top"
                alt="강원동 로고"
              />
              <span>강릉원주대학교 원주캠퍼스 동아리</span>
            </Navbar.Brand>
          </Col>
          <Col xs={6} md={8}>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="navLinks">
                <Nav.Link as={NavLink} to="/club-introduce" className="navLink">
                  동아리 소개
                </Nav.Link>
                <Nav.Link
                  as="div"
                  onClick={handleCreateClubClick}
                  className="navLink clickable"
                >
                  동아리 만들기
                </Nav.Link>
                <Nav.Link as={NavLink} to="/club_board" className="navLink">
                  자유 게시판
                </Nav.Link>
                <Nav.Link as={NavLink} to="/eventpage" className="navLink">
                  이벤트
                </Nav.Link>
              </Nav>
              <Nav className="navAuthLinks">
                {!isLoggedIn ? (
                  <>
                    <Nav.Link as={NavLink} to="/login" className="navLink">
                      로그인
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/signup" className="navLink">
                      회원가입
                    </Nav.Link>
                  </>
                ) : (
                  <>
                    <Nav.Link as={NavLink} to="/mypage" className="navLink">
                      마이페이지
                    </Nav.Link>
                    <Nav.Link
                      as="div"
                      onClick={handleLogout}
                      className="navLink"
                    >
                      로그아웃
                    </Nav.Link>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
};

export default TopScreen;
