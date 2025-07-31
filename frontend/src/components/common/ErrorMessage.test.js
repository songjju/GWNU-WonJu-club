import React from "react";
import { render, screen } from "@testing-library/react";

const ErrorMessage = ({ message, onRetry }) => (
  <div data-testid="error-message" className="error-message">
    <p>{message}</p>
    {onRetry && (
      <button onClick={onRetry} data-testid="retry-button">
        다시 시도
      </button>
    )}
  </div>
);

describe("ErrorMessage Component", () => {
  test("ErrorMessage 컴포넌트가 정상적으로 렌더링된다", () => {
    render(<ErrorMessage message="오류가 발생했습니다." />);

    expect(screen.getByTestId("error-message")).toBeInTheDocument();
    expect(screen.getByText("오류가 발생했습니다.")).toBeInTheDocument();
  });

  test("재시도 버튼이 있을 때 표시된다", () => {
    const mockRetry = jest.fn();
    render(<ErrorMessage message="오류 발생" onRetry={mockRetry} />);

    expect(screen.getByTestId("retry-button")).toBeInTheDocument();
  });

  test("재시도 버튼이 없을 때 표시되지 않는다", () => {
    render(<ErrorMessage message="오류 발생" />);

    expect(screen.queryByTestId("retry-button")).not.toBeInTheDocument();
  });
});
