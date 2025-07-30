// src/Mypage/Mypage.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import MyPage from './Mypage';

// API 설정 모킹
jest.mock('../config/apiConfig', () => 'http://localhost:8000');

// 하위 컴포넌트들 모킹
jest.mock('./MypageHome', () => {
  return function MockMypageHome({ userData, myClubList }) {
    return (
      <div data-testid="mypage-home">
        <div data-testid="user-data">{userData?.name || 'No user data'}</div>
        <div data-testid="club-count">{myClubList?.length || 0} clubs</div>
      </div>
    );
  };
});

jest.mock('./Editinformation', () => {
  return function MockEditinformation() {
    return <div data-testid="edit-information">Edit Information</div>;
  };
});

jest.mock('./PasswordChangeForm', () => {
  return function MockPasswordChangeForm() {
    return <div data-testid="password-change">Password Change</div>;
  };
});

jest.mock('./MyClubPage', () => {
  return function MockMyClubPage({ myClubList }) {
    return <div data-testid="my-club-page">My Club Page - {myClubList?.length || 0} clubs</div>;
  };
});

// fetch 모킹
global.fetch = jest.fn();

// 테스트용 Redux 스토어
const createTestStore = () => {
  return configureStore({
    reducer: {
      auth: (state = { isLoggedIn: true }, action) => state
    }
  });
};

const TestWrapper = ({ children, initialEntries = ['/mypage'] }) => {
  const store = createTestStore();
  return (
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        {children}
      </MemoryRouter>
    </Provider>
  );
};

describe('MyPage Component', () => {
  const mockUserData = {
    name: '김동아리',
    email: 'kim@example.com',
    phone: '010-1234-5678',
    grade: 3,
    student_id: '20220001',
    study: '컴퓨터공학과'
  };

  const mockMyClubList = [
    {
      member_id: 1,
      club_name: '프로그래밍 동아리',
      job: '회장'
    },
    {
      member_id: 2,
      club_name: '축구 동아리',
      job: '일반회원'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
    localStorage.setItem('token', 'test_token');
  });

  test('MyPage 컴포넌트가 정상적으로 렌더링된다', async () => {
    fetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockUserData)
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockMyClubList)
      });

    render(
      <TestWrapper>
        <MyPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('마이페이지')).toBeInTheDocument();
    });
  });

  test('사용자 데이터와 동아리 목록이 올바르게 로드된다', async () => {
    fetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockUserData)
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockMyClubList)
      });

    render(
      <TestWrapper>
        <MyPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user-data')).toHaveTextContent('김동아리');
      expect(screen.getByTestId('club-count')).toHaveTextContent('2 clubs');
    });
  });

  test('네비게이션 메뉴가 올바르게 표시된다', async () => {
    fetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockUserData)
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockMyClubList)
      });

    render(
      <TestWrapper>
        <MyPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('홈')).toBeInTheDocument();
      expect(screen.getByText('회원정보 수정')).toBeInTheDocument();
      expect(screen.getByText('패스워드 변경')).toBeInTheDocument();
      expect(screen.getByText('내 동아리 관리')).toBeInTheDocument();
    });
  });

  test('회원정보 수정 페이지로 라우팅이 정상적으로 동작한다', async () => {
    fetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockUserData)
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockMyClubList)
      });

    render(
      <TestWrapper initialEntries={['/mypage/edit-information']}>
        <MyPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('edit-information')).toBeInTheDocument();
    });
  });

  test('패스워드 변경 페이지로 라우팅이 정상적으로 동작한다', async () => {
    fetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockUserData)
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockMyClubList)
      });

    render(
      <TestWrapper initialEntries={['/mypage/password-change']}>
        <MyPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('password-change')).toBeInTheDocument();
    });
  });

  test('내 동아리 관리 페이지로 라우팅이 정상적으로 동작한다', async () => {
    fetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockUserData)
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockMyClubList)
      });

    render(
      <TestWrapper initialEntries={['/mypage/my-club']}>
        <MyPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('my-club-page')).toBeInTheDocument();
      expect(screen.getByText('My Club Page - 2 clubs')).toBeInTheDocument();
    });
  });

  test('API 에러 시 에러 처리가 정상적으로 동작한다', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(
      <TestWrapper>
        <MyPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user-data')).toHaveTextContent('No user data');
    });
  });

  test('토큰이 없을 때 에러 처리가 정상적으로 동작한다', async () => {
    localStorage.removeItem('token');

    render(
      <TestWrapper>
        <MyPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user-data')).toHaveTextContent('No user data');
    });
  });

  test('MypageHome 컴포넌트에 올바른 props가 전달된다', async () => {
    fetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockUserData)
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockMyClubList)
      });

    render(
      <TestWrapper>
        <MyPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('mypage-home')).toBeInTheDocument();
      expect(screen.getByTestId('user-data')).toHaveTextContent('김동아리');
      expect(screen.getByTestId('club-count')).toHaveTextContent('2 clubs');
    });
  });

  test('네비게이션 링크에 올바른 CSS 클래스가 적용된다', async () => {
    fetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockUserData)
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockMyClubList)
      });

    render(
      <TestWrapper>
        <MyPage />
      </TestWrapper>
    );

    await waitFor(() => {
      const navLinks = screen.getAllByTestId('nav-link');
      expect(navLinks).toHaveLength(4);
      
      navLinks.forEach(link => {
        expect(link).toHaveClass('my-category-item');
      });
    });
  });

  test('컴포넌트 구조가 올바르게 구성된다', async () => {
    fetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockUserData)
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockMyClubList)
      });

    const { container } = render(
      <TestWrapper>
        <MyPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(container.querySelector('.my-page')).toBeInTheDocument();
      expect(container.querySelector('.my-sidebar')).toBeInTheDocument();
      expect(container.querySelector('.userData_table')).toBeInTheDocument();
    });
  });
});