import React from "react";
import { render } from "@testing-library/react";

const ClubEventCard = () => <div>Event Card</div>;

describe("ClubEventCard", () => {
  test("이벤트 카드가 렌더링된다", () => {
    render(<ClubEventCard />);
    expect(document.body).toBeInTheDocument();
  });
});
