describe('Redux Store Configuration', () => {
  test('store와 persistor가 내보내기된다', () => {
    const store = require('./configureStore').default;
    const { persistor } = require('./configureStore');
    
    expect(store).toBeDefined();
    expect(persistor).toBeDefined();
  });

  test('store가 객체이다', () => {
    const store = require('./configureStore').default;
    expect(typeof store).toBe('object');
  });

  test('persistor가 객체이다', () => {
    const { persistor } = require('./configureStore');
    expect(typeof persistor).toBe('object');
  });
});