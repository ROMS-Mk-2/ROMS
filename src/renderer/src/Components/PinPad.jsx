import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { Form, Modal, ToastContainer, Toast } from "react-bootstrap";
import { useDispatch, connect } from "react-redux";
import { Navigate } from "react-router-dom";

import { login } from "../Utilities/Store/authReducer/authSlice";
import { insertSQL, sendSQL } from "../Utilities/SQLFunctions";
import "./PinPad.scss";

const PasswordModal = ({
  show,
  setShow,
  rootFirst,
  pin,
  loginEmployee,
  onClear,
  setShowToast,
}) => {
  const [password, setPassword] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [validation, setValidation] = useState({
    password: { invalid: false, msg: "" },
  });

  const clearValidation = () => {
    setValidation({
      password: { invalid: false, msg: "" },
    });
  };

  const authenticateRoot = async () => {
    setFormSubmitted(true);
    if (pin.length === 4) {
      const response = await sendSQL(
        `SELECT * FROM employees WHERE pin='${pin}'`
      );

      if (response.length > 0) {
        if (response[0].root_password === password) {
          loginEmployee(response[0]);
          onClear();
          clearValidation();
          setShow(false);
        } else {
          setValidation({
            password: { invalid: true, msg: "Invalid password!" },
          });
        }
      }
    }
  };

  const updateRoot = async () => {
    setFormSubmitted(true);
    if (password.length >= 10) {
      if (pin.length === 4) {
        const response = await insertSQL(
          `UPDATE employees SET root_password='${password}' WHERE pin='${pin}'`
        );
        onClear();
        clearValidation();
        setShow(false);
        setShowToast(true);
      }
    } else {
      setValidation({
        password: {
          invalid: true,
          msg: "Password needs to be > 10 characters.",
        },
      });
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        onClear();
        setShow(false);
        clearValidation();
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {rootFirst ? "Create" : "Enter"} Root Password
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              isInvalid={formSubmitted && validation.password.invalid}
              required
              onChange={(event) => setPassword(event.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              {validation.password.msg}
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {rootFirst ? (
          <Button onClick={updateRoot}>Set Password</Button>
        ) : (
          <Button onClick={authenticateRoot}>Login</Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

const PinPad = ({ isAuth }) => {
  const [showToast, setShowToast] = useState(false);
  const [showRootModal, setShowRootModal] = useState(false);
  const [rootFirst, setRootFirst] = useState(false);
  const [pin, setPin] = useState("");
  const [isValid, setIsValid] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    setRootFirst(false);
    const fetchEmployee = async (queryPIN) => {
      const response = await sendSQL(
        `SELECT * FROM employees WHERE pin='${queryPIN}'`
      );
      return response;
    };

    if (pin.length === 4) {
      fetchEmployee(pin).then((data) => {
        if (data.length > 0) {
          if (data[0].pin === "0000") {
            if (!data[0].root_password) {
              setRootFirst(true);
            }
            setShowRootModal(true);
          } else {
            loginEmployee(data[0]);
            onClear();
          }
        } else {
          onClear();
          setIsValid(false);
        }
      });
    }
  }, [pin]);

  const PinNum = (props) => {
    const { value, ...rest } = props;
    return (
      <Button className="pin-btn" onClick={() => setPin(pin.concat(value))}>
        {value}
      </Button>
    );
  };

  const onClear = () => {
    setPin("");
  };

  const loginEmployee = (user) => {
    dispatch(login(user));
  };

  return isAuth ? (
    <Navigate to="/app/table" />
  ) : (
    <Container className="pin-pad-container">
      <ToastContainer position="top-end" style={{ padding: "8px" }}>
        <Toast onClose={() => setShowToast(false)} show={showToast} autohide>
          <Toast.Body>Root User Password Updated.</Toast.Body>
        </Toast>
      </ToastContainer>
      <PasswordModal
        show={showRootModal}
        setShow={setShowRootModal}
        rootFirst={rootFirst}
        pin={pin}
        loginEmployee={loginEmployee}
        onClear={onClear}
        setShowToast={setShowToast}
      />
      <div className="ellipse-container">
        <div
          className={`ellipse-pin ${pin.length > 0 && "pin-entered"} ${
            !isValid && "invalid-pin"
          }`}
        ></div>
        <div
          className={`ellipse-pin ${pin.length > 1 && "pin-entered"} ${
            !isValid && "invalid-pin"
          }`}
        ></div>
        <div
          className={`ellipse-pin ${pin.length > 2 && "pin-entered"} ${
            !isValid && "invalid-pin"
          }`}
        ></div>
        <div
          className={`ellipse-pin ${pin.length > 3 && "pin-entered"} ${
            !isValid && "invalid-pin"
          }`}
        ></div>
      </div>
      <Row>
        <PinNum value={1} />
        <PinNum value={2} />
        <PinNum value={3} />
      </Row>
      <Row>
        <PinNum value={4} />
        <PinNum value={5} />
        <PinNum value={6} />
      </Row>
      <Row>
        <PinNum value={7} />
        <PinNum value={8} />
        <PinNum value={9} />
      </Row>
      <Row>
        <Button className="pin-btn" onClick={onClear}>
          Clear
        </Button>
        <PinNum value={0} />
        <Button
          className="pin-btn"
          onClick={() => setPin(pin.substring(0, pin.length - 1))}
        >
          Back
        </Button>
      </Row>
    </Container>
  );
};

const mapStateToProps = (state) => {
  return { isAuth: state.auth.authenticated };
};

export default connect(mapStateToProps)(PinPad);
