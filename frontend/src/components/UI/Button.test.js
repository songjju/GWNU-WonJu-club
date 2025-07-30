import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

const Button = ({ children, onClick, disabled = false, variant = 'primary', ...props }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`btn btn-${variant}`}
    data-testid="custom-button"
    {...props}
  >
    {children}
  </button>
);

describe('Button Component', () => {
  test('Button이 올바르게 렌더링된다', () => {
    render(<Button>클릭하세요</Button>);
    
    expect(screen.getByTestId('custom-button')).toBeInTheDocument();
    expect(screen.getByText('클릭하세요')).toBeInTheDocument();
  });

  test('클릭 이벤트가 올바르게 동작한다', () => {
    const mockClick = jest.fn();
    render(<Button onClick={mockClick}>클릭하세요</Button>);
    
    fireEvent.click(screen.getByTestId('custom-button'));
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  test('disabled 상태가 올바르게 적용된다', () => {
    const mockClick = jest.fn();
    render(<Button onClick={mockClick} disabled>클릭하세요</Button>);
    
    const button = screen.getByTestId('custom-button');
    expect(button).toBeDisabled();
    
    fireEvent.click(button);
    expect(mockClick).not.toHaveBeenCalled();
  });

  test('variant가 올바르게 적용된다', () => {
    render(<Button variant="secondary">버튼</Button>);
    
    const button = screen.getByTestId('custom-button');
    expect(button).toHaveClass('btn-secondary');
  });
});