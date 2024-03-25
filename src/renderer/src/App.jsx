import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Header from "./Layouts/Header";
import TableTicket from "./Components/TableTicket";
import TableGraph from "./Components/TableGraph";
import GridLayout from "./Components/GridLayout";
import "./App.scss";
import { useState } from "react";

function App() {
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

  return (
    <Container className="app-container" fluid>
      <Row>
        <Col className="g-0">
          <Header />
        </Col>
      </Row>
      <Row className="app-main-content">
        <Col className="g-0" xs={7}>
          <GridLayout data={testData} onItemSelect={handleItemClick} />
        </Col>
        <Col className="g-0">
          <TableTicket orderItems={orderItems} />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
