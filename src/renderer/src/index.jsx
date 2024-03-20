import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";

import App from "./App.jsx";
import PinPad from "./Components/PinPad.jsx";
import store from "./Utilities/Store/index.js";
import "./index.scss";
import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<PinPad />}></Route>
          <Route path="/app" element={<App />}>
            <Route path="table" element={<div>Table</div>}></Route>
            <Route path="admin" element={<div>Administrator</div>}></Route>
          </Route>
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>
);
