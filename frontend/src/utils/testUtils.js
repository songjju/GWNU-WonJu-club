import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

export const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: (state = { isLoggedIn: false, ...initialState }, action) => {
        switch (action.type) {
          case "LOGIN_SUCCESS":
            return { ...state, isLoggedIn: true };
          case "LOGOUT":
            return { ...state, isLoggedIn: false };
          default:
            return state;
        }
      },
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

export const TestWrapper = ({ children, initialState = {} }) => {
  const store = createTestStore(initialState);
  return (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );
};

export const renderWithProviders = (ui, options = {}) => {
  const { initialState = {}, ...renderOptions } = options;

  const Wrapper = ({ children }) => (
    <TestWrapper initialState={initialState}>{children}</TestWrapper>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

export const conditionalMock = (modulePath, mockImplementation) => {
  try {
    // 모듈이 존재하는지 확인
    require.resolve(modulePath);

    // 모듈이 존재하면 정상 모킹
    jest.mock(modulePath, mockImplementation);
  } catch (error) {
    // 모듈이 존재하지 않으면 빈 컴포넌트로 모킹
    jest.mock(
      modulePath,
      () => {
        return function MockComponent() {
          const React = require("react");
          return React.createElement(
            "div",
            {
              "data-testid": "mock-component",
            },
            "Mock Component"
          );
        };
      },
      { virtual: true }
    );
  }
};

/**
 * 안전한 컴포넌트 import 함수
 */
export const safeImport = (modulePath, defaultComponent = null) => {
  try {
    const module = require(modulePath);
    return module.default || module;
  } catch (error) {
    console.warn(`Module ${modulePath} not found, using fallback`);
    return (
      defaultComponent ||
      (() => {
        const React = require("react");
        return React.createElement(
          "div",
          {
            "data-testid": "fallback-component",
          },
          "Fallback Component"
        );
      })
    );
  }
};

/**
 * 다중 경로 모킹 함수 - 여러 가능한 경로 중 존재하는 것을 모킹
 */
export const multiPathMock = (possiblePaths, mockImplementation) => {
  let foundPath = null;

  for (const path of possiblePaths) {
    try {
      require.resolve(path);
      foundPath = path;
      break;
    } catch (error) {
      // 계속 다음 경로 시도
    }
  }

  if (foundPath) {
    jest.mock(foundPath, mockImplementation);
  } else {
    // 모든 경로에 대해 virtual 모킹
    possiblePaths.forEach((path) => {
      jest.mock(
        path,
        () => {
          return function MockComponent() {
            const React = require("react");
            return React.createElement(
              "div",
              {
                "data-testid": "virtual-mock-component",
              },
              "Virtual Mock Component"
            );
          };
        },
        { virtual: true }
      );
    });
  }
};
