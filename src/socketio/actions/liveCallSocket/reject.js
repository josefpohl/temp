import {
  CALL_REJECT,
  CALL_REJECT_SUCCESS,
  CALL_REJECT_FAIL,
  ON_CALL_REJECT,
  ON_CALL_REJECT_SUCCESS,
  ON_CALL_REJECT_FAIL,
  OFF_CALL_REJECT,
  OFF_CALL_REJECT_SUCCESS,
  OFF_CALL_REJECT_FAIL,
} from "../types";

import { callReject } from "../../../state/liveCalls";
export const rejectingCall = ({ sender, receiver }) => {
  console.log(`Rejecting call socket emit`);
  return {
    type: "socket",
    types: [CALL_REJECT, CALL_REJECT_SUCCESS, CALL_REJECT_FAIL],
    promise: (socket) => socket.emit(CALL_REJECT, { sender, receiver }),
  };
};

export const onCallReject = () => (dispatch) => {
  console.log(`Call Reject listener exec`);

  const onRejecting = (e) => {
    dispatch(callReject(e));
  };

  dispatch({
    type: "socket",
    types: [ON_CALL_REJECT, ON_CALL_REJECT_SUCCESS, ON_CALL_REJECT_FAIL],
    promise: (socket) => socket.on(CALL_REJECT, onRejecting),
  });
};

export const offCallReject = () => {
  return {
    type: "socket",
    types: [OFF_CALL_REJECT, OFF_CALL_REJECT_SUCCESS, OFF_CALL_REJECT_FAIL],
    promise: (socket) => socket.off(CALL_REJECT),
  };
};
