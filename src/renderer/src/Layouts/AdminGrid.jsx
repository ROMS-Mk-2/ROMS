import React from "react";
import { useDispatch, connect } from "react-redux";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

import GridLayout from "../Components/GridLayout";
import {
  setOrderedItem,
  incrementItemQty,
} from "../Utilities/Store/appReducer/appSlice";

const AdminGrid = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleItemClick = (selectedItem) => {
    const routeMap = {
      "Table Analytics": "/app/admin/table-analytics",
      "Menu Management": "/app/admin/menu-management",
      "Table Management": "/app/admin/table-management",
      "Sales Report": "/app/admin/sales-report",
      "Employee Management": "/app/admin/employee-management",
    };

    const route = routeMap[selectedItem.name];
    if (route) {
      navigate(route);
    }
  };

  const testData = [
    { name: "Employee Management" },
    { name: "Menu Management" },
    { name: "Table Management" },
    { name: "Sales Report" },
    { name: "Table Analytics" },
  ];

  const isBaseAdminRoute =
    location.pathname.endsWith("admin") || location.pathname.endsWith("admin/");

  return (
    <>
      {isBaseAdminRoute && (
        <GridLayout data={testData} onItemSelect={handleItemClick} />
      )}
      <Outlet />
    </>
  );
};

export default AdminGrid;
