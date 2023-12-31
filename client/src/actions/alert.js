import { v4 } from "uuid";
import { SET_ALERT, REMOVE_ALERT } from "./types";

export const setAlert = (msg, alertType) => (dispatch) => {
  const id = v4();
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id },
  });
};
