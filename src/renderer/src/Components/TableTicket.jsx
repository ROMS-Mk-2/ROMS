import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { connect } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import {
  clearOrderedItems,
  selectItem,
  deselectItem,
  setTableOrderedItems,
} from "../Utilities/Store/appReducer/appSlice";

import EmptySvg from "../Assets/Empty.svg";
import "./TableTicket.scss";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { sendSQL } from "../Utilities/SQLFunctions";

const TableTicket = ({ orderItems }) => {
  const selectedItems = useSelector((state) => state.app.selectedItems);
  const [ticketInfo, setTicketInfo] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  let params = useParams();

  const tableOrderedItems = useSelector((state) => state.app.tableOrderedItems);

  // Combine items, with non-ordered items first
  const displayItems = [
    ...Object.entries(orderItems).map(([name, details]) => ({
      name,
      ...details,
      ordered: false,
    })),
    ...Object.entries(tableOrderedItems).map(([name, details]) => ({
      name,
      ...details,
      ordered: true,
    })),
  ];

  // Fetch ticket info based on the current transaction
  useEffect(() => {
    if (params.transaction_id) {
      sendSQL(
        `SELECT * FROM transaction_history INNER JOIN employees ON transaction_history.server_id = employees.pin WHERE id=${params.transaction_id}`
      ).then((data) => setTicketInfo(data[0]));
    } else {
      setTicketInfo(null);
    }
  }, [params.transaction_id]);

  useEffect(() => {
    // Fetch ticket info and items when entering a table
    const fetchTicketInfoAndItems = async () => {
      if (params.transaction_id) {
        // Fetch and set ticket info based on the transaction_id
        const ticketInfoResponse = await sendSQL(
          `SELECT * FROM transaction_history INNER JOIN employees ON transaction_history.server_id = employees.pin WHERE id=${params.transaction_id}`
        );
        setTicketInfo(ticketInfoResponse[0]);

        // Fetch and update ordered items for this table
        await fetchUpdatedOrders(params.transaction_id);
      } else {
        // Clear ticket info and items when exiting a table
        setTicketInfo(null);
        dispatch(setTableOrderedItems({})); // Assuming setTableOrderedItems with an empty object clears the items
      }
    };

    fetchTicketInfoAndItems();

    // Cleanup function to clear items when the component unmounts or when transaction_id changes
    return () => {
      dispatch(setTableOrderedItems({}));
    };
  }, [params.transaction_id]);

  const fetchUpdatedOrders = async (transactionId) => {
    // Fetch updated orders based solely on the transaction_id
    const updatedOrdersResponse = await sendSQL(
      `SELECT menu.id, menu.name, orders.quantity, menu.price 
     FROM orders 
     JOIN menu ON orders.menu_item = menu.id 
     WHERE orders.transaction_id = ${transactionId}`
    );

    const updatedOrderedItems = updatedOrdersResponse.reduce(
      (acc, item) => ({
        ...acc,
        [item.name]: {
          quantity: item.quantity,
          price: item.price,
          ordered: true,
        },
      }),
      {}
    );

    dispatch(setTableOrderedItems(updatedOrderedItems));
    dispatch(clearOrderedItems());
  };

  const handleOrder = async () => {
    const transactionId = params.transaction_id;
    for (const [itemName, itemDetails] of Object.entries(orderItems)) {
      const menuItemResponse = await sendSQL(
        `SELECT id FROM menu WHERE name='${itemName.replace("'", "''")}'`
      );
      const menuItemId = menuItemResponse[0]?.id;

      if (menuItemId) {
        // Check if the order for this menu item already exists for the current transaction
        const existingOrderResponse = await sendSQL(
          `SELECT quantity FROM orders WHERE transaction_id=${transactionId} AND menu_item=${menuItemId}`
        );

        if (existingOrderResponse.length > 0) {
          // If it exists, update the quantity
          const newQuantity =
            existingOrderResponse[0].quantity + itemDetails.quantity;
          await sendSQL(
            `UPDATE orders SET quantity=${newQuantity} WHERE transaction_id=${transactionId} AND menu_item=${menuItemId}`
          );
        } else {
          // If it doesn't exist, insert a new order
          await sendSQL(
            `INSERT INTO orders (transaction_id, menu_item, quantity) VALUES (${transactionId}, ${menuItemId}, ${itemDetails.quantity})`
          );
        }
      } else {
        console.error(`Menu item ID not found for item: ${itemName}`);
        continue;
      }
    }
    dispatch(clearOrderedItems());
    await fetchUpdatedOrders(transactionId);
  };

  const handleItemSelection = (itemName, isOrdered) => {
    const uniqueIdentifier = `${itemName}-${isOrdered ? "ordered" : "new"}`;
    if (selectedItems.includes(uniqueIdentifier)) {
      dispatch(deselectItem(uniqueIdentifier));
    } else {
      dispatch(selectItem(uniqueIdentifier));
    }
  };

  const renderItems = () => {
    // Combine and sort items: non-ordered items first, then ordered items
    const combinedItems = [
      ...Object.entries(orderItems).map(([name, details]) => ({
        name,
        ...details,
        ordered: false,
      })),
      ...Object.entries(tableOrderedItems).map(([name, details]) => ({
        name,
        ...details,
        ordered: true,
      })),
    ].sort((a, b) => (a.ordered === b.ordered ? 0 : a.ordered ? 1 : -1));

    // Render items with checkboxes for selection
    return combinedItems.map(({ name, quantity, price, ordered }, index) => (
      <Row
        key={index}
        className={`item-ticket ${ordered ? "ordered-item" : ""}`}
      >
        <Col xs={7}>
          <div>
            <input
              type="checkbox"
              className="form-check-input me-2"
              checked={selectedItems.includes(
                `${name}-${ordered ? "ordered" : "new"}`
              )}
              onChange={() => handleItemSelection(name, ordered)}
            />
            <span>{name}</span>
          </div>
        </Col>
        {/* Ensure these columns align under their respective headers */}
        <Col className="d-flex justify-content-center">{quantity}</Col>
        <Col className="d-flex justify-content-center">{price}</Col>
      </Row>
    ));
  };

  return (
    <Container className="ticket-container" fluid>
      <div className="ticket-header">
        <Row>
          <Col className="ticket-col-1" xs={4}>
            TBL ID: {ticketInfo && ` ${ticketInfo.table_id}`}
          </Col>
          <Col className="ticket-col-1">
            Server Name:{" "}
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
        <Col>
          {Object.keys({ ...orderItems, ...tableOrderedItems }).length > 0 ? (
            renderItems()
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
          <Button className="ticket-fn-button" onClick={handleOrder}>
            Order
          </Button>
        </Col>
        <Col>
          <Button
            className="ticket-fn-button"
            onClick={() =>
              navigate(`/app/table/${params.transaction_id}/functions`)
            }
          >
            Functions
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

const mapStateToProps = (state) => {
  return { orderItems: state.app.orderedItem };
};

export default connect(mapStateToProps)(TableTicket);
