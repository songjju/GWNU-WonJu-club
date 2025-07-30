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

// React Bootstrap 완전 모킹 - 개선된 버전
jest.mock('react-bootstrap', () => {
  const mockReact = require('react');
  
  const MockComponent = ({ children, className, as, fluid, xs, md, lg, ...props }) => {
    // DOM에서 허용되지 않는 props 필터링
    const { controlId, expand, variant, interval, isOpen, toggle, ...domProps } = props;
    const Component = as || 'div';
    
    // fluid prop은 Container에서만 사용되므로 문자열로 변환하지 않고 제거
    if (Component === 'div' && fluid !== undefined) {
      delete domProps.fluid;
    }
    
    return mockReact.createElement(Component, { 
      className, 
      'data-testid': `${Component}`,
      ...domProps 
    }, children);
  };

  const MockForm = ({ children, className, onSubmit, ...props }) => {
    // Form에서 controlId 제거
    const { controlId, ...domProps } = props;
    return mockReact.createElement('form', { 
      className, 
      onSubmit,
      'data-testid': 'form',
      ...domProps 
    }, children);
  };

  const MockFormGroup = ({ children, className, controlId, ...props }) => {
    // controlId는 DOM에 전달하지 않음
    return mockReact.createElement('div', { 
      className, 
      'data-testid': 'form-group',
      ...props 
    }, children);
  };

  const MockFormControl = ({ as, type, value, onChange, placeholder, className, controlId, ...props }) => {
    // controlId 제거하고 input 요소에 children이 없도록 보장
    const { children, ...inputProps } = props;
    const Component = as || 'input';
    
    if (Component === 'input') {
      return mockReact.createElement('input', { 
        type,
        value,
        onChange,
        placeholder,
        className,
        'data-testid': 'form-control',
        ...inputProps
      });
    }
    
    return mockReact.createElement(Component, { 
      value,
      onChange,
      placeholder,
      className,
      'data-testid': 'form-control',
      ...inputProps 
    }, children);
  };

  const MockNavbarBrand = ({ children, as, to, className, ...props }) => {
    if (as) {
      return mockReact.createElement(as, { to, className, 'data-testid': 'navbar-brand', ...props }, children);
    }
    return mockReact.createElement('div', { className, 'data-testid': 'navbar-brand', ...props }, children);
  };

  const MockNavLink = ({ children, as, to, onClick, className, ...props }) => {
    if (as === 'div') {
      return mockReact.createElement('div', { onClick, className, 'data-testid': 'nav-link', ...props }, children);
    }
    if (as) {
      return mockReact.createElement(as, { to, className, 'data-testid': 'nav-link', ...props }, children);
    }
    return mockReact.createElement('a', { onClick, className, 'data-testid': 'nav-link', ...props }, children);
  };
  
  const Navbar = ({ children, className, expand, ...props }) => {
    // expand prop 제거
    const { fluid, ...domProps } = props;
    return mockReact.createElement('nav', { 
      'data-testid': 'navbar', 
      className, 
      ...domProps 
    }, children);
  };

  // Navbar의 하위 컴포넌트들을 Navbar 객체의 속성으로 설정
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

  // Nav의 하위 컴포넌트
  Nav.Link = MockNavLink;

  const MockCarousel = ({ children, interval, ...props }) => (
    mockReact.createElement('div', { 
      'data-testid': 'carousel', 
      'data-interval': interval, 
      ...props 
    }, children)
  );

  MockCarousel.Item = ({ children, ...props }) => (
    mockReact.createElement('div', { 
      'data-testid': 'carousel-item', 
      ...props 
    }, children)
  );

  const MockCard = ({ children, className, ...props }) => (
    mockReact.createElement('div', { 
      'data-testid': 'card', 
      className,
      ...props 
    }, children)
  );

  MockCard.Img = ({ variant, src, alt, ...props }) => (
    mockReact.createElement('img', { 
      'data-testid': 'card-img', 
      src,
      alt,
      ...props 
    })
  );

  MockCard.Body = ({ children, ...props }) => (
    mockReact.createElement('div', { 
      'data-testid': 'card-body', 
      ...props 
    }, children)
  );

  MockCard.Title = ({ children, ...props }) => (
    mockReact.createElement('h5', { 
      'data-testid': 'card-title', 
      ...props 
    }, children)
  );

  MockCard.Text = ({ children, ...props }) => (
    mockReact.createElement('p', { 
      'data-testid': 'card-text', 
      ...props 
    }, children)
  );

  return {
    Container: ({ children, fluid, ...props }) => {
      // fluid prop을 DOM에 전달하지 않음
      return mockReact.createElement('div', { 'data-testid': 'container', ...props }, children);
    },
    Row: ({ children, className, ...props }) => 
      mockReact.createElement('div', { 'data-testid': 'row', className, ...props }, children),
    Col: ({ children, xs, md, lg, ...props }) => {
      // Bootstrap specific props 제거
      return mockReact.createElement('div', { 'data-testid': 'col', ...props }, children);
    },
    Form: MockForm,
    'Form.Group': MockFormGroup,
    'Form.Control': MockFormControl,
    'Form.Label': ({ children, ...props }) => 
      mockReact.createElement('label', { 'data-testid': 'form-label', ...props }, children),
    Navbar,
    Nav,
    Button: ({ children, variant, onClick, ...props }) => {
      // variant prop 제거
      return mockReact.createElement('button', { 'data-testid': 'button', onClick, ...props }, children);
    },
    Carousel: MockCarousel,
    Card: MockCard,
    Table: ({ children, ...props }) => 
      mockReact.createElement('table', { 'data-testid': 'table', ...props }, children),
    Modal: ({ children, show, onHide, ...props }) => 
      show ? mockReact.createElement('div', { 'data-testid': 'modal', ...props }, children) : null,
    'Modal.Header': ({ children, ...props }) => 
      mockReact.createElement('div', { 'data-testid': 'modal-header', ...props }, children),
    'Modal.Body': ({ children, ...props }) => 
      mockReact.createElement('div', { 'data-testid': 'modal-body', ...props }, children),
    'Modal.Footer': ({ children, ...props }) => 
      mockReact.createElement('div', { 'data-testid': 'modal-footer', ...props }, children)
  };
});

