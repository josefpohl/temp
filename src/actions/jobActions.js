import axios from "axios";
import {
  GET_USERSJOBS,
  GET_JOB,
  LOADING_JOBS,
  ADD_NEW_JOB,
  UPDATE_NEW_JOB,
  ADD_URL,
  TITLE_CHANGED,
  STORE_JOBINPROGRESS,
  CALL_ENDED,LOADING_JOBS, SET_JOBS
} from "./actionTypes";
import config from "../config";
import RNFS from "react-native-fs";

export const getJobs = (userid) => async (dispatch) => {
  dispatch({ type: LOADING_JOBS });
  const uri = config.SERVER + `/api/jobs/provider/${userid}`;
  //TODO refine to users who can take calls for this team
  const myJobs = await axios.get(uri).then((res) => {
    return res.data;
  });

  dispatch({ type: SET_JOBS, payload: myJobs });
  dispatch({ type: LOADING_JOBS });
}
export const getMyJobs = (userId) => (dispatch) => {
  dispatch(setJobLoading());

  const uri = config.SERVER + `/api/jobs/provider/${userId}`;
  console.log("My Jobs,", userId);
  axios.get(uri).then((res) => {
    dispatch({
      type: GET_USERSJOBS,
      payload: res.data,
    });
  });
};

export const getJob = (jobId) => (dispatch) => {
  dispatch(setJobLoading());

  const uri = config.SERVER + `/api/jobs/${jobId}`;
  axios.get(uri).then((res) =>
    dispatch({
      type: GET_JOB,
      payload: res.data,
    })
  );
};

export const titleChanged = (title) => {
  return {
    type: TITLE_CHANGED,
    payload: title,
  };
};

export const saveJobInProgress = (jobInProgressData) => (dispatch) => {
  console.log("STORE_JOBINPROGRESS", jobInProgressData);
  return {
    type: STORE_JOBINPROGRESS,
    payload: jobInProgressData,
  };
};

export const removeJobInProgress = () => (dispatch) => {
  console.log("RemoveJobInProgress");
  return {
    type: STORE_JOBINPROGRESS,
    payload: { data: null, error: false },
  };
};

export const uploadNewJob = ({ jobData, audioFileName }) => (dispatch) => {
  const uri = config.SERVER + "/api/jobs";
  console.log("In uploadNewJob", jobData, uri);
  dispatch(setJobLoading());
  axios
    .post(uri, jobData)
    .then((res) => {
      console.log("Upload Response", res.data);
      // if (!second) {
      //   throw (Error, { message: "dummy error" });
      // }
      if (res.error) {
        console.log("Error on File Upload: ", res.error);
      } else {
        setTimeout(() => {
          if (RNFS.exists(audioFileName)) {
            return RNFS.unlink(audioFileName).then(() =>
              console.log("File Deleted:", audioFileName)
            );
          }
        }, 5000); // 5 second delay on delete
        dispatch({
          type: ADD_NEW_JOB,
          payload: res.data,
        });
        dispatch({
          type: STORE_JOBINPROGRESS,
          payload: { data: null, error: false },
        });
        dispatch({
          type: CALL_ENDED,
          payload: true,
        });
      }
      //return res;
    })
    .catch((err) => {
      dispatch({
        type: STORE_JOBINPROGRESS,
        payload: { data: { jobData, audioFileName }, error: true },
      });
      console.log("Error uploadNewJob", err);
    });
};

export const uploadLiveCallJob = (jobData) => (dispatch) => {
  const uri = config.SERVER + "/api/jobs/livecall";
  console.log("In uploadLiveCallJob", jobData, uri);
  dispatch(setJobLoading());
  axios
    .post(uri, jobData)
    .then((res) => {
      console.log("Upload Update Response", res.data);
      // if (!second) {
      //   throw (Error, { message: "dummy error" });
      // }
      if (res.error) {
        console.log("Error on File Upload: ", res.error);
      } else {
        dispatch({
          type: ADD_NEW_JOB,
          payload: res.data,
        });
        dispatch({
          type: STORE_JOBINPROGRESS,
          payload: { data: null, error: false },
        });
      }
      //return res;
    })
    .catch((err) => {
      dispatch({
        type: STORE_JOBINPROGRESS,
        payload: { data: { jobData }, error: true },
      });
      console.log("Error uploadNewJob", err);
    });
};

export const updateLiveCallJob = (jobData) => (dispatch) => {
  const uri = config.SERVER + "/api/jobs/update/livecall";
  console.log("In updateLiveCallJob", jobData, uri);
  dispatch(setJobLoading());
  axios
    .post(uri, jobData)
    .then((res) => {
      console.log("Upload Response", res.data);
      // if (!second) {
      //   throw (Error, { message: "dummy error" });
      // }
      if (res.error) {
        console.log("Error on File Upload: ", res.error);
      } else {
        dispatch({
          type: UPDATE_NEW_JOB,
          payload: res.data,
        });
        dispatch({
          type: STORE_JOBINPROGRESS,
          payload: { data: null, error: false },
        });
      }
      //return res;
    })
    .catch((err) => {
      dispatch({
        type: STORE_JOBINPROGRESS,
        payload: { data: { jobData }, error: true },
      });
      console.log("Error uploadNewJob", err);
    });
};

//UNUSED CURRENTLY
export const getSignedURL = (job) => (dispatch) => {
  // console.log('JOB IN GETSIGNEDURL', job);
  const uri = config.SERVER + `/api/jobs/signedURL/${job.s3File}`;
  axios.get(uri).then((res) => {
    console.log("Response in action", res.data, job._id);
    dispatch({
      type: ADD_URL,
      payload: { audioFile: res.data, jobid: job._id },
    });
    //return res.data;
  });
};

export const setJobLoading = () => {
  return {
    type: LOADING_JOBS,
  };
};
