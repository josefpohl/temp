import {
  TERMINATE_CALL,
  TERMINATE_CALL_SUCCESS,
  TERMINATE_CALL_FAIL,
  OFF_TERMINATE_CALL,
  OFF_TERMINATE_CALL_FAIL,
  OFF_TERMINATE_CALL_SUCCESS,
  OFF_CALL_ACCEPT_FAIL,
} from "../types";

import { terminateCall } from "../../../state/liveCalls";

export const onTerminate = () => (dispatch) => {
  console.log(`TERMINATE_CALL listener exec`);
  const onCallTerminate = (e) => {
    const { receiver, sender, roomname } = e;
    dispatch(terminateCall({ receiver, sender, roomname }));
  };
  dispatch({
    type: "socket",
    types: [TERMINATE_CALL, TERMINATE_CALL_SUCCESS, TERMINATE_CALL_FAIL],
    promise: (socket) => socket.on(TERMINATE_CALL, onCallTerminate),
  });
};

export function offTerminate() {
  return {
    type: "socket",
    types: [
      OFF_TERMINATE_CALL,
      OFF_TERMINATE_CALL_SUCCESS,
      OFF_CALL_ACCEPT_FAIL,
    ],
    promise: (socket) => socket.off(TERMINATE_CALL),
  };
}
