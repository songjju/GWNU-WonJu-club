import React from 'react';
import { render } from '@testing-library/react';
import styled from 'styled-components';
import { BannerImage, ProfileImage, LogoImage } from './styles';

describe('Styled Components', () => {
  test('BannerImage 컴포넌트가 정상적으로 렌더링된다', () => {
    const { container } = render(<BannerImage src="test-banner.jpg" alt="Banner" />);
    
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'test-banner.jpg');
    expect(img).toHaveAttribute('alt', 'Banner');
  });

  test('BannerImage에 올바른 스타일이 적용된다', () => {
    const { container } = render(<BannerImage src="test-banner.jpg" alt="Banner" />);
    
    const img = container.querySelector('img');
    expect(img).toHaveStyle('width: 1600px');
    expect(img).toHaveStyle('height: 400px');
  });

  test('ProfileImage 컴포넌트가 정상적으로 렌더링된다', () => {
    const { container } = render(<ProfileImage src="profile.jpg" alt="Profile" />);
    
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'profile.jpg');
    expect(img).toHaveAttribute('alt', 'Profile');
  });

  test('ProfileImage에 올바른 스타일이 적용된다', () => {
    const { container } = render(<ProfileImage src="profile.jpg" alt="Profile" />);
    
    const img = container.querySelector('img');
    expect(img).toHaveStyle('width: 80px');
    expect(img).toHaveStyle('height: 80px');
  });

  test('LogoImage 컴포넌트가 정상적으로 렌더링된다', () => {
    const { container } = render(<LogoImage src="logo.png" alt="Logo" />);
    
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'logo.png');
    expect(img).toHaveAttribute('alt', 'Logo');
  });

  test('LogoImage에 올바른 스타일이 적용된다', () => {
    const { container } = render(<LogoImage src="logo.png" alt="Logo" />);
    
    const img = container.querySelector('img');
    expect(img).toHaveStyle('width: 80px');
    expect(img).toHaveStyle('height: 80px');
  });

  test('모든 이미지 컴포넌트가 img 태그로 렌더링된다', () => {
    const { container: bannerContainer } = render(<BannerImage />);
    const { container: profileContainer } = render(<ProfileImage />);
    const { container: logoContainer } = render(<LogoImage />);
    
    expect(bannerContainer.querySelector('img')).toBeInTheDocument();
    expect(profileContainer.querySelector('img')).toBeInTheDocument();
    expect(logoContainer.querySelector('img')).toBeInTheDocument();
  });

  test('Styled Components가 올바른 컴포넌트 타입을 가진다', () => {
    expect(BannerImage).toBeDefined();
    expect(ProfileImage).toBeDefined();
    expect(LogoImage).toBeDefined();
    
    // Styled components는 객체 형태 (React 컴포넌트)
    expect(typeof BannerImage).toBe('object');
    expect(typeof ProfileImage).toBe('object');
    expect(typeof LogoImage).toBe('object');
    
    // Styled components는 $typeof 속성을 가짐
    expect(BannerImage.$$typeof).toBeDefined();
    expect(ProfileImage.$$typeof).toBeDefined();
    expect(LogoImage.$$typeof).toBeDefined();
  });
});