import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderedItem: {},
  selectedItems: [],
  tableOrderedItems: {},
  editModalVisible: false,
  editingItem: {},
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setOrderedItem(state, action) {
      const { name, details } = action.payload;
      state.orderedItem[name] = { ...details };
    },
    incrementItemQty(state, action) {
      const itemName = action.payload;
      if (state.orderedItem[itemName]) {
        state.orderedItem[itemName].quantity += 1;
      }
    },
    decrementItemQty(state, action) {
      const itemName = action.payload;
      if (
        state.orderedItem[itemName] &&
        state.orderedItem[itemName].quantity > 1
      ) {
        state.orderedItem[itemName].quantity -= 1;
      } else {
        delete state.orderedItem[itemName];
      }
    },
    editItemQty(state, action) {
      const { itemName, newQty } = action.payload;
      if (state.orderedItem[itemName]) {
        state.orderedItem[itemName].quantity = newQty;
      } else if (state.tableOrderedItems[itemName]) {
        state.tableOrderedItems[itemName].quantity = newQty;
      }
    },
    deleteOrderedItem(state, action) {
      const itemName = action.payload;
      delete state.orderedItem[itemName];
    },

    deleteTableOrderedItem(state, action) {
      const itemName = action.payload;
      delete state.tableOrderedItems[itemName];
    },

    clearOrderedItems(state) {
      state.orderedItem = {};
    },
    selectItem(state, action) {
      if (!state.selectedItems.includes(action.payload)) {
        state.selectedItems.push(action.payload);
      }
    },
    deselectItem(state, action) {
      state.selectedItems = state.selectedItems.filter(
        (item) => item !== action.payload
      );
    },
    clearSelectedItems(state) {
      state.selectedItems = [];
    },
    setTableOrderedItems(state, action) {
      state.tableOrderedItems = action.payload;
    },
    clearTableOrderedItems(state) {
      state.tableOrderedItems = {};
    },
    markItemsAsOrdered(state) {
      Object.entries(state.orderedItem).forEach(([key, value]) => {
        if (state.tableOrderedItems[key]) {
          state.tableOrderedItems[key].quantity += value.quantity;
        } else {
          state.tableOrderedItems[key] = { ...value, ordered: true };
        }
      });
      state.orderedItem = {};
      state.selectedItems = [];
    },
    showEditModal(state, action) {
      const { itemName, isOrdered, quantity, price } = action.payload;
      state.editModalVisible = true;
      state.editingItem = { itemName, isOrdered, quantity, price };
    },
    hideEditModal(state) {
      state.editModalVisible = false;
      state.editingItem = null;
    },
    deselectItems(state, action) {
      const identifiers = action.payload;
      state.selectedItems = state.selectedItems.filter(
        (item) => !identifiers.includes(item)
      );
    },
    compItems: (state, action) => {
      const identifiers = action.payload;

      identifiers.forEach((identifier) => {
        const [itemName, itemState] = identifier.split("-");

        if (itemState === "new" && state.orderedItem[itemName]) {
          state.orderedItem[itemName].price = 0;
        }

        if (itemState === "ordered" && state.tableOrderedItems[itemName]) {
          state.tableOrderedItems[itemName].price = 0;
        }
      });
    },
  },
});

export const {
  compItems,
  deleteTableOrderedItem,
  deselectItems,
  setTableOrderedItems,
  clearTableOrderedItems,
  markItemsAsOrdered,
  setOrderedItem,
  incrementItemQty,
  decrementItemQty,
  editItemQty,
  deleteOrderedItem,
  clearOrderedItems,
  selectItem,
  deselectItem,
  clearSelectedItems,
  showEditModal,
  hideEditModal,
} = appSlice.actions;
export default appSlice.reducer;
