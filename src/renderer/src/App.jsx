import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import Header from "./Layouts/Header";
import TableTicket from "./Components/TableTicket";
import "./App.scss";
import Game from "./Components/Game";


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
          Dynamic Content
          <Game></Game>
        </Col>
        <Col className="g-0">
          <TableTicket />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
