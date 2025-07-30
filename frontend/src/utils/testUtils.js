import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

export const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: (state = { isLoggedIn: false, ...initialState }, action) => {
        switch (action.type) {
          case 'LOGIN_SUCCESS':
            return { ...state, isLoggedIn: true };
          case 'LOGOUT':
            return { ...state, isLoggedIn: false };
          default:
            return state;
        }
      }
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false
      })
  });
};

export const TestWrapper = ({ children, initialState = {} }) => {
  const store = createTestStore(initialState);
  return (
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  );
};

export const renderWithProviders = (ui, options = {}) => {
  const { initialState = {}, ...renderOptions } = options;
  
  const Wrapper = ({ children }) => (
    <TestWrapper initialState={initialState}>
      {children}
    </TestWrapper>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};