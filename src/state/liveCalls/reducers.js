import { CALL_REJECT } from "../../socketio/actions/types";
import {
  LOADING_SKYWRITER,
  SET_SKYWRITER_IN_CALL,
  SET_TOKEN,
  CLEAR_LIVE_CALL,
  FINDING_SKYWRITER_ERROR,
  SAVE_LIVECALL,
  ROOM_INITIATE,
  CALL_ACCEPTED,
  SEND_MESSAGE,
  LEAVING,
  SKYWRITER_ARRIVED,
  LEFT_LIVE_CALL,
  CALL_CANCELLED,
} from "./types";

const initial_state = {
  skywriter: null,
  findingSkywriterError: false,
  loadingSkywriter: false,
  roomname: "",
  token: null,
  canJoinRoom: false,
  callAccepted: false,
  skywriterArrived: true,
  callWillEnd: false,
  leavingCall: false,
  savedLiveCall: false,
  callCancelled: false,
  rejectCall: false,
  messages: [],
};

export default (state = initial_state, action) => {
  switch (action.type) {
    case LOADING_SKYWRITER:
      return { ...state, loadingSkywriter: true };
    case SET_SKYWRITER_IN_CALL:
      console.log("SET_SKYWRITER REDUX");
      return {
        ...state,
        loadingSkywriter: false,
        skywriter: action.payload,
      };
    case FINDING_SKYWRITER_ERROR:
      return { ...state, findingSkywriterError: true, loadingSkywriter: false };
    case SET_TOKEN:
      return { ...state, token: action.payload };
    case ROOM_INITIATE:
      return { ...state, roomname: action.payload.roomname, canJoinRoom: true };
    case CALL_ACCEPTED:
      return { ...state, callAccepted: true };
    case SEND_MESSAGE:
      let newMessages = [...state.messages, action.payload];
      return { ...state, messages: newMessages };
    case SKYWRITER_ARRIVED:
      return { ...state, skywriterArrived: true };
    case LEAVING:
      return { ...state, callWillEnd: true };
    case CLEAR_LIVE_CALL:
      return { ...state, ...initial_state };
    case SAVE_LIVECALL:
      return { ...state, savedLiveCall: true };
    case CALL_CANCELLED:
      return { ...state, callWillEnd: true, callCancelled: true };
    case CALL_REJECT:
      return { ...state, rejectCall: true, callWillEnd: true };
    case CALL_DISCONNECTED:
      return { ...state, leavingCall: true };
    default:
      return state;
  }
};
