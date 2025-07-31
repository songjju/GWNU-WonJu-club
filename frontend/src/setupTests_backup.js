// src/setupTests.js
import "@testing-library/jest-dom";

// axios 모킹
jest.mock("axios", () => ({
  __esModule: true,
  default: {
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
  },
}));

// React Bootstrap 완전 모킹 - React를 모킹 내부에서 직접 사용
jest.mock("react-bootstrap", () => {
  const mockReact = require("react");

  const MockComponent = ({ children, className, ...props }) => {
    const Component = props.as || "div";
    return mockReact.createElement(
      Component,
      { className, ...props },
      children
    );
  };

  const MockNavbarBrand = ({ children, as, to, className, ...props }) => {
    if (as) {
      return mockReact.createElement(as, { to, className, ...props }, children);
    }
    return mockReact.createElement("div", { className, ...props }, children);
  };

  const MockNavLink = ({ children, as, to, onClick, className, ...props }) => {
    if (as === "div") {
      return mockReact.createElement(
        "div",
        { onClick, className, ...props },
        children
      );
    }
    if (as) {
      return mockReact.createElement(as, { to, className, ...props }, children);
    }
    return mockReact.createElement(
      "a",
      { onClick, className, ...props },
      children
    );
  };

  const Navbar = ({ children, className, expand, ...props }) =>
    mockReact.createElement(
      "nav",
      {
        "data-testid": "navbar",
        className,
        ...props,
      },
      children
    );

  // Navbar의 하위 컴포넌트들을 Navbar 객체의 속성으로 설정
  Navbar.Brand = MockNavbarBrand;
  Navbar.Toggle = ({ children, ...props }) =>
    mockReact.createElement(
      "button",
      {
        "data-testid": "navbar-toggle",
        ...props,
      },
      children
    );
  Navbar.Collapse = ({ children, id, ...props }) =>
    mockReact.createElement(
      "div",
      {
        "data-testid": "navbar-collapse",
        id,
        ...props,
      },
      children
    );

  const Nav = ({ children, className, ...props }) =>
    mockReact.createElement(
      "div",
      {
        "data-testid": "nav",
        className,
        ...props,
      },
      children
    );

  // Nav의 하위 컴포넌트
  Nav.Link = MockNavLink;

  return {
    Container: ({ children, fluid, ...props }) =>
      mockReact.createElement(
        "div",
        { "data-testid": "container", ...props },
        children
      ),
    Row: ({ children, className, ...props }) =>
      mockReact.createElement(
        "div",
        { "data-testid": "row", className, ...props },
        children
      ),
    Col: ({ children, xs, md, ...props }) =>
      mockReact.createElement(
        "div",
        { "data-testid": "col", ...props },
        children
      ),
    Navbar,
    Nav,
    Button: ({ children, variant, onClick, ...props }) =>
      mockReact.createElement(
        "button",
        { "data-testid": "button", onClick, ...props },
        children
      ),
    Carousel: ({ children, interval, ...props }) =>
      mockReact.createElement(
        "div",
        { "data-testid": "carousel", "data-interval": interval, ...props },
        children
      ),
    Table: ({ children, ...props }) =>
      mockReact.createElement(
        "table",
        { "data-testid": "table", ...props },
        children
      ),
    Input: ({ ...props }) =>
      mockReact.createElement("input", { "data-testid": "input", ...props }),
    Dropdown: ({ children, ...props }) =>
      mockReact.createElement(
        "div",
        { "data-testid": "dropdown", ...props },
        children
      ),
    DropdownToggle: ({ children, ...props }) =>
      mockReact.createElement(
        "button",
        { "data-testid": "dropdown-toggle", ...props },
        children
      ),
    DropdownMenu: ({ children, ...props }) =>
      mockReact.createElement(
        "div",
        { "data-testid": "dropdown-menu", ...props },
        children
      ),
    DropdownItem: ({ children, ...props }) =>
      mockReact.createElement(
        "div",
        { "data-testid": "dropdown-item", ...props },
        children
      ),
    Modal: ({ children, isOpen, ...props }) =>
      isOpen
        ? mockReact.createElement(
            "div",
            { "data-testid": "modal", ...props },
            children
          )
        : null,
    ModalHeader: ({ children, ...props }) =>
      mockReact.createElement(
        "div",
        { "data-testid": "modal-header", ...props },
        children
      ),
    ModalBody: ({ children, ...props }) =>
      mockReact.createElement(
        "div",
        { "data-testid": "modal-body", ...props },
        children
      ),
    ModalFooter: ({ children, ...props }) =>
      mockReact.createElement(
        "div",
        { "data-testid": "modal-footer", ...props },
        children
      ),
  };
});

