import {
  LOADING_TEAM_PROFILES,
  SET_CURRENT_PROFILE,
  SET_TEAM_PROFILES,
} from '../actions/actionTypes';

const initial_state = {
  loadingProfiles: false,
  userProfile: null,
  teamProfiles: [],
};

export default (state = initial_state, action) => {
  switch (action.type) {
    case LOADING_TEAM_PROFILES:
      return {...state, loadingProfiles: !state.loadingProfiles};
    case SET_CURRENT_PROFILE:
      return {...state, userProfile: action.payload};
    case SET_TEAM_PROFILES:
      return {...state, teamProfiles: action.payload};
    default:
      return state;
  }
};
