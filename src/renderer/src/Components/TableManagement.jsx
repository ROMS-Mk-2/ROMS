import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { PlusSquare, Trash } from "react-bootstrap-icons";

import NumPadModal from "./NumPadModal";

import "./TableManagement.scss";
import Draggable from "react-draggable";
import { sendSQL } from "../Utilities/SQLFunctions";

const TableItem = ({ name, tableID, ...props }) => {
  return (
    <Button {...props} className="table-item" data-tableid={tableID}>
      {name}
    </Button>
  );
};

const TableMangement = ({ canEdit = false }) => {
  const [modalShow, setModalShow] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    sendSQL("SELECT * FROM tables").then((data) => setItems(data));
  }, []);

  const handleStop = (event, ui) => {
    setIsDragging(false);
    const draggableBounds = event.target.getBoundingClientRect();
    const targetBounds = document
      .getElementById("target-delete-btn")
      .getBoundingClientRect();

    sendSQL(
      `UPDATE tables SET coords='${ui.x},${ui.y}' WHERE id=${ui.node.attributes["data-tableid"].value}`
    );
    // console.log(
    //   `(${targetBounds.left}, ${targetBounds.right}) (${targetBounds.top}, ${targetBounds.bottom})`
    // );

    // console.log(
    //   `(${draggableBounds.left}, ${draggableBounds.right}) (${draggableBounds.top}, ${draggableBounds.bottom})`
    // );

    if (
      draggableBounds.left < targetBounds.right &&
      draggableBounds.right > targetBounds.left &&
      draggableBounds.top < targetBounds.bottom &&
      draggableBounds.bottom > targetBounds.top
    ) {
      deleteTable(ui.node.attributes["data-tableid"].value);
    }
  };

  const addTable = (value) => {
    sendSQL(
      `INSERT INTO tables (seating_size, coords) VALUES(${value}, '0,0');`
    ).then((data) => console.log(data));

    sendSQL("SELECT * FROM tables").then((data) => setItems(data));
  };

  const deleteTable = (id) => {
    sendSQL(`DELETE FROM tables WHERE id=${id}`);
    sendSQL("SELECT * FROM tables").then((data) => setItems(data));
  };

  return (
    <div className="table-management-container">
      <NumPadModal
        show={modalShow}
        setShow={setModalShow}
        modalTitle="Seating Size"
        stateHandler={(value) => {
          addTable(value);
          setModalShow(false);
        }}
      />

      {items.map((table, index) => (
        <Draggable
          key={table.id}
          //   bounds="parent"
          defaultPosition={{
            x: parseInt(table.coords.split(",")[0]),
            y: parseInt(table.coords.split(",")[1]),
          }}
          onDrag={() => setIsDragging(true)}
          onStop={handleStop}
          disabled={!canEdit}
        >
          <TableItem name={table.seating_size} tableID={table.id} />
        </Draggable>
      ))}

      {canEdit && (
        <div className="table-button-container">
          {!isDragging ? (
            <Button className="icon-button" onClick={() => setModalShow(true)}>
              <PlusSquare size={16} />
              Add Table
            </Button>
          ) : (
            <Button
              id="target-delete-btn"
              className="icon-button"
              variant="outline-primary"
              disabled
            >
              <Trash size={16} />
              Delete Table
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default TableMangement;
