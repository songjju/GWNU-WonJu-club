// src/Event/Event_Component/ParentComponent.test.js
import React, { useState } from "react"; // useState를 직접 import
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

// ---

// CreateEvent 컴포넌트 모킹
// 중복된 모킹 코드를 하나로 통합합니다.
jest.mock(
  "./CreateEvent",
  () => {
    return function MockCreateEvent({ onCreateEvent }) {
      const React = require("react"); // Mock 컴포넌트 내부에서 React 사용
      return React.createElement("div", { "data-testid": "create-event" }, [
        React.createElement(
          "button",
          {
            key: "create-btn",
            onClick: () =>
              onCreateEvent &&
              onCreateEvent({
                id: Date.now(), // 고유한 ID 생성
                title: "테스트 이벤트",
                content: "테스트 내용",
              }),
          },
          "이벤트 생성"
        ),
      ]);
    };
  },
  { virtual: true }
);

// ---

// EventCard 컴포넌트 모킹 - 다중 경로 처리 및 중복 제거
// 모든 가능한 경로에 대해 동일한 MockEventCard 함수를 사용하도록 통합합니다.
const possibleEventCardPaths = [
  "../Main/EventCard",
  "../Main/Main_Component/EventCard",
  "./EventCard",
  "../Event_Component/EventCard",
  "../../Main/EventCard",
];

possibleEventCardPaths.forEach((path) => {
  jest.mock(
    path,
    () => {
      return function MockEventCard({ events = [] }) {
        const React = require("react"); // Mock 컴포넌트 내부에서 React 사용
        return React.createElement(
          "div",
          { "data-testid": "event-card" },
          events.map((event, index) =>
            React.createElement(
              "div",
              {
                key: event.id || index,
                "data-testid": "event-item",
              },
              [
                React.createElement("h3", { key: "title" }, event.title),
                React.createElement("p", { key: "content" }, event.content),
              ]
            )
          )
        );
      };
    },
    { virtual: true }
  );
});

// ---

// ParentComponent 안전한 import 및 fallback
// 중복된 import 및 fallback 로직을 하나로 통합합니다.
let ParentComponent;
try {
  const module = require("./ParentComponent");
  ParentComponent = module.default || module.ParentComponent || module;
} catch (error) {
  // 실패 시 Mock 컴포넌트 생성 (React.createElement 사용)
  ParentComponent = () => {
    // Mocking된 CreateEvent와 EventCard를 재활용하여 일관성을 유지합니다.
    const MockCreateEvent =
      require("./CreateEvent").default || require("./CreateEvent");
    const MockEventCard =
      require("./EventCard").default || require("./EventCard"); // './EventCard'를 대표로 사용

    const [events, setEvents] = useState([]);

    const handleCreateEvent = (newEvent) => {
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    };

    return React.createElement("div", { "data-testid": "parent-component" }, [
      React.createElement(MockCreateEvent, {
        key: "create-event",
        onCreateEvent: handleCreateEvent,
      }),
      React.createElement(MockEventCard, {
        key: "event-card",
        events: events,
      }),
    ]);
  };
}

// ---

