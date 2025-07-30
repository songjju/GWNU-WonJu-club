// src/Header/TopScreen.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import TopScreen from './TopScreen';
import * as authActions from '../redux/actions/authActions';

// 이미지 모킹
jest.mock('../Main/Main_assets/logo.png', () => 'logo.png');

// authActions 모킹
jest.mock('../redux/actions/authActions', () => ({
  logout: jest.fn()
}));

// window.confirm 모킹
global.confirm = jest.fn();

// 테스트용 Redux 스토어 생성
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: (state = { isLoggedIn: false, ...initialState }, action) => {
        switch (action.type) {
          case 'LOGOUT':
            return { ...state, isLoggedIn: false };
          default:
            return state;
        }
      }
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false
      })
  });
};

const TestWrapper = ({ children, initialState = {} }) => {
  const store = createTestStore(initialState);
  return (
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  );
};

// 모의 navigate 함수
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/' })
}));

describe('TopScreen Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    global.confirm.mockClear();
    localStorage.clear();
    authActions.logout.mockReturnValue({ type: 'LOGOUT' });
    
    // 스크롤 이벤트 리스너 모킹
    global.addEventListener = jest.fn();
    global.removeEventListener = jest.fn();
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 0
    });
  });

  test('TopScreen 컴포넌트가 정상적으로 렌더링된다', () => {
    render(
      <TestWrapper>
        <TopScreen />
      </TestWrapper>
    );

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  test('로고가 올바르게 렌더링된다', () => {
    render(
      <TestWrapper>
        <TopScreen />
      </TestWrapper>
    );

    const logoLinks = screen.getAllByTestId('navbar-brand');
    expect(logoLinks.length).toBeGreaterThan(0);
  });

  test('로그인하지 않은 상태에서 로그인/회원가입 버튼이 표시된다', () => {
    render(
      <TestWrapper initialState={{ isLoggedIn: false }}>
        <TopScreen />
      </TestWrapper>
    );

    expect(screen.getByText('로그인')).toBeInTheDocument();
    expect(screen.getByText('회원가입')).toBeInTheDocument();
  });

  test('로그인한 상태에서 로그아웃 버튼이 표시된다', () => {
    render(
      <TestWrapper initialState={{ isLoggedIn: true }}>
        <TopScreen />
      </TestWrapper>
    );

    expect(screen.getByText('로그아웃')).toBeInTheDocument();
    expect(screen.queryByText('로그인')).not.toBeInTheDocument();
    expect(screen.queryByText('회원가입')).not.toBeInTheDocument();
  });

  test('네비게이션 메뉴가 올바르게 렌더링된다', () => {
    render(
      <TestWrapper>
        <TopScreen />
      </TestWrapper>
    );

    expect(screen.getByText('동아리 소개')).toBeInTheDocument();
    expect(screen.getByText('동아리 만들기')).toBeInTheDocument();
    expect(screen.getByText('자유 게시판')).toBeInTheDocument();
    expect(screen.getByText('이벤트')).toBeInTheDocument();
  });

  test('로그인 버튼 클릭 시 로그인 페이지로 이동한다', () => {
    // NavLink는 실제로는 Link 컴포넌트로 렌더링되므로 to prop을 확인
    render(
      <TestWrapper initialState={{ isLoggedIn: false }}>
        <TopScreen />
      </TestWrapper>
    );

    const loginLink = screen.getByText('로그인');
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.closest('a')).toHaveAttribute('href', '/login');
  });

  test('회원가입 버튼 클릭 시 회원가입 페이지로 이동한다', () => {
    render(
      <TestWrapper initialState={{ isLoggedIn: false }}>
        <TopScreen />
      </TestWrapper>
    );

    const signupLink = screen.getByText('회원가입');
    expect(signupLink).toBeInTheDocument();
    expect(signupLink.closest('a')).toHaveAttribute('href', '/signup');
  });

  test('로그아웃 버튼 클릭 시 로그아웃 처리가 정상적으로 동작한다', async () => {
    render(
      <TestWrapper initialState={{ isLoggedIn: true }}>
        <TopScreen />
      </TestWrapper>
    );

    const logoutButton = screen.getByText('로그아웃');
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(authActions.logout).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('마이페이지 버튼이 로그인 상태에서만 표시된다', () => {
    // 로그인하지 않은 상태
    const { rerender } = render(
      <TestWrapper initialState={{ isLoggedIn: false }}>
        <TopScreen />
      </TestWrapper>
    );

    expect(screen.queryByText('마이페이지')).not.toBeInTheDocument();

    // 로그인한 상태
    rerender(
      <TestWrapper initialState={{ isLoggedIn: true }}>
        <TopScreen />
      </TestWrapper>
    );

    expect(screen.getByText('마이페이지')).toBeInTheDocument();
  });

  test('동아리 만들기 버튼 클릭 시 로그인하지 않으면 확인창이 표시된다', () => {
    global.confirm.mockReturnValue(true);

    render(
      <TestWrapper initialState={{ isLoggedIn: false }}>
        <TopScreen />
      </TestWrapper>
    );

    const createClubButton = screen.getByText('동아리 만들기');
    fireEvent.click(createClubButton);

    expect(global.confirm).toHaveBeenCalledWith(
      '회원만 사용할 수 있습니다. 로그인하시겠습니까?'
    );
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('로그인한 사용자가 동아리 만들기 버튼 클릭 시 동아리 생성 페이지로 이동한다', () => {
    render(
      <TestWrapper initialState={{ isLoggedIn: true }}>
        <TopScreen />
      </TestWrapper>
    );

    const createClubButton = screen.getByText('동아리 만들기');
    fireEvent.click(createClubButton);

    expect(mockNavigate).toHaveBeenCalledWith('/create_club');
  });

  test('로그아웃 시 localStorage에서 토큰이 제거된다', async () => {
    localStorage.setItem('token', 'test_token');

    render(
      <TestWrapper initialState={{ isLoggedIn: true }}>
        <TopScreen />
      </TestWrapper>
    );

    const logoutButton = screen.getByText('로그아웃');
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  test('네비게이션 바가 올바른 CSS 클래스를 가진다', () => {
    const { container } = render(
      <TestWrapper>
        <TopScreen />
      </TestWrapper>
    );

    const navbar = container.querySelector('[data-testid="navbar"]');
    expect(navbar).toHaveClass('navbar');
  });

  test('Container 컴포넌트가 올바르게 렌더링된다', () => {
    render(
      <TestWrapper>
        <TopScreen />
      </TestWrapper>
    );

    expect(screen.getAllByTestId('container')).toHaveLength(1);
  });
});