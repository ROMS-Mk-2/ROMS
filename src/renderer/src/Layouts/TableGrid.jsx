import React, { useEffect, useState } from "react";
import { useDispatch, connect } from "react-redux";

import GridLayout from "../Components/GridLayout";
import {
  setOrderedItem,
  incrementItemQty,
} from "../Utilities/Store/appReducer/appSlice";

import { sendSQL } from "../Utilities/SQLFunctions";

const TableGrid = ({ orderedItems }) => {
  const [menuItems, setMenuItems] = useState([]); // State to hold fetched menu items
  const dispatch = useDispatch();

  // Fetch menu items from the database when the component mounts
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await sendSQL("SELECT name, price FROM menu");
        setMenuItems(response); // Assume response is in the expected format
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchMenuItems();
  }, []); // Empty dependency array means this effect runs once on mount

  const handleItemClick = (selectedItem) => {
    let updatedItems = { ...orderedItems };

    if (updatedItems[selectedItem.name]) {
      dispatch(incrementItemQty(selectedItem.name));
    } else {
      const updatedItems = {
        ...orderedItems,
        [selectedItem.name]: {
          quantity: 1,
          price: selectedItem.price,
        },
      };
      dispatch(setOrderedItem(updatedItems));
    }
  };

  return <GridLayout data={menuItems} onItemSelect={handleItemClick} />;
};

const mapStateToProps = (state) => {
  return { orderedItems: state.app.orderedItem };
};

export default connect(mapStateToProps)(TableGrid);
