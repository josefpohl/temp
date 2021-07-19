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
  CALL_ENDED,
  SET_JOBS,
  IN_ASYNC_RECORDING,
  END_RECORDING,
} from "./actionTypes";
import config from "../config";
import RNFS from "react-native-fs";

export const getJobs = (userid) => async (dispatch) => {
  dispatch({ type: LOADING_JOBS });
  const uri = config.SERVER + `/api/jobs/provider/${userid}`;
  //TODO refine to users who can take calls for this team
  console.log(`getJobs for user`);
  axios.get(uri).then((res) => {
    dispatch({ type: SET_JOBS, payload: res.data });
    dispatch({ type: LOADING_JOBS });
  });
};

//Internal function for getting jobs.
export const getMyJobs = async (userId) => {
  const uri = config.SERVER + `/api/jobs/provider/${userId}`;
  console.log("My Jobs,", userId);
  const data = await axios.get(uri).then((res) => {
    return {
      type: SET_JOBS,
      payload: res.data,
    };
  });
  return data;
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
  dispatch(setJobLoading());
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

export const uploadNewJob =
  ({ jobData, audioFileName, userid }) =>
  (dispatch) => {
    const uri = config.SERVER + "/api/jobs";
    console.log("In uploadNewJob", jobData, uri, userid);
    dispatch(setJobLoading());
    axios
      .post(uri, jobData)
      .then(async (res) => {
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
            type: END_RECORDING,
          });
        }
        //return res;
        const jobs = await getMyJobs(userid);
        dispatch(jobs);
        dispatch(setJobLoading());
      })
      .catch((err) => {
        dispatch({
          type: STORE_JOBINPROGRESS,
          payload: { data: { jobData, audioFileName }, error: true },
        });
        console.log("Error uploadNewJob", err);
        dispatch(setJobLoading());
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

export const setEndRecording = () => {
  return {
    type: END_RECORDING,
  };
};

export const setInAsyncRecording = (recordingData) => {
  console.log(`Setting state IN_ASYNC_RECORDING`);
  return {
    type: IN_ASYNC_RECORDING,
    payload: recordingData,
  };
};
