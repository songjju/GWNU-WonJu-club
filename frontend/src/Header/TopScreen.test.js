import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import TopScreen from "./TopScreen";

// 이미지 파일 모킹
jest.mock("../Main/Main_assets/logo.png", () => "logo.png");

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: (state = { isLoggedIn: false, ...initialState }, action) => state,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

const TestWrapper = ({ children, initialState = {} }) => {
  const store = createTestStore(initialState);
  return (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );
};

describe("TopScreen Component", () => {
  test("TopScreen 컴포넌트가 정상적으로 렌더링된다", () => {
    render(
      <TestWrapper>
        <TopScreen />
      </TestWrapper>
    );

    // 네비게이션 바가 존재하는지 확인
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
  });

  test("로그인하지 않은 상태에서 네비게이션이 렌더링된다", () => {
    render(
      <TestWrapper initialState={{ isLoggedIn: false }}>
        <TopScreen />
      </TestWrapper>
    );

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("container")).toBeInTheDocument();
  });

  test("로그인한 상태에서 네비게이션이 렌더링된다", () => {
    render(
      <TestWrapper initialState={{ isLoggedIn: true }}>
        <TopScreen />
      </TestWrapper>
    );

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
  });

  test("네비게이션 구조가 올바르게 렌더링된다", () => {
    render(
      <TestWrapper>
        <TopScreen />
      </TestWrapper>
    );

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("container")).toBeInTheDocument();
    expect(screen.getByTestId("row")).toBeInTheDocument();
  });

  test("로고가 올바르게 렌더링된다", () => {
    render(
      <TestWrapper>
        <TopScreen />
      </TestWrapper>
    );

    // 실제 텍스트 내용으로 확인
    expect(
      screen.getByText("강릉원주대학교 원주캠퍼스 동아리")
    ).toBeInTheDocument();
    // 로고 이미지 확인
    expect(screen.getByAltText("강원동 로고")).toBeInTheDocument();
  });

  test("네비게이션 브랜드가 렌더링된다", () => {
    render(
      <TestWrapper>
        <TopScreen />
      </TestWrapper>
    );

    expect(
      screen.getByText("강릉원주대학교 원주캠퍼스 동아리")
    ).toBeInTheDocument();
  });

  test("로그인하지 않은 상태에서 로그인/회원가입 링크가 표시된다", () => {
    render(
      <TestWrapper initialState={{ isLoggedIn: false }}>
        <TopScreen />
      </TestWrapper>
    );

    expect(screen.getByText("로그인")).toBeInTheDocument();
    expect(screen.getByText("회원가입")).toBeInTheDocument();
  });

  test("로그인한 상태에서 마이페이지/로그아웃 링크가 표시된다", () => {
    render(
      <TestWrapper initialState={{ isLoggedIn: true }}>
        <TopScreen />
      </TestWrapper>
    );

    expect(screen.getByText("마이페이지")).toBeInTheDocument();
    expect(screen.getByText("로그아웃")).toBeInTheDocument();
  });

  test("주요 네비게이션 링크들이 렌더링된다", () => {
    render(
      <TestWrapper>
        <TopScreen />
      </TestWrapper>
    );

    expect(screen.getByText("동아리 소개")).toBeInTheDocument();
    expect(screen.getByText("동아리 만들기")).toBeInTheDocument();
    expect(screen.getByText("자유 게시판")).toBeInTheDocument();
    expect(screen.getByText("이벤트")).toBeInTheDocument();
  });

  test("CSS 클래스가 올바르게 적용된다", () => {
    render(
      <TestWrapper>
        <TopScreen />
      </TestWrapper>
    );

    const navbar = screen.getByTestId("navbar");
    expect(navbar).toHaveClass("navbar");
  });
});
