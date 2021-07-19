import {
  LOADING_JOBS,
  SET_JOBS,
  UPLOAD_JOB,
  LOAD_JOB_VIEW,
  IN_ASYNC_RECORDING,
  END_RECORDING,
} from "../actions/actionTypes";

const initial_state = {
  loadingJobs: false,
  allJobs: [],
  jobInContext: null,
  isRecording: false,
  title: "",
  playerState: null,
  audioFilePath: "",
  audioFileBase: "",
};

export default (state = initial_state, action) => {
  switch (action.type) {
    case LOAD_JOB_VIEW:
      return { ...state, jobInContext: action.payload };
    case UPLOAD_JOB:
      let jobs = allJobs.push(action.payload);
      return { ...state, allJobs: jobs, isRecording: false };
    case LOADING_JOBS:
      return { ...state, loadingJobs: !state.loadingJobs };
    case SET_JOBS:
      return { ...state, allJobs: action.payload };
    case END_RECORDING:
      return {
        ...state,
        isRecording: false,
        title: "",
        playerState: null,
        audioFilePath: "",
        audioFileBase: "",
      };
    case IN_ASYNC_RECORDING:
      console.log(`IN_ASYNC_RECORDING ${JSON.stringify(action.payload)}`);
      return {
        ...state,
        isRecording: true,
        title: action.payload.title,
        audioFilePath: action.payload.audioFilePath,
        audioFileBase: action.payload.audioFileBase,
        playerState: action.payload.playerState,
      };
    default:
      return state;
  }
};
