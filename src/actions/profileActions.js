import {
  LOADING_TEAM_PROFILES,
  SET_CURRENT_PROFILE,
  SET_TEAM_PROFILES,
} from './actionTypes';
import axios from 'axios';

export const getProfiles = (userid) => (dispatch) => {
    dispatch({type: LOADING_TEAM_PROFILES});
    const uri = config.SERVER + `/api/profile/teams/${userid}`;
    const profiles = await axios.get(uri).then((res) => {
      return res.data;
    });
    const myProfile = profiles.find((p) => p.user._id === userid);
    //TODO Refine search to team roles rather than user roles
    const teamProfiles = profiles.filter((p) => p.user.role === 'skywriter');
    dispatch({
        type: SET_CURRENT_PROFILE,
        payload: myProfile,
      });
      dispatch({
        type: SET_TEAM_PROFILES,
        payload: teamProfiles,
      });
      dispatch({type: LOADING_TEAM_PROFILES});
}