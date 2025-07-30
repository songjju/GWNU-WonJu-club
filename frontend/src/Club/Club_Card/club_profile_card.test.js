import React from 'react';
import { render, screen } from '@testing-library/react';
import ProfileCard from './club_profile_card';

// 이미지 파일 모킹
jest.mock('../../Assets/profile.jpg', () => 'test-profile-image.jpg');

describe('ProfileCard Component', () => {
  test('ProfileCard 컴포넌트가 정상적으로 렌더링된다', () => {
    render(<ProfileCard name="홍길동" memberLevel="회장" />);
    
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  test('전달받은 name이 올바르게 표시된다', () => {
    render(<ProfileCard name="홍길동" memberLevel="회장" />);
    
    expect(screen.getByTestId('card-title')).toHaveTextContent('홍길동');
  });

  test('전달받은 memberLevel이 올바르게 표시된다', () => {
    render(<ProfileCard name="홍길동" memberLevel="회장" />);
    
    expect(screen.getByTestId('card-text')).toHaveTextContent('회장');
  });

  test('프로필 이미지가 올바르게 렌더링된다', () => {
    render(<ProfileCard name="홍길동" memberLevel="회장" />);
    
    const image = screen.getByTestId('card-img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'test-profile-image.jpg');
  });

  test('Card 구조가 올바르게 구성된다', () => {
    render(<ProfileCard name="홍길동" memberLevel="회장" />);
    
    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('card-img')).toBeInTheDocument();
    expect(screen.getByTestId('card-body')).toBeInTheDocument();
    expect(screen.getByTestId('card-title')).toBeInTheDocument();
    expect(screen.getByTestId('card-text')).toBeInTheDocument();
  });

  test('Card에 올바른 CSS 클래스가 적용된다', () => {
    render(<ProfileCard name="홍길동" memberLevel="회장" />);
    
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('profile-card', 'text-center');
  });

  test('빈 문자열 props가 전달되어도 정상적으로 렌더링된다', () => {
    render(<ProfileCard name="" memberLevel="" />);
    
    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('card-title')).toHaveTextContent('');
    expect(screen.getByTestId('card-text')).toHaveTextContent('');
  });

  test('undefined props가 전달되어도 정상적으로 렌더링된다', () => {
    render(<ProfileCard name={undefined} memberLevel={undefined} />);
    
    expect(screen.getByTestId('card')).toBeInTheDocument();
    // undefined는 빈 문자열로 렌더링됨
    expect(screen.getByTestId('card-title')).toBeInTheDocument();
    expect(screen.getByTestId('card-text')).toBeInTheDocument();
  });

  test('특수문자가 포함된 이름이 올바르게 표시된다', () => {
    const specialName = "홍길동@#$%";
    render(<ProfileCard name={specialName} memberLevel="회장" />);
    
    expect(screen.getByTestId('card-title')).toHaveTextContent(specialName);
  });

  test('긴 텍스트가 포함된 props가 올바르게 표시된다', () => {
    const longName = "매우긴이름을가진사용자입니다매우긴이름을가진사용자입니다";
    const longMemberLevel = "부회장겸총무겸기획팀장겸홍보팀장";
    
    render(<ProfileCard name={longName} memberLevel={longMemberLevel} />);
    
    expect(screen.getByTestId('card-title')).toHaveTextContent(longName);
    expect(screen.getByTestId('card-text')).toHaveTextContent(longMemberLevel);
  });
});