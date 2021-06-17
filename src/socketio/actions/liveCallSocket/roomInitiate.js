import {
  ROOM_INITIATE,
  ON_ROOM_INITIATE,
  ON_ROOM_INITIATE_FAIL,
  ON_ROOM_INITIATE_SUCCESS,
  OFF_ROOM_INITIATE,
  OFF_ROOM_INITIATE_SUCCESS,
  OFF_ROOM_INITIATE_FAIL,
} from "../types";

import { roomInitiate } from "../../../state/liveCalls";

export const onRoomInitiate = () => (dispatch) => {
  console.log("onRoomInitiated listener exec");
  const onRoomInitiate = (data) => {
    const { roomname, receiver, sender } = data;
    console.log(
      `Room initiate received ${roomname}, ${receiver.name}, ${sender.name}`
    );

    dispatch(roomInitiate(data));
  };

  dispatch({
    type: "socket",
    types: [ON_ROOM_INITIATE, ON_ROOM_INITIATE_SUCCESS, ON_ROOM_INITIATE_FAIL],
    promise: (socket) => socket.on(ROOM_INITIATE, onRoomInitiate),
  });
};

export function offRoomInitiate() {
  return {
    type: "socket",
    types: [
      OFF_ROOM_INITIATE,
      OFF_ROOM_INITIATE_SUCCESS,
      OFF_ROOM_INITIATE_FAIL,
    ],
    promise: (socket) => socket.off(ROOM_INITIATE),
  };
}
