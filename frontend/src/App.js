//App.js
import React from "react";
import { Routes, useLocation } from "react-router-dom";
import { AppRoutes } from "./routes/routes";
import TopScreen from "./Header/TopScreen";
import ChatbotLayout from "./ChatBot/ChatbotLayout";
import "./App.css";

function App() {
  const location = useLocation();
  const isMainPage = location.pathname === "/";

  return (
    <div className={`content ${isMainPage ? "" : "content-padding"}`}>
      <ChatbotLayout>
        <TopScreen />
        <div className="content-main">
          <Routes>{AppRoutes()}</Routes>
        </div>
      </ChatbotLayout>
    </div>
  );
}

export default App;
