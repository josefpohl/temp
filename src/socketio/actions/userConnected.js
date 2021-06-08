import {
  USER_CONNECTED,
  USER_CONNECTED_FAIL,
  USER_CONNECTED_SUCCESS,
  ON_USER_CONNECTED,
  ON_USER_CONNECTED_FAIL,
  ON_USER_CONNECTED_SUCCESS,
} from "./types";

import { addAvailable } from "../../actions/availableActions";

export function userConnected(user) {
  console.log("userConnected function", user);
  return {
    type: "socket",
    types: [USER_CONNECTED, USER_CONNECTED_SUCCESS, USER_CONNECTED_FAIL],
    promise: (socket) => socket.emit(USER_CONNECTED, user),
  };
}

export function onUserConnected() {
  console.log("userConnected listener exec");
  const onUserConnected = (e) => {
    console.log(
      "This is the function ran when an external user has connected, handle available context"
    );
    console.log(e);
    addAvailable(e);
  };
  return {
    type: "socket",
    types: [
      ON_USER_CONNECTED,
      ON_USER_CONNECTED_SUCCESS,
      ON_USER_CONNECTED_FAIL,
    ],
    promise: (socket) => socket.on(USER_CONNECTED, onUserConnected),
  };
}
