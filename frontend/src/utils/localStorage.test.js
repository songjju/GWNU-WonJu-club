describe("LocalStorage Utils", () => {
  const localStorageUtils = {
    setItem: (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.error("Error saving to localStorage:", error);
        return false;
      }
    },

    getItem: (key) => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.error("Error reading from localStorage:", error);
        return null;
      }
    },

    removeItem: (key) => {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (error) {
        console.error("Error removing from localStorage:", error);
        return false;
      }
    },

    clear: () => {
      try {
        localStorage.clear();
        return true;
      } catch (error) {
        console.error("Error clearing localStorage:", error);
        return false;
      }
    },
  };

  beforeEach(() => {
    localStorage.clear();
  });

  test("setItem이 올바르게 동작한다", () => {
    const result = localStorageUtils.setItem("test", { name: "value" });
    expect(result).toBe(true);
    expect(localStorage.getItem("test")).toBe('{"name":"value"}');
  });

  test("getItem이 올바르게 동작한다", () => {
    localStorage.setItem("test", '{"name":"value"}');
    const result = localStorageUtils.getItem("test");
    expect(result).toEqual({ name: "value" });
  });

  test("존재하지 않는 키에 대해 null을 반환한다", () => {
    const result = localStorageUtils.getItem("nonexistent");
    expect(result).toBe(null);
  });

  test("removeItem이 올바르게 동작한다", () => {
    localStorage.setItem("test", "value");
    const result = localStorageUtils.removeItem("test");
    expect(result).toBe(true);
    expect(localStorage.getItem("test")).toBe(null);
  });

  test("clear가 올바르게 동작한다", () => {
    localStorage.setItem("test1", "value1");
    localStorage.setItem("test2", "value2");

    const result = localStorageUtils.clear();
    expect(result).toBe(true);
    expect(localStorage.length).toBe(0);
  });
});
