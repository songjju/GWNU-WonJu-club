import * as actionTypes from './actionTypes';

describe('Action Types', () => {
  test('모든 액션 타입이 정의되어 있다', () => {
    expect(actionTypes).toBeDefined();
    const values = Object.values(actionTypes);
    expect(values.length).toBeGreaterThan(0);
  });
});