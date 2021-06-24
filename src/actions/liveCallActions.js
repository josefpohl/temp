import {
  RECORDING,
  PAUSE_RECORDING,
  CALL_ENDING,
  CALL_ENDED,
  LIVECALL_CANCELLED,
  LIVECALL_REJECTED,
  IGNORE_INCOMINGCALL,
  IGNORE_ALL_CALLS,
  INCOMING_CALL_FORWARD,
  INCOMING_CALL_CANCEL,
  SET_ROOM_INFORMATION,
} from "./actionTypes";

export const startRecording = (isRecording) => {
  return {
    type: RECORDING,
    payload: isRecording,
  };
};

export const pauseRecording = (isPaused) => {
  return {
    type: PAUSE_RECORDING,
    payload: isPaused,
  };
};

export const callEnding = () => {
  return {
    type: CALL_ENDING,
    payload: true,
  };
};

export const callEnded = () => {
  return {
    type: CALL_ENDED,
    payload: true,
  };
};
export const livecall_rejected = () => {
  return {
    type: LIVECALL_REJECTED,
    payload: true,
  };
};
export const livecall_cancelled = () => {
  return {
    type: LIVECALL_CANCELLED,
    payload: true,
  };
};

export const ignoreIncomingCall = (ignore) => {
  console.log("IGNORE_INCOMINGCALL", ignore);
  return {
    type: IGNORE_INCOMINGCALL,
    payload: ignore,
  };
};

export const ignoreAllCalls = (ignore) => {
  console.log("IGNORE_ALL_CALLS", ignore);
  return {
    type: IGNORE_ALL_CALLS,
    payload: ignore,
  };
};

export const forwardCall = () => (dispatch) => {
  dispatch({ type: INCOMING_CALL_FORWARD });
};

export const forwardCallCancel = () => (dispatch) => {
  dispatch({ type: INCOMING_CALL_CANCEL });
};

export const setRoomInformation = (roomInfo) => (dispatch) => {
  dispatch({
    type: SET_ROOM_INFORMATION,
    payload: roomInfo,
  });
};
