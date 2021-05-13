import {
  LOADING_AVAILABLES,
  SET_CURRENT_AVAILABLES,
} from '../actions/actionTypes';

const initial_state = {
  loadingAvailables: false,
  allAvailables: [],
};

export default (state = initial_state, action) => {
  switch (action.type) {
    case LOADING_AVAILABLES:
      return {...state, loadingAvailables: !state.loadingAvailables};
    case SET_CURRENT_AVAILABLES:
      return {...state, allAvailables: action.payload};
    default:
      return state;
  }
};
