import {LOADING_JOBS, SET_JOBS} from '../actions/actionTypes';

const initial_state = {
  loadingJobs: false,
  allJobs: [],
};

export default (state = initial_state, action) => {
  switch (action.type) {
    case LOADING_JOBS:
      return {...state, loadingJobs: !state.loadingJobs};
    case SET_JOBS:
      return {...state, allJobs: action.payload};
    default:
      return state;
  }
};
