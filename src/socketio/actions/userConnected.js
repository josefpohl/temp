import {
  USER_CONNECTED,
  USER_CONNECTED_FAIL,
  USER_CONNECTED_SUCCESS,
  ON_USER_CONNECTED,
  ON_USER_CONNECTED_FAIL,
  ON_USER_CONNECTED_SUCCESS,
  OFF_USER_CONNECTED,
  OFF_USER_CONNECTED_FAIL,
  OFF_USER_CONNECTED_SUCCESS,
} from "./types";

import { addAvailable } from "../../actions/availableActions";

import {
  logoutUser,
  userLoadingComplete
} from "../../actions/authenticationActions";

export function userConnected(user) {
  console.log('userConnected');
  return {
    type: "socket",
    types: [USER_CONNECTED, USER_CONNECTED_SUCCESS, USER_CONNECTED_FAIL],
    promise: (socket) => {
      console.log('userConnected --> socket', socket);
      return socket.emit(USER_CONNECTED, user);
    },
  };
}
// added socket control to prevent loading screen showing on login dispatch
export const onUserConnected = (socketControl) => (dispatch, getState) => {
  console.log('onUserConnected');
  const onUserConnected = (e) => {
    // socketControl == 2, means is a dispatch from active-inactive-background state flow
    if (socketControl == 2) {
      // check if the user have a socketId, if exists then show home screen
      if (e.socketId) {
        dispatch(userLoadingComplete());
      } else {
        // if socket is not connected then logout the user
        dispatch(logoutUser(e));
      }
    }
    const { teamProfiles, userProfile } = getState().profiles;

    const foundProfile = teamProfiles.find((p) => p.user?._id === e.id);
    let teamFromSky = null;
    if (foundProfile) {
      const { teams } = userProfile;
      if (teams.length > 0) {
        const teamid = teams[0].teamid;

        teamFromSky = foundProfile.teams.find((p) => p.teamid === teamid);
      }
    }
    if (foundProfile && teamFromSky?.role === "skywriter") {
      dispatch(addAvailable(e));
    }
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

export function offUserConnected() {
  return {
    type: "socket",
    types: [
      OFF_USER_CONNECTED,
      OFF_USER_CONNECTED_SUCCESS,
      OFF_USER_CONNECTED_FAIL,
    ],
    promise: (socket) => socket.off(USER_CONNECTED),
  };
}
