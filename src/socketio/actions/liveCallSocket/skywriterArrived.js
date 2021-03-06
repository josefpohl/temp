import {
  SKYWRITER_ARRIVED,
  SKYWRITER_ARRIVED_SUCCESS,
  SKYWRITER_ARRIVED_FAIL,
  OFF_SKYWRITER_ARRIVED,
  OFF_SKYWRITER_ARRIVED_SUCCESS,
  OFF_SKYWRITER_ARRIVED_FAIL,
} from "../types";

import { skywriterArrived } from "../../../state/liveCalls";

export const onSkywriterArrived = () => (dispatch) => {
  console.log("onSkywriterArrived listener exec");
  const onSkyArrived = (e) => {
    dispatch(skywriterArrived(e));
  };

  dispatch({
    type: "socket",
    types: [
      SKYWRITER_ARRIVED,
      SKYWRITER_ARRIVED_SUCCESS,
      SKYWRITER_ARRIVED_FAIL,
    ],
    promise: (socket) => socket.on(SKYWRITER_ARRIVED, onSkyArrived),
  });
};

export function offSkywriterArrived() {
  return {
    type: "socket",
    types: [
      OFF_SKYWRITER_ARRIVED,
      OFF_SKYWRITER_ARRIVED_SUCCESS,
      OFF_SKYWRITER_ARRIVED_FAIL,
    ],
    promise: (socket) => socket.off(SKYWRITER_ARRIVED),
  };
}
