import { combineReducers, configureStore } from "@reduxjs/toolkit";
import appSlice from "./appReducer/appSlice";
import authSlice from "./authReducer/authSlice";

const rootReducer = combineReducers({
  app: appSlice,
  auth: authSlice,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
