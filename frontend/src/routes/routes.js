// Import necessary dependencies
import React from "react";
import { Route } from "react-router-dom";
import MainPage from "../Main/Main_Component/MainPage";
import LoginPage from "../Login/LoginPage";
import Myclub from "../Mypage/Myclub";
import MyPage from "../Mypage/Mypage";
import EventPage from "../Event/Event_Component/EventPage";
import CreateClubPage from "../CreateClub/CreateClubPage";
import ClubPage from "../Club/ClubPage";
import ClubMember from "../Club/Club_Component/Club_members";
import ClubAlbum from "../Club/Club_Component/Club_gallery";
import ClubEvent from "../Club/Club_Component/Club_event";
import ClubPosts from "../Club/Club_Component/Club_board";
import PostMain from "../Board/free_posts/free_posts_Component/PostMain";
import SignUpPage from "../Login/SignUpPage";
import UserDetail from "../Login/UserDetail";
import NotFound from "../Login/NotFound";
import ClubIntroducePage from "../Club_Introduce/ClubIntroducePage";
import ClubManagement from "../club_management/club_management";
import ResetPasswordPage from "../Login/ResetPasswordPage";
import ClubCreatePost from "../Club/Club_Create/Club_create_post";
import ClubCreatePhoto from "../Club/Club_Create/Club_create_photo";
import ClubCreateEvent from "../Club/Club_Create/Club_create_event";
import ClubNotice from "../Main/Main_Component/ClubNotice";
import CreateNotice from "../Main/Main_Component/CreateNotice";

export const AppRoutes = () => (
  <>
    <Route path="/" element={<MainPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/reset-password/" element={<ResetPasswordPage />} />
    <Route
      path="/auth/reset-password-confirm/:uid/token/:token"
      element={<ResetPasswordPage />}
    />
    <Route path="/myclub" element={<Myclub />} />
    <Route path="/mypage/*" element={<MyPage />} />
    <Route path="/eventpage/*" element={<EventPage />} />
    <Route path="/clubpage/*" element={<ClubPage />} />
    <Route
      path="club_management/club/:club_name"
      element={<ClubManagement />}
    />
    <Route
      path="/club_information/club/:club_name/home/"
      element={<ClubPage />}
    />
    <Route
      path="/club_information/club/:club_name/members/"
      element={<ClubMember />}
    />
    <Route
      path="/club_information/club/:club_name/albums/"
      element={<ClubAlbum />}
    />
    <Route
      path="/club_information/club/:club_name/events/"
      element={<ClubEvent />}
    />
    <Route path="/create_club" element={<CreateClubPage />} />
    <Route path="/club_board/club_posts/" element={<ClubPosts />} />
    <Route path="/club_board/*" element={<PostMain />} />
    <Route path="signup/*" element={<SignUpPage />} />
    <Route path="/user" element={<UserDetail />} />
    <Route path="*" element={<NotFound />} />
    <Route path="/club-introduce" element={<ClubIntroducePage />} />
    <Route
      path="/club_board/club_posts/create-club-post/"
      element={<ClubCreatePost />}
    />
    <Route
      path="/club_information/club/create_album/:club_name"
      element={<ClubCreatePhoto />}
    />
    <Route
      path="/club_information/club/:club_name/create_club_event"
      element={<ClubCreateEvent />}
    />
    <Route path="/club-notice" element={<ClubNotice />} />
    <Route path="/create-notice" element={<CreateNotice />} />
  </>
);
