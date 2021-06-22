import {
  ON_IN_LIVE_CALL,
  ON_IN_LIVE_CALL_SUCCESS,
  ON_IN_LIVE_CALL_FAIL,
  IN_LIVE_CALL_SUCCESS,
  IN_LIVE_CALL_FAIL,
  IN_LIVE_CALL,
  OFF_IN_LIVE_CALL,
  OFF_IN_LIVE_CALL_SUCCESS,
  OFF_IN_LIVE_CALL_FAIL,
} from "../types";
import { inLiveCall } from "../../../actions/availableActions";

export const emitInLiveCall = (data) => {
  console.log(`IN_LIVE_CALL socket emit event`);
  return {
    type: "socket",
    types: [IN_LIVE_CALL, IN_LIVE_CALL_SUCCESS, IN_LIVE_CALL_FAIL],
    promise: (socket) => socket.emit(IN_LIVE_CALL, { data }),
  };
};

export const onInLiveCall = () => (dispatch, getState) => {
  console.log(`IN_LIVE_CALL listener exec`);
  const processInLiveCall = (e) => {
    const { teamProfiles } = getState().profiles;
    const { user } = getState().auth;
    const foundReceiverProfile = teamProfiles.find(
      (p) => p.user?._id === getId(e.receiverUser)
    );
    const foundSenderProfile = teamProfiles.find(
      (p) => p.user?._id === getId(e.senderUser)
    );
    if (foundReceiverProfile) {
      //  console.log(`${JSON.stringify(e)}`);
      dispatch(inLiveCall(e.receiverUser));
    }
    if (foundSenderProfile) {
      dispatch(inLiveCall(e.senderUser));
    }
    if (
      getId(e.senderUser) === getId(user) ||
      getId(e.receiverUser) === getId(user)
    ) {
      dispatch(inLiveCall(user));
    }
  };
  dispatch({
    type: "socket",
    types: [ON_IN_LIVE_CALL, ON_IN_LIVE_CALL_SUCCESS, ON_IN_LIVE_CALL_FAIL],
    promise: (socket) => socket.on(IN_LIVE_CALL, processInLiveCall),
  });
};

export function offInLiveCall() {
  return {
    type: "socket",
    types: [OFF_IN_LIVE_CALL, OFF_IN_LIVE_CALL_SUCCESS, OFF_IN_LIVE_CALL_FAIL],
    promise: (socket) => socket.off(IN_LIVE_CALL),
  };
}

function getId(user) {
  if (user.id) {
    return user.id;
  } else {
    return user._id;
  }
}
