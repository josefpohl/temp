import {
  LOADING_JOBS,
  SET_JOBS,
  UPLOAD_JOB,
  LOAD_JOB_VIEW,
} from "../actions/actionTypes";

const initial_state = {
  loadingJobs: false,
  allJobs: [],
  jobInContext: null,
};

export default (state = initial_state, action) => {
  switch (action.type) {
    case LOAD_JOB_VIEW:
      return { ...state, jobInContext: action.payload };
    case UPLOAD_JOB:
      let jobs = allJobs.push(action.payload);
      return { ...state, allJobs: jobs };
    case LOADING_JOBS:
      return { ...state, loadingJobs: !state.loadingJobs };
    case SET_JOBS:
      return { ...state, allJobs: action.payload };
    default:
      return state;
  }
};
