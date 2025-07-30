// src/Event/Event_Component/ParentComponent.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ParentComponent from './ParentComponent';

// CreateEvent와 EventCard 컴포넌트 모킹
jest.mock('./CreateEvent', () => {
  return function MockCreateEvent({ onCreateEvent }) {
    return (
      <div data-testid="create-event">
        <button 
          onClick={() => onCreateEvent({ 
            id: 1, 
            title: '테스트 이벤트', 
            content: '테스트 내용' 
          })}
        >
          이벤트 생성
        </button>
      </div>
    );
  };
});

jest.mock('../Main/EventCard', () => {
  return function MockEventCard({ events }) {
    return (
      <div data-testid="event-card">
        {events.map((event, index) => (
          <div key={index} data-testid="event-item">
            <h3>{event.title}</h3>
            <p>{event.content}</p>
          </div>
        ))}
      </div>
    );
  };
});

const TestWrapper = ({ children }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};

describe('ParentComponent', () => {
  test('ParentComponent가 정상적으로 렌더링된다', () => {
    render(
      <TestWrapper>
        <ParentComponent />
      </TestWrapper>
    );
    
    expect(screen.getByTestId('create-event')).toBeInTheDocument();
    expect(screen.getByTestId('event-card')).toBeInTheDocument();
  });

  test('초기 상태에서 이벤트 목록이 비어있다', () => {
    render(
      <TestWrapper>
        <ParentComponent />
      </TestWrapper>
    );
    
    // 이벤트 아이템이 없어야 함
    expect(screen.queryByTestId('event-item')).not.toBeInTheDocument();
  });

  test('새 이벤트 생성 시 이벤트 목록에 추가된다', () => {
    render(
      <TestWrapper>
        <ParentComponent />
      </TestWrapper>
    );
    
    const createButton = screen.getByText('이벤트 생성');
    fireEvent.click(createButton);
    
    // 새로 생성된 이벤트가 목록에 표시되어야 함
    expect(screen.getByText('테스트 이벤트')).toBeInTheDocument();
    expect(screen.getByText('테스트 내용')).toBeInTheDocument();
    expect(screen.getByTestId('event-item')).toBeInTheDocument();
  });

  test('여러 이벤트를 생성할 수 있다', () => {
    render(
      <TestWrapper>
        <ParentComponent />
      </TestWrapper>
    );
    
    const createButton = screen.getByText('이벤트 생성');
    
    // 첫 번째 이벤트 생성
    fireEvent.click(createButton);
    expect(screen.getAllByTestId('event-item')).toHaveLength(1);
    
    // 두 번째 이벤트 생성
    fireEvent.click(createButton);
    expect(screen.getAllByTestId('event-item')).toHaveLength(2);
  });

  test('CreateEvent 컴포넌트에 onCreateEvent 콜백이 전달된다', () => {
    render(
      <TestWrapper>
        <ParentComponent />
      </TestWrapper>
    );
    
    // CreateEvent 컴포넌트가 렌더링되고 버튼이 있는지 확인
    expect(screen.getByText('이벤트 생성')).toBeInTheDocument();
  });

  test('EventCard 컴포넌트에 events 데이터가 전달된다', () => {
    render(
      <TestWrapper>
        <ParentComponent />
      </TestWrapper>
    );
    
    // EventCard 컴포넌트가 렌더링되는지 확인
    expect(screen.getByTestId('event-card')).toBeInTheDocument();
    
    // 이벤트 생성 후 EventCard에 데이터가 전달되는지 확인
    const createButton = screen.getByText('이벤트 생성');
    fireEvent.click(createButton);
    
    expect(screen.getByText('테스트 이벤트')).toBeInTheDocument();
  });

  test('컴포넌트 구조가 올바르게 구성된다', () => {
    const { container } = render(
      <TestWrapper>
        <ParentComponent />
      </TestWrapper>
    );
    
    // div 컨테이너가 있는지 확인
    const mainDiv = container.firstChild;
    expect(mainDiv).toBeInTheDocument();
    expect(mainDiv.tagName).toBe('DIV');
    
    // CreateEvent와 EventCard가 모두 포함되어 있는지 확인
    expect(screen.getByTestId('create-event')).toBeInTheDocument();
    expect(screen.getByTestId('event-card')).toBeInTheDocument();
  });
});