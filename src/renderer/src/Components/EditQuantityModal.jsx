import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Modal, Button, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import {
  editItemQty,
  setTableOrderedItems,
  setOrderedItem,
} from "../Utilities/Store/appReducer/appSlice";
import { sendSQL } from "../Utilities/SQLFunctions";

const EditQuantityModal = ({
  show,
  onHide,
  item,
  onSave,
  fetchUpdatedOrders,
}) => {
  const params = useParams();
  const transactionId = params.transaction_id;
  const {
    quantity: initialQuantity = 0,
    itemName,
    isOrdered,
    menu_item,
  } = item;
  const [quantity, setQuantity] = useState(initialQuantity);
  const dispatch = useDispatch();

  const handleSave = async () => {
    if (isOrdered) {
      try {
        await sendSQL(
          `UPDATE orders SET quantity=${quantity} WHERE menu_item=${menu_item} AND transaction_id=${transactionId}`
        );
        dispatch((dispatch, getState) => {
          const { tableOrderedItems } = getState().app;
          const updatedTableOrderedItems = { ...tableOrderedItems };

          const itemKey = Object.keys(updatedTableOrderedItems).find(
            (key) => updatedTableOrderedItems[key].menu_item === menu_item
          );
          if (itemKey) {
            updatedTableOrderedItems[itemKey] = {
              ...updatedTableOrderedItems[itemKey],
              quantity: quantity,
            };
          }

          dispatch(setTableOrderedItems(updatedTableOrderedItems));
        });
      } catch (error) {
        console.error("Error updating item quantity in the database:", error);
      }
    } else {
      dispatch((dispatch, getState) => {
        const { orderedItem } = getState().app;
        const itemKey = Object.keys(orderedItem).find(
          (key) => orderedItem[key].menu_item === menu_item
        );
        if (itemKey) {
          dispatch(
            setOrderedItem({
              name: itemKey,
              details: {
                ...orderedItem[itemKey],
                quantity: quantity,
              },
            })
          );
        }
      });
    }
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} style={{ marginTop: "5rem" }}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Quantity for {itemName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              min="0"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(0, parseInt(e.target.value, 10)))
              }
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditQuantityModal;
