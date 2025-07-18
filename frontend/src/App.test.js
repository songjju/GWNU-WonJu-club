// src/App.test.js - 모든 하위 컴포넌트 모킹
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// 문제가 되는 컴포넌트들을 먼저 모킹
jest.mock('./ChatBot/ChatbotLayout', () => {
  return function MockChatbotLayout({ children }) {
    return <div data-testid="chatbot-layout">{children}</div>;
  };
});

jest.mock('./Header/TopScreen', () => {
  return function MockTopScreen() {
    return <div data-testid="top-screen">TopScreen</div>;
  };
});

jest.mock('./routes/routes', () => ({
  AppRoutes: () => []
}));

// Mypage 관련 컴포넌트들 모킹 (이미지 import 문제 해결)
jest.mock('./Mypage/Myclub', () => {
  return function MockMyclub() {
    return <div data-testid="myclub">MyClub</div>;
  };
});

jest.mock('./Mypage/Mypage', () => {
  return function MockMypage() {
    return <div data-testid="mypage">MyPage</div>;
  };
});

// 이제 App 컴포넌트 import
import App from './App';

// 테스트용 Redux 스토어
const createTestStore = () => {
  return configureStore({
    reducer: {
      auth: (state = { isLoggedIn: false }, action) => state
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false
      })
  });
};

const TestWrapper = ({ children }) => {
  const store = createTestStore();
  return (
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  );
};

describe('App Component', () => {
  test('App 컴포넌트가 기본적으로 렌더링된다', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    
    expect(getByTestId('chatbot-layout')).toBeInTheDocument();
    expect(getByTestId('top-screen')).toBeInTheDocument();
  });

  test('content 클래스가 적용된다', () => {
    const { container } = render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    
    const contentElement = container.querySelector('.content');
    expect(contentElement).toBeInTheDocument();
  });
});