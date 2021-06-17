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
  SKYWRITER_ARRIVED,
  CALL_CANCELLED,
  TERMINATE_CALL,
  CALL_REJECT,
  CALL_DISONNECTED,
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
        const skywriters = res.data;
        const sorted = skywriters.sort((a, b) => sortByLastCall(a, b));
        skywriter = sorted[0];
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
  return {
    type: SKYWRITER_ARRIVED,
    payload: data,
  };
};

export const leavingCall = (data) => {
  //console.log(`PARTICIPANT LEAVING ${JSON.stringify(data)}`);
  return {
    type: LEAVING,
    payload: data,
  };
};

export const cancelCall = () => {
  return {
    type: CALL_CANCELLED,
  };
};
export const saveCall = async () => {
  console.log(`Saving call`);
  return new Promise((resolve) => setTimeout(resolve, 2000));
};

export const clearLiveCall = () => (dispatch) => {
  dispatch({
    type: CLEAR_LIVE_CALL,
  });
};

export const terminateCall = ({ receiver, sender, roomname }) => {
  console.log(`Redux terminate call action`);
  return {
    type: TERMINATE_CALL,
    payload: { receiver, sender, roomname },
  };
};

export const callReject = ({ receiver, sender }) => {
  console.log(`Call reject action ${receiver.name} ${sender.name}`);
  return {
    type: CALL_REJECT,
    payload: { receiver, sender },
  };
};

export const afterCallDisconnect = () => {
  console.log(`Call disconnected. Continue processing`);
  return { type: CALL_DISONNECTED };
};

function sortByLastCall(a, b) {
  if (a.lastLiveCallTime && b.lastLiveCallTime) {
    if (a.lastLiveCallTime >= b.lastLiveCallTime) {
      return 1;
    } else {
      return -1;
    }
  }
  if (!a.lastLiveCallTime) {
    return -1;
  }
  if (b.lastLiveCallTime) {
    return 1;
  }
  return 0;
}
