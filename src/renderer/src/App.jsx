import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { connect } from "react-redux";

import Header from "./Layouts/Header";
import TableTicket from "./Components/TableTicket";
import TableTicketSim from "./Components/TableTicketSim";
import "./App.scss";

function App({ isAuth, orderedItems }) {
  const [isSim, setIsSim] = useState(false);
  const location = useLocation();
  useEffect(() => {
    if (location.pathname.startsWith("/app/game")) setIsSim(true);
    else setIsSim(false);
  }, [location.pathname]);
  return isAuth ? (
    <Container className="app-container" fluid>
      <Row>
        <Col className="g-0">
          <Header />
        </Col>
      </Row>
      <Row className="app-main-content">
        <Col className="g-0" xs={7}>
          <Outlet />
        </Col>
        <Col className="g-0">
          {!isSim && <TableTicket orderItems={orderedItems} />}
          {isSim && <TableTicketSim />}
        </Col>
      </Row>
    </Container>
  ) : (
    <Navigate to="/" />
  );
}

const mapStateToProps = (state) => {
  return {
    isAuth: state.auth.authenticated,
    orderedItems: state.app.orderedItems,
  };
};

export default connect(mapStateToProps)(App);
