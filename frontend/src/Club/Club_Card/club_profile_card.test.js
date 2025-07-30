// src/Club/Club_Card/club_profile_card.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import ProfileCard from './club_profile_card';

// 이미지 모킹
jest.mock('../../Assets/profile.jpg', () => 'profile-image.jpg');

describe('ProfileCard Component', () => {
  const mockProps = {
    name: '김동아리',
    memberLevel: '회장'
  };

  test('ProfileCard 컴포넌트가 정상적으로 렌더링된다', () => {
    render(<ProfileCard {...mockProps} />);
    
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  test('전달받은 name이 올바르게 표시된다', () => {
    render(<ProfileCard {...mockProps} />);
    
    expect(screen.getByText('김동아리')).toBeInTheDocument();
  });

  test('전달받은 memberLevel이 올바르게 표시된다', () => {
    render(<ProfileCard {...mockProps} />);
    
    expect(screen.getByText('회장')).toBeInTheDocument();
  });

  test('프로필 이미지가 올바르게 렌더링된다', () => {
    render(<ProfileCard {...mockProps} />);
    
    const profileImage = screen.getByTestId('card-img');
    expect(profileImage).toBeInTheDocument();
    expect(profileImage).toHaveAttribute('src', 'profile-image.jpg');
  });

  test('Card 구조가 올바르게 구성된다', () => {
    render(<ProfileCard {...mockProps} />);
    
    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('card-img')).toBeInTheDocument();
    expect(screen.getByTestId('card-body')).toBeInTheDocument();
    expect(screen.getByTestId('card-title')).toBeInTheDocument();
    expect(screen.getByTestId('card-text')).toBeInTheDocument();
  });

  test('Card에 올바른 CSS 클래스가 적용된다', () => {
    render(<ProfileCard {...mockProps} />);
    
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('profile-card');
    expect(card).toHaveClass('text-center');
  });

  test('빈 문자열 props가 전달되어도 정상적으로 렌더링된다', () => {
    render(<ProfileCard name="" memberLevel="" />);
    
    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('card-title')).toBeInTheDocument();
    expect(screen.getByTestId('card-text')).toBeInTheDocument();
  });

  test('undefined props가 전달되어도 정상적으로 렌더링된다', () => {
    render(<ProfileCard name={undefined} memberLevel={undefined} />);
    
    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('card-title')).toBeInTheDocument();
    expect(screen.getByTestId('card-text')).toBeInTheDocument();
  });

  test('특수문자가 포함된 이름이 올바르게 표시된다', () => {
    render(<ProfileCard name="김-동아리_123" memberLevel="부회장" />);
    
    expect(screen.getByText('김-동아리_123')).toBeInTheDocument();
    expect(screen.getByText('부회장')).toBeInTheDocument();
  });

  test('긴 텍스트가 포함된 props가 올바르게 표시된다', () => {
    const longName = '매우 긴 이름을 가진 동아리 회원';
    const longMemberLevel = '수석 부회장 겸 총무부장';
    
    render(<ProfileCard name={longName} memberLevel={longMemberLevel} />);
    
    expect(screen.getByText(longName)).toBeInTheDocument();
    expect(screen.getByText(longMemberLevel)).toBeInTheDocument();
  });

  test('Bootstrap CSS가 문제없이 적용된다', () => {
    expect(() => {
      render(<ProfileCard {...mockProps} />);
    }).not.toThrow();
  });
});