import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import { sendSQL } from "../Utilities/SQLFunctions";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {
  clearOrderedItems,
  selectItem,
  deselectItem,
  deselectItems,
  setTableOrderedItems,
  clearSelectedItems,
} from "../Utilities/Store/appReducer/appSlice";
import EmptySvg from "../Assets/Empty.svg";
import "./TableTicket.scss";

const TableTicket = ({ orderItems }) => {
  const selectedItems = useSelector((state) => state.app.selectedItems);
  const [ticketInfo, setTicketInfo] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let params = useParams();

  const tableOrderedItems = useSelector((state) => state.app.tableOrderedItems);
  const orderedItem = useSelector((state) => state.app.orderedItem);

  useEffect(() => {
    const fetchTicketInfoAndItems = async () => {
      if (params.transaction_id) {
        const ticketInfoResponse = await sendSQL(
          `SELECT * FROM transaction_history INNER JOIN employees ON transaction_history.server_id = employees.pin WHERE id=${params.transaction_id}`
        );
        setTicketInfo(ticketInfoResponse[0]);

        await fetchUpdatedOrders(params.transaction_id);
      } else {
        setTicketInfo(null);
        dispatch(clearSelectedItems());
        dispatch(clearOrderedItems());
        dispatch(setTableOrderedItems({}));
      }
    };

    fetchTicketInfoAndItems();

    return () => {
      dispatch(setTableOrderedItems({}));
    };
  }, [params.transaction_id]);

  const fetchUpdatedOrders = async (transactionId) => {
    const updatedOrdersResponse = await sendSQL(`
  SELECT 
    orders.menu_item, 
    menu.name, 
    orders.quantity, 
    menu.price
  FROM orders 
  JOIN menu ON orders.menu_item = menu.id 
  WHERE orders.transaction_id = ${transactionId}
`);

    const updatedOrderedItems = updatedOrdersResponse.reduce(
      (acc, item) => ({
        ...acc,
        [item.name]: {
          menu_item: item.menu_item,
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
    const identifiersToDeselect = Object.keys(orderedItem).map(
      (itemName) => `${itemName}-new`
    );

    for (const [itemName, itemDetails] of Object.entries(orderedItem)) {
      const menuItemResponse = await sendSQL(
        `SELECT id FROM menu WHERE name='${itemName.replace("'", "''")}'`
      );
      const menuItemId = menuItemResponse[0]?.id;

      if (menuItemId) {
        const existingOrderResponse = await sendSQL(
          `SELECT id, quantity, transaction_price FROM orders WHERE transaction_id=${transactionId} AND menu_item=${menuItemId}`
        );

        if (existingOrderResponse.length > 0) {
          const existingOrderComped =
            existingOrderResponse[0].transaction_price === 0;
          const newItemComped = itemDetails.price === 0;

          const newQuantity =
            existingOrderResponse[0].quantity + itemDetails.quantity;

          if (existingOrderComped && newItemComped) {
            await sendSQL(
              `UPDATE orders SET quantity=${newQuantity} WHERE id=${existingOrderResponse[0].id}`
            );
          } else if (!existingOrderComped && newItemComped) {
          } else if (existingOrderComped && !newItemComped) {
            await sendSQL(
              `UPDATE orders SET quantity=${itemDetails.quantity}, transaction_price=${itemDetails.price} WHERE id=${existingOrderResponse[0].id}`
            );
          } else {
            await sendSQL(
              `UPDATE orders SET quantity=${newQuantity}, transaction_price=${itemDetails.price} WHERE id=${existingOrderResponse[0].id}`
            );
          }
        } else {
          await sendSQL(
            `INSERT INTO orders (transaction_id, menu_item, quantity, transaction_price) VALUES (${transactionId}, ${menuItemId}, ${itemDetails.quantity}, ${itemDetails.price})`
          );
        }
      } else {
        console.error(`Menu item ID not found for item: ${itemName}`);
        continue;
      }
    }

    dispatch(clearOrderedItems());
    dispatch(deselectItems(identifiersToDeselect));
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
        <Col
          className={
            Object.keys({ ...orderItems, ...tableOrderedItems }).length <= 0
              ? "d-flex justify-content-center"
              : ""
          }
        >
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
          <Button
            className="ticket-fn-button"
            onClick={handleOrder}
            disabled={!ticketInfo}
          >
            Order
          </Button>
        </Col>
        <Col>
          <Button
            className="ticket-fn-button"
            onClick={() =>
              navigate(`/app/table/${params.transaction_id}/functions`)
            }
            disabled={!ticketInfo}
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
