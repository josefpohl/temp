import {
  LOADING_SKYWRITER,
  SET_SKYWRITER_IN_CALL,
  SET_TOKEN,
  CLEAR_LIVE_CALL,
  FINDING_SKYWRITER_ERROR,
  SAVE_LIVECALL,
} from "./types";

const initial_state = {
  skywriter: null,
  findingSkywriterError: false,
  loadingSkywriter: false,
  roomName: "",
  token: null,
};

export default (state = initial_state, action) => {
  switch (action.type) {
    case LOADING_SKYWRITER:
      return { ...state, loadingSkywriter: true };
    case SET_SKYWRITER_IN_CALL:
      console.log("SET_SKYWRITER REDUX");
      return {
        ...state,
        loadingSkywriter: false,
        skywriter: action.payload,
      };
    case FINDING_SKYWRITER_ERROR:
      return { ...state, findingSkywriterError: true, loadingSkywriter: false };
    case SET_TOKEN:
      return { ...state, token: action.payload };
    default:
      return state;
  }
};
