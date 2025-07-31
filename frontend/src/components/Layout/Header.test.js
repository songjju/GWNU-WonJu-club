import React from "react";
import { render, screen } from "@testing-library/react";

const Header = ({
  title = "Default Title",
  showBackButton = false,
  onBack,
}) => (
  <header data-testid="header" className="app-header">
    {showBackButton && (
      <button onClick={onBack} data-testid="back-button">
        ← 뒤로
      </button>
    )}
    <h1 data-testid="header-title">{title}</h1>
  </header>
);

describe("Header Component", () => {
  test("Header가 기본 제목과 함께 렌더링된다", () => {
    render(<Header />);

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("header-title")).toHaveTextContent(
      "Default Title"
    );
  });

  test("커스텀 제목이 표시된다", () => {
    render(<Header title="커스텀 제목" />);

    expect(screen.getByTestId("header-title")).toHaveTextContent("커스텀 제목");
  });

  test("뒤로 가기 버튼이 표시되고 클릭 이벤트가 동작한다", () => {
    const mockOnBack = jest.fn();
    render(<Header showBackButton onBack={mockOnBack} />);

    const backButton = screen.getByTestId("back-button");
    expect(backButton).toBeInTheDocument();

    backButton.click();
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  test("뒤로 가기 버튼이 기본적으로 표시되지 않는다", () => {
    render(<Header />);

    expect(screen.queryByTestId("back-button")).not.toBeInTheDocument();
  });
});
