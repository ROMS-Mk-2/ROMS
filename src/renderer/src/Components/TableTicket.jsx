import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { connect } from "react-redux";

import EmptySvg from "../Assets/Empty.svg";
import "./TableTicket.scss";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { sendSQL } from "../Utilities/SQLFunctions";

const TableTicket = ({ orderItems }) => {
  const [ticketInfo, setTicketInfo] = useState(null);
  const location = useLocation();
  let params = useParams();
  useEffect(() => {
    if (params.transaction_id) {
      sendSQL(
        `SELECT * FROM transaction_history INNER JOIN employees ON transaction_history.server_id = employees.pin WHERE id=${params.transaction_id}`
      ).then((data) => setTicketInfo(data[0]));
    }
    if (
      !location.pathname.includes("/app/table/") ||
      location.pathname === "/app/table"
    ) {
      setTicketInfo(null);
    }
  }, [params.transaction_id, location.pathname]);
  return (
    <Container className="ticket-container" fluid>
      <div className="ticket-header">
        <Row>
          <Col className="ticket-col-1" xs={4}>
            TBL ID: {ticketInfo && ` ${ticketInfo.table_id}`}
          </Col>
          <Col className="ticket-col-1">
            Server Name:
            {ticketInfo && ` ${ticketInfo.first_name} ${ticketInfo.last_name}`}
          </Col>
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
        {Object.keys(orderItems).length > 0 ? (
          <Col>
            {Object.entries(orderItems).map(
              ([itemName, itemDetails], index) => (
                <Row key={index} className="item-ticket">
                  <Col xs={7}>
                    <div>
                      <input
                        type="checkbox"
                        className="form-check-input me-2"
                      />
                      <span>{itemName}</span>
                    </div>
                  </Col>

                  <Col className="d-flex justify-content-center">
                    {itemDetails.quantity}
                  </Col>
                  <Col className="d-flex justify-content-center">
                    {itemDetails.price}
                  </Col>
                </Row>
              )
            )}
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

const mapStateToProps = (state) => {
  return { orderItems: state.app.orderedItem };
};

export default connect(mapStateToProps)(TableTicket);
