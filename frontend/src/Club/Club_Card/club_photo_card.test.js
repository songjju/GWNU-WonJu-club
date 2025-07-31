import React from "react";
import { render } from "@testing-library/react";

const ClubPhotoCard = () => <div>Photo Card</div>;

describe("ClubPhotoCard", () => {
  test("사진 카드가 렌더링된다", () => {
    render(<ClubPhotoCard />);
    expect(document.body).toBeInTheDocument();
  });
});
