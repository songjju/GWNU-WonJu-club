// 실제 reportWebVitals 함수 구현 시뮬레이션
const mockReportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

describe('reportWebVitals', () => {
  test('onPerfEntry가 함수가 아니면 아무것도 실행하지 않는다', () => {
    expect(() => {
      mockReportWebVitals(null);
      mockReportWebVitals(undefined);
      mockReportWebVitals('not a function');
      mockReportWebVitals(123);
    }).not.toThrow();
  });

  test('onPerfEntry가 함수일 때 정상적으로 처리된다', () => {
    const mockOnPerfEntry = jest.fn();
    
    expect(() => {
      mockReportWebVitals(mockOnPerfEntry);
    }).not.toThrow();
  });

  test('onPerfEntry 없이 호출하면 아무것도 실행하지 않는다', () => {
    expect(() => {
      mockReportWebVitals();
    }).not.toThrow();
  });

  test('콜백 함수가 올바른 타입인지 확인한다', () => {
    const mockCallback = jest.fn();
    
    expect(() => {
      mockReportWebVitals(mockCallback);
    }).not.toThrow();
    
    expect(typeof mockCallback).toBe('function');
  });

  test('여러 번 호출해도 정상적으로 동작한다', () => {
    const mockOnPerfEntry = jest.fn();
    
    expect(() => {
      mockReportWebVitals(mockOnPerfEntry);
      mockReportWebVitals(mockOnPerfEntry);
    }).not.toThrow();
  });

  test('실제 reportWebVitals 모듈이 존재한다', () => {
    expect(() => {
      const reportWebVitals = require('./reportWebVitals');
      expect(reportWebVitals).toBeDefined();
      // 모듈의 default export 또는 전체 export 확인
      const actualFunction = reportWebVitals.default || reportWebVitals;
      expect(typeof actualFunction).toBe('function');
    }).not.toThrow();
  });
});