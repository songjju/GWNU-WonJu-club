// src/Header/TopScreen.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import TopScreen from './TopScreen';

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: (state = { isLoggedIn: false, ...initialState }, action) => state
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

describe('TopScreen Component', () => {
  test('TopScreen 컴포넌트가 정상적으로 렌더링된다', () => {
    render(
      <TestWrapper>
        <TopScreen />
      </TestWrapper>
    );
    
    // 네비게이션 바가 존재하는지 확인
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  test('로그인하지 않은 상태에서 네비게이션이 렌더링된다', () => {
    render(
      <TestWrapper initialState={{ isLoggedIn: false }}>
        <TopScreen />
      </TestWrapper>
    );
    
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('container')).toBeInTheDocument();
  });

  test('로그인한 상태에서 네비게이션이 렌더링된다', () => {
    render(
      <TestWrapper initialState={{ isLoggedIn: true }}>
        <TopScreen />
      </TestWrapper>
    );
    
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  test('네비게이션 구조가 올바르게 렌더링된다', () => {
    render(
      <TestWrapper>
        <TopScreen />
      </TestWrapper>
    );
    
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('container')).toBeInTheDocument();
    expect(screen.getByTestId('row')).toBeInTheDocument();
  });

  test('네비게이션 브랜드가 렌더링된다', () => {
    render(
      <TestWrapper>
        <TopScreen />
      </TestWrapper>
    );
    
    expect(screen.getByText('강릉원주대학교 원주캠퍼스 동아리')).toBeInTheDocument();
  });

  test('CSS 클래스가 올바르게 적용된다', () => {
    render(
      <TestWrapper>
        <TopScreen />
      </TestWrapper>
    );
    
    const navbar = screen.getByTestId('navbar');
    expect(navbar).toHaveClass('navbar');
  });
});