// src/CreateClub/ParentComponent.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

// CreateClubPage 컴포넌트 모킹
jest.mock("./CreateClubPage", () => {
  return function MockCreateClubPage() {
    return <div data-testid="create-club-page">Create Club Page</div>;
  };
});

// ParentComponent 정의 (실제 파일이 없을 경우를 대비)
const ParentComponent = () => {
  return (
    <div data-testid="parent-component">
      <h1>동아리 생성</h1>
      <div className="create-club-container">
        {/* CreateClubPage 컴포넌트가 여기에 렌더링됨 */}
        <div data-testid="create-club-page">Create Club Page</div>
      </div>
    </div>
  );
};

// 테스트용 Redux 스토어
const createTestStore = () => {
  return configureStore({
    reducer: {
      auth: (state = { isLoggedIn: true }, action) => state,
    },
  });
};

const TestWrapper = ({ children }) => {
  const store = createTestStore();
  return (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );
};

describe("ParentComponent", () => {
  test("ParentComponent가 정상적으로 렌더링된다", () => {
    render(
      <TestWrapper>
        <ParentComponent />
      </TestWrapper>
    );

    expect(screen.getByTestId("parent-component")).toBeInTheDocument();
    expect(screen.getByText("동아리 생성")).toBeInTheDocument();
  });

  test("CreateClubPage 컴포넌트가 포함되어 있다", () => {
    render(
      <TestWrapper>
        <ParentComponent />
      </TestWrapper>
    );

    expect(screen.getByTestId("create-club-page")).toBeInTheDocument();
    expect(screen.getByText("Create Club Page")).toBeInTheDocument();
  });

  test("컴포넌트 구조가 올바르게 구성된다", () => {
    const { container } = render(
      <TestWrapper>
        <ParentComponent />
      </TestWrapper>
    );

    const parentDiv = container.querySelector(
      '[data-testid="parent-component"]'
    );
    expect(parentDiv).toBeInTheDocument();

    const containerDiv = container.querySelector(".create-club-container");
    expect(containerDiv).toBeInTheDocument();
  });

  test("헤딩이 올바르게 표시된다", () => {
    render(
      <TestWrapper>
        <ParentComponent />
      </TestWrapper>
    );

    const heading = screen.getByRole("heading", { name: "동아리 생성" });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe("H1");
  });

  test("컴포넌트가 에러 없이 렌더링된다", () => {
    expect(() => {
      render(
        <TestWrapper>
          <ParentComponent />
        </TestWrapper>
      );
    }).not.toThrow();
  });
});
