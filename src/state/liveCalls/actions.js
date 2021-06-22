import {
  CLEAR_LIVE_CALL,
  SET_SKYWRITER_IN_CALL,
  SET_TOKEN,
  LOADING_SKYWRITER,
  SAVED_LIVECALL,
  ROOM_INITIATE,
  CALL_ACCEPTED,
  ADD_MESSAGE,
  CALL_ACCEPT,
  NOTIFY,
  LEAVING,
  SKYWRITER_ARRIVED,
  CALL_CANCELLED,
  TERMINATE_CALL,
  CALL_REJECT,
  SET_IS_SENDER,
  CALL_DISCONNECTED,
  SAVING_LIVECALL,
  SET_DESCRIPTION,
  SET_ROOM_INFO,
  CALL_FINISHED,
} from "./types";
import axios from "axios";
import config from "../../config";

const SERVERURL = config.SERVER;
export const getToken = () => (dispatch) => {
  //get Token from API

  const uri = SERVERURL + "/api/twilio/token";
  axios.get(uri).then((results) => {
    const { identity, token } = results.data;
    //console.log(`Getting Token ${identity} ${token}`);
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
      //  console.log(`GET SKYWRITER ${JSON.stringify(res.data)}`);
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

export const setIsSender = ({ isSender }) => {
  return {
    type: SET_IS_SENDER,
    payload: isSender,
  };
};

export const addCallAccepted = (data) => {
  //console.log(`CALL ACCEPTED ACTION ${JSON.stringify(data)}`);
  return {
    type: CALL_ACCEPTED,
    payload: data,
  };
};

export const addMessage = (data) => {
  //console.log(`MESSAGE RECEIVED ${JSON.stringify(data)}`);
  return {
    type: ADD_MESSAGE,
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
  // console.log(`PARTICIPANT LEAVING ACTION`); //${JSON.stringify(data)}`);
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

export const notifyProvider = (sender) => {
  let senderName = null;
  if (sender.name) {
    senderName = sender.name;
    //console.log(`Notify Provider ${JSON.stringify(sender)}`);
    return {
      type: NOTIFY,
      payload: senderName,
    };
  }
};

export const resetNotifyProvider = () => {
  return {
    type: NOTIFY,
    payload: null,
  };
};

export const setRoomInformation = (roomInfo) => {
  return {
    type: SET_ROOM_INFO,
    payload: JSON.stringify(roomInfo),
  };
};

export const setDescription = (description) => {
  return {
    type: SET_DESCRIPTION,
    payload: description,
  };
};

export const saveCall = (jobData, isPreSave = false) => (dispatch) => {
  console.log(`Saving call`);
  if (!isPreSave) {
    dispatch({
      type: SAVING_LIVECALL,
    });
  }

  const uri = SERVERURL + `/api/jobs/livecall`;
  axios
    .post(uri, jobData)
    .then((res) => {
      if (res.status === 200) {
        console.log(`DATA is SAVED ${res.status} ${JSON.stringify(res.data)}`);
        dispatch({
          type: SAVED_LIVECALL,
        });
        if (!isPreSave) {
          console.log(`NOT PRESAVE`);
          dispatch({
            type: SAVING_LIVECALL,
          });
          dispatch({
            type: CALL_FINISHED,
          });
        }
      }
    })
    .catch((err) => {
      console.log(`Error saving job ${err}`);
      if (!isPreSave) {
        dispatch({
          type: SAVING_LIVECALL,
        });
        dispatch({
          type: CALL_FINISHED,
        });
      }
    });
  return new Promise((resolve) => setTimeout(resolve, 2000));
};

export const updateCall = (jobData) => (dispatch) => {
  console.log(`Updating call`);
  dispatch({
    type: SAVING_LIVECALL,
  });
  console.log(`JOB DATA: ${JSON.stringify(jobData)}`);
  const uri = SERVERURL + `/api/jobs/update/livecall`;
  axios
    .post(uri, jobData)
    .then((res) => {
      console.log(`DATA is Updated ${JSON.stringify(res.status)}`);
      dispatch({
        type: SAVING_LIVECALL,
      });
      dispatch({
        type: CALL_FINISHED,
      });
    })
    .catch((err) => {
      console.log(`Error on updating job ${err}`);
      dispatch({
        type: SAVING_LIVECALL,
      });
      dispatch({
        type: CALL_FINISHED,
      });
    });
  return new Promise((resolve) => setTimeout(resolve, 2000));
};

export const clearLiveCall = () => (dispatch) => {
  dispatch({
    type: CLEAR_LIVE_CALL,
  });
};

export const terminateCall = ({ receiver, sender, roomname }) => {
  //console.log(`Redux terminate call action`);
  return {
    type: TERMINATE_CALL,
    payload: { receiver, sender, roomname },
  };
};

export const callReject = ({ receiver, sender }) => {
  //console.log(`Call reject action ${receiver.name} ${sender.name}`);
  return {
    type: CALL_REJECT,
    payload: { receiver, sender },
  };
};

export const afterCallDisconnect = () => {
  //console.log(`Call disconnected. Continue processing`);
  return { type: CALL_DISCONNECTED };
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
