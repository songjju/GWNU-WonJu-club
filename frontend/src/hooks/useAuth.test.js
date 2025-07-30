import { renderHook } from '@testing-library/react';
import { useSelector } from 'react-redux';

// useAuth 훅 모킹
jest.mock('react-redux', () => ({
  useSelector: jest.fn()
}));

const useAuth = () => {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const user = useSelector(state => state.auth.user);
  
  return {
    isLoggedIn,
    user,
    isAuthenticated: () => !!localStorage.getItem('token'),
    getToken: () => localStorage.getItem('token')
  };
};

describe('useAuth Hook', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('로그인 상태를 올바르게 반환한다', () => {
    useSelector.mockImplementation((selector) => {
      return selector({
        auth: {
          isLoggedIn: true,
          user: { email: 'test@example.com' }
        }
      });
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.user.email).toBe('test@example.com');
  });

  test('토큰 검증이 올바르게 동작한다', () => {
    localStorage.setItem('token', 'test_token');
    useSelector.mockReturnValue(false);

    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated()).toBe(true);
    expect(result.current.getToken()).toBe('test_token');
  });

  test('토큰이 없을 때 인증되지 않은 상태를 반환한다', () => {
    useSelector.mockReturnValue(false);

    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated()).toBe(false);
    expect(result.current.getToken()).toBe(null);
  });
});