import {
  USER_DISCONNECTED,
  USER_DISCONNECTED_FAIL,
  USER_DISCONNECTED_SUCCESS,
  ON_USER_DISCONNECTED,
  ON_USER_DISCONNECTED_FAIL,
  ON_USER_DISCONNECTED_SUCCESS,
  OFF_USER_DISCONNECTED,
  OFF_USER_DISCONNECTED_SUCCESS,
  OFF_USER_DISCONNECTED_FAIL,
} from "./types";

import { removeAvailable } from "../../actions/availableActions";

export function userDisconnected(user) {
  console.log("userDisconnected function", user);
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

export const onUserDisconnected = () => (dispatch, getState) => {
  console.log("userDisconnected listener exec");
  const onUserDisconnected = (e) => {
    console.log(`On USER_DISCONNECTED: ${e.name}`);
    const { teamProfiles } = getState().profiles;
    const foundProfile = teamProfiles.find((p) => p.user?._id === e.id);
    if (foundProfile) {
      dispatch(removeAvailable(e));
    } else {
      console.log(`${e.name} removal ignored`);
    }
  };
  dispatch({
    type: "socket",
    types: [
      ON_USER_DISCONNECTED,
      ON_USER_DISCONNECTED_SUCCESS,
      ON_USER_DISCONNECTED_FAIL,
    ],
    promise: (socket) => socket.on(USER_DISCONNECTED, onUserDisconnected),
  });
};

export function offUserDisconnected() {
  return {
    type: "socket",
    types: [
      OFF_USER_DISCONNECTED,
      OFF_USER_DISCONNECTED_SUCCESS,
      OFF_USER_DISCONNECTED_FAIL,
    ],
    promise: (socket) => socket.off(USER_DISCONNECTED),
  };
}
