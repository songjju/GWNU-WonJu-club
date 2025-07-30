import '@testing-library/jest-dom';

// axios 모킹
jest.mock('axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
  },
}));

// ReactBootstrap 모킹
jest.mock('react-bootstrap', () => {
  const mockReact = require('react');
  
  const MockComponent = ({ children, className, ...props }) => {
    const Component = props.as || 'div';
    return mockReact.createElement(Component, { className, ...props }, children);
  };

  const MockNavbarBrand = ({ children, as, to, className, ...props }) => {
    if (as) {
      return mockReact.createElement(as, { to, className, ...props }, children);
    }
    return mockReact.createElement('div', { className, ...props }, children);
  };

  const MockNavLink = ({ children, as, to, onClick, className, ...props }) => {
    if (as === 'div') {
      return mockReact.createElement('div', { onClick, className, ...props }, children);
    }
    if (as) {
      return mockReact.createElement(as, { to, className, ...props }, children);
    }
    return mockReact.createElement('a', { onClick, className, ...props }, children);
  };
  
  const Navbar = ({ children, className, expand, ...props }) => (
    mockReact.createElement('nav', { 
      'data-testid': 'navbar', 
      className, 
      ...props 
    }, children)
  );

  Navbar.Brand = MockNavbarBrand;
  Navbar.Toggle = ({ children, ...props }) => (
    mockReact.createElement('button', { 
      'data-testid': 'navbar-toggle', 
      ...props 
    }, children)
  );
  Navbar.Collapse = ({ children, id, ...props }) => (
    mockReact.createElement('div', { 
      'data-testid': 'navbar-collapse', 
      id, 
      ...props 
    }, children)
  );

  const Nav = ({ children, className, ...props }) => (
    mockReact.createElement('div', { 
      'data-testid': 'nav', 
      className, 
      ...props 
    }, children)
  );

  Nav.Link = MockNavLink;

  // Card 컴포넌트와 하위 컴포넌트들 모킹
  const Card = ({ children, className, ...props }) => (
    mockReact.createElement('div', { 
      'data-testid': 'card', 
      className, 
      ...props 
    }, children)
  );

  Card.Img = ({ variant, src, alt, ...props }) => (
    mockReact.createElement('img', { 
      'data-testid': 'card-img',
      src,
      alt,
      ...props 
    })
  );

  Card.Body = ({ children, ...props }) => (
    mockReact.createElement('div', { 
      'data-testid': 'card-body', 
      ...props 
    }, children)
  );

  Card.Title = ({ children, ...props }) => (
    mockReact.createElement('h5', { 
      'data-testid': 'card-title', 
      ...props 
    }, children)
  );

  Card.Text = ({ children, ...props }) => (
    mockReact.createElement('p', { 
      'data-testid': 'card-text', 
      ...props 
    }, children)
  );

  return {
    Container: ({ children, fluid, ...props }) => 
      mockReact.createElement('div', { 'data-testid': 'container', ...props }, children),
    Row: ({ children, className, ...props }) => 
      mockReact.createElement('div', { 'data-testid': 'row', className, ...props }, children),
    Col: ({ children, xs, md, ...props }) => 
      mockReact.createElement('div', { 'data-testid': 'col', ...props }, children),
    Navbar,
    Nav,
    Button: ({ children, variant, onClick, ...props }) => 
      mockReact.createElement('button', { 'data-testid': 'button', onClick, ...props }, children),
    Carousel: ({ children, interval, ...props }) => 
      mockReact.createElement('div', { 'data-testid': 'carousel', 'data-interval': interval, ...props }, children),
    Table: ({ children, ...props }) => 
      mockReact.createElement('table', { 'data-testid': 'table', ...props }, children),
    Input: ({ ...props }) => 
      mockReact.createElement('input', { 'data-testid': 'input', ...props }),
    Dropdown: ({ children, ...props }) => 
      mockReact.createElement('div', { 'data-testid': 'dropdown', ...props }, children),
    DropdownToggle: ({ children, caret, ...props }) => {
      // caret prop 제거
      const { caret: _, ...restProps } = props;
      return mockReact.createElement('button', { 'data-testid': 'dropdown-toggle', ...restProps }, children);
    },
    DropdownMenu: ({ children, ...props }) => 
      mockReact.createElement('div', { 'data-testid': 'dropdown-menu', ...props }, children),
    DropdownItem: ({ children, divider, ...props }) => {
      // divider prop 처리
      if (divider) {
        return mockReact.createElement('hr', { 'data-testid': 'dropdown-item' });
      }
      return mockReact.createElement('div', { 'data-testid': 'dropdown-item', ...props }, children);
    },
    Modal: ({ children, isOpen, toggle, ...props }) => {
      // toggle prop 제거
      const { toggle: _, ...restProps } = props;
      return isOpen ? mockReact.createElement('div', { 'data-testid': 'modal', ...restProps }, children) : null;
    },
    ModalHeader: ({ children, toggle, ...props }) => 
      mockReact.createElement('div', { 'data-testid': 'modal-header', ...props }, children),
    ModalBody: ({ children, ...props }) => 
      mockReact.createElement('div', { 'data-testid': 'modal-body', ...props }, children),
    ModalFooter: ({ children, ...props }) => 
      mockReact.createElement('div', { 'data-testid': 'modal-footer', ...props }, children),
    Card
  };
});

// reactstrap도 모킹
jest.mock('reactstrap', () => {
  const mockReact = require('react');
  return {
    Table: ({ children, ...props }) => 
      mockReact.createElement('table', { 'data-testid': 'table', ...props }, children),
    Button: ({ children, color, onClick, ...props }) => 
      mockReact.createElement('button', { 'data-testid': 'button', onClick, ...props }, children),
    Input: ({ ...props }) => 
      mockReact.createElement('input', { 'data-testid': 'input', ...props }),
    Dropdown: ({ children, isOpen, toggle, ...props }) => 
      mockReact.createElement('div', { 'data-testid': 'dropdown', ...props }, children),
    DropdownToggle: ({ children, caret, ...props }) => {
      // caret prop 제거
      const { caret: _, ...restProps } = props;
      return mockReact.createElement('button', { 'data-testid': 'dropdown-toggle', ...restProps }, children);
    },
    DropdownMenu: ({ children, ...props }) => 
      mockReact.createElement('div', { 'data-testid': 'dropdown-menu', ...props }, children),
    DropdownItem: ({ children, divider, ...props }) => {
      // divider prop 처리
      if (divider) {
        return mockReact.createElement('hr', { 'data-testid': 'dropdown-item' });
      }
      return mockReact.createElement('div', { 'data-testid': 'dropdown-item', ...props }, children);
    },
    Modal: ({ children, isOpen, toggle, ...props }) => {
      // toggle prop 제거
      const { toggle: _, ...restProps } = props;
      return isOpen ? mockReact.createElement('div', { 'data-testid': 'modal', ...restProps }, children) : null;
    },
    ModalHeader: ({ children, toggle, ...props }) => {
      // toggle prop을 제거하고 나머지 props만 전달
      const { toggle: _, ...restProps } = props;
      return mockReact.createElement('div', { 'data-testid': 'modal-header', ...restProps }, children);
    },
    ModalBody: ({ children, ...props }) => 
      mockReact.createElement('div', { 'data-testid': 'modal-body', ...props }, children),
    ModalFooter: ({ children, ...props }) => 
      mockReact.createElement('div', { 'data-testid': 'modal-footer', ...props }, children)
  };
});

// FontAwesome 모킹
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon, ...props }) => {
    const mockReact = require('react');
    return mockReact.createElement('i', { 'data-testid': 'fontawesome-icon', ...props });
  }
}));

jest.mock('@fortawesome/free-solid-svg-icons', () => ({
  faSearch: 'faSearch'
}));

// React Router 컴포넌트들 부분 모킹
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ children, to, ...props }) => {
    const mockReact = require('react');
    return mockReact.createElement('a', { 'data-testid': 'link', href: to, ...props }, children);
  },
  NavLink: ({ children, to, className, ...props }) => {
    const mockReact = require('react');
    return mockReact.createElement('a', { 'data-testid': 'nav-link', href: to, className, ...props }, children);
  }
}));

// 이미지 파일 모킹
jest.mock('../../Assets/profile.jpg', () => 'test-profile-image.jpg');

// 전역 설정들
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
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
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
       args[0].includes('Warning: validateDOMNesting') ||
       args[0].includes('Warning: React.createElement') ||
       args[0].includes('Warning: React.jsx') ||
       args[0].includes('Warning: Invalid value for prop') ||
       args[0].includes('Warning: Received') ||
       args[0].includes('Warning: React does not recognize') ||
       args[0].includes('Warning: Received `true` for a non-boolean attribute') ||
       args[0].includes('Warning: Each child in a list should have a unique "key" prop') ||
       args[0].includes('useLocation() may be used only in the context of a <Router>') ||
       args[0].includes('Cannot read properties of undefined') ||
       args[0].includes('The above error occurred in the') ||
       args[0].includes('Consider adding an error boundary') ||
       args[0].includes('controlId') ||
       args[0].includes('fluid') ||
       args[0].includes('variant') ||
       args[0].includes('expand') ||
       args[0].includes('caret') ||
       args[0].includes('divider') ||
       args[0].includes('is a void element tag')) ||
       args[0].includes('for a non-boolean attribute')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// 이미지 파일들을 일반적으로 모킹
jest.mock.doMock = jest.fn();

// 일반적인 이미지 파일 확장자들 모킹
const mockImageFiles = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];
mockImageFiles.forEach(ext => {
  jest.doMock(`*${ext}`, () => `test-image${ext}`, { virtual: true });
});

// Assets 폴더의 이미지들 개별 모킹
jest.mock('../Assets/profile.jpg', () => 'test-profile-image.jpg');
jest.mock('../Assets/club_logo.png', () => 'test-club-logo.png');
jest.mock('../Assets/default_background.png', () => 'test-background.png');
jest.mock('../Assets/image.jpg', () => 'test-image.jpg');