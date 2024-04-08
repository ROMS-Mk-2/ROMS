import React, { useEffect, useState } from "react";
import { useDispatch, connect } from "react-redux";

import GridLayout from "../Components/GridLayout";
import {
  setOrderedItem,
  incrementItemQty,
} from "../Utilities/Store/appReducer/appSlice";
import Col from "react-bootstrap/Col";

import { sendSQL } from "../Utilities/SQLFunctions";

import "./TableGrid.scss";
import { Outlet } from "react-router-dom";

const TableGrid = ({ orderedItems }) => {
  const [menuItems, setMenuItems] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await sendSQL(
          "SELECT id, name, price, gui_position FROM menu WHERE gui_position IS NOT NULL AND gui_position != '' ORDER BY gui_position ASC;"
        );
        const sortedItems = [];
        response.forEach((item) => {
          if (typeof item.gui_position === "string") {
            const [row, col] = item.gui_position.split("-").map(Number);
            const index = row * 5 + col;

            while (sortedItems.length < index) {
              sortedItems.push({ name: "", isEmpty: true });
            }
            sortedItems.push({ ...item, row, col });
          }
        });
        setMenuItems(sortedItems);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchMenuItems();
  }, []);

  const renderCell = (item) => {
    if (item.isEmpty) {
      return (
        <Col
          key={item.id}
          className="grid-col d-flex align-items-center justify-content-center invisible-cell"
        >
          &nbsp;
        </Col>
      );
    } else {
      return (
        <Col
          key={item.id}
          className="grid-col d-flex align-items-center justify-content-center"
          onClick={() => handleItemClick(item)}
        >
          {item.name}
        </Col>
      );
    }
  };

  const handleItemClick = (selectedItem) => {
    if (orderedItems[selectedItem.name]) {
      dispatch(incrementItemQty(selectedItem.name));
    } else {
      dispatch(
        setOrderedItem({
          name: selectedItem.name,
          details: {
            menu_item: selectedItem.id,
            quantity: 1,
            price: selectedItem.price,
            ordered: false,
          },
        })
      );
    }
  };

  return (
    <>
      <GridLayout
        data={menuItems}
        onItemSelect={handleItemClick}
        renderCell={renderCell}
      />
      <Outlet />
    </>
  );
};

const mapStateToProps = (state) => {
  return { orderedItems: state.app.orderedItem };
};

export default connect(mapStateToProps)(TableGrid);
