import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";

import AdminGrid from "./Layouts/AdminGrid.jsx";
import App from "./App.jsx";
import EmployeeManagement from "./Components/EmployeeManagement.jsx";
import PinPad from "./Components/PinPad.jsx";
import Game from "./Components/Game";
import SalesGraph from "./Components/SalesGraph.jsx";
import TableGraph from "./Components/TableGraph.jsx";
import TableGrid from "./Layouts/TableGrid.jsx";
import TableMangement from "./Components/TableManagement.jsx";
import store from "./Utilities/Store/index.js";
import "./index.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import MenuManagementGrid from "./Layouts/MenuManagementGrid.jsx";
import FunctionGrid from "./Layouts/FunctionGrid.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<PinPad />} />
          <Route path="/app" element={<App />}>
            <Route path="table" element={<TableMangement />} />
            <Route path="table/:transaction_id" element={<TableGrid />} />
            <Route
              path="/app/table/:transaction_id/functions"
              element={<FunctionGrid />}
            />
            <Route path="admin" element={<AdminGrid />}>
              <Route
                path="employee-management"
                element={<EmployeeManagement />}
              />
              <Route path="menu-management">
                <Route path="category1" element={<MenuManagementGrid />} />
              </Route>

              <Route
                path="table-management"
                element={<TableMangement canEdit />}
              />

              <Route path="sales-report">
                <Route path="sales" element={<SalesGraph />} />
              </Route>

              <Route path="table-analytics">
                <Route
                  path="spp"
                  element={<TableGraph statisticProp="SPP" />}
                />
                <Route
                  path="sph"
                  element={<TableGraph statisticProp="SPH" />}
                />
                <Route path="ts" element={<TableGraph statisticProp="TS" />} />
                <Route path="tp" element={<TableGraph statisticProp="TP" />} />
              </Route>
            </Route>
            <Route path="game" element={<Game></Game>}></Route>
          </Route>
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>
);
