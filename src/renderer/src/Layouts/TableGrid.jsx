import React from "react";

const TableGrid = () => {
  const [orderItems, setOrderItems] = useState({});

  function handleItemClick(selectedItem) {
    setOrderItems((prevItems) => {
      // Check if the item already exists in the order
      if (prevItems[selectedItem.name]) {
        // Item exists, update its quantity
        return {
          ...prevItems,
          [selectedItem.name]: {
            ...prevItems[selectedItem.name],
            quantity: prevItems[selectedItem.name].quantity + 1,
          },
        };
      } else {
        // Item does not exist, add it with quantity 1
        return {
          ...prevItems,
          [selectedItem.name]: {
            quantity: 1,
            price: selectedItem.price, // Assuming selectedItem has a price property
          },
        };
      }
    });
  }

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

export default TableGrid;
