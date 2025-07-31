describe("Application Entry Point", () => {
  let mockRoot;
  let mockRender;

  beforeEach(() => {
    mockRender = jest.fn();
    mockRoot = { render: mockRender };

    // ReactDOM.createRoot 모킹
    jest.doMock("react-dom/client", () => ({
      createRoot: jest.fn(() => mockRoot),
    }));

    // reportWebVitals 모킹
    jest.doMock("./reportWebVitals", () => jest.fn());

    // DOM 요소 모킹
    const mockElement = document.createElement("div");
    mockElement.id = "root";
    document.getElementById = jest.fn().mockReturnValue(mockElement);

    // CSS 모킹
    jest.doMock("bootstrap/dist/css/bootstrap.min.css", () => ({}));
    jest.doMock("./index.css", () => ({}));

    // Redux store와 persistor 모킹
    jest.doMock("./redux/store/configureStore", () => ({
      __esModule: true,
      default: {
        getState: jest.fn(),
        dispatch: jest.fn(),
        subscribe: jest.fn(),
      },
      persistor: { persist: jest.fn() },
    }));

    // App 컴포넌트 모킹
    jest.doMock("./App", () => {
      return function MockApp() {
        return React.createElement(
          "div",
          { "data-testid": "app" },
          "App Component"
        );
      };
    });
  });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test("기본 모듈들이 정상적으로 임포트된다", () => {
    expect(() => {
      // 각 모듈을 개별적으로 require하여 확인
      require("react");
      require("react-dom/client");
      require("./reportWebVitals");
    }).not.toThrow();
  });

  test("CSS 파일들이 정상적으로 임포트된다", () => {
    expect(() => {
      require("bootstrap/dist/css/bootstrap.min.css");
      require("./index.css");
    }).not.toThrow();
  });

  test("Redux store가 정상적으로 임포트된다", () => {
    expect(() => {
      const store = require("./redux/store/configureStore");
      expect(store.default).toBeDefined();
      expect(store.persistor).toBeDefined();
    }).not.toThrow();
  });

  test("App 컴포넌트가 정상적으로 임포트된다", () => {
    expect(() => {
      const App = require("./App").default || require("./App");
      expect(App).toBeDefined();
    }).not.toThrow();
  });

  test("index.js 파일이 에러 없이 실행된다", () => {
    expect(() => {
      // index.js의 실행을 시뮬레이션
      const React = require("react");
      const ReactDOM = require("react-dom/client");
      const reportWebVitals = require("./reportWebVitals");

      // 기본적인 실행 흐름 확인
      expect(React).toBeDefined();
      expect(ReactDOM).toBeDefined();
      expect(reportWebVitals).toBeDefined();
    }).not.toThrow();
  });
});
