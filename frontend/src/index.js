import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { persistor } from "./redux/store/configureStore";
import { PersistGate } from "redux-persist/integration/react";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store/configureStore"; // 올바르게 import된 store 객체
import "bootstrap/dist/css/bootstrap.min.css";

import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>  // 개발환경에서 두번 렌더링되는 요소
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
  // </React.StrictMode>
);

reportWebVitals();
