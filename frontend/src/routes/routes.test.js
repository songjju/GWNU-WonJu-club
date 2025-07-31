// src/routes/routes.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { Routes } from "react-router-dom";
import { AppRoutes } from "./routes";

// 테스트용 컴포넌트들 모킹
jest.mock("../Main/Main_Component/MainPage", () => {
  return function MockMainPage() {
    return <div data-testid="main-page">Main Page</div>;
  };
});

jest.mock("../Login/LoginPage", () => {
  return function MockLoginPage() {
    return <div data-testid="login-page">Login Page</div>;
  };
});

jest.mock("../Event/Event_Component/EventPage", () => {
  return function MockEventPage() {
    return <div data-testid="event-page">Event Page</div>;
  };
});

jest.mock("../Club/ClubPage", () => {
  return function MockClubPage() {
    return <div data-testid="club-page">Club Page</div>;
  };
});

jest.mock("../Mypage/Mypage", () => {
  return function MockMyPage() {
    return <div data-testid="my-page">My Page</div>;
  };
});

// 테스트용 Redux 스토어 생성
const createTestStore = () => {
  return configureStore({
    reducer: {
      auth: (state = { isLoggedIn: false }, action) => {
        switch (action.type) {
          default:
            return state;
        }
      },
    },
  });
};

const TestWrapper = ({ children, initialEntries = ["/"] }) => {
  const store = createTestStore();
  return (
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </Provider>
  );
};

describe("Routes Configuration", () => {
  test("메인 페이지 라우팅이 정상적으로 동작한다", () => {
    render(
      <TestWrapper initialEntries={["/"]}>
        <Routes>{AppRoutes()}</Routes>
      </TestWrapper>
    );

    expect(screen.getByTestId("main-page")).toBeInTheDocument();
  });

  test("로그인 페이지 라우팅이 정상적으로 동작한다", () => {
    render(
      <TestWrapper initialEntries={["/login"]}>
        <Routes>{AppRoutes()}</Routes>
      </TestWrapper>
    );

    expect(screen.getByTestId("login-page")).toBeInTheDocument();
  });

  test("이벤트 페이지 라우팅이 정상적으로 동작한다", () => {
    render(
      <TestWrapper initialEntries={["/eventpage"]}>
        <Routes>{AppRoutes()}</Routes>
      </TestWrapper>
    );

    expect(screen.getByTestId("event-page")).toBeInTheDocument();
  });

  test("동아리 페이지 라우팅이 정상적으로 동작한다", () => {
    render(
      <TestWrapper initialEntries={["/clubpage"]}>
        <Routes>{AppRoutes()}</Routes>
      </TestWrapper>
    );

    expect(screen.getByTestId("club-page")).toBeInTheDocument();
  });

  test("마이페이지 라우팅이 정상적으로 동작한다", () => {
    render(
      <TestWrapper initialEntries={["/mypage"]}>
        <Routes>{AppRoutes()}</Routes>
      </TestWrapper>
    );

    expect(screen.getByTestId("my-page")).toBeInTheDocument();
  });

  test("존재하지 않는 경로에 대한 처리가 정상적으로 동작한다", () => {
    render(
      <TestWrapper initialEntries={["/nonexistent"]}>
        <Routes>{AppRoutes()}</Routes>
      </TestWrapper>
    );

    // 존재하지 않는 경로의 경우 아무것도 렌더링되지 않음
    expect(screen.queryByTestId("main-page")).not.toBeInTheDocument();
  });
});
