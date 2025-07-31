// src/Event/Event_Component/EventList.test.js
import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import EventList from "./EventList";

// API 설정 모킹
jest.mock("../../config/apiConfig", () => "http://localhost:8000");

// fetch 모킹
global.fetch = jest.fn();

// 모의 navigate 함수
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const TestWrapper = ({ children }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

describe("EventList Component", () => {
  const mockEvents = [
    {
      specific_id: "1",
      title: "테스트 이벤트 1",
      link: "http://example.com/event1",
      author: "관리자",
      created_date: "2024-01-15",
      views: 10,
    },
    {
      specific_id: "2",
      title: "테스트 이벤트 2",
      link: "http://example.com/event2",
      author: "회장",
      created_date: "2024-01-16",
      views: 15,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
    mockNavigate.mockClear();
    localStorage.clear();
  });

  test("EventList 컴포넌트가 정상적으로 렌더링된다", async () => {
    fetch.mockResolvedValueOnce({
      json: () =>
        Promise.resolve({
          results: mockEvents,
          count: 2,
        }),
    });

    await act(async () => {
      render(
        <TestWrapper>
          <EventList />
        </TestWrapper>
      );
    });

    await waitFor(() => {
      // 실제 컴포넌트에서는 "이벤트"라는 제목이 있음
      expect(screen.getByText("이벤트")).toBeInTheDocument();
    });
  });

  test("이벤트 목록이 올바르게 표시된다", async () => {
    fetch.mockResolvedValueOnce({
      json: () =>
        Promise.resolve({
          results: mockEvents,
          count: 2,
        }),
    });

    await act(async () => {
      render(
        <TestWrapper>
          <EventList />
        </TestWrapper>
      );
    });

    await waitFor(() => {
      expect(screen.getByText("테스트 이벤트 1")).toBeInTheDocument();
      expect(screen.getByText("테스트 이벤트 2")).toBeInTheDocument();
    });
  });

  test("검색 기능이 정상적으로 동작한다", async () => {
    fetch
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            results: mockEvents,
            count: 2,
          }),
      })
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            results: [mockEvents[0]],
            count: 1,
          }),
      });

    await act(async () => {
      render(
        <TestWrapper>
          <EventList />
        </TestWrapper>
      );
    });

    await waitFor(() => {
      expect(screen.getByText("테스트 이벤트 1")).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId("input");
    const searchButton = screen.getByTestId("search-button");

    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "테스트" } });
      fireEvent.click(searchButton);
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("search=테스트"),
        expect.any(Object)
      );
    });
  });

  test("정렬 드롭다운이 정상적으로 동작한다", async () => {
    fetch.mockResolvedValueOnce({
      json: () =>
        Promise.resolve({
          results: mockEvents,
          count: 2,
        }),
    });

    await act(async () => {
      render(
        <TestWrapper>
          <EventList />
        </TestWrapper>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId("dropdown-toggle")).toBeInTheDocument();
    });

    const dropdownToggle = screen.getByTestId("dropdown-toggle");

    await act(async () => {
      fireEvent.click(dropdownToggle);
    });

    expect(screen.getByTestId("dropdown-menu")).toBeInTheDocument();
  });

  test("로그인하지 않은 사용자가 작성 버튼을 클릭하면 로그인 모달이 표시된다", async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isClubOfficer");

    fetch.mockResolvedValueOnce({
      json: () =>
        Promise.resolve({
          results: [],
          count: 0,
        }),
    });

    await act(async () => {
      render(
        <TestWrapper>
          <EventList />
        </TestWrapper>
      );
    });

    await waitFor(() => {
      expect(screen.getByText("작성")).toBeInTheDocument();
    });

    const writeButton = screen.getByText("작성");

    await act(async () => {
      fireEvent.click(writeButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId("modal")).toBeInTheDocument();
      expect(screen.getByText("로그인 필요")).toBeInTheDocument();
    });
  });

  test("동아리 임원이 아닌 사용자가 작성 버튼을 클릭하면 경고 모달이 표시된다", async () => {
    localStorage.setItem("token", "test_token");
    localStorage.setItem("isClubOfficer", "false");

    fetch.mockResolvedValueOnce({
      json: () =>
        Promise.resolve({
          results: [],
          count: 0,
        }),
    });

    await act(async () => {
      render(
        <TestWrapper>
          <EventList />
        </TestWrapper>
      );
    });

    await waitFor(() => {
      const writeButton = screen.getByText("작성");
      fireEvent.click(writeButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId("modal")).toBeInTheDocument();
      expect(screen.getByText("권한 없음")).toBeInTheDocument();
    });
  });

  test("API 에러 시 에러 처리가 정상적으로 동작한다", async () => {
    fetch.mockRejectedValueOnce(new Error("Network error"));

    await act(async () => {
      render(
        <TestWrapper>
          <EventList />
        </TestWrapper>
      );
    });

    await waitFor(() => {
      expect(screen.getByText("이벤트")).toBeInTheDocument();
    });
  });
});
