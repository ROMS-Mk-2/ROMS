import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Outlet } from "react-router-dom";
import GridLayout from "../Components/GridLayout";
import { useSelector } from "react-redux";
import { Col, Toast, ToastContainer } from "react-bootstrap";
import { useDispatch } from "react-redux";
import EditQuantityModal from "../Components/EditQuantityModal";
import { sendSQL } from "../Utilities/SQLFunctions";
import {
  setTableOrderedItems,
  deselectItems,
  setOrderedItem,
  deleteOrderedItem,
  clearSelectedItems,
  deleteTableOrderedItem,
  compItems,
} from "../Utilities/Store/appReducer/appSlice";
import EndTransactionModal from "../Components/EndTransactionModal";

const FunctionGrid = () => {
  const [toast, setToast] = useState({ show: false, items: [], type: "" });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEndTransactionModal, setShowEndTransactionModal] = useState(false);
  const [editItemDetails, setEditItemDetails] = useState(null);
  const dispatch = useDispatch();
  const selectedItems = useSelector((state) => state.app.selectedItems);

  const selectedItemCount = useSelector(
    (state) => state.app.selectedItems.length
  );
  const tableOrderedItems = useSelector((state) => state.app.tableOrderedItems);
  const orderedItems = useSelector((state) => state.app.orderedItem);
  const params = useParams();
  const transactionId = params.transaction_id;

  const handleFunctionClick = (selectedFunction) => {
    const selectedItemIdentifier =
      selectedItems.length === 1 ? selectedItems[0] : null;
    let itemName, itemState, itemDetails;

    if (selectedItemIdentifier) {
      [itemName, itemState] = selectedItemIdentifier.split("-");
      const isOrdered = itemState === "ordered";
      itemDetails = isOrdered
        ? tableOrderedItems[itemName]
        : orderedItems[itemName];
    }

    switch (selectedFunction.name) {
      case "Edit Quantity":
        if (selectedItemIdentifier && itemDetails) {
          setEditItemDetails({
            ...itemDetails,
            itemName,
            isOrdered: itemState === "ordered",
          });
          setShowEditModal(true);
        }
        break;
      case "Void Item":
        voidItem();
        break;
      case "Comp Item":
        compItem();
        break;
      case "Move Table":
        // todo: Add logic for moving a table
        console.log("Moving table");
        break;
      case "End Transaction":
        setShowEndTransactionModal(true);
        break;
      default:
        console.log("Function not recognized:", selectedFunction.name);
    }
  };

  const voidItem = async () => {
    selectedItems.forEach(async (selectedItemIdentifier) => {
      const [itemName, itemState] = selectedItemIdentifier.split("-");

      if (itemState === "new") {
        dispatch(deleteOrderedItem(itemName));
      }

      if (itemState === "ordered") {
        const itemDetails = tableOrderedItems[itemName];
        if (itemDetails) {
          const query = `DELETE FROM orders WHERE transaction_id = ${transactionId} AND menu_item = ${itemDetails.menu_item}`;
          try {
            await sendSQL(query);
            dispatch(deleteTableOrderedItem(itemName));
          } catch (error) {
            console.error("Failed to delete item from database:", error);
          }
        }
      }
    });

    setToast((prev) => ({ show: true, items: selectedItems, type: "void" }));
    dispatch(clearSelectedItems());
  };

  const compItem = async () => {
    dispatch(compItems(selectedItems));

    const orderedItemUpdates = selectedItems
      .filter((item) => item.endsWith("-ordered"))
      .map((identifier) => {
        const [itemName] = identifier.split("-");
        const itemDetails = tableOrderedItems[itemName];
        if (!itemDetails) return null;
        return {
          transactionId: params.transaction_id,
          menuItemId: itemDetails.menu_item,
        };
      })
      .filter(Boolean);

    for (const { transactionId, menuItemId } of orderedItemUpdates) {
      try {
        await sendSQL(
          `UPDATE orders SET transaction_price = 0 WHERE transaction_id = ${transactionId} AND menu_item = ${menuItemId}`
        );
        console.log(
          `Comp'd item in database: ${menuItemId} in transaction ${transactionId}`
        );
      } catch (error) {
        console.error("Failed to comp item in database:", error);
      }
    }

    setToast((prev) => ({ show: true, items: selectedItems, type: "comp" }));

    dispatch(clearSelectedItems());
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditItemDetails(null);
  };

  const handleSaveEdit = (newQty) => {
    console.log("Saving new quantity:", newQty);
    handleCloseModal();
  };

  const functionItems = [
    { name: "Edit Quantity", disabled: selectedItemCount !== 1 },
    { name: "Void Item", disabled: selectedItemCount < 1 },
    { name: "Comp Item", disabled: selectedItemCount < 1 },
    { name: "Move Table", disabled: false },
    { name: "End Transaction", disabled: false },
  ].map((item) => ({
    ...item,
  }));

  return (
    <>
      <ToastContainer position="top-end" style={{ padding: "8px" }}>
        {toast.items.map((item) => (
          <Toast
            onClose={() => {
              setToast((prev) => ({
                show: false,
                items: prev.items.filter((prevItem) => item !== prevItem),
              }));
            }}
            show={toast.show}
            autohide
          >
            <Toast.Body>{`${item.split("-")[0]} has been ${
              toast.type
            }ed.`}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
      <GridLayout
        data={functionItems}
        onItemSelect={handleFunctionClick}
        renderCell={(item) => (
          <Col
            className="grid-col d-flex align-items-center justify-content-center"
            style={{
              opacity: item.disabled ? 0.65 : 1,
              cursor: item.disabled ? "not-allowed" : "pointer",
            }}
            onClick={
              !item.disabled ? () => handleFunctionClick(item) : undefined
            }
          >
            {item.name}
          </Col>
        )}
      />
      {showEditModal && editItemDetails && (
        <EditQuantityModal
          show={showEditModal}
          onHide={handleCloseModal}
          item={editItemDetails}
          onSave={handleSaveEdit}
        />
      )}
      <EndTransactionModal
        show={showEndTransactionModal}
        onHide={() => setShowEndTransactionModal(false)}
      />
      <Outlet />
    </>
  );
};

export default FunctionGrid;
