import {
  SKYWRITER_ARRIVED,
  ON_SKYWRITER_ARRIVED,
  ON_SKYWRITER_ARRIVED_SUCCESS,
  ON_SKYWRITER_ARRIVED_FAIL,
  OFF_SKYWRITER_ARRIVED,
  OFF_SKYWRITER_ARRIVED_SUCCESS,
  OFF_SKYWRITER_ARRIVED_FAIL,
} from "../types";

import { skywriterArrived } from "../../../state/liveCalls";

export const onSkywriterArrived = () => (dispatch) => {
  console.log("onSkywriterArrived listener exec");
  const onSkyArrived = (e) => {
    console.log(`Skywriter Arrived in listener ${JSON.stringify(e)}`);
    dispatch(skywriterArrived(e));
  };

  dispatch({
    type: "socket",
    types: [
      ON_SKYWRITER_ARRIVED,
      ON_SKYWRITER_ARRIVED_SUCCESS,
      ON_SKYWRITER_ARRIVED_FAIL,
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
