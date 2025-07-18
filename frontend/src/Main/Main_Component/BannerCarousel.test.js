// src/Main/Main_Component/BannerCarousel.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import BannerCarousel from './BannerCarousel';

// React Bootstrap의 Carousel 컴포넌트 모킹
jest.mock('react-bootstrap', () => ({
  Carousel: ({ children, interval }) => (
    <div data-testid="carousel" data-interval={interval}>
      {children}
    </div>
  )
}));

// Carousel.Item을 별도로 모킹
jest.mock('react-bootstrap', () => {
  const MockCarousel = ({ children, interval }) => (
    <div data-testid="carousel" data-interval={interval}>
      {children}
    </div>
  );
  
  MockCarousel.Item = ({ children }) => (
    <div data-testid="carousel-item">
      {children}
    </div>
  );
  
  return {
    Carousel: MockCarousel
  };
});

describe('BannerCarousel Component', () => {
  beforeEach(() => {
    // 각 테스트 전에 모킹 초기화
    jest.clearAllMocks();
  });

  test('BannerCarousel 컴포넌트가 정상적으로 렌더링된다', () => {
    render(<BannerCarousel />);
    
    // 카루셀 컨테이너 확인
    const carouselContainer = document.querySelector('.carousel-container');
    expect(carouselContainer).toBeInTheDocument();
  });

  test('Carousel 컴포넌트가 올바른 interval로 렌더링된다', () => {
    render(<BannerCarousel />);
    
    const carousel = screen.getByTestId('carousel');
    expect(carousel).toBeInTheDocument();
    expect(carousel).toHaveAttribute('data-interval', '3000');
  });

  test('배너 이미지들이 올바르게 렌더링된다', () => {
    render(<BannerCarousel />);
    
    // 첫 번째 배너 이미지 확인
    const firstImage = screen.getByAltText('First slide');
    expect(firstImage).toBeInTheDocument();
    expect(firstImage).toHaveAttribute('src', '/photo/bannerimg1.jpg');
    expect(firstImage).toHaveClass('carousel-image');
    
    // 두 번째 배너 이미지 확인
    const secondImage = screen.getByAltText('Second slide');
    expect(secondImage).toBeInTheDocument();
    expect(secondImage).toHaveAttribute('src', '/photo/bannerimg2.jpg');
    expect(secondImage).toHaveClass('carousel-image');
  });

  test('Carousel Item들이 올바르게 렌더링된다', () => {
    render(<BannerCarousel />);
    
    const carouselItems = screen.getAllByTestId('carousel-item');
    expect(carouselItems).toHaveLength(2);
  });

  test('이미지가 로드되지 않을 때 대체 텍스트가 표시된다', () => {
    render(<BannerCarousel />);
    
    // 이미지의 alt 속성 확인
    expect(screen.getByAltText('First slide')).toBeInTheDocument();
    expect(screen.getByAltText('Second slide')).toBeInTheDocument();
  });
});