import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import EmailConfirm from "./EmailConfirm";

const TestWrapper = ({
  children,
  initialEntries = ["/?email=test@example.com"],
}) => {
  return (
    <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
  );
};

// console.log 모킹
const originalConsoleLog = console.log;
beforeAll(() => {
  console.log = jest.fn();
});
afterAll(() => {
  console.log = originalConsoleLog;
});

describe("EmailConfirm Component", () => {
  test("EmailConfirm 컴포넌트가 정상적으로 렌더링된다", () => {
    render(
      <TestWrapper>
        <EmailConfirm />
      </TestWrapper>
    );

    expect(screen.getByText("이메일 인증 확인")).toBeInTheDocument();
    expect(screen.getByText("로그인 페이지 이동")).toBeInTheDocument();
  });

  test("URL 파라미터의 이메일이 표시된다", () => {
    render(
      <TestWrapper initialEntries={["/?email=user@test.com"]}>
        <EmailConfirm />
      </TestWrapper>
    );

    expect(
      screen.getByText("user@test.com", { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/로 인증 메일이 전송되었습니다/)
    ).toBeInTheDocument();
  });

  test("컨테이너와 카드 구조가 올바르게 렌더링된다", () => {
    const { container } = render(
      <TestWrapper>
        <EmailConfirm />
      </TestWrapper>
    );

    expect(container.querySelector(".container")).toBeInTheDocument();
    expect(container.querySelector(".card")).toBeInTheDocument();
    expect(container.querySelector(".card-body")).toBeInTheDocument();
  });

  test("카드 제목이 올바르게 표시된다", () => {
    render(
      <TestWrapper>
        <EmailConfirm />
      </TestWrapper>
    );

    const title = screen.getByText("이메일 인증 확인");
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe("H5");
    expect(title).toHaveClass("card-title");
  });

  test("안내 메시지가 올바르게 표시된다", () => {
    render(
      <TestWrapper>
        <EmailConfirm />
      </TestWrapper>
    );

    expect(
      screen.getByText(/이메일을 확인하고 링크를 클릭하여 가입을 완료하세요/)
    ).toBeInTheDocument();
  });

  test("로그인 페이지 이동 버튼이 올바른 링크를 가진다", () => {
    render(
      <TestWrapper>
        <EmailConfirm />
      </TestWrapper>
    );

    const loginLink = screen.getByText("로그인 페이지 이동");
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.tagName).toBe("A");
    expect(loginLink).toHaveAttribute("href", "/login");
    expect(loginLink).toHaveClass("btn", "btn-primary");
  });

  test("이메일 파라미터가 없을 때도 정상적으로 렌더링된다", () => {
    render(
      <TestWrapper initialEntries={["/"]}>
        <EmailConfirm />
      </TestWrapper>
    );

    expect(screen.getByText("이메일 인증 확인")).toBeInTheDocument();
    expect(screen.getByText("로그인 페이지 이동")).toBeInTheDocument();
  });

  test("Bootstrap CSS 클래스가 올바르게 적용된다", () => {
    const { container } = render(
      <TestWrapper>
        <EmailConfirm />
      </TestWrapper>
    );

    expect(container.querySelector(".container.py-5")).toBeInTheDocument();
    expect(container.querySelector(".card.mx-auto")).toBeInTheDocument();
    expect(container.querySelector(".card-body")).toBeInTheDocument();
    expect(container.querySelector(".btn.btn-primary")).toBeInTheDocument();
  });

  test("카드 스타일이 올바르게 적용된다", () => {
    const { container } = render(
      <TestWrapper>
        <EmailConfirm />
      </TestWrapper>
    );

    const card = container.querySelector(".card");
    expect(card).toHaveStyle("max-width: 700px");
  });
});
