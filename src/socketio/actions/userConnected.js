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

export function userConnected(user) {
  console.log('userConnected');
  return {
    type: "socket",
    types: [USER_CONNECTED, USER_CONNECTED_SUCCESS, USER_CONNECTED_FAIL],
    promise: (socket) => socket.emit(USER_CONNECTED, user),
  };
}

export const onUserConnected = () => (dispatch, getState) => {
  console.log('onUserConnected');
  const onUserConnected = (e) => {
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
