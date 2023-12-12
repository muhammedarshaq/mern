import { combineReducers } from "@reduxjs/toolkit";
import alert from "./alert";

const rootReducer = combineReducers({
  alert: alert,
});

export default rootReducer;
