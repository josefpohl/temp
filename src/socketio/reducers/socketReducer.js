import {
  USER_CONNECTED,
  // CONNECT,  remove these?
  // CONNECT_FAIL,
  // CONNECT_SUCCESS,
  USER_DISCONNECTED,
} from "../actions/types";

const initial_state = {
  data: {},
};

export default (state = initial_state, action) => {
  switch (action.type) {
    case USER_CONNECTED:
      console.log("USER CONNECTED EVENT");
      return { ...state, data: action.payload };
    case USER_DISCONNECTED:
      console.log("USER DISCONNECTED EVENT");
      return { ...state, data: action.payload };
    default:
      return state;
  }
};
