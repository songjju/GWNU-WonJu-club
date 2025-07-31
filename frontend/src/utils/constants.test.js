describe("Constants", () => {
  const constants = {
    API_ENDPOINTS: {
      LOGIN: "/club_account/login/",
      LOGOUT: "/club_account/logout/",
      CLUBS: "/clubs/",
      EVENTS: "/events/",
    },
    HTTP_STATUS: {
      OK: 200,
      CREATED: 201,
      BAD_REQUEST: 400,
      UNAUTHORIZED: 401,
      NOT_FOUND: 404,
      INTERNAL_SERVER_ERROR: 500,
    },
  };

  test("API_ENDPOINTS가 정의되어 있다", () => {
    expect(constants.API_ENDPOINTS).toBeDefined();
    expect(constants.API_ENDPOINTS.LOGIN).toBe("/club_account/login/");
    expect(constants.API_ENDPOINTS.LOGOUT).toBe("/club_account/logout/");
  });

  test("HTTP_STATUS가 정의되어 있다", () => {
    expect(constants.HTTP_STATUS).toBeDefined();
    expect(constants.HTTP_STATUS.OK).toBe(200);
    expect(constants.HTTP_STATUS.UNAUTHORIZED).toBe(401);
  });
});
