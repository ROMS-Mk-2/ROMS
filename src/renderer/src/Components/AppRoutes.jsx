import React, { useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";

import AdminGrid from "../Layouts/AdminGrid.jsx";
import App from "../App.jsx";
import EmployeeManagement from "./EmployeeManagement.jsx";
import FunctionGrid from "../Layouts/FunctionGrid.jsx";
import Game from "./Game";
import MenuManagementGrid from "../Layouts/MenuManagementGrid.jsx";
import PinPad from "./PinPad.jsx";
import SalesGraph from "./SalesGraph.jsx";
import TableGraph from "./TableGraph.jsx";
import TableGrid from "../Layouts/TableGrid.jsx";
import TableMangement from "./TableManagement.jsx";
import store from "../Utilities/Store/index.js";
import { SimContext } from "../Utilities/SimContext.jsx";

const AppRoutes = () => {
  const [simItems, setSimItems] = useState([]);
  const [sendCheckout, setSendCheckout] = useState(false);
  return (
    <SimContext.Provider
      value={{ simItems, setSimItems, sendCheckout, setSendCheckout }}
    >
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
                  <Route
                    path="ts"
                    element={<TableGraph statisticProp="TS" />}
                  />
                  <Route
                    path="tp"
                    element={<TableGraph statisticProp="TP" />}
                  />
                </Route>
              </Route>
              <Route path="game" element={<Game></Game>}></Route>
            </Route>
          </Routes>
        </Router>
      </Provider>
    </SimContext.Provider>
  );
};

export default AppRoutes;
