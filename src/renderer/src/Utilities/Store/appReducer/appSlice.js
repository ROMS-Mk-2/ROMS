import { createSlice } from "@reduxjs/toolkit";

const initialState = { orderedItem: {} };

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
      state.orderedItem[action.payload].quantity += 1;
    },
    editItemQty(state, action) {
      state.orderedItem[action.payload.name] = action.payload.newQty;
    },
    deleteItem(state, action) {
      const next = { ...state.orderedItem };
      delete next[action.payload];
      state.orderedItem = next;
    },
  },
});

export const {
  setOrderedItem,
  incrementItemQty,
  decrementItemQty,
  editItemQty,
  deleteItem,
} = appSlice.actions;
export default appSlice.reducer;
