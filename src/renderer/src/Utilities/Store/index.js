import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authReducer/authSlice";

const store = configureStore({
  reducer: authSlice,
});

export default store;
