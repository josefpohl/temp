import { CALL_CANCEL, CALL_CANCEL_SUCCESS, CALL_CANCEL_FAIL } from "../types";

export function callCancelled(user, skywriter, reason, roomname) {
  console.log("call cancel initiated emit");
  return {
    type: "socket",
    types: [CALL_CANCEL, CALL_CANCEL_SUCCESS, CALL_CANCEL_FAIL],
    promise: (socket) =>
      socket.on(CALL_CANCEL, {
        roomname,
        sender: user,
        receiver: skywriter,
        reason,
      }),
  };
}
