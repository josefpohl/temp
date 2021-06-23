import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";
import jwt_decode from "jwt-decode";
import setAuthToken from "../utils/setAuthToken";

import {
  USER_LOADING,
  USER_LOADING_COMPLETE,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  EMAIL_CHANGED,
  PASSWORD_CHANGED,
  LOADING_TEAM_PROFILES,
  SET_TEAM_PROFILES,
  SET_CURRENT_PROFILE,
  LOGOUT_USER,
  SET_CURRENT_AVAILABLES,
  LOADING_AVAILABILITY,
  LOADING_JOBS,
  SET_JOBS,
} from "./actionTypes";

import { connect } from "../socketio/actions/connect";
import {
  onUserConnected,
  offUserConnected,
} from "../socketio/actions/userConnected";
import { userConnected } from "../socketio/actions/userConnected";
import {
  onCallAccept,
  onMessage,
  onRoomInitiate,
  onSkywriterArrived,
  onLeaving,
  onLeftLiveCall,
  onInLiveCall,
  onTerminate,
  onCallReject,
  onAlert,
  offCallAccept,
  offInLiveCall,
  offLeaving,
  offLeftLiveCall,
  offMessage,
  //offRoomConnect, not needed yet
  offRoomInitiate,
  offSkywriterArrived,
  offTerminate,
  offCallReject,
  offAlert,
  onRoomConnect,
  offRoomConnect,
} from "../socketio/actions/liveCallSocket";
import {
  onUserDisconnected,
  userDisconnected,
  offUserDisconnected,
} from "../socketio/actions/userDisconnected";

import config from "../config";

export const emailChanged = (text) => {
  return {
    type: EMAIL_CHANGED,
    payload: text,
  };
};

export const passwordChanged = (text) => {
  return {
    type: PASSWORD_CHANGED,
    payload: text,
  };
};

//Action
export const loginUser = (emailIn, passwordIn) => (dispatch) => {
  console.log(`EMAIL and PASSWORD: ${emailIn} ${passwordIn}`);
  //DISPATCH CHECKING FOR TOKEN...
  //dispatch(connect());
  dispatch(onUserConnected());
  dispatch(onUserDisconnected());
  //TODO move this list of calls elsewhere????
  dispatch(onRoomInitiate());
  dispatch(onCallAccept());
  dispatch(onMessage());
  dispatch(onSkywriterArrived());
  dispatch(onLeaving());
  dispatch(onLeftLiveCall());
  dispatch(onInLiveCall());
  dispatch(onTerminate());
  dispatch(onCallReject());
  dispatch(onAlert());
  dispatch(onRoomConnect());

  const email = emailIn; //"doc5@users.com";
  const password = passwordIn; //"Password1@";
  const uri = config.SERVER + "/api/users/login";
  axios
    .post(uri, { email, password }, { timeout: 5000 })
    .then((res) => {
      dispatch({ type: USER_LOADING });
      dispatch({ type: LOGIN_USER_FAIL, payload: null });
      const { token } = res.data;
      AsyncStorage.setItem("jwtToken", token);
      AsyncStorage.setItem("lastUser", email);
      setAuthToken(token);
      const decodedToken = jwt_decode(token);
      AsyncStorage.setItem("user", JSON.stringify(decodedToken));
      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: decodedToken,
      });
      dispatch(userConnected(decodedToken));
      return decodedToken;
    })
    .then(async (decodedToken) => {
      dispatch({ type: LOADING_TEAM_PROFILES });
      const { id } = decodedToken;
      const { myProfile, teamProfiles } = await getProfiles(id);
      dispatch({
        type: SET_CURRENT_PROFILE,
        payload: myProfile,
      });
      dispatch({
        type: SET_TEAM_PROFILES,
        payload: teamProfiles,
      });
      dispatch({ type: LOADING_TEAM_PROFILES });
      return decodedToken;
    })
    .then(async (decodedToken) => {
      dispatch({ type: LOADING_AVAILABILITY });
      //Get Availables for team
      const { id } = decodedToken;
      //TODO needs socket in theory at least
      setAvailable(decodedToken);
      const teamAvailables = await getTeamAvailables(id);
      dispatch({
        type: SET_CURRENT_AVAILABLES,
        payload: teamAvailables,
      });
      dispatch({ type: LOADING_AVAILABILITY });
      return id;
    })
    .then(async (id) => {
      dispatch({ type: LOADING_JOBS });
      const myJobs = await getJobs(id);
      dispatch({ type: SET_JOBS, payload: myJobs });
      dispatch({ type: LOADING_JOBS });

      dispatch({ type: USER_LOADING_COMPLETE });
    })
    .catch((error) => {
      //TODO Present Error and issue correction guidance
      //TODO Network detection?
      console.log(`Error on login ${error}`);
      let content = { user: false };
      dispatch({
        type: LOGIN_USER_FAIL,
        payload: content,
      });
    });
};

//Supporting login action
const getProfiles = async (userid) => {
  const uri = config.SERVER + `/api/profile/teams/${userid}`;
  const profiles = await axios.get(uri).then((res) => {
    return res.data;
  });
  const myProfile = profiles.find((p) => p.user._id === userid);
  //TODO Refine search to team roles rather than user roles
  const teamProfiles = profiles.filter((p) => p.user.role === "skywriter");
  return { myProfile, teamProfiles };
};

//Supporting login action
const setAvailable = async (decodedToken) => {
  const uri = config.SERVER + "/api/available";
  const available = await axios
    .post(uri, { user: decodedToken, socketid: "unknown" })
    .then((res) => {
      return res.data;
    });

  //console.log(`Available: ${JSON.stringify(available)}`);
};

//Supporting login action
const getTeamAvailables = async (userid) => {
  const uri = config.SERVER + `/api/available/team/${userid}`;
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
  return teamAvailables;
};

//Action
export const logoutUser = (user) => (dispatch) => {
  const uri = config.SERVER + `/api/users/logout/${user.id}`;
  dispatch(userDisconnected(user));
  dispatch(offUserConnected());
  dispatch(offUserDisconnected());
  dispatch(offRoomInitiate());
  dispatch(offCallAccept());
  dispatch(offMessage());
  dispatch(offSkywriterArrived());
  dispatch(offLeaving());
  dispatch(offLeftLiveCall());
  dispatch(offInLiveCall());
  dispatch(offTerminate());
  dispatch(offCallReject());
  dispatch(offRoomConnect());
  axios
    .post(uri, {}, { timeout: 5000 })
    .then((user) => {
      dispatch({ type: LOGOUT_USER });
      AsyncStorage.removeItem("jwtToken");
      AsyncStorage.removeItem("user");
      return { success: true, user };
    })
    .catch((err) => {
      dispatch({ type: LOGOUT_USER });
      return { success: false };
    });
};

const getJobs = async (userid) => {
  const uri = config.SERVER + `/api/jobs/provider/${userid}`;
  //TODO refine to users who can take calls for this team
  const myJobs = await axios.get(uri).then((res) => {
    return res.data;
  });
  return myJobs;
};
