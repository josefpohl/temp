import {
  LEAVING,
  LEAVING_SUCCESS,
  LEAVING_FAIL,
  ON_LEAVING,
  ON_LEAVING_SUCCESS,
  ON_LEAVING_FAIL,
  OFF_LEAVING,
  OFF_LEAVING_SUCCESS,
  OFF_LEAVING_FAIL,
} from "../types";

import { leavingCall } from "../../../state/liveCalls";

export const leaving = ({
  sender,
  receiver,
  roomname,
  terminatedBySender,
  from,
}) => {
  console.log(`Leaving socket emit event`);
  return {
    type: "socket",
    types: [LEAVING, LEAVING_SUCCESS, LEAVING_FAIL],
    promise: (socket) =>
      socket.emit(LEAVING, {
        sender,
        receiver,
        roomname,
        terminatedBySender,
        from,
      }),
  };
};

export const onLeaving = () => (dispatch) => {
  console.log(`Leaving listener exec`);

  const onLeaving = (e) => {
    dispatch(leavingCall(e));
  };
  dispatch({
    type: "socket",
    types: [ON_LEAVING, ON_LEAVING_SUCCESS, ON_LEAVING_FAIL],
    promise: (socket) => socket.on(LEAVING, onLeaving),
  });
};

export function offLeaving() {
  return {
    type: "socket",
    types: [OFF_LEAVING, OFF_LEAVING_SUCCESS, OFF_LEAVING_FAIL],
    promise: (socket) => socket.off(LEAVING),
  };
}
