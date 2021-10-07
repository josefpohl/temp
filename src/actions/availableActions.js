import {
  ADD_AVAILABLE,
  LEFT_LIVE_CALL,
  REMOVE_AVAILABLE,
  IN_LIVE_CALL,
  LOADING_AVAILABILITY,
  SET_CURRENT_AVAILABLES,
} from "./actionTypes";

import axios from "axios";

import config from "../config";

export const addAvailable = (user) => {
  //check user against users currently in state AND in team profiles
  // need access to team profile state, so this may need to be done else where
  // or combined with profile state...

  return {
    type: ADD_AVAILABLE,
    payload: user,
  };
};

export const removeAvailable = (user) => {
  return {
    type: REMOVE_AVAILABLE,
    payload: user,
  };
};

export const leftLiveCall = (user) => async (dispatch) => {
  const URI = config.SERVER + `/api/available/callEnd/${getId(user)}`;
  const avail = await axios
    .get(URI)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(`ERROR LEFT LIVE CALL callENd ${JSON.stringify(err)}`);
    });

  dispatch({
    type: LEFT_LIVE_CALL,
    payload: user,
  });
};

export const inLiveCall = (user) => async (dispatch) => {
  const URI = config.SERVER + `/api/available/update/${getId(user)}`;
  const avail = await axios
    .get(URI)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(`ERROR IN LIVE CALL update ${JSON.stringify(err)}`);
    });
  dispatch({
    type: IN_LIVE_CALL,
    payload: user,
  });
};

export const getCurrentAvailable = (user) => async (dispatch, getState) => {
  dispatch({ type: LOADING_AVAILABILITY });
  const uri = config.SERVER + `/api/available/allTeam/${getId(user)}`;
  //TODO refine to users who can take calls for this team
  const teamAvailables = await axios
    .get(uri)
    .then((res) => {;
      const availableSkywriters = res.data.filter(
        (a) => a.userLoggedIn?.role === "skywriter"
      );
      const teamProfiles = getState().profiles.teamProfiles;
      const myProfile = getState().profiles.userProfile;
      const mainTeamID = myProfile.teams[0].teamid;
      const trueTeamSkywriters = filterForTeamRoles(
        availableSkywriters,
        mainTeamID,
        teamProfiles
      );
      return trueTeamSkywriters;
    })
    .then((filtered) => {
      return filtered;
    })
    .catch((err) => {
      console.log(`Cannot get availability ${err}`);
    });
  //return teamAvailables;

  // dispatch({ type: LOADING_AVAILABILITY }); catch this on HOME screen
  // const teamAvailables = await getTeamAvailables(id);
  dispatch({
    type: SET_CURRENT_AVAILABLES,
    payload: teamAvailables,
  });
  dispatch({ type: LOADING_AVAILABILITY });
};

function getId(user) {
  if (user.userLoggedIn) {
    return user.userLoggedIn._id;
  }
  return user.id ? user.id : user._id;
}

const filterForTeamRoles = (availableSkywriters, teamid, teamProfiles) => {
  const avails = availableSkywriters.filter((a) => {
    const profile = teamProfiles.find((p) => p.user._id === a.userLoggedIn._id);
    const profileTeams = profile.teams.filter((pt) => {
      return pt.teamid.toString() === teamid.toString();
    });
    if (profileTeams.length >= 1) {
      return profileTeams[0].role === "skywriter";
    }
    return false;
    //iterate through profileTeams to find teamid match
  });
  return avails;
};
