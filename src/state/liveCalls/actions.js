import {
  CLEAR_LIVE_CALL,
  SET_SKYWRITER_IN_CALL,
  SET_TOKEN,
  LOADING_SKYWRITER,
  SAVE_LIVECALL,
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
      console.log(`GET SKYWRITER ${JSON.stringify(res.data)}`);
      let skywriter = null;
      if (res.data.length > 0) {
        skywriter = res.data[0];
      }
      setTimeout(
        () =>
          dispatch({
            type: SET_SKYWRITER_IN_CALL,
            payload: skywriter,
          }),
        5000
      );
      return skywriter;
    })
    .catch((error) => {
      dispatch({
        type: SET_SKYWRITER_IN_CALL,
        payload: null,
      });
    });
};
