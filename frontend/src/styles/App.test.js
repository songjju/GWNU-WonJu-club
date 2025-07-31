describe("App Styles", () => {
  test("CSS 파일이 정상적으로 로드된다", () => {
    expect(() => {
      require("../App.css");
    }).not.toThrow();
  });

  test("index.css 파일이 정상적으로 로드된다", () => {
    expect(() => {
      require("../index.css");
    }).not.toThrow();
  });

  test("global.css 파일이 정상적으로 로드된다", () => {
    expect(() => {
      require("../global.css");
    }).not.toThrow();
  });
});
