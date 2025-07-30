import React from 'react';
import { render, screen } from '@testing-library/react';

const Footer = () => (
  <footer data-testid="footer" className="app-footer">
    <p>&copy; 2024 강릉원주대학교 원주캠퍼스 동아리</p>
    <div className="footer-links">
      <a href="/privacy" data-testid="privacy-link">개인정보처리방침</a>
      <a href="/terms" data-testid="terms-link">이용약관</a>
      <a href="/contact" data-testid="contact-link">문의하기</a>
    </div>
  </footer>
);

describe('Footer Component', () => {
  test('Footer가 올바르게 렌더링된다', () => {
    render(<Footer />);
    
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByText('© 2024 강릉원주대학교 원주캠퍼스 동아리')).toBeInTheDocument();
  });

  test('푸터 링크들이 올바르게 표시된다', () => {
    render(<Footer />);
    
    expect(screen.getByTestId('privacy-link')).toHaveAttribute('href', '/privacy');
    expect(screen.getByTestId('terms-link')).toHaveAttribute('href', '/terms');
    expect(screen.getByTestId('contact-link')).toHaveAttribute('href', '/contact');
  });

  test('푸터 링크 텍스트가 올바르게 표시된다', () => {
    render(<Footer />);
    
    expect(screen.getByText('개인정보처리방침')).toBeInTheDocument();
    expect(screen.getByText('이용약관')).toBeInTheDocument();
    expect(screen.getByText('문의하기')).toBeInTheDocument();
  });
});