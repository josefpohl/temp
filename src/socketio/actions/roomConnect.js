import { ROOM_CONNECT, ROOM_CONNECT_SUCCESS, ROOM_CONNECT_FAIL } from "./types";

export function roomConnect(user, skywriter) {
  console.log(`connect request from ${user.name} to ${skywriter.name}`);

  //TODO Fix this - for correct data names on emit.
  return {
    type: "socket",
    types: [ROOM_CONNECT, ROOM_CONNECT_SUCCESS, ROOM_CONNECT_FAIL],
    promise: (socket) =>
      socket.emit(ROOM_CONNECT, { sender: user, receiver: skywriter }),
  };
}
