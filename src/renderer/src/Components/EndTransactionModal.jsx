import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearOrderedItems } from "../Utilities/Store/appReducer/appSlice";
import { sendSQL } from "../Utilities/SQLFunctions";

const EndTransactionModal = ({ show, onHide }) => {
  const navigate = useNavigate();
  const { transaction_id } = useParams();
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [pretipBill, setPretipBill] = useState(0);
  const [tip, setTip] = useState(0);
  const [finalBill, setFinalBill] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await sendSQL(
          `SELECT quantity, transaction_price FROM orders WHERE transaction_id=${transaction_id}`
        );
        setOrders(response);
        const pretip = response.reduce(
          (acc, order) => acc + order.quantity * order.transaction_price,
          0
        );
        setPretipBill(pretip);
        setFinalBill(pretip);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, [transaction_id]);

  useEffect(() => {
    setFinalBill(pretipBill + parseFloat(tip));
  }, [tip, pretipBill]);

  const handleSave = async () => {
    const endTime = new Date().toISOString();
    try {
      await sendSQL(`
        UPDATE transaction_history 
        SET end_time='${endTime}', pretip_bill=${pretipBill}, final_bill=${finalBill}, tip=${tip} 
        WHERE id=${transaction_id}
      `);
      dispatch(clearOrderedItems());
      onHide();
      navigate("/app/table");
    } catch (error) {
      console.error("Error updating transaction history:", error);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>End Transaction</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Pretip Bill: ${pretipBill.toFixed(2)}</p>
        <Form>
          <Form.Group>
            <Form.Label>Tip</Form.Label>
            <Form.Control
              type="number"
              value={tip}
              onChange={(e) => setTip(e.target.value)}
            />
          </Form.Group>
          <p>Final Bill: ${finalBill.toFixed(2)}</p>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EndTransactionModal;
