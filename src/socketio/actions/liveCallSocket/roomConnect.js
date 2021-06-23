import {
  ROOM_CONNECT,
  ROOM_CONNECT_SUCCESS,
  ROOM_CONNECT_FAIL,
  ON_ROOM_CONNECT,
  ON_ROOM_CONNECT_SUCCESS,
  ON_ROOM_CONNECT_FAIL,
  OFF_ROOM_CONNECT,
  OFF_ROOM_CONNECT_SUCCESS,
  OFF_ROOM_CONNECT_FAIL,
} from "../types";

import { makeRoomConnect } from "../../../state/liveCalls";
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

export const onRoomConnect = () => (dispatch) => {
  console.log(`listener for Room connection`);

  const onRoomConnectInner = (e) => {
    console.log(`ROOM_CONNECT Requested from external ${JSON.stringify(e)}`);
    dispatch(makeRoomConnect(e));
  };

  dispatch({
    type: "socket",
    types: [ON_ROOM_CONNECT, ON_ROOM_CONNECT_SUCCESS, ON_ROOM_CONNECT_FAIL],
    promise: (socket) => socket.on(ROOM_CONNECT, onRoomConnectInner),
  });
};

export function offRoomConnect() {
  return {
    type: "socket",
    types: [OFF_ROOM_CONNECT, OFF_ROOM_CONNECT_SUCCESS, OFF_ROOM_CONNECT_FAIL],
    promise: (socket) => socket.off(ROOM_CONNECT),
  };
}
