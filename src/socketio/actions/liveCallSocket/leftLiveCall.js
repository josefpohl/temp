import {
  LEFT_LIVE_CALL,
  LEFT_LIVE_CALL_SUCCESS,
  LEFT_LIVE_CALL_FAIL,
  ON_LEFT_LIVE_CALL,
  ON_LEFT_LIVE_CALL_SUCCESS,
  ON_LEFT_LIVE_CALL_FAIL,
  OFF_LEFT_LIVE_CALL,
  OFF_LEFT_LIVE_CALL_SUCCESS,
  OFF_LEFT_LIVE_CALL_FAIL,
} from "../types";

import { leftLiveCall } from "../../../actions/availableActions";

export const emitLeftLiveCall = ({
  receiver,
  sender,
  roomname,
  terminatedBySender,
}) => {
  console.log(`LEFT_LIVE_CALL socket emit event`);
  return {
    type: "socket",
    types: [LEFT_LIVE_CALL, LEFT_LIVE_CALL_SUCCESS, LEFT_LIVE_CALL_FAIL],
    promise: (socket) =>
      socket.emit(LEFT_LIVE_CALL, {
        receiver,
        sender,
        roomname,
        terminatedBySender,
      }),
  };
};

export const onLeftLiveCall = () => (dispatch, getState) => {
  console.log(`LEFT_LIVE_CALL listener exec`);
  const processLeftLiveCall = (e) => {
    // console.log(`PROCESS LEFT_LIVE_CALL ${JSON.stringify(e)}`);
    const { teamProfiles } = getState().profiles;
    const { user } = getState().auth;
    const foundReceiverProfile = teamProfiles.find(
      (p) => p.user?._id === getId(e.receiverUser)
    );
    const foundSenderProfile = teamProfiles.find(
      (p) => p.user?._id === getId(e.senderUser)
    );
    if (foundReceiverProfile) {
      // console.log(`${JSON.stringify(e)}`);
      dispatch(leftLiveCall(e.receiverUser));
    }
    if (foundSenderProfile) {
      dispatch(leftLiveCall(e.senderUser));
    }

    if (
      getId(e.senderUser) === getId(user) ||
      getId(e.receiverUser) === getId(user)
    ) {
      dispatch(leftLiveCall(user));
    }
  };

  dispatch({
    type: "socket",
    types: [
      ON_LEFT_LIVE_CALL,
      ON_LEFT_LIVE_CALL_SUCCESS,
      ON_LEFT_LIVE_CALL_FAIL,
    ],
    promise: (socket) => socket.on(LEFT_LIVE_CALL, processLeftLiveCall),
  });
};

export function offLeftLiveCall() {
  return {
    type: "socket",
    types: [
      OFF_LEFT_LIVE_CALL,
      OFF_LEFT_LIVE_CALL_SUCCESS,
      OFF_LEFT_LIVE_CALL_FAIL,
    ],
    promise: (socket) => socket.off(LEFT_LIVE_CALL),
  };
}

function getId(user) {
  if (user.id) {
    return user.id;
  } else {
    return user._id;
  }
}
