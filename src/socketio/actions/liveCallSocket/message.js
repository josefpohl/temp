import {
  SEND_MESSAGE,
  SEND_MESSAGE_FAIL,
  SEND_MESSAGE_SUCCESS,
  ON_SEND_MESSAGE,
  ON_SEND_MESSAGE_SUCCESS,
  ON_SEND_MESSAGE_FAIL,
  OFF_SEND_MESSAGE,
  OFF_SEND_MESSAGE_SUCCESS,
  OFF_SEND_MESSAGE_FAIL,
} from "../types";

import { addMessage } from "../../../state/liveCalls";

export const message = (data) => {
  return {
    type: "socket",
    types: [SEND_MESSAGE, SEND_MESSAGE_SUCCESS, SEND_MESSAGE_FAIL],
    promis: (socket) => socket.emit(SEND_MESSAGE, data),
  };
};

export const onMessage = () => (dispatch) => {
  const onMessageIncoming = (e) => {
    console.log(`Incoming message ${JSON.stringify(e)}`);
    dispatch(addMessage(e));
  };

  dispatch({
    type: "socket",
    types: [ON_SEND_MESSAGE, ON_SEND_MESSAGE_SUCCESS, ON_SEND_MESSAGE_FAIL],
    promise: (socket) => socket.on(SEND_MESSAGE, onMessageIncoming),
  });
};

export function offMessage() {
  return {
    type: "socket",
    types: [OFF_SEND_MESSAGE, OFF_SEND_MESSAGE_SUCCESS, OFF_SEND_MESSAGE_FAIL],
    promise: (socket) => socket.off(SEND_MESSAGE),
  };
}
