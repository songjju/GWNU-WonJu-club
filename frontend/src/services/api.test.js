describe("API Service", () => {
  const apiService = {
    get: async (url) => {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token") || ""}`,
        },
      });
      return response.json();
    },

    post: async (url, data) => {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },
  };

  beforeEach(() => {
    global.fetch = jest.fn();
    localStorage.clear();
  });

  test("GET 요청이 올바르게 동작한다", async () => {
    const mockData = { message: "success" };
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await apiService.get("/test-endpoint");

    expect(fetch).toHaveBeenCalledWith("/test-endpoint", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token ",
      },
    });
    expect(result).toEqual(mockData);
  });

  test("POST 요청이 올바르게 동작한다", async () => {
    const mockData = { id: 1, name: "test" };
    const requestData = { name: "test" };

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    localStorage.setItem("token", "test_token");
    const result = await apiService.post("/test-endpoint", requestData);

    expect(fetch).toHaveBeenCalledWith("/test-endpoint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token test_token",
      },
      body: JSON.stringify(requestData),
    });
    expect(result).toEqual(mockData);
  });
});
