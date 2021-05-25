import {
  USER_DISCONNECTED,
  USER_DISCONNECTED_FAIL,
  USER_DISCONNECTED_SUCCESS,
  ON_USER_DISCONNECTED,
  ON_USER_DISCONNECTED_FAIL,
  ON_USER_DISCONNECTED_SUCCESS,
} from "./types";

export function userDisconnected(user) {
  console.log("userConnected function", user);
  return {
    type: "socket",
    types: [
      USER_DISCONNECTED,
      USER_DISCONNECTED_SUCCESS,
      USER_DISCONNECTED_FAIL,
    ],
    promise: (socket) => socket.emit(USER_DISCONNECTED, user),
  };
}

export function onUserDisconnected() {
  console.log("userDisconnected listener exec");
  const onUserDisconnected = (e) => {
    console.log("An external user has disconnected, handle available context");
    console.log(e);
  };
  return {
    type: "socket",
    types: [
      ON_USER_DISCONNECTED,
      ON_USER_DISCONNECTED_SUCCESS,
      ON_USER_DISCONNECTED_FAIL,
    ],
    promise: (socket) => socket.on(USER_DISCONNECTED, onUserDisconnected),
  };
}
