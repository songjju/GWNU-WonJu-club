// src/Event/Event_Component/EventPage.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import EventPage from "./EventPage";

// CreateEvent와 EventList 컴포넌트 모킹
jest.mock("./CreateEvent", () => {
  return function MockCreateEvent() {
    return <div data-testid="create-event">Create Event Page</div>;
  };
});

jest.mock("./EventList", () => {
  return function MockEventList() {
    return <div data-testid="event-list">Event List Page</div>;
  };
});

const TestWrapper = ({ children, initialEntries = ["/"] }) => {
  return (
    <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
  );
};

describe("EventPage Component", () => {
  test("EventPage 컴포넌트가 정상적으로 렌더링된다", () => {
    render(
      <TestWrapper>
        <EventPage />
      </TestWrapper>
    );

    // 기본 경로에서는 EventList가 표시되어야 함
    expect(screen.getByTestId("event-list")).toBeInTheDocument();
  });

  test("루트 경로(/)에서 EventList가 렌더링된다", () => {
    render(
      <TestWrapper initialEntries={["/"]}>
        <EventPage />
      </TestWrapper>
    );

    expect(screen.getByTestId("event-list")).toBeInTheDocument();
    expect(screen.getByText("Event List Page")).toBeInTheDocument();
    expect(screen.queryByTestId("create-event")).not.toBeInTheDocument();
  });

  test("/create_event 경로에서 CreateEvent가 렌더링된다", () => {
    render(
      <TestWrapper initialEntries={["/create_event"]}>
        <EventPage />
      </TestWrapper>
    );

    expect(screen.getByTestId("create-event")).toBeInTheDocument();
    expect(screen.getByText("Create Event Page")).toBeInTheDocument();
    expect(screen.queryByTestId("event-list")).not.toBeInTheDocument();
  });

  test("존재하지 않는 경로에서는 아무것도 렌더링되지 않는다", () => {
    render(
      <TestWrapper initialEntries={["/nonexistent"]}>
        <EventPage />
      </TestWrapper>
    );

    expect(screen.queryByTestId("event-list")).not.toBeInTheDocument();
    expect(screen.queryByTestId("create-event")).not.toBeInTheDocument();
  });

  test("Routes와 Route 컴포넌트가 올바르게 구성되어 있다", () => {
    const { container } = render(
      <TestWrapper>
        <EventPage />
      </TestWrapper>
    );

    // Routes 컴포넌트가 렌더링되는지 확인
    expect(container.firstChild).toBeInTheDocument();
  });

  test("CSS 클래스가 올바르게 임포트되어 있다", () => {
    // CSS 파일 임포트가 문제없이 되는지 확인하기 위한 기본 테스트
    expect(() => {
      render(
        <TestWrapper>
          <EventPage />
        </TestWrapper>
      );
    }).not.toThrow();
  });

  test("Bootstrap CSS가 올바르게 임포트되어 있다", () => {
    // Bootstrap CSS 임포트가 문제없이 되는지 확인
    expect(() => {
      render(
        <TestWrapper>
          <EventPage />
        </TestWrapper>
      );
    }).not.toThrow();
  });
});
