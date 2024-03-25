import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button } from "react-bootstrap";

import Header from "./Layouts/Header";
import TableTicket from "./Components/TableTicket";
import { sendSQL } from "./Utilities/SQLFunctions";
import TableGraph from "./Components/TableGraph"
import SalesGraph from "./Components/SalesGraph";
import "./App.scss";

function App() {
  return (
    <Container className="app-container" fluid>
      <Row>
        <Col className="g-0">
          <Header />
        </Col>
      </Row>
      <Row className="app-main-content">
        <Col className="g-0" xs={7}>
          <Button onClick={() => sendSQL("SELECT * FROM lorem")}>SQL</Button>
          <TableGraph />
          <SalesGraph />
        </Col>
        <Col className="g-0">
          <TableTicket />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
