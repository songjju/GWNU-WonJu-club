import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import SignUp from "./SignUp";
import EmailConfirm from "./EmailConfirm";

const ParentComponent = () => {
  const [condition, setCondition] = useState(false);

  return (
    <div>
      <Routes>
        <Route path="" element={<SignUp />} />
        <Route path="/email_confirm" element={<EmailConfirm />} />
      </Routes>
    </div>
  );
};

export default ParentComponent;
