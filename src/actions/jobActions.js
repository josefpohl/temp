import { LOADING_JOBS, SET_JOBS } from "./actionTypes";
import axios from "axios";

import config from "../config";

export const getJobs = (userid) => async (dispatch) => {
  dispatch({ type: LOADING_JOBS });
  const uri = config.SERVER + `/api/jobs/provider/${userid}`;
  //TODO refine to users who can take calls for this team
  const myJobs = await axios.get(uri).then((res) => {
    return res.data;
  });

  dispatch({ type: SET_JOBS, payload: myJobs });
  dispatch({ type: LOADING_JOBS });
};
