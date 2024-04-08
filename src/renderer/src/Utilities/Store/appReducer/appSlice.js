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
      const { name, details } = action.payload;
      // Ensure details include ordered status
      state.orderedItem[name] = { ...details };
    },
    incrementItemQty(state, action) {
      const itemName = action.payload;
      // Increment in orderedItem (to-be-ordered items)
      if (state.orderedItem[itemName]) {
        state.orderedItem[itemName].quantity += 1;
      }
      // Optionally handle increment for tableOrderedItems if needed
    },
    decrementItemQty(state, action) {
      const itemName = action.payload;
      // Decrement in orderedItem (to-be-ordered items)
      if (
        state.orderedItem[itemName] &&
        state.orderedItem[itemName].quantity > 1
      ) {
        state.orderedItem[itemName].quantity -= 1;
      } else {
        delete state.orderedItem[itemName];
      }
      // Optionally handle decrement for tableOrderedItems if needed
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
      // Merge orderedItem into tableOrderedItems
      Object.entries(state.orderedItem).forEach(([key, value]) => {
        if (state.tableOrderedItems[key]) {
          // If the item exists in tableOrderedItems, update quantity
          state.tableOrderedItems[key].quantity += value.quantity;
        } else {
          // Otherwise, add the item to tableOrderedItems
          state.tableOrderedItems[key] = { ...value, ordered: true };
        }
      });
      // Reset orderedItem and selectedItems as they are now ordered
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
