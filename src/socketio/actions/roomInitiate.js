import {
  ROOM_INITIATE,
  ROOM_INITIATE_FAIL,
  ROOM_INITIATE_SUCCESS,
} from "./types";

export function roomInitiate(data) {
  console.log(`Room initiate received`);

  return {
    type: "socket",
    types: [ROOM_INITIATE, ROOM_INITIATE_SUCCESS, ROOM_INITIATE_FAIL],
    promise: (socket) => socket.on(ROOM_INITIATE, data),
  };
}
