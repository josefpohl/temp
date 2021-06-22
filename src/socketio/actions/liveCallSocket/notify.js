import {
  POKE_NOTIFY,
  POKE_NOTIFY_SUCCESS,
  POKE_NOTIFY_FAIL,
  ON_POKE_NOTIFY,
  ON_POKE_NOTIFY_SUCCESS,
  ON_POKE_NOTIFY_FAIL,
  OFF_POKE_NOTIFY,
  OFF_POKE_NOTIFY_SUCCESS,
  OFF_POKE_NOTIFY_FAIL,
} from "../types";

import { notifyProvider } from "../../../state/liveCalls";

export const alert = ({ sender, receiver }) => {
  return {
    type: "socket",
    types: [POKE_NOTIFY, POKE_NOTIFY_SUCCESS, POKE_NOTIFY_FAIL],
    promise: (socket) => socket.emit(POKE_NOTIFY, { sender, receiver }),
  };
};

export const onAlert = () => (dispatch) => {
  console.log(`On Alert listener exec`);
  const notify = (e) => {
    dispatch(notifyProvider(e));
  };

  dispatch({
    type: "socket",
    types: [ON_POKE_NOTIFY, ON_POKE_NOTIFY_SUCCESS, ON_POKE_NOTIFY_FAIL],
    promise: (socket) => socket.on(POKE_NOTIFY, notify),
  });
};

export function offAlert() {
  return {
    type: "socket",
    types: [OFF_POKE_NOTIFY, OFF_POKE_NOTIFY_SUCCESS, OFF_POKE_NOTIFY_FAIL],
    promise: (socket) => socket.off(POKE_NOTIFY),
  };
}
