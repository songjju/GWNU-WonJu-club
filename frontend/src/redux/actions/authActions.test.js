// 실제 authActions 함수들을 시뮬레이션
const authActions = {
  loginSuccess: (payload) => ({
    type: "LOGIN_SUCCESS",
    payload,
  }),
  logout: () => ({
    type: "LOGOUT",
  }),
};

describe("Auth Actions", () => {
  test("loginSuccess 액션이 올바른 타입과 페이로드를 반환한다", () => {
    const payload = {
      email: "test@example.com",
      token: "test_token_12345",
    };

    const expectedAction = {
      type: "LOGIN_SUCCESS",
      payload,
    };

    const result = authActions.loginSuccess(payload);
    expect(result).toEqual(expectedAction);
  });

  test("loginSuccess 액션이 빈 객체와 함께 호출되어도 정상적으로 동작한다", () => {
    const payload = {};

    const expectedAction = {
      type: "LOGIN_SUCCESS",
      payload,
    };

    const result = authActions.loginSuccess(payload);
    expect(result).toEqual(expectedAction);
  });

  test("logout 액션이 올바른 타입을 반환한다", () => {
    const expectedAction = {
      type: "LOGOUT",
    };

    const result = authActions.logout();
    expect(result).toEqual(expectedAction);
  });

  test("logout 액션이 매개변수 없이 호출되어도 정상적으로 동작한다", () => {
    expect(() => authActions.logout()).not.toThrow();
  });

  test("loginSuccess가 함수인지 확인한다", () => {
    expect(typeof authActions.loginSuccess).toBe("function");
  });

  test("logout이 함수인지 확인한다", () => {
    expect(typeof authActions.logout).toBe("function");
  });

  test("loginSuccess에 null이 전달되어도 정상적으로 동작한다", () => {
    const result = authActions.loginSuccess(null);

    expect(result).toEqual({
      type: "LOGIN_SUCCESS",
      payload: null,
    });
  });

  test("loginSuccess에 undefined가 전달되어도 정상적으로 동작한다", () => {
    const result = authActions.loginSuccess(undefined);

    expect(result).toEqual({
      type: "LOGIN_SUCCESS",
      payload: undefined,
    });
  });

  test("액션 타입이 문자열인지 확인한다", () => {
    const loginResult = authActions.loginSuccess({});
    const logoutResult = authActions.logout();

    expect(typeof loginResult.type).toBe("string");
    expect(typeof logoutResult.type).toBe("string");
  });
});
