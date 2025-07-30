import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EventList from './EventList';

// API 설정 모킹
jest.mock('../../config/apiConfig', () => 'http://localhost:8000');

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

describe('EventList Component', () => {
  const mockEvents = [
    {
      id: 1,
      title: '테스트 이벤트 1',
      content: '테스트 이벤트 내용 1',
      created_at: '2024-01-15T10:00:00Z',
      club_name: '프로그래밍 동아리',
      tag: '세미나'
    },
    {
      id: 2,
      title: '테스트 이벤트 2',
      content: '테스트 이벤트 내용 2',
      created_at: '2024-01-16T14:00:00Z',
      club_name: '축구 동아리',
      tag: '경기'
    }
  ];

  const mockTags = [
    { id: 1, name: '세미나' },
    { id: 2, name: '경기' },
    { id: 3, name: '모임' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    
    // fetch를 완전히 모킹
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ 
          results: mockEvents, 
          count: 2 
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTags)
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('EventList 컴포넌트가 정상적으로 렌더링된다', async () => {
    // 성공적인 API 응답 모킹
    fetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ 
          results: mockEvents, 
          count: 2 
        })
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockTags)
      });

    render(
      <TestWrapper>
        <EventList />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('이벤트 목록')).toBeInTheDocument();
    });
  });

  test('로딩 상태가 올바르게 표시된다', () => {
    // 응답이 지연되는 상황을 시뮬레이션
    fetch.mockImplementation(() => new Promise(() => {}));

    render(
      <TestWrapper>
        <EventList />
      </TestWrapper>
    );

    expect(screen.getByText('로딩 중...')).toBeInTheDocument();
  });

  test('이벤트 목록이 올바르게 표시된다', async () => {
    fetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ 
          results: mockEvents, 
          count: 2 
        })
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockTags)
      });

    render(
      <TestWrapper>
        <EventList />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('테스트 이벤트 1')).toBeInTheDocument();
      expect(screen.getByText('테스트 이벤트 2')).toBeInTheDocument();
      expect(screen.getByText('프로그래밍 동아리')).toBeInTheDocument();
      expect(screen.getByText('축구 동아리')).toBeInTheDocument();
    });
  });

  test('검색 기능이 정상적으로 동작한다', async () => {
    fetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ 
          results: mockEvents, 
          count: 2 
        })
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockTags)
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ 
          results: [mockEvents[0]], 
          count: 1 
        })
      });

    render(
      <TestWrapper>
        <EventList />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('테스트 이벤트 1')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('이벤트를 검색하세요...');
    const searchButton = screen.getByText('검색');

    fireEvent.change(searchInput, { target: { value: '프로그래밍' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('search=프로그래밍'),
        expect.any(Object)
      );
    });
  });

  test('정렬 기능이 정상적으로 동작한다', async () => {
    fetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ 
          results: mockEvents, 
          count: 2 
        })
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockTags)
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ 
          results: mockEvents.reverse(), 
          count: 2 
        })
      });

    render(
      <TestWrapper>
        <EventList />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('정렬')).toBeInTheDocument();
    });

    const sortButton = screen.getByText('정렬');
    fireEvent.click(sortButton);

    const ascendingOption = screen.getByText('오래된 순');
    fireEvent.click(ascendingOption);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('ordering=asc'),
        expect.any(Object)
      );
    });
  });

  test('태그 필터링이 정상적으로 동작한다', async () => {
    localStorage.setItem('token', 'test_token');

    fetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ 
          results: mockEvents, 
          count: 2 
        })
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockTags)
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ 
          results: [mockEvents[0]], 
          count: 1 
        })
      });

    render(
      <TestWrapper>
        <EventList />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('모든 태그')).toBeInTheDocument();
    });

    const tagButton = screen.getByText('모든 태그');
    fireEvent.click(tagButton);

    await waitFor(() => {
      const seminarTag = screen.getByText('세미나');
      fireEvent.click(seminarTag);
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('tag=세미나'),
        expect.any(Object)
      );
    });
  });

  test('로그인하지 않은 사용자가 글쓰기 버튼을 클릭하면 로그인 모달이 표시된다', async () => {
    fetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ 
          results: [], 
          count: 0 
        })
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve([])
      });

    render(
      <TestWrapper>
        <EventList />
      </TestWrapper>
    );

    await waitFor(() => {
      const writeButton = screen.getByText('이벤트 작성');
      fireEvent.click(writeButton);
    });

    expect(screen.getByText('로그인이 필요합니다')).toBeInTheDocument();
  });

  test('동아리 임원이 아닌 사용자가 글쓰기 버튼을 클릭하면 경고 모달이 표시된다', async () => {
    localStorage.setItem('token', 'test_token');
    localStorage.setItem('isClubOfficer', 'false');

    fetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ 
          results: [], 
          count: 0 
        })
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve([])
      });

    render(
      <TestWrapper>
        <EventList />
      </TestWrapper>
    );

    await waitFor(() => {
      const writeButton = screen.getByText('이벤트 작성');
      fireEvent.click(writeButton);
    });

    expect(screen.getByText('권한이 없습니다')).toBeInTheDocument();
  });

  test('동아리 임원이 글쓰기 버튼을 클릭하면 이벤트 작성 페이지로 이동한다', async () => {
    localStorage.setItem('token', 'test_token');
    localStorage.setItem('isClubOfficer', 'true');

    fetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ 
          results: [], 
          count: 0 
        })
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve([])
      });

    render(
      <TestWrapper>
        <EventList />
      </TestWrapper>
    );

    await waitFor(() => {
      const writeButton = screen.getByText('이벤트 작성');
      fireEvent.click(writeButton);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/create_event');
  });

  test('페이지네이션이 올바르게 동작한다', async () => {
    fetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ 
          results: mockEvents, 
          count: 12 // 2페이지 이상이 되도록 설정
        })
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockTags)
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ 
          results: [], 
          count: 12
        })
      });

    render(
      <TestWrapper>
        <EventList />
      </TestWrapper>
    );

    await waitFor(() => {
      const nextButton = screen.getByText('다음');
      fireEvent.click(nextButton);
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('page=2'),
        expect.any(Object)
      );
    });
  });

  test('API 에러 시 에러 처리가 정상적으로 동작한다', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(
      <TestWrapper>
        <EventList />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('이벤트를 불러올 수 없습니다')).toBeInTheDocument();
    });
  });

  test('검색어 입력 후 Enter 키를 누르면 검색이 실행된다', async () => {
    fetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ 
          results: mockEvents, 
          count: 2 
        })
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockTags)
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ 
          results: [mockEvents[0]], 
          count: 1 
        })
      });

    render(
      <TestWrapper>
        <EventList />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('테스트 이벤트 1')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('이벤트를 검색하세요...');
    
    fireEvent.change(searchInput, { target: { value: '프로그래밍' } });
    fireEvent.keyPress(searchInput, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('search=프로그래밍'),
        expect.any(Object)
      );
    });
  });
});