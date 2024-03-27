import React from "react";
import { useDispatch, connect } from "react-redux";

import GridLayout from "../Components/GridLayout";
import {
  setOrderedItem,
  incrementItemQty,
} from "../Utilities/Store/appReducer/appSlice";

const TableGrid = ({ orderedItems }) => {
  const dispatch = useDispatch();
  const handleItemClick = (selectedItem) => {
    let updatedItems = { ...orderedItems };

    if (updatedItems[selectedItem.name]) {
      dispatch(incrementItemQty(selectedItem.name));
    } else {
      updatedItems[selectedItem.name] = {
        quantity: 1,
        price: selectedItem.price,
      };
      dispatch(setOrderedItem(updatedItems));
    }
  };

  const testData = [
    { name: "beans", quantity: 0, price: "$20" },
    { name: "soda", quantity: 0, price: "$10" },
    { name: "egg roll", quantity: 0, price: "$201" },
    { name: "chicnen", quantity: 0, price: "$22" },
    { name: "butter", quantity: 0, price: "$24" },
    { name: "teeb", quantity: 0, price: "$25" },
    { name: "toast", quantity: 0, price: "$30" },
  ];

  return <GridLayout data={testData} onItemSelect={handleItemClick} />;
};

const mapStateToProps = (state) => {
  return { orderedItems: state.app.orderedItem };
};

export default connect(mapStateToProps)(TableGrid);
