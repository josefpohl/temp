import { CALL_REJECT } from "../../socketio/actions/types";
import {
  LOADING_SKYWRITER,
  SET_SKYWRITER_IN_CALL,
  SET_TOKEN,
  CLEAR_LIVE_CALL,
  FINDING_SKYWRITER_ERROR,
  SAVED_LIVECALL,
  ROOM_INITIATE,
  CALL_ACCEPTED,
  ADD_MESSAGE,
  LEAVING,
  SKYWRITER_ARRIVED,
  LEFT_LIVE_CALL,
  CALL_CANCELLED,
  CALL_DISCONNECTED,
  NOTIFY,
  SET_IS_SENDER,
  SAVING_LIVECALL,
  SET_ROOM_INFO,
  SET_DESCRIPTION,
  CAN_PRE_SAVE,
  CALL_FINISHED,
} from "./types";

const initial_state = {
  skywriter: null,
  findingSkywriterError: false,
  loadingSkywriter: false,
  roomname: "",
  token: null,
  isSender: false,
  canJoinRoom: false,
  callAccepted: false,
  skywriterArrived: true,
  callWillEnd: false,
  leavingCall: false,
  savedLiveCall: false,
  savingCallInProgress: false,
  callCancelled: false,
  rejectCall: false,
  notified: null,
  liveCallError: false,
  roomInfo: null,
  description: "",
  canPreSave: false,
  callFinished: false,
  messages: [],
};

export default (state = initial_state, action) => {
  switch (action.type) {
    case LOADING_SKYWRITER:
      return { ...state, loadingSkywriter: true };
    case SET_SKYWRITER_IN_CALL:
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
    case ADD_MESSAGE:
      let newMessages = [...state.messages, action.payload];
      return { ...state, messages: [...newMessages] };
    case SKYWRITER_ARRIVED:
      return { ...state, skywriterArrived: true };
    case SET_IS_SENDER:
      return { ...state, isSender: action.payload };
    case LEAVING:
      return { ...state, callWillEnd: true };
    case CLEAR_LIVE_CALL:
      return { ...state, ...initial_state };
    case SAVED_LIVECALL:
      return { ...state, savedLiveCall: true };
    case SAVING_LIVECALL:
      return { ...state, savingCallInProgress: !state.savingCallInProgress };
    case CALL_FINISHED:
      console.log(`Setting callFinished true`);
      return { ...state, callFinished: true };
    case CALL_CANCELLED:
      return { ...state, callWillEnd: true, callCancelled: true };
    case CALL_REJECT:
      return { ...state, rejectCall: true, callWillEnd: true };
    case CALL_DISCONNECTED:
      return { ...state, leavingCall: true };
    case NOTIFY:
      return { ...state, notified: action.payload };
    case SET_DESCRIPTION:
      return { ...state, description: action.payload };
    case SET_ROOM_INFO:
      let preSave = false;
      console.log(
        `SET_ROOM_INFO REDUCER: ${JSON.stringify(
          action.payload
        )} ${JSON.stringify(state.skywriter)}, ${JSON.stringify(
          state.description
        )}`
      );
      if (
        action.payload !== null &&
        state.skywriter !== null &&
        state.description !== ""
      ) {
        console.log(`CAN PRESAVE!!!`);
        preSave = true;
      }
      return { ...state, roomInfo: action.payload, canPreSave: preSave };
    default:
      return state;
  }
};
