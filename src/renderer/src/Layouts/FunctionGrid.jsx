import React from "react";
import { useNavigate, useParams, Outlet } from "react-router-dom";
import GridLayout from "../Components/GridLayout";
import { useSelector } from "react-redux";
import { Col } from "react-bootstrap";

const FunctionGrid = () => {
  const navigate = useNavigate();
  const params = useParams();
  const selectedItemCount = useSelector(
    (state) => state.app.selectedItems.length
  );

  const handleFunctionClick = (selectedItem) => {
    console.log("Function item clicked:", selectedItem.name);
  };

  // Items for the function grid
  const functionItems = [
    { name: "Edit Quantity", disabled: selectedItemCount !== 1 },
    { name: "Void Item", disabled: selectedItemCount < 1 },
    { name: "Comp Item", disabled: selectedItemCount < 1 },
    { name: "Move Item", disabled: selectedItemCount < 1 },
    { name: "Move Table", disabled: false },
    { name: "End Transaction", disabled: false },
  ].map((item) => ({
    ...item,
    style: {
      opacity: item.disabled ? 0.5 : 1,
      pointerEvents: item.disabled ? "none" : "auto",
    },
  }));

  return (
    <>
      <GridLayout
        data={functionItems}
        onItemSelect={handleFunctionClick}
        renderCell={(item) => (
          <Col
            className="grid-col d-flex align-items-center justify-content-center"
            style={{
              opacity: item.disabled ? 0.5 : 1,
              backgroundColor: item.disabled ? "purple" : "transparent",
              pointerEvents: item.disabled ? "none" : "auto",
              color: item.disabled ? "white" : "black",
            }}
            onClick={
              !item.disabled ? () => handleFunctionClick(item) : undefined
            }
          >
            {item.name}
          </Col>
        )}
      />
      <Outlet />
    </>
  );
};

export default FunctionGrid;
