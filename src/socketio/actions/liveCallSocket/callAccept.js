import {
  CALL_ACCEPT,
  CALL_ACCEPT_FAIL,
  CALL_ACCEPT_SUCCESS,
  ON_CALL_ACCEPT,
  ON_CALL_ACCEPT_SUCCESS,
  ON_CALL_ACCEPT_FAIL,
} from "../types";

import { addCallAccepted } from "../../../state/liveCalls";
export const callAccept = (liveCallData) => {
  console.log(`Call Accepted ${JSON.stringify(liveCallData)}`);

  return {
    type: "socket",
    types: [CALL_ACCEPT, CALL_ACCEPT_SUCCESS, CALL_ACCEPT_FAIL],
    promise: (socket) => socket.emit(CALL_ACCEPT, liveCallData),
  };
};

export const onCallAccepted = () => (dispatch) => {
  console.log(`Incoming Call Accepted`);

  const onCallAccept = (e) => {
    dispatch(addCallAccepted(e));
  };

  dispatch({
    type: "socket",
    types: [ON_CALL_ACCEPT, ON_CALL_ACCEPT_SUCCESS, ON_CALL_ACCEPT_FAIL],
    promise: (socket) => socket.on(CALL_ACCEPT, onCallAccept),
  });
};
