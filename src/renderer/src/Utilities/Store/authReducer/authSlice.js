import { createSlice } from "@reduxjs/toolkit";

const initialState = { authenticated: false, user: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.authenticated = true;
      state.user = action.payload;
    },
    logout(state) {
      state.authenticated = false;
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