// reactstrap 모킹 - 개선된 버전
jest.mock('reactstrap', () => {
  const mockReact = require('react');
  return {
    Table: ({ children, ...props }) => 
      mockReact.createElement('table', { 'data-testid': 'table', ...props }, children),
    Button: ({ children, color, onClick, ...props }) => {
      // color prop 제거
      return mockReact.createElement('button', { 'data-testid': 'button', onClick, ...props }, children);
    },
    Input: ({ type, value, onChange, placeholder, ...props }) => 
      mockReact.createElement('input', { 
        'data-testid': 'input', 
        type, 
        value, 
        onChange, 
        placeholder,
        ...props 
      }),
    Dropdown: ({ children, isOpen, toggle, ...props }) => {
      // isOpen, toggle props 제거
      return mockReact.createElement('div', { 'data-testid': 'dropdown', ...props }, children);
    },
    DropdownToggle: ({ children, caret, ...props }) => {
      // caret prop 제거
      return mockReact.createElement('button', { 'data-testid': 'dropdown-toggle', ...props }, children);
    },
    DropdownMenu: ({ children, ...props }) => 
      mockReact.createElement('div', { 'data-testid': 'dropdown-menu', ...props }, children),
    DropdownItem: ({ children, divider, ...props }) => {
      // divider prop 제거
      return mockReact.createElement('div', { 'data-testid': 'dropdown-item', ...props }, children);
    },
    Modal: ({ children, isOpen, toggle, ...props }) => 
      isOpen ? mockReact.createElement('div', { 'data-testid': 'modal', ...props }, children) : null,
    ModalHeader: ({ children, ...props }) => 
      mockReact.createElement('div', { 'data-testid': 'modal-header', ...props }, children),
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
  faSearch: 'faSearch',
  faUser: 'faUser',
  faBars: 'faBars'
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

// 콘솔 에러 필터링 - 더 포괄적으로 개선
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
       args[0].includes('Warning: validateDOMNesting') ||
       args[0].includes('Warning: React.createElement') ||
       args[0].includes('Warning: React.jsx') ||
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
       args[0].includes('is a void element tag'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});