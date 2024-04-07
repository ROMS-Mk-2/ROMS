import React from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function BasicDraggable() {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "box",
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        ref={drag}
        style={{
          width: "100px",
          height: "100px",
          backgroundColor: isDragging ? "red" : "blue",
        }}
      >
        Drag Me
      </div>
    </DndProvider>
  );
}

export default BasicDraggable;
