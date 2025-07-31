import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import MainPage from "./MainPage";

// API 설정 모킹
jest.mock("../../config/apiConfig", () => "http://localhost:8000");

// BannerCarousel 컴포넌트 모킹
jest.mock("./BannerCarousel", () => {
  return function MockBannerCarousel() {
    const React = require("react");
    return React.createElement(
      "div",
      { "data-testid": "banner-carousel" },
      "Banner Carousel"
    );
  };
});

// ClubNotice 컴포넌트 모킹
jest.mock("./ClubNotice", () => {
  return function MockClubNotice() {
    const React = require("react");
    return React.createElement(
      "div",
      { "data-testid": "club-notice" },
      "Club Notice"
    );
  };
});

// ClubAnalytics 컴포넌트 모킹
jest.mock("./ClubAnalytics", () => {
  return function MockClubAnalytics({ title }) {
    const React = require("react");
    return React.createElement(
      "div",
      { "data-testid": "club-analytics" },
      title || "Club Analytics"
    );
  };
});

// 테스트용 스토어
const createTestStore = () =>
  configureStore({
    reducer: {
      auth: (state = { isLoggedIn: false }, action) => state,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
  });

const TestWrapper = ({ children }) => {
  const store = createTestStore();
  return (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );
};

describe("MainPage", () => {
  beforeEach(() => {
    // fetch 모킹 - API 호출 성공 응답
    global.fetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          results: [
            { category: "IT", count: 10 },
            { type: "학술", count: 5 },
          ],
        }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("MainPage 컴포넌트가 정상적으로 렌더링된다", async () => {
    render(
      <TestWrapper>
        <MainPage />
      </TestWrapper>
    );

    // 각 섹션의 컴포넌트들이 렌더링되는지 확인
    expect(screen.getByTestId("banner-carousel")).toBeInTheDocument();
    expect(screen.getByTestId("club-notice")).toBeInTheDocument();

    // ClubAnalytics는 비동기로 데이터를 받아서 렌더링되므로 waitFor 사용
    await waitFor(() => {
      const analyticsComponents = screen.getAllByTestId("club-analytics");
      expect(analyticsComponents).toHaveLength(2); // 카테고리별, 분야별 2개
    });
  });

  test("API 호출이 정상적으로 수행된다", async () => {
    render(
      <TestWrapper>
        <MainPage />
      </TestWrapper>
    );

    // API 호출이 두 번 이루어지는지 확인 (카테고리, 분야)
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8000/club_introduce/count_club_category/"
      );
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8000/club_introduce/count_club_type/"
      );
    });
  });

  test("섹션들이 올바른 구조로 렌더링된다", () => {
    const { container } = render(
      <TestWrapper>
        <MainPage />
      </TestWrapper>
    );

    // MainPage 클래스를 가진 컨테이너가 있는지 확인
    const mainPageContainer = container.querySelector(".MainPage");
    expect(mainPageContainer).toBeInTheDocument();

    // 3개의 섹션이 있는지 확인
    const sections = container.querySelectorAll(".section");
    expect(sections).toHaveLength(3);

    // 각 섹션이 올바른 클래스를 가지고 있는지 확인
    expect(container.querySelector(".section1")).toBeInTheDocument();
    expect(container.querySelector(".section2")).toBeInTheDocument();
    expect(container.querySelector(".section3")).toBeInTheDocument();
  });

  test("analytics-container가 올바르게 렌더링된다", async () => {
    const { container } = render(
      <TestWrapper>
        <MainPage />
      </TestWrapper>
    );

    await waitFor(() => {
      const analyticsContainer = container.querySelector(
        ".analytics-container"
      );
      expect(analyticsContainer).toBeInTheDocument();
    });
  });

  test("API 호출 실패 시 에러 처리가 정상적으로 동작한다", async () => {
    // console.error 모킹
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    // fetch 실패 모킹
    global.fetch.mockRejectedValueOnce(new Error("Network error"));

    render(
      <TestWrapper>
        <MainPage />
      </TestWrapper>
    );

    // 에러가 콘솔에 출력되는지 확인
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching category data:",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  test("휠 이벤트 리스너가 정상적으로 등록된다", () => {
    const addEventListenerSpy = jest.spyOn(window, "addEventListener");
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

    const { unmount } = render(
      <TestWrapper>
        <MainPage />
      </TestWrapper>
    );

    // 휠 이벤트 리스너가 등록되었는지 확인
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "wheel",
      expect.any(Function),
      { passive: false }
    );

    // 컴포넌트 언마운트
    unmount();

    // 이벤트 리스너가 제거되었는지 확인
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "wheel",
      expect.any(Function)
    );

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  test("모바일 환경에서는 휠 스크롤이 비활성화된다", () => {
    // window.innerWidth를 모바일 크기로 설정
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 500, // 768보다 작은 값
    });

    const scrollToSpy = jest.spyOn(window, "scrollTo").mockImplementation();

    render(
      <TestWrapper>
        <MainPage />
      </TestWrapper>
    );

    // 휠 이벤트 시뮬레이션
    const wheelEvent = new WheelEvent("wheel", { deltaY: 100 });
    window.dispatchEvent(wheelEvent);

    // 모바일에서는 scrollTo가 호출되지 않아야 함
    expect(scrollToSpy).not.toHaveBeenCalled();

    scrollToSpy.mockRestore();
  });
});
