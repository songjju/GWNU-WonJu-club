import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ClubNotice from './ClubNotice';

// API 설정 모킹
jest.mock('../../config/apiConfig', () => ({
  API_BASE_URL: 'http://localhost:8000'
}));

// fetch 모킹
global.fetch = jest.fn();

// 모의 navigate 함수
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const TestWrapper = ({ children }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};

describe('ClubNotice Component', () => {
  const mockNotices = [
    {
      specific_id: '1',
      title: '공지사항 1',
      link: 'http://example.com/notice1',
      author: '관리자',
      created_date: '2024-01-15',
      views: 10
    },
    {
      specific_id: '2',
      title: '공지사항 2',
      link: 'http://example.com/notice2',
      author: '회장',
      created_date: '2024-01-16',
      views: 15
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
    mockNavigate.mockClear();
    localStorage.clear();
  });

  test('ClubNotice 컴포넌트가 정상적으로 렌더링된다', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ 
        results: mockNotices, 
        count: 2 
      })
    });

    await act(async () => {
      render(
        <TestWrapper>
          <ClubNotice />
        </TestWrapper>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('공지')).toBeInTheDocument();
    });
  });

  test('로딩 상태가 올바르게 표시된다', async () => {
    fetch.mockImplementation(() => new Promise(() => {}));

    await act(async () => {
      render(
        <TestWrapper>
          <ClubNotice />
        </TestWrapper>
      );
    });

    expect(screen.getByText('공지')).toBeInTheDocument();
    expect(screen.getByTestId('table')).toBeInTheDocument();
  });

  test('공지사항 목록이 올바르게 표시된다', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ 
        results: mockNotices, 
        count: 2 
      })
    });

    await act(async () => {
      render(
        <TestWrapper>
          <ClubNotice />
        </TestWrapper>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('공지사항 1')).toBeInTheDocument();
      expect(screen.getByText('공지사항 2')).toBeInTheDocument();
    });
  });

  test('검색 기능이 정상적으로 동작한다', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ 
        results: mockNotices, 
        count: 2 
      })
    });

    await act(async () => {
      render(
        <TestWrapper>
          <ClubNotice />
        </TestWrapper>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('공지사항 1')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('input');
    const searchButton = screen.getByTestId('search-button');

    // 검색어 입력
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: '테스트' } });
    });

    // 검색 버튼 클릭
    await act(async () => {
      fireEvent.click(searchButton);
    });

    // 검색어가 입력 필드에 올바르게 설정되었는지 확인
    expect(searchInput.value).toBe('테스트');
  });

  test('정렬 드롭다운이 정상적으로 동작한다', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ 
        results: mockNotices, 
        count: 2 
      })
    });

    await act(async () => {
      render(
        <TestWrapper>
          <ClubNotice />
        </TestWrapper>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('dropdown-toggle')).toBeInTheDocument();
    });

    const dropdownToggle = screen.getByTestId('dropdown-toggle');
    
    await act(async () => {
      fireEvent.click(dropdownToggle);
    });

    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
  });

  test('로그인하지 않은 사용자가 작성 버튼을 클릭하면 로그인 모달이 표시된다', async () => {
    // 로그인하지 않은 상태 설정
    localStorage.removeItem('access_token');
    localStorage.removeItem('isClubOfficer');

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ 
        results: [], 
        count: 0 
      })
    });

    await act(async () => {
      render(
        <TestWrapper>
          <ClubNotice />
        </TestWrapper>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('공지사항 작성')).toBeInTheDocument();
    });

    const writeButton = screen.getByText('공지사항 작성');
    
    await act(async () => {
      fireEvent.click(writeButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
      expect(screen.getByText('로그인 필요')).toBeInTheDocument();
    });
  });

  test('동아리 임원이 아닌 사용자가 작성 버튼을 클릭하면 경고 모달이 표시된다', async () => {
    localStorage.setItem('access_token', 'test_token');
    localStorage.setItem('isClubOfficer', 'false');

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ 
        results: [], 
        count: 0 
      })
    });

    await act(async () => {
      render(
        <TestWrapper>
          <ClubNotice />
        </TestWrapper>
      );
    });

    await waitFor(() => {
      const writeButton = screen.getByText('공지사항 작성');
      fireEvent.click(writeButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
      expect(screen.getByText('권한 없음')).toBeInTheDocument();
    });
  });

  test('동아리 임원이 작성 버튼을 클릭하면 작성 페이지로 이동한다', async () => {
    localStorage.setItem('access_token', 'test_token');
    localStorage.setItem('isClubOfficer', 'true');

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ 
        results: [], 
        count: 0 
      })
    });

    await act(async () => {
      render(
        <TestWrapper>
          <ClubNotice />
        </TestWrapper>
      );
    });

    await waitFor(() => {
      const writeButton = screen.getByText('공지사항 작성');
      fireEvent.click(writeButton);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/create-notice');
  });

  test('페이지네이션이 올바르게 렌더링된다', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ 
        results: mockNotices, 
        count: 12
      })
    });

    await act(async () => {
      render(
        <TestWrapper>
          <ClubNotice />
        </TestWrapper>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('공지사항 1')).toBeInTheDocument();
    });

    // 페이지네이션이 렌더링되는지 확인
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  test('API 에러 시 에러 처리가 정상적으로 동작한다', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    await act(async () => {
      render(
        <TestWrapper>
          <ClubNotice />
        </TestWrapper>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('공지')).toBeInTheDocument();
    });
  });

  test('검색어 입력 후 Enter 키를 누르면 검색 기능이 동작한다', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ 
        results: mockNotices, 
        count: 2 
      })
    });

    await act(async () => {
      render(
        <TestWrapper>
          <ClubNotice />
        </TestWrapper>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('공지사항 1')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('input');
    
    // 검색어 입력
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: '프로그래밍' } });
    });

    // Enter 키 입력으로 검색 실행
    await act(async () => {
      fireEvent.keyPress(searchInput, { key: 'Enter', code: 'Enter' });
    });

    // 검색어가 입력 필드에 올바르게 설정되었는지 확인
    expect(searchInput.value).toBe('프로그래밍');
  });

  test('모달 닫기 기능이 정상적으로 동작한다', async () => {
    localStorage.removeItem('access_token');
    
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ 
        results: [], 
        count: 0 
      })
    });

    await act(async () => {
      render(
        <TestWrapper>
          <ClubNotice />
        </TestWrapper>
      );
    });

    await waitFor(() => {
      const writeButton = screen.getByText('공지사항 작성');
      fireEvent.click(writeButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    const closeButton = screen.getByText('취소');
    
    await act(async () => {
      fireEvent.click(closeButton);
    });

    await waitFor(() => {
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });
});