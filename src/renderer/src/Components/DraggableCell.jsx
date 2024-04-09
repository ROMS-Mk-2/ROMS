import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { Col } from "react-bootstrap";
import { PlusSquare } from "react-bootstrap-icons";

function DraggableCell({ item, onMove, onItemSelect }) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "cell",
      item: { id: item.id },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [item.id]
  );

  const [, drop] = useDrop(
    () => ({
      accept: "cell",
      drop: (draggedItem) => {
        onMove(draggedItem.id, item.id);
      },
    }),
    [onMove, item.id]
  );

  return (
    <Col
      ref={(node) => drag(drop(node))}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: "grab" }}
      className="grid-col d-flex align-items-center justify-content-center"
      onClick={() => onItemSelect(item)}
    >
      {item.name || <PlusSquare size={16} />}
    </Col>
  );
}

export default DraggableCell;
