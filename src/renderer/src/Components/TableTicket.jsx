import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import EmptySvg from "../Assets/Empty.svg";
import "./TableTicket.scss";

const TableTicket = ({ selectedItems }) => {
  return (
    <Container className="ticket-container" fluid>
      <div className="ticket-header">
        <Row>
          <Col className="ticket-col-1" xs={4}>
            TBL ID:
          </Col>
          <Col className="ticket-col-1">Server Name:</Col>
        </Row>
        <Row>
          <Col className="ticket-col-2" xs={7}>
            Item
          </Col>
          <Col className="ticket-col-2">Qty</Col>
          <Col className="ticket-col-2">Price</Col>
        </Row>
      </div>
      <Row className="ticket-items">
        {selectedItems.length > 0 ? (
          <Col>
            {selectedItems.map((item, index) => (
              <Row key={index}>{item.name}</Row>
            ))}
          </Col>
        ) : (
          <div className="ticket-no-table">
            <img src={EmptySvg} alt="Empty" />
            Select a Table
          </div>
        )}
      </Row>
      <Button className="ticket-fn-button">Functions</Button>
    </Container>
  );
};

export default TableTicket;
