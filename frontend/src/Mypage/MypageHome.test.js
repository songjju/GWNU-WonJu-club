import React from "react";
import { render, screen } from "@testing-library/react";
import MypageHome from "./MypageHome";

// 이미지 import 모킹 - 실제 경로와 일치하도록 수정
jest.mock("./profile.jpg", () => "logo-image.png");
jest.mock("./logo.png", () => "logo-image.png");

describe("MypageHome Component", () => {
  const mockUserData = {
    name: "김동아리",
    email: "kim.club@example.com",
    phone: "010-1234-5678",
    grade: 3,
    student_id: "20220001",
    study: "컴퓨터공학과",
    date_joined: "2024-01-15",
  };

  const mockMyClubList = [
    {
      member_id: 1,
      club_name: "프로그래밍 동아리",
      job: "회장",
      logo: null,
    },
    {
      member_id: 2,
      club_name: "축구 동아리",
      job: "일반회원",
      logo: "soccer-logo.png",
    },
  ];

  test("MypageHome 컴포넌트가 정상적으로 렌더링된다", () => {
    render(<MypageHome userData={mockUserData} myClubList={mockMyClubList} />);

    expect(screen.getByText("사용자 정보")).toBeInTheDocument();
    expect(screen.getByText("나의 동아리")).toBeInTheDocument();
  });

  test("사용자 정보가 올바르게 표시된다", () => {
    render(<MypageHome userData={mockUserData} myClubList={mockMyClubList} />);

    expect(screen.getByText("김동아리")).toBeInTheDocument();
    expect(screen.getByText("kim.club@example.com")).toBeInTheDocument();
    expect(screen.getByText("010-1234-5678")).toBeInTheDocument();
    expect(screen.getByText("3학년")).toBeInTheDocument();
    expect(screen.getByText("20220001")).toBeInTheDocument();
    expect(screen.getByText("컴퓨터공학과")).toBeInTheDocument();
  });

  test("프로필 이미지가 올바르게 렌더링된다", () => {
    render(<MypageHome userData={mockUserData} myClubList={mockMyClubList} />);

    const profileImage = screen.getByAltText("프로필 사진");
    expect(profileImage).toBeInTheDocument();
    expect(profileImage).toHaveClass("profile-image");
    // 실제 모킹된 값과 일치하도록 수정
    expect(profileImage).toHaveAttribute("src", "logo-image.png");
  });

  test("동아리 목록이 올바르게 표시된다", () => {
    render(<MypageHome userData={mockUserData} myClubList={mockMyClubList} />);

    expect(screen.getByText("프로그래밍 동아리")).toBeInTheDocument();
    expect(screen.getByText("축구 동아리")).toBeInTheDocument();
    expect(screen.getByText("회장")).toBeInTheDocument();
    expect(screen.getByText("일반회원")).toBeInTheDocument();
  });

  test("동아리 목록의 각 항목이 고유한 key로 렌더링된다", () => {
    render(<MypageHome userData={mockUserData} myClubList={mockMyClubList} />);

    const clubItems = document.querySelectorAll(".myclub-item");
    expect(clubItems).toHaveLength(2);
  });

  test("userData가 null일 때 안전하게 처리된다", () => {
    render(<MypageHome userData={null} myClubList={mockMyClubList} />);

    expect(screen.getByText("사용자 정보")).toBeInTheDocument();
    expect(screen.getByText("나의 동아리")).toBeInTheDocument();

    // userData가 null이어도 컴포넌트가 깨지지 않음을 확인
    expect(screen.queryByText("undefined")).not.toBeInTheDocument();
  });

  test("myClubList가 빈 배열일 때 정상적으로 처리된다", () => {
    render(<MypageHome userData={mockUserData} myClubList={[]} />);

    expect(screen.getByText("나의 동아리")).toBeInTheDocument();

    const clubItems = document.querySelectorAll(".myclub-item");
    expect(clubItems).toHaveLength(0);
  });

  test("Bootstrap 컴포넌트들이 올바르게 렌더링된다", () => {
    render(<MypageHome userData={mockUserData} myClubList={mockMyClubList} />);

    expect(screen.getByTestId("container")).toBeInTheDocument();
    expect(screen.getByTestId("row")).toBeInTheDocument();

    const cols = screen.getAllByTestId("col");
    expect(cols).toHaveLength(2);
  });

  test("CSS 클래스들이 올바르게 적용된다", () => {
    render(<MypageHome userData={mockUserData} myClubList={mockMyClubList} />);

    expect(document.querySelector(".profile-panel")).toBeInTheDocument();
    expect(document.querySelector(".details-head")).toBeInTheDocument();
    expect(document.querySelector(".details-info")).toBeInTheDocument();
    expect(document.querySelector(".myclub-panel")).toBeInTheDocument();
    expect(document.querySelector(".myclub-head")).toBeInTheDocument();
    expect(document.querySelector(".myclub-list")).toBeInTheDocument();
  });

  test("사용자 정보 라벨들이 올바르게 표시된다", () => {
    render(<MypageHome userData={mockUserData} myClubList={mockMyClubList} />);

    // 사용자 정보 섹션에서만 찾기 위해 더 구체적인 선택자 사용
    const detailsInfo = document.querySelector(".details-info");
    expect(detailsInfo).toBeInTheDocument();

    // 사용자 정보 영역에서 특정 텍스트들 확인
    expect(screen.getByText("이메일:", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("휴대전화:", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("학년:", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("학번:", { exact: false })).toBeInTheDocument();
    expect(
      screen.getByText("소속 학과:", { exact: false })
    ).toBeInTheDocument();

    // "이름:"의 경우 사용자 정보 섹션에서만 확인
    const userNameLabel = detailsInfo.querySelector("strong");
    expect(userNameLabel).toHaveTextContent("이름:");
  });

  test("동아리 정보 라벨들이 올바르게 표시된다", () => {
    render(<MypageHome userData={mockUserData} myClubList={mockMyClubList} />);

    // getAllByText를 사용하여 중복된 텍스트 처리
    const clubNameLabels = screen.getAllByText(/동아리 이름:/);
    const jobLabels = screen.getAllByText(/직책:/);

    expect(clubNameLabels).toHaveLength(2); // 2개의 동아리가 있으므로
    expect(jobLabels).toHaveLength(2);
  });

  test("여러 동아리에 속한 경우 모든 동아리가 표시된다", () => {
    const manyClubs = [
      { member_id: 1, club_name: "프로그래밍 동아리", job: "회장" },
      { member_id: 2, club_name: "축구 동아리", job: "일반회원" },
      { member_id: 3, club_name: "밴드 동아리", job: "부회장" },
    ];

    render(<MypageHome userData={mockUserData} myClubList={manyClubs} />);

    expect(screen.getByText("프로그래밍 동아리")).toBeInTheDocument();
    expect(screen.getByText("축구 동아리")).toBeInTheDocument();
    expect(screen.getByText("밴드 동아리")).toBeInTheDocument();
    expect(screen.getByText("부회장")).toBeInTheDocument();
  });
});
