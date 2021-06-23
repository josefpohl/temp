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

  console.log(`ADD_AVAILABLE_ACTION ${user.name}`);
  return {
    type: ADD_AVAILABLE,
    payload: user,
  };
};

export const removeAvailable = (user) => {
  console.log("REMOVE_AVAILABLE ACTION ", user);
  return {
    type: REMOVE_AVAILABLE,
    payload: user,
  };
};

export const leftLiveCall = (user) => async (dispatch) => {
  const URI = config.SERVER + `/api/available/callEnd/${getId(user)}`;
  // console.log(`LEFT LIVE CALL ${JSON.stringify(user)}`);
  console.log(URI);
  const avail = await axios
    .get(URI)
    .then((res) => {
      //console.log(`LeftLiveCall available ${JSON.stringify(res.data)}`);
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
  console.log(`IN LIVE CALL ${JSON.stringify(user)}`);
  const URI = config.SERVER + `/api/available/update/${getId(user)}`;
  console.log(URI);
  const avail = await axios
    .get(URI)
    .then((res) => {
      console.log(`In LiveCall available ${JSON.stringify(res.data)}`);
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

export const getCurrentAvailable = (user) => async (dispatch) => {
  dispatch({ type: LOADING_AVAILABILITY });
  console.log(`In getCurrentAvailable ${user.name}`);
  const uri = config.SERVER + `/api/available/allTeam/${getId(user)}`;
  //TODO refine to users who can take calls for this team
  const teamAvailables = await axios
    .get(uri)
    .then((res) => {
      //console.log(`GET TEAM AVAILABLES: ${JSON.stringify(res.data)}`);
      const availablesSkywriters = res.data.filter(
        (a) => a.userLoggedIn?.role === "skywriter"
      );
      return availablesSkywriters;
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
