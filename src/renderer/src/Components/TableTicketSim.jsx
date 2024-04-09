import React, { useContext } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

import EmptySvg from "../Assets/Empty.svg";
import { SimContext } from "../Utilities/SimContext";
import "./TableTicket.scss";

const TableTicketSim = () => {
  const { simItems, setSimItems, simCheckoutFn, setSimCheckoutFn } =
    useContext(SimContext);
  return (
    <Container className="ticket-container sim" fluid>
      <div className="ticket-header">
        <Row>
          <Col className="ticket-col-1" xs={4}>
            TBL ID: SIM
          </Col>
          <Col className="ticket-col-1">Server Name: Simulation User</Col>
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
        <Col
          className={
            simItems.length <= 0 ? "d-flex justify-content-center" : ""
          }
        >
          {simItems.length > 0 ? (
            simItems.map((item, index) => (
              <Row key={index} className={`item-ticket ordered-item`}>
                <Col xs={7}>
                  <div>
                    <input
                      type="checkbox"
                      className="form-check-input me-2"
                      disabled
                    />
                    <span>{item}</span>
                  </div>
                </Col>
                <Col className="d-flex justify-content-center">{1}</Col>
                <Col className="d-flex justify-content-center">SIM</Col>
              </Row>
            ))
          ) : (
            <div className="ticket-no-table">
              <img src={EmptySvg} alt="Empty" />
              Select a Table
            </div>
          )}
        </Col>
      </Row>
      <Row style={{ display: "flex", gap: "8px" }} className="g-0">
        <Col>
          <Button className="ticket-fn-button" onClick={() => simCheckoutFn()}>
            Order
          </Button>
        </Col>
        <Col>
          <Button className="ticket-fn-button" disabled={true}>
            Functions
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default TableTicketSim;
