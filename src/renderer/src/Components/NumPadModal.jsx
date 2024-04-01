import React, { useState } from "react";
import {
  Button,
  Modal,
  FormControl,
  Form,
  Container,
  Row,
} from "react-bootstrap";
import { Backspace } from "react-bootstrap-icons";

import "./NumPadModal.scss";

const NumPadModal = ({ show, setShow, modalTitle, stateHandler }) => {
  const [num, setNum] = useState("0");
  const NumBtn = ({ value }) => {
    return (
      <Button className="num-btn" onClick={() => setNum(num.concat(value))}>
        {value}
      </Button>
    );
  };

  const handleClose = () => setShow(false);
  const handleClear = () => setNum("0");
  const handleBack = () =>
    num.length > 0 ? setNum(num.substring(0, num.length - 1)) : setNum(0);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="num-pad-modal-form">
          <FormControl
            type="number"
            value={parseInt(num)}
            onChange={() => {}}
            min={0}
            max={100}
          />
          <Container className="num-pad-container">
            <Row>
              <NumBtn value={1} />
              <NumBtn value={2} />
              <NumBtn value={3} />
            </Row>
            <Row>
              <NumBtn value={4} />
              <NumBtn value={5} />
              <NumBtn value={6} />
            </Row>
            <Row>
              <NumBtn value={7} />
              <NumBtn value={8} />
              <NumBtn value={9} />
            </Row>
            <Row>
              <Button className="num-btn" onClick={handleClear}>
                Clear
              </Button>
              <NumBtn value={0} />
              <Button className="num-btn" onClick={handleBack}>
                <Backspace size={24} />
              </Button>
            </Row>
          </Container>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => stateHandler(num)}>Ok</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NumPadModal;
