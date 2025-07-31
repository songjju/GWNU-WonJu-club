import { renderHook, act } from "@testing-library/react";

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = React.useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading localStorage:", error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error("Error setting localStorage:", error);
    }
  };

  return [storedValue, setValue];
};

// React import for the hook
const React = require("react");

describe("useLocalStorage Hook", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("초기값을 올바르게 설정한다", () => {
    const { result } = renderHook(() => useLocalStorage("test", "initial"));

    expect(result.current[0]).toBe("initial");
  });

  test("localStorage에서 기존 값을 읽어온다", () => {
    localStorage.setItem("test", JSON.stringify("existing"));

    const { result } = renderHook(() => useLocalStorage("test", "initial"));

    expect(result.current[0]).toBe("existing");
  });

  test("값을 설정하고 localStorage에 저장한다", () => {
    const { result } = renderHook(() => useLocalStorage("test", "initial"));

    act(() => {
      result.current[1]("new value");
    });

    expect(result.current[0]).toBe("new value");
    expect(localStorage.getItem("test")).toBe('"new value"');
  });

  test("함수를 통해 값을 업데이트한다", () => {
    const { result } = renderHook(() => useLocalStorage("test", 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
  });

  test("잘못된 JSON에 대해 초기값을 반환한다", () => {
    localStorage.setItem("test", "invalid json");

    const { result } = renderHook(() => useLocalStorage("test", "default"));

    expect(result.current[0]).toBe("default");
  });
});
