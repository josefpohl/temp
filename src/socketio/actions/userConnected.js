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

export const onUserConnected = () => (dispatch) => {
  console.log("onUserConnected listener exec");
  const onUserConnected = (e) => {
    console.log(
      "This is the function ran when an external user has connected, handle available context"
    );
    console.log("The dispatch func in onUserConnected: ", dispatch);
    console.log(e);
    //Stefan -- This is where the AVAILABLE state in REDUX should be sent the user who logged in
    // but the dispatch from here is unavailable.  Is there a way to send "e" to the
    // Available reducer and add it to the list.
    dispatch(addAvailable(e));
  };

  dispatch({
    type: "socket",
    types: [
      ON_USER_CONNECTED,
      ON_USER_CONNECTED_SUCCESS,
      ON_USER_CONNECTED_FAIL,
    ],
    promise: (socket) => socket.on(USER_CONNECTED, onUserConnected),
  });
};
