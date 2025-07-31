// src/Simple.test.js - axios 없이 동작 확인
import React from "react";
import { render } from "@testing-library/react";

const SimpleComponent = () => <div>Hello Jest</div>;

describe("Simple Test", () => {
  test("기본 렌더링이 작동하는지 확인", () => {
    const { getByText } = render(<SimpleComponent />);
    expect(getByText("Hello Jest")).toBeInTheDocument();
  });
});