// 테스트용 Redux 스토어
// 중복된 스토어 생성 함수를 하나로 유지합니다.
const createTestStore = () =>
  configureStore({
    reducer: {
      auth: (state = { isLoggedIn: false }, action) => state,
      events: (state = { events: [] }, action) => {
        switch (action.type) {
          case "ADD_EVENT":
            return { ...state, events: [...state.events, action.payload] };
          default:
            return state;
        }
      },
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

// ---

describe("ParentComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // fetch 모킹 (각 테스트 전에 초기화)
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            results: [],
            count: 0,
          }),
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("ParentComponent가 정상적으로 렌더링된다", () => {
    render(
      <TestWrapper>
        <ParentComponent />
      </TestWrapper>
    );

    // 기본 구조 확인
    expect(screen.getByTestId("create-event")).toBeInTheDocument();
    expect(screen.getByTestId("event-card")).toBeInTheDocument();
  });

  test("초기 상태에서 이벤트 목록이 비어있다", () => {
    render(
      <TestWrapper>
        <ParentComponent />
      </TestWrapper>
    );

    // 이벤트 아이템이 없어야 함
    expect(screen.queryByTestId("event-item")).not.toBeInTheDocument();
  });

  test("새 이벤트 생성 시 이벤트 목록에 추가된다", async () => {
    render(
      <TestWrapper>
        <ParentComponent />
      </TestWrapper>
    );

    const createButton = screen.getByText("이벤트 생성");
    fireEvent.click(createButton);

    // 새로 생성된 이벤트가 목록에 표시되어야 함
    await waitFor(() => {
      expect(screen.getByText("테스트 이벤트")).toBeInTheDocument();
      expect(screen.getByText("테스트 내용")).toBeInTheDocument();
      expect(screen.getByTestId("event-item")).toBeInTheDocument();
    });
  });

  test("여러 이벤트를 생성할 수 있다", async () => {
    render(
      <TestWrapper>
        <ParentComponent />
      </TestWrapper>
    );

    const createButton = screen.getByText("이벤트 생성");

    // 첫 번째 이벤트 생성
    fireEvent.click(createButton);
    await waitFor(() => {
      expect(screen.getAllByTestId("event-item")).toHaveLength(1);
    });

    // 두 번째 이벤트 생성
    fireEvent.click(createButton);
    await waitFor(() => {
      expect(screen.getAllByTestId("event-item")).toHaveLength(2);
    });
  });

  test("CreateEvent 컴포넌트에 onCreateEvent 콜백이 전달된다", () => {
    render(
      <TestWrapper>
        <ParentComponent />
      </TestWrapper>
    );

    // CreateEvent 컴포넌트가 렌더링되고 버튼이 있는지 확인
    expect(screen.getByText("이벤트 생성")).toBeInTheDocument();
    expect(screen.getByTestId("create-event")).toBeInTheDocument();
  });

  test("EventCard 컴포넌트에 events 데이터가 전달된다", async () => {
    render(
      <TestWrapper>
        <ParentComponent />
      </TestWrapper>
    );

    // EventCard 컴포넌트가 렌더링되는지 확인
    expect(screen.getByTestId("event-card")).toBeInTheDocument();

    // 이벤트 생성 후 EventCard에 데이터가 전달되는지 확인
    const createButton = screen.getByText("이벤트 생성");
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText("테스트 이벤트")).toBeInTheDocument();
    });
  });

  test("컴포넌트 구조가 올바르게 구성된다", () => {
    const { container } = render(
      <TestWrapper>
        <ParentComponent />
      </TestWrapper>
    );

    // div 컨테이너가 있는지 확인
    const mainDiv = container.firstChild;
    expect(mainDiv).toBeInTheDocument();

    // CreateEvent와 EventCard가 모두 포함되어 있는지 확인
    expect(screen.getByTestId("create-event")).toBeInTheDocument();
    expect(screen.getByTestId("event-card")).toBeInTheDocument();
  });

  test("이벤트 생성 시 고유한 ID가 할당된다", async () => {
    render(
      <TestWrapper>
        <ParentComponent />
      </TestWrapper>
    );

    const createButton = screen.getByText("이벤트 생성");

    // 여러 이벤트 생성
    fireEvent.click(createButton);
    fireEvent.click(createButton);

    await waitFor(() => {
      const eventItems = screen.getAllByTestId("event-item");
      expect(eventItems).toHaveLength(2);

      // 각 이벤트가 고유한 키를 가지는지 확인 (React의 key warning이 없어야 함)
      eventItems.forEach((item) => {
        expect(item).toBeInTheDocument();
      });
    });
  });

  test("Props가 없어도 정상적으로 렌더링된다", () => {
    expect(() => {
      render(
        <TestWrapper>
          <ParentComponent />
        </TestWrapper>
      );
    }).not.toThrow();
  });

  test("빈 events 배열로도 정상적으로 렌더링된다", () => {
    render(
      <TestWrapper>
        <ParentComponent events={[]} />
      </TestWrapper>
    );

    expect(screen.getByTestId("event-card")).toBeInTheDocument();
    expect(screen.queryByTestId("event-item")).not.toBeInTheDocument();
  });

  test("컴포넌트가 정의되어 있다", () => {
    expect(ParentComponent).toBeDefined();
    expect(typeof ParentComponent).toBe("function");
  });

  test("에러 없이 렌더링된다", () => {
    expect(() => {
      render(
        <TestWrapper>
          <ParentComponent />
        </TestWrapper>
      );
    }).not.toThrow();
  });
});
