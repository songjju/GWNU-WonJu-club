import API_BASE_URL from "./apiConfig";

describe("API Configuration", () => {
  test("API_BASE_URL이 정의되어 있다", () => {
    expect(API_BASE_URL).toBeDefined();
    expect(typeof API_BASE_URL).toBe("string");
  });

  test("API_BASE_URL이 유효한 URL 형식이다", () => {
    expect(API_BASE_URL).toMatch(/^https?:\/\/.+/);
  });
});
