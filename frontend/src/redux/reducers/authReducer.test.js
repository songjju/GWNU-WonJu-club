describe("Auth Reducer", () => {
  const initialState = {
    isLoggedIn: false,
    user: null,
    token: null,
    loading: false,
    error: null,
  };

  const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case "LOGIN_SUCCESS":
        return {
          ...state,
          isLoggedIn: true,
          user: action.payload.user,
          token: action.payload.token,
          loading: false,
          error: null,
        };
      case "LOGOUT":
        return {
          ...state,
          isLoggedIn: false,
          user: null,
          token: null,
          loading: false,
          error: null,
        };
      case "LOGIN_REQUEST":
        return {
          ...state,
          loading: true,
          error: null,
        };
      case "LOGIN_FAILURE":
        return {
          ...state,
          loading: false,
          error: action.payload,
          isLoggedIn: false,
        };
      default:
        return state;
    }
  };

  test("초기 상태를 반환한다", () => {
    expect(authReducer(undefined, {})).toEqual(initialState);
  });

  test("LOGIN_SUCCESS 액션을 처리한다", () => {
    const action = {
      type: "LOGIN_SUCCESS",
      payload: {
        user: { email: "test@example.com" },
        token: "test_token",
      },
    };

    const expectedState = {
      ...initialState,
      isLoggedIn: true,
      user: { email: "test@example.com" },
      token: "test_token",
    };

    expect(authReducer(initialState, action)).toEqual(expectedState);
  });

  test("LOGOUT 액션을 처리한다", () => {
    const loggedInState = {
      ...initialState,
      isLoggedIn: true,
      user: { email: "test@example.com" },
      token: "test_token",
    };

    const action = { type: "LOGOUT" };

    expect(authReducer(loggedInState, action)).toEqual(initialState);
  });

  test("LOGIN_REQUEST 액션을 처리한다", () => {
    const action = { type: "LOGIN_REQUEST" };

    const expectedState = {
      ...initialState,
      loading: true,
    };

    expect(authReducer(initialState, action)).toEqual(expectedState);
  });

  test("LOGIN_FAILURE 액션을 처리한다", () => {
    const action = {
      type: "LOGIN_FAILURE",
      payload: "로그인에 실패했습니다",
    };

    const expectedState = {
      ...initialState,
      loading: false,
      error: "로그인에 실패했습니다",
      isLoggedIn: false,
    };

    expect(authReducer(initialState, action)).toEqual(expectedState);
  });

  test("알 수 없는 액션에 대해 현재 상태를 반환한다", () => {
    const action = { type: "UNKNOWN_ACTION" };
    expect(authReducer(initialState, action)).toEqual(initialState);
  });
});
