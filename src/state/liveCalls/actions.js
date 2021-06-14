import {
  CLEAR_LIVE_CALL,
  SET_SKYWRITER_IN_CALL,
  SET_TOKEN,
  LOADING_SKYWRITER,
  SAVE_LIVECALL,
  ROOM_INITIATE,
  CALL_ACCEPTED,
  SEND_MESSAGE,
  CALL_ACCEPT,
  LEAVING,
  LEFT_LIVE_CALL,
  SKYWRITER_ARRIVED,
} from "./types";
import axios from "axios";
import config from "../../config";

const SERVERURL = config.SERVER;
export const getToken = () => (dispatch) => {
  //get Token from API

  const uri = SERVERURL + "/api/twilio/token";
  axios.get(uri).then((results) => {
    const { identity, token } = results.data;
    console.log(`Getting Token ${identity} ${token}`);
    dispatch({
      type: SET_TOKEN,
      payload: token,
    });
    return token;
  });
};

export const getSkywriter = (user) => (dispatch) => {
  //get Skywriter from API
  dispatch({
    type: LOADING_SKYWRITER,
  });
  //console.log(`User making request ${JSON.stringify(user)}`);
  const uri = SERVERURL + `/api/available/team/${user.id}`;
  axios
    .get(uri)
    .then((res) => {
      console.log(`GET SKYWRITER ${JSON.stringify(res.data)}`);
      let skywriter = null;
      if (res.data.length > 0) {
        skywriter = res.data[0];
      }
      // setTimeout(
      //   () =>
      dispatch({
        type: SET_SKYWRITER_IN_CALL,
        payload: skywriter,
      });
      //     ,
      //   5000
      // );
      return skywriter;
    })
    .catch((error) => {
      dispatch({
        type: SET_SKYWRITER_IN_CALL,
        payload: null,
      });
    });
};

export const roomInitiate = (data) => {
  console.log(`ROOM_INITIATE_ACTION ${data.roomname}`);
  return {
    type: ROOM_INITIATE,
    payload: data,
  };
};

export const addCallAccepted = (data) => {
  console.log(`CALL ACCEPTED ACTION ${JSON.stringify(data)}`);
  return {
    type: CALL_ACCEPTED,
    payload: data,
  };
};

export const addMessage = (data) => {
  console.log(`MESSAGE RECEIVED ${JSON.stringify(data)}`);
  return {
    type: SEND_MESSAGE,
    payload: data,
  };
};

export const skywriterArrived = (data) => {
  console.log(`SKYWRITER ARRIVED ${JSON.stringify(data)}`);
  return {
    type: SKYWRITER_ARRIVED,
    payload: data,
  };
};

export const leavingCall = (data) => {
  console.log(`PARTICIPANT LEAVING ${JSON.stringify(data)}`);
  return {
    type: LEAVING,
    payload: data,
  };
};

export const leftLiveCall = (data) => {
  console.log(`PARTICIPANT LEFT LIVE CALL ${JSON.stringify(data)}`);
  return {
    type: LEFT_LIVE_CALL,
    payload: data,
  };
};

export const saveCall = (data) => {
  console.log(`Saving call ${JSON.stringify(data)}`);
};
