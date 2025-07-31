import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { RecoilRoot } from "recoil";
import MyPage from "./Mypage";

describe("MyPage 컴포넌트", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              name: "테스트 유저",
              email: "test@example.com",
            },
          }),
      })
    );
  });

  test("마이페이지 컴포넌트가 정상 렌더링된다", async () => {
    render(
      <RecoilRoot>
        <MemoryRouter initialEntries={["/mypage"]}>
          <Routes>
            <Route path="/mypage" element={<MyPage />} />
          </Routes>
        </MemoryRouter>
      </RecoilRoot>
    );

    expect(await screen.findByText("마이페이지")).toBeInTheDocument();
  });
});
