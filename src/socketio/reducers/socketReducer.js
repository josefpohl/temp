import {
  USER_CONNECTED,
  CONNECT,
  CONNECT_FAIL,
  CONNECT_SUCCESS,
} from "../actions/types";

const initial_state = {
  data: {},
};

export default (state = initial_state, action) => {
  switch (action.type) {
    case USER_CONNECTED:
      console.log("USER CONNECTED EVENT");
      return { ...state, data: action.payload };
    default:
      return state;
  }
};
