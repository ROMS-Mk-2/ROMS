import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Outlet, Navigate } from "react-router-dom";
import { connect } from "react-redux";

import Header from "./Layouts/Header";
import TableTicket from "./Components/TableTicket";
import TableGraph from "./Components/TableGraph";
import GridLayout from "./Components/GridLayout";
import "./App.scss";
import { useState } from "react";

function App({ isAuth }) {
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
          <TableTicket orderItems={orderItems} />
        </Col>
      </Row>
    </Container>
  ) : (
    <Navigate to="/" />
  );
}

const mapStateToProps = (state) => {
  return { isAuth: state.authenticated };
};

export default connect(mapStateToProps)(App);
