import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderedItem: {},
  selectedItems: [],
  tableOrderedItems: {},
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setOrderedItem(state, action) {
      state.orderedItem = action.payload;
    },
    incrementItemQty(state, action) {
      state.orderedItem[action.payload].quantity += 1;
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
      state.orderedItem[action.payload.name] = action.payload.newQty;
    },
    deleteItem(state, action) {
      const next = { ...state.orderedItem };
      delete next[action.payload];
      state.orderedItem = next;
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
    markItemsAsOrdered(state, action) {
      state.tableOrderedItems = {
        ...state.tableOrderedItems,
        ...action.payload,
      };
      state.orderedItem = {};
      state.selectedItems = [];
    },
  },
});

export const {
  setTableOrderedItems,
  clearTableOrderedItems,
  markItemsAsOrdered,
  setOrderedItem,
  incrementItemQty,
  decrementItemQty,
  editItemQty,
  deleteItem,
  clearOrderedItems,
  selectItem,
  deselectItem,
  clearSelectedItems,
} = appSlice.actions;
export default appSlice.reducer;