// reactstrap도 모킹
jest.mock("reactstrap", () => {
  const mockReact = require("react");
  return {
    Table: ({ children, ...props }) =>
      mockReact.createElement(
        "table",
        { "data-testid": "table", ...props },
        children
      ),
    Button: ({ children, color, onClick, ...props }) =>
      mockReact.createElement(
        "button",
        { "data-testid": "button", onClick, ...props },
        children
      ),
    Input: ({ ...props }) =>
      mockReact.createElement("input", { "data-testid": "input", ...props }),
    Dropdown: ({ children, isOpen, toggle, ...props }) =>
      mockReact.createElement(
        "div",
        { "data-testid": "dropdown", ...props },
        children
      ),
    DropdownToggle: ({ children, ...props }) =>
      mockReact.createElement(
        "button",
        { "data-testid": "dropdown-toggle", ...props },
        children
      ),
    DropdownMenu: ({ children, ...props }) =>
      mockReact.createElement(
        "div",
        { "data-testid": "dropdown-menu", ...props },
        children
      ),
    DropdownItem: ({ children, ...props }) =>
      mockReact.createElement(
        "div",
        { "data-testid": "dropdown-item", ...props },
        children
      ),
    Modal: ({ children, isOpen, ...props }) =>
      isOpen
        ? mockReact.createElement(
            "div",
            { "data-testid": "modal", ...props },
            children
          )
        : null,
    ModalHeader: ({ children, ...props }) =>
      mockReact.createElement(
        "div",
        { "data-testid": "modal-header", ...props },
        children
      ),
    ModalBody: ({ children, ...props }) =>
      mockReact.createElement(
        "div",
        { "data-testid": "modal-body", ...props },
        children
      ),
    ModalFooter: ({ children, ...props }) =>
      mockReact.createElement(
        "div",
        { "data-testid": "modal-footer", ...props },
        children
      ),
  };
});

// FontAwesome 모킹 - React 참조 제거
jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: ({ icon, ...props }) => {
    const mockReact = require("react");
    return mockReact.createElement("i", {
      "data-testid": "fontawesome-icon",
      ...props,
    });
  },
}));

jest.mock("@fortawesome/free-solid-svg-icons", () => ({
  faSearch: "faSearch",
}));

// React Router 컴포넌트들 부분 모킹
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  Link: ({ children, to, ...props }) => {
    const mockReact = require("react");
    return mockReact.createElement(
      "a",
      { "data-testid": "link", href: to, ...props },
      children
    );
  },
  NavLink: ({ children, to, className, ...props }) => {
    const mockReact = require("react");
    return mockReact.createElement(
      "a",
      { "data-testid": "nav-link", href: to, className, ...props },
      children
    );
  },
}));

// 전역 설정들
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

global.sessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

global.confirm = jest.fn(() => true);
global.alert = jest.fn();

// 콘솔 에러 필터링
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      (args[0].includes("Warning: ReactDOM.render") ||
        args[0].includes("Warning: validateDOMNesting") ||
        args[0].includes("Warning: React.createElement") ||
        args[0].includes("Warning: React.jsx"))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
