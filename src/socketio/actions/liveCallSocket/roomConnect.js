import {
  ROOM_CONNECT,
  ROOM_CONNECT_SUCCESS,
  ROOM_CONNECT_FAIL,
  ON_ROOM_CONNECT,
  ON_ROOM_CONNECT_SUCCESS,
  ON_ROOM_CONNECT_FAIL,
} from "../types";

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

export function onRoomConnect(data) {
  console.log(`listener for Room connection`);

  const onRoomConnect = (e) => {
    console.log(`ROOM_CONNECT Requested from external ${JSON.stringify(e)}`);
  };

  return {
    type: "socket",
    types: [ON_ROOM_CONNECT, ON_ROOM_CONNECT_SUCCESS, ON_ROOM_CONNECT_FAIL],
    promise: (socket) => socket.on(ROOM_CONNECT, onRoomConnect),
  };
}
