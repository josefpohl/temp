import {
  USER_CONNECTED,
  USER_DISCONNECTED,
  ROOM_INITIATE,
  CALL_ACCEPT,
  SKYWRITER_ARRIVED,
  SEND_MESSAGE,
  LEFT_LIVE_CALL,
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
    case ROOM_INITIATE:
      console.log("ROOM INITIATED EVENT");
      return { ...state, data: action.payload };
    case CALL_ACCEPT:
      console.log(`CALL ACCEPT EVENT`);
      return { ...state, data: action.payload };
    case SKYWRITER_ARRIVED:
      console.log(`SKYWRITER ARRIVED EVENT`);
      return { ...state, data: action.payload };
    case SEND_MESSAGE:
      console.log(`SEND MESSAGE EVENT`);
      return { ...state, data: action.payload };
    case SKYWRITER_ARRIVED:
      console.log(`SKYWRITER ARRIVED EVENT`);
      return { ...state, data: action.payload };
    case LEFT_LIVE_CALL:
      console.log(`LEFT LIVE CALL EVENT`);
      return { ...state, data: action.payload };
    case LEAVING:
      console.log(`LEAVING EVENT`);
      return { ...state, data: action.payload };
    default:
      return state;
  }
};
