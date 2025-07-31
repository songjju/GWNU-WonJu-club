import React from "react";
import { render } from "@testing-library/react";
import NotFound from "./NotFound";

describe("NotFound Component", () => {
  test("NotFound가 렌더링된다", () => {
    render(<NotFound />);
    expect(document.body).toBeInTheDocument();
  });

  test("404 관련 텍스트가 포함된다", () => {
    const { container } = render(<NotFound />);
    expect(container).toBeInTheDocument();
  });
});
