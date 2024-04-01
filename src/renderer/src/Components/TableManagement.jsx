import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { PlusSquare, Trash } from "react-bootstrap-icons";

import NumPadModal from "./NumPadModal";

import "./TableManagement.scss";
import Draggable from "react-draggable";
import { insertSQL, sendSQL } from "../Utilities/SQLFunctions";
import { useNavigate, useParams } from "react-router-dom";
import { connect } from "react-redux";
import moment from "moment";

const TableItem = ({ name, tableID, active = false, canEdit, ...props }) => {
  return (
    <Button
      {...props}
      className="table-item"
      data-tableid={tableID}
      variant={!active ? "primary" : "danger"}
    >
      {name}
    </Button>
  );
};

const TableMangement = ({ canEdit = false, user }) => {
  const [modalShow, setModalShow] = useState(false);
  const [showNewTableModal, setShowNewTableModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [items, setItems] = useState([]);
  const [activeTables, setActiveTables] = useState([]);
  const [currentTable, setCurrentTable] = useState(null);

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    sendSQL("SELECT * FROM tables").then((data) => setItems(data));
    getActiveTables();
  }, []);

  const handleTableClick = (tableID) => {
    if (activeTables.includes(tableID)) {
      sendSQL(
        `SELECT * FROM transaction_history WHERE table_id=${tableID} AND end_time IS NULL`
      ).then((data) => navigate(`/app/table/${data[0].id}`));
    } else {
      if (!canEdit) {
        setShowNewTableModal(true);
        setCurrentTable(tableID);
      }
    }
  };

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

  const getActiveTables = (id) => {
    sendSQL(`SELECT * FROM transaction_history WHERE end_time IS NULL`).then(
      (data) => {
        const temp = data.map((d) => d.table_id);
        setActiveTables(temp);
      }
    );
  };

  const createTransaction = (patronCount, tableID) => {
    console.log(typeof user.pin);
    insertSQL(
      `INSERT INTO transaction_history (patron_count, server_id, table_id, arrival_time, date) VALUES(${patronCount}, '${
        user.pin
      }', ${tableID}, '${moment().toISOString()}', '${moment().toISOString()}');`
    ).then((data) => console.log(data));
  };

  return (
    <div className="table-management-container">
      <NumPadModal
        modalTitle="Patron Count"
        show={showNewTableModal}
        setShow={setShowNewTableModal}
        stateHandler={(value) => {
          if (currentTable) createTransaction(value, currentTable);
          setShowNewTableModal(false);
        }}
      />
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
          <TableItem
            name={table.seating_size}
            tableID={table.id}
            setShowNewTableModal={setShowNewTableModal}
            canEdit={canEdit}
            active={activeTables.includes(table.id)}
            onClick={() => handleTableClick(table.id)}
          />
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

const mapStateToProps = (state) => {
  return { user: state.auth.user };
};

export default connect(mapStateToProps)(TableMangement);
