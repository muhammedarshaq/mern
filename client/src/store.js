import { configureStore, applyMiddleware } from "@reduxjs/toolkit";
import { composeWithDevTools } from "redux-devtools-extension";
import { thunk } from "redux-thunk";
import rootReducer from "./reducers/index";

const initialState = {};

const middleware = [];

const store = configureStore(
  { reducer: rootReducer },
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
