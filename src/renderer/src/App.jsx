import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Header from "./Layouts/Header";
import TableTicket from "./Components/TableTicket";
import TableGraph from "./Components/TableGraph";
import GridLayout from "./Components/GridLayout";
import "./App.scss";

function App() {
  const testData = [
    { name: "beans" },
    { name: "toast" },
    { name: "soda" },
    { name: "chicken" },
    { name: "egg roll" },
    { name: "butter" },
    { name: "teeb" },
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
          <TableGraph />
          <GridLayout data={testData} />
        </Col>
        <Col className="g-0">
          <TableTicket />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
