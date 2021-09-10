import { IN_LIVE_CALL } from "../../actions/actionTypes";
import {
  USER_CONNECTED,
  USER_DISCONNECTED,
  ROOM_INITIATE,
  CALL_ACCEPT,
  SKYWRITER_ARRIVED,
  SEND_MESSAGE,
  LEFT_LIVE_CALL,
  TERMINATE_CALL,
  CALL_REJECT,
} from "../actions/types";

const initial_state = {
  data: {},
};

export default (state = initial_state, action) => {
  switch (action.type) {
    case USER_CONNECTED:
      return { ...state, data: action.payload };
    case USER_DISCONNECTED:
      return { ...state, data: action.payload };
    case ROOM_INITIATE:
      return { ...state, data: action.payload };
    case CALL_ACCEPT:
      return { ...state, data: action.payload };
    case SKYWRITER_ARRIVED:
      return { ...state, data: action.payload };
    case SEND_MESSAGE:
      return { ...state, data: action.payload };
    case LEFT_LIVE_CALL:
      return { ...state, data: action.payload };
    case IN_LIVE_CALL:
      return { ...state, data: action.payload };
    case LEAVING:
      return { ...state, data: action.payload };
    case TERMINATE_CALL:
      return { ...state, data: action.payload };
    case CALL_REJECT:
      return { ...state, data: action.payload };
    default:
      return state;
  }
};
