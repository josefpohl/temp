import {
  CONNECT,
  CONNECT_SUCCESS,
  CONNECT_FAIL,
  DISCONNECT,
  DISCONNECT_SUCCESS,
  DISCONNECT_FAIL,
} from "./types";

export function connect() {
  return {
    type: "socket",
    types: [CONNECT, CONNECT_SUCCESS, CONNECT_FAIL],
    promise: (socket) => {
      return socket.connect();
    },
  };
}

export function disconnect() {
  return {
    type: "socket",
    types: [DISCONNECT, DISCONNECT_SUCCESS, DISCONNECT_FAIL],
    promise: (socket) => socket.disconnect(),
  };
}
