import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import SignUpPage from './SignUpPage';

const store = configureStore({
  reducer: { auth: (state = {}, action) => state }
});

describe('SignUpPage Component', () => {
  test('SignUpPage가 렌더링된다', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <SignUpPage />
        </BrowserRouter>
      </Provider>
    );
    expect(document.body).toBeInTheDocument();
  });
});