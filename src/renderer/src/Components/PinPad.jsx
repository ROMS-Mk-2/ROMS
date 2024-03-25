import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useDispatch, connect } from "react-redux";
import { Navigate } from "react-router-dom";

import { login } from "../Utilities/Store/authReducer/authSlice";
import "./PinPad.scss";

const PinPad = ({ isAuth }) => {
  const [pin, setPin] = useState("");
  const [isValid, setIsValid] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    //TODO: Implement database user/PIN
    if (pin === "0000") {
      dispatch(login());
    }

    if (pin.length >= 4) {
      setIsValid(false);
      onClear();
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

  return isAuth ? (
    <Navigate to="/app/table" />
  ) : (
    <Container className="pin-pad-container">
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
