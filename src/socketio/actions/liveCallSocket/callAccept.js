import {
  CALL_ACCEPT,
  CALL_ACCEPT_FAIL,
  CALL_ACCEPT_SUCCESS,
  ON_CALL_ACCEPT,
  ON_CALL_ACCEPT_SUCCESS,
  ON_CALL_ACCEPT_FAIL,
  OFF_CALL_ACCEPT,
  OFF_CALL_ACCEPT_SUCCESS,
  OFF_CALL_ACCEPT_FAIL,
} from "../types";

import { addCallAccepted } from "../../../state/liveCalls";

export const callAccept = (liveCallData) => {
  return {
    type: "socket",
    types: [CALL_ACCEPT, CALL_ACCEPT_SUCCESS, CALL_ACCEPT_FAIL],
    promise: (socket) => socket.emit(CALL_ACCEPT, liveCallData),
  };
};

export const onCallAccept = () => (dispatch) => {
  console.log(`Incoming Call Accepted listener exec`);
  const onCallAccepted = (e) => {
    console.log(`Call ACCEPT RECEIVED ${JSON.stringify(e)}`);
    dispatch(addCallAccepted(e));
  };

  dispatch({
    type: "socket",
    types: [ON_CALL_ACCEPT, ON_CALL_ACCEPT_SUCCESS, ON_CALL_ACCEPT_FAIL],
    promise: (socket) => socket.on(CALL_ACCEPT, onCallAccepted),
  });
};

export function offCallAccept() {
  return {
    type: "socket",
    types: [OFF_CALL_ACCEPT, OFF_CALL_ACCEPT_SUCCESS, OFF_CALL_ACCEPT_FAIL],
    promise: (socket) => socket.off(CALL_ACCEPT),
  };
}
