import {
  CLEAR_LIVE_CALL,
  SET_SKYWRITER_IN_CALL,
  SET_TOKEN,
  LOADING_SKYWRITER,
  SAVED_LIVECALL,
  ROOM_INITIATED,
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
  INCOMING_ROOM_CONNECT,
  INCOMING_ROOM_INITIATE,
} from "./types";
import axios from "axios";
import config from "../../config";
import { getMyJobs } from "../../actions/jobActions";

const SERVERURL = config.SERVER;
export const getToken = () => (dispatch) => {
  //get Token from API

  const uri = SERVERURL + "/api/twilio/token";
  axios.get(uri).then((results) => {
    const { token } = results.data;
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
  const uri = SERVERURL + `/api/available/team/${user.id}`;
  axios
    .get(uri)
    .then((res) => {
      let skywriter = null;
      if (res.data.length > 0) {
        const skywriters = res.data;
        const sorted = skywriters.sort((a, b) => sortByLastCall(a, b));
        skywriter = sorted[0];
      }
      dispatch({
        type: SET_SKYWRITER_IN_CALL,
        payload: skywriter,
      });
      return skywriter;
    })
    .catch((error) => {
      console.log('ERROR getSkywriter --> ',error);
      dispatch({
        type: SET_SKYWRITER_IN_CALL,
        payload: null,
      });
    });
};

export const makeRoomConnect = (data) => (dispatch) => {
  const { roomname, receiver, sender } = data;
  //INCOMING_ROOM_CONNECT
  dispatch({
    type: INCOMING_ROOM_CONNECT,
    payload: { roomname, skywriter: sender.available },
  });
};

export const roomInitiate = (data) => {
  return {
    type: ROOM_INITIATED,
    payload: data,
  };
};

export const initiateIncomingJoin = () => {
  return {
    type: INCOMING_ROOM_INITIATE,
  };
};
export const setIsSender = ({ isSender }) => {
  return {
    type: SET_IS_SENDER,
    payload: isSender,
  };
};

export const addCallAccepted = (data) => {
  return {
    type: CALL_ACCEPTED,
    payload: data,
  };
};

export const addMessage = (data) => {
  return {
    type: ADD_MESSAGE,
    payload: data,
  };
};

export const skywriterArrived = (data) => {
  console.log(`skywriterArrived --> When and why???? ${JSON.stringify(data)}`);
  return {
    type: SKYWRITER_ARRIVED,
    payload: data,
  };
};

export const leavingCall = (data) => {
  console.log(`leavingCall --> When and why???? ${JSON.stringify(data)}`);
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
  console.log('notifyProvider', sender);
  let senderName = null;
  if (sender.name) {
    senderName = sender.name;
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

export const saveCall =
  (jobData, isPreSave = false) =>
  (dispatch) => {
    console.log(`Saving call`);
    if (!isPreSave) {
      dispatch({
        type: SAVING_LIVECALL,
      });
    }
    const userid = jobData.provider;
    const uri = SERVERURL + `/api/jobs/livecall`;
    axios
      .post(uri, jobData)
      .then(async (res) => {
        if (res.status === 200) {
          console.log(
            `DATA CALL is SAVED ${res.status} ${JSON.stringify(res.data)}`
          );
          dispatch({
            type: SAVED_LIVECALL,
          });
          if (!isPreSave) {
            console.log(`NOT PRESAVE CALL`);
            const jobs = await getMyJobs(userid);
            dispatch(jobs);
            dispatch({
              type: SAVING_LIVECALL,
            });
          }
        }
      })
      .catch((err) => {
        if (!isPreSave) {
          dispatch({
            type: SAVING_LIVECALL,
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
  const userid = jobData.provider;
  console.log(`CALL DATA: ${JSON.stringify(jobData)}`);
  const uri = SERVERURL + `/api/jobs/update/livecall`;
  axios
    .post(uri, jobData)
    .then(async (res) => {
      console.log(`DATA CALL is Updated ${JSON.stringify(res.status)}`);
      const jobs = await getMyJobs(userid);
      dispatch(jobs);
      dispatch({
        type: SAVING_LIVECALL,
      });
    })
    .catch((err) => {
      console.log(`Error on updating CALL ${err}`);
      dispatch({
        type: SAVING_LIVECALL,
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
