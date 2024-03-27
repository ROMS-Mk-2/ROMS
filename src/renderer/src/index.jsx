import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";

import AdminGrid from "./Layouts/AdminGrid.jsx";
import App from "./App.jsx";
import PinPad from "./Components/PinPad.jsx";
import SalesGraph from "./Components/SalesGraph.jsx";
import TableGraph from "./Components/TableGraph.jsx";
import TableGrid from "./Layouts/TableGrid.jsx";
import store from "./Utilities/Store/index.js";
import "./index.scss";
import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<PinPad />} />
          <Route path="/app" element={<App />}>
            <Route path="table" element={<TableGrid />} />
            <Route path="admin" element={<AdminGrid />}>
              <Route path="employee-management">
                <Route
                  index
                  element={<div>Category 1 - Employee Management</div>}
                />
                <Route
                  path="category1"
                  element={<div>Category 1 - Employee Management</div>}
                />
                <Route
                  path="category2"
                  element={<div>Category 2 - Employee Management</div>}
                />
                <Route
                  path="category3"
                  element={<div>Category 3 - Employee Management</div>}
                />
              </Route>

              <Route path="menu-management">
                <Route
                  index
                  element={<div>Category 1 - Menu Management</div>}
                />
                <Route
                  path="category1"
                  element={<div>Category 1 - Menu Management</div>}
                />
                <Route
                  path="category2"
                  element={<div>Category 2 - Menu Management</div>}
                />
                <Route
                  path="category3"
                  element={<div>Category 3 - Menu Management</div>}
                />
              </Route>

              <Route path="table-management">
                <Route
                  index
                  element={<div>Category 1 - Table Management</div>}
                />
                <Route
                  path="category1"
                  element={<div>Category 1 - Table Management</div>}
                />
                <Route
                  path="category2"
                  element={<div>Category 2 - Table Management</div>}
                />
                <Route
                  path="category3"
                  element={<div>Category 3 - Table Management</div>}
                />
              </Route>

              <Route path="sales-report">
                <Route path="category1" element={<SalesGraph />} />
              </Route>

              <Route path="table-analytics">
                <Route path="category1" element={<TableGraph />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>
);
