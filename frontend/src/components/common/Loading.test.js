import React from "react";
import { render, screen } from "@testing-library/react";

const Loading = ({ message = "로딩 중..." }) => (
  <div data-testid="loading" className="loading">
    <div className="spinner"></div>
    <p>{message}</p>
  </div>
);

describe("Loading Component", () => {
  test("Loading 컴포넌트가 정상적으로 렌더링된다", () => {
    render(<Loading />);

    expect(screen.getByTestId("loading")).toBeInTheDocument();
    expect(screen.getByText("로딩 중...")).toBeInTheDocument();
  });

  test("커스텀 메시지가 표시된다", () => {
    render(<Loading message="데이터를 불러오는 중..." />);

    expect(screen.getByText("데이터를 불러오는 중...")).toBeInTheDocument();
  });

  test("스피너가 렌더링된다", () => {
    const { container } = render(<Loading />);

    expect(container.querySelector(".spinner")).toBeInTheDocument();
  });
});
