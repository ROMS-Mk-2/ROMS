import React, { useState, useCallback, useEffect } from "react";
import GridLayout from "../Components/GridLayout";
import { Modal, Button, Form } from "react-bootstrap";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableCell from "../Components/DraggableCell";
import { sendSQL, insertSQL } from "../Utilities/SQLFunctions";

const createEmptyGrid = (size = 30) =>
  Array.from({ length: size }, (_, index) => ({
    id: `empty-${index}`,
    name: "+",
    isEmpty: true,
  }));

function MenuManagementGrid({ data, onItemUpdate }) {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [itemId, setItemId] = useState("");
  const [currentPosition, setCurrentPosition] = useState("");

  const fetchMenuItems = async () => {
    try {
      const response = await sendSQL(
        "SELECT id, name, price, description, category, gui_position FROM menu ORDER BY gui_position ASC"
      );
      const fetchedItems = response.map((item) => ({
        ...item,
        isEmpty: false,
      }));

      const maxPosition = fetchedItems.reduce((max, item) => {
        const [row, col] = item.gui_position.split("-").map(Number);
        return Math.max(max, row * 5 + col + 1);
      }, 30);

      const newGridSize = Math.ceil(maxPosition / 5) * 5;
      const newGrid = createEmptyGrid(newGridSize).map((cell, index) => {
        const guiPosition = `${Math.floor(index / 5)}-${index % 5}`;
        const foundItem = fetchedItems.find(
          (item) => item.gui_position === guiPosition
        );
        return foundItem || cell;
      });

      setItems(newGrid);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const onMove = async (draggedId, targetId) => {
    setItems((prevItems) => {
      const draggedIndex = prevItems.findIndex((item) => item.id === draggedId);
      let targetIndex = prevItems.findIndex((item) => item.id === targetId);

      if (targetIndex === -1) {
        const newPosition = targetId.split("-");
        const newRow = parseInt(newPosition[0], 10);
        const newCol = parseInt(newPosition[1], 10);
        const requiredRows = Math.max(newRow, Math.ceil(prevItems.length / 5));
        const requiredCells = requiredRows * 5;
        const cellsToAdd =
          requiredCells - prevItems.length + (newCol === 5 ? 5 : 0);

        const newItems = [...prevItems];
        for (let i = 0; i < cellsToAdd; i++) {
          newItems.push({
            id: `empty-${prevItems.length + i}`,
            name: "+",
            isEmpty: true,
          });
        }
        targetIndex = newItems.length - 5 + newCol - 1;
        return newItems;
      }

      const newItems = [...prevItems];
      const temp = newItems[draggedIndex];
      newItems[draggedIndex] = newItems[targetIndex];
      newItems[targetIndex] = temp;

      if (
        targetIndex === prevItems.length - 1 ||
        draggedIndex === prevItems.length - 1
      ) {
        newItems.push({
          id: `empty-${newItems.length}`,
          name: "+",
          isEmpty: true,
        });
      }

      return newItems;
    });

    const newPositionForDragged = findItemPosition(targetId);
    const newPositionForTarget = findItemPosition(draggedId);

    try {
      await sendSQL(
        `UPDATE menu SET gui_position='${newPositionForDragged}' WHERE id='${draggedId}'`
      );
      await sendSQL(
        `UPDATE menu SET gui_position='${newPositionForTarget}' WHERE id='${targetId}'`
      );
    } catch (error) {
      console.log("Error updating positions:", error);
    }
  };

  const renderCell = (item) => (
    <DraggableCell
      key={item.id}
      item={item}
      onMove={onMove}
      onItemSelect={onItemSelect}
    />
  );

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    switch (name) {
      case "name":
        setName(value);
        break;
      case "price":
        setPrice(value);
        break;
      case "description":
        setDescription(value);
        break;
      case "category":
        setCategory(value);
        break;
      case "image":
        setImageFile(files[0]);
        break;
      default:
        break;
    }
  };

  const findItemPosition = useCallback(
    (itemId) => {
      const index = items.findIndex((item) => item.id === itemId);
      if (index === -1) return "";
      const rowIndex = Math.floor(index / 5);
      const colIndex = index % 5;
      return `${rowIndex}-${colIndex}`;
    },
    [items]
  );

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("image", imageFile);

    const isExistingItem = typeof itemId.startsWith("empty-") === false;
    let sqlQuery = "";

    if (isExistingItem) {
      sqlQuery = `UPDATE menu SET name='${name}', category='${category}', price=${price}, description='${description}' WHERE id='${itemId}'`;
    } else {
      sqlQuery = `INSERT INTO menu (name, category, price, description, gui_position) VALUES ('${name}', '${category}', ${price}, '${description}', '${currentPosition}');`;
    }

    try {
      const response = await insertSQL(sqlQuery);
      let newid = await response.lastID;
      if (isExistingItem) {
        const itemIndex = items.findIndex((item) => item.id === Number(itemId));
        if (itemIndex !== -1) {
          const newItems = [...items];

          newItems[itemIndex] = {
            ...newItems[itemIndex],
            name: name,
            category,
            price,
            currentPosition,
            description,
            isEmpty: false,
          };

          setItems(newItems);
        }
      } else {
        const newItem = {
          id: newid,
          name,
          category,
          price,
          description,
          isEmpty: false,
        };
        fetchMenuItems();
      }
    } catch (error) {
      console.error("Error in SQL operation:", error);
    }

    resetForm();
    setShowModal(false);
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setDescription("");
    setCategory("");
    setImageFile(null);
    setItemId("");
  };

  const onItemSelect = (item) => {
    setItemId(String(item.id));
    setName(item.name || "");
    setPrice(item.price || "");
    setDescription(item.description || "");
    setCategory(item.category || "");
    setImageFile(null);
    setShowModal(true);

    setCurrentPosition(findItemPosition(item.id));
  };

  const renderModal = () => (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Menu Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={price}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              rows={3}
              value={description}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              name="category"
              value={category}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <GridLayout
          data={items}
          onItemSelect={onItemSelect}
          renderCell={renderCell}
        />
      </DndProvider>
      {renderModal()}
    </>
  );
}

export default MenuManagementGrid;
