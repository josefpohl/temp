import {
  CALL_CANCELLED,
  CALL_CANCELLED_SUCCESS,
  CALL_CANCELLED_FAIL,
} from "../types";

export function callCancelled(user, skywriter, reason, roomname) {
  console.log(
    `call cancel initiated emit ${user.name} ${skywriter.name} ${reason} ${roomname}`
  );
  return {
    type: "socket",
    types: [CALL_CANCELLED, CALL_CANCELLED_SUCCESS, CALL_CANCELLED_FAIL],
    promise: (socket) =>
      socket.emit(CALL_CANCELLED, {
        roomname,
        sender: user,
        receiver: skywriter,
        reason,
      }),
  };
}
