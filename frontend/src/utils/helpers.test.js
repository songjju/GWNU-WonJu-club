describe("Helper Functions", () => {
  const helpers = {
    formatDate: (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("ko-KR");
    },

    validateEmail: (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    truncateText: (text, maxLength = 100) => {
      if (!text) return "";
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + "...";
    },
  };

  test("formatDate가 올바르게 날짜를 포맷한다", () => {
    expect(helpers.formatDate("2024-01-15T10:00:00Z")).toBe("2024. 1. 15.");
    expect(helpers.formatDate("")).toBe("");
    expect(helpers.formatDate(null)).toBe("");
  });

  test("validateEmail이 올바르게 이메일을 검증한다", () => {
    expect(helpers.validateEmail("test@example.com")).toBe(true);
    expect(helpers.validateEmail("invalid-email")).toBe(false);
    expect(helpers.validateEmail("")).toBe(false);
  });

  test("truncateText가 올바르게 텍스트를 자른다", () => {
    const longText = "a".repeat(150);
    expect(helpers.truncateText(longText, 100)).toBe("a".repeat(100) + "...");
    expect(helpers.truncateText("short text")).toBe("short text");
    expect(helpers.truncateText("")).toBe("");
  });
});
