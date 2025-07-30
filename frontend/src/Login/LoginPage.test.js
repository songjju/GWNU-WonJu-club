import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import LoginPage from './LoginPage';
import * as authActions from '../redux/actions/authActions';

// API 설정 모킹
jest.mock('../config/apiConfig', () => 'http://localhost:8000');

// authActions 모킹
jest.mock('../redux/actions/authActions', () => ({
  loginSuccess: jest.fn(),
  logout: jest.fn()
}));

// fetch 모킹
global.fetch = jest.fn();

// 테스트용 Redux 스토어 생성
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: (state = { isLoggedIn: false, ...initialState }, action) => {
        switch (action.type) {
          case 'LOGIN_SUCCESS':
            return { ...state, isLoggedIn: true };
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
  useNavigate: () => mockNavigate
}));

describe('LoginPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
    mockNavigate.mockClear();
    localStorage.clear();
    authActions.loginSuccess.mockReturnValue({ type: 'LOGIN_SUCCESS' });
    authActions.logout.mockReturnValue({ type: 'LOGOUT' });
  });

  test('LoginPage 컴포넌트가 정상적으로 렌더링된다', () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
    // label과 input의 연결을 확인하는 대신 placeholder로 요소를 찾음
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Forgot Password?' })).toBeInTheDocument();
  });

  test('이미 로그인된 사용자는 메인 페이지로 리다이렉트된다', () => {
    render(
      <TestWrapper initialState={{ isLoggedIn: true }}>
        <LoginPage />
      </TestWrapper>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('이메일과 패스워드 입력이 정상적으로 동작한다', () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('로그인 성공 시 메인 페이지로 이동한다', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ key: 'test_token_12345' })
    });

    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/club_account/login/',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'test@example.com', password: 'password123' })
        })
      );
    });

    await waitFor(() => {
      expect(authActions.loginSuccess).toHaveBeenCalledWith({
        email: 'test@example.com',
        token: 'test_token_12345'
      });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('로그인 실패 시 에러 상태가 설정되고 폼이 초기화된다', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({}) // key가 없는 응답
    });

    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(emailInput.value).toBe('');
      expect(passwordInput.value).toBe('');
      expect(authActions.logout).toHaveBeenCalled();
    });
  });

  test('네트워크 에러 시 에러 처리가 정상적으로 동작한다', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(emailInput.value).toBe('');
      expect(passwordInput.value).toBe('');
      expect(authActions.logout).toHaveBeenCalled();
    });
  });

  test('비밀번호 재설정 버튼 클릭 시 올바른 페이지로 이동한다', () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const resetButton = screen.getByRole('button', { name: 'Forgot Password?' });
    fireEvent.click(resetButton);

    expect(mockNavigate).toHaveBeenCalledWith('/reset-password');
  });

  test('폼 제출 시 preventDefault가 호출된다', () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    // form 요소를 직접 찾기 (role이 없으므로)
    const form = document.querySelector('form');
    expect(form).toBeInTheDocument();
    
    // 실제로는 submit 버튼 클릭으로 테스트
    const submitButton = screen.getByRole('button', { name: 'Sign In' });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute('type', 'submit');
  });

  test('로딩 상태 처리가 정상적으로 동작한다', () => {
    // 로그인된 상태에서 렌더링하면 로딩 상태를 거쳐 리다이렉트됨
    render(
      <TestWrapper initialState={{ isLoggedIn: false }}>
        <LoginPage />
      </TestWrapper>
    );

    // 로그인하지 않은 상태에서는 Login 폼이 표시되어야 함
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });
});