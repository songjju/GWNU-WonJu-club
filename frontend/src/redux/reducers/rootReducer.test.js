import rootReducer from "./rootReducer";

describe("Root Reducer", () => {
  test("루트 리듀서가 정의되어 있다", () => {
    expect(rootReducer).toBeDefined();
  });

  test("초기 상태를 반환한다", () => {
    const state = rootReducer(undefined, {});
    expect(state).toBeDefined();
  });

  test("알 수 없는 액션을 처리한다", () => {
    const initialState = rootReducer(undefined, {});
    const newState = rootReducer(initialState, { type: "UNKNOWN" });
    expect(newState).toBeDefined();
  });
});
