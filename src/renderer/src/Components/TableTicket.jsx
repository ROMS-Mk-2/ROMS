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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [ticketInfo, setTicketInfo] = useState(null);
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

  useEffect(() => {
    const fetchOrderedItems = async () => {
      if (!params.table_id) return;

      const transactionIdResponse = await sendSQL(
        `SELECT id FROM transaction_history WHERE table_id=${params.table_id} AND end_time IS NULL`
      );
      const transactionId =
        transactionIdResponse.length > 0 ? transactionIdResponse[0].id : null;

      if (transactionId) {
        const orderedItemsResponse = await sendSQL(
          `SELECT menu.id, menu.name, SUM(orders.quantity) AS totalQuantity, menu.price
         FROM orders
         JOIN menu ON orders.menu_item = menu.id
         WHERE orders.transaction_id = ${transactionId}
         GROUP BY orders.menu_item`
        );

        const formattedOrderedItems = orderedItemsResponse.reduce(
          (acc, item) => ({
            ...acc,
            [item.name]: {
              quantity: item.totalQuantity,
              price: item.price,
              ordered: true,
            },
          }),
          {}
        );

        dispatch(setTableOrderedItems(formattedOrderedItems));
      }
    };

    fetchOrderedItems();
  }, [params.table_id, dispatch]);

  const handleOrder = async () => {
    const transactionId = params.transaction_id;

    // Iterating over the items selected for ordering
    for (const [itemName, itemDetails] of Object.entries(orderItems)) {
      // Fetch menu item ID based on the itemName
      const menuItemResponse = await sendSQL(
        `SELECT id FROM menu WHERE name='${itemName.replace("'", "''")}'`
      );
      const menuItemId = menuItemResponse[0]?.id;

      if (menuItemId) {
        // Insert the order into the database
        await sendSQL(
          `INSERT INTO orders (transaction_id, menu_item, quantity) VALUES (${transactionId}, ${menuItemId}, ${itemDetails.quantity})`
        );
      } else {
        console.error(`Menu item ID not found for item: ${itemName}`);
        continue; // Skip to the next item if this one fails
      }
    }

    // After orders are successfully placed, update the state
    try {
      // Fetch updated ordered items for the current transaction
      const updatedOrdersResponse = await sendSQL(
        `SELECT menu.id, menu.name, SUM(orders.quantity) AS totalQuantity, menu.price FROM orders JOIN menu ON orders.menu_item = menu.id WHERE orders.transaction_id = ${transactionId} GROUP BY orders.menu_item`
      );

      const updatedOrderedItems = updatedOrdersResponse.reduce(
        (acc, item) => ({
          ...acc,
          [item.name]: {
            quantity: item.totalQuantity,
            price: item.price,
            ordered: true,
          },
        }),
        {}
      );

      // Update state with the consolidated ordered items
      dispatch(setTableOrderedItems(updatedOrderedItems));
      dispatch(clearOrderedItems()); // Clear items awaiting order
    } catch (error) {
      console.error("Error while updating orders in the database: ", error);
    }
  };

  const handleItemSelection = (itemName) => {
    if (selectedItems.includes(itemName)) {
      dispatch(deselectItem(itemName));
    } else {
      dispatch(selectItem(itemName));
      // If the item is being reordered (i.e., it's already in tableOrderedItems), add it to orderItems with initial quantity
      if (tableOrderedItems[itemName] && !orderItems[itemName]) {
        const itemDetails = tableOrderedItems[itemName];
        dispatch(
          setOrderedItem({
            ...orderItems,
            [itemName]: { ...itemDetails, quantity: 1, ordered: false },
          })
        );
      }
    }
  };

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
            {Object.entries({ ...orderItems, ...tableOrderedItems })
              .sort((a, b) =>
                a[1].ordered === b[1].ordered ? 0 : a[1].ordered ? 1 : -1
              )
              .map(([itemName, itemDetails], index) => (
                <Row
                  key={index}
                  className={`item-ticket ${
                    itemDetails.ordered ? "ordered-item" : ""
                  }`}
                >
                  <Col xs={7}>
                    <div>
                      <input
                        type="checkbox"
                        className="form-check-input me-2"
                        checked={selectedItems.includes(itemName)}
                        onChange={() => handleItemSelection(itemName)}
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
              ))}
          </Col>
        ) : (
          <div className="ticket-no-table">
            <img src={EmptySvg} alt="Empty" />
            Select a Table
          </div>
        )}
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
            onClick={() => {
              navigate(`/app/table/${params.transaction_id}/functions`);
            }}
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
