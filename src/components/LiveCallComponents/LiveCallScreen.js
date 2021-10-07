import React from "react";
import { StyleSheet } from "react-native";
import { connect } from "react-redux";
import moment from "moment";
import AsyncStorage from "@react-native-community/async-storage";
import LiveCallSplashScreen from "./LiveCallSplashScreen";
import LiveCallInProgress from "./LiveCallInProgress";
import { getCurrentAvailable } from "../../actions/availableActions";
import {
  getSkywriter,
  getToken,
  clearLiveCall,
  setDescription,
  initiateIncomingJoin,
} from "../../state/liveCalls";
import {
  roomConnect,
  callAccept,
  emitLeftLiveCall,
} from "../../socketio/actions/liveCallSocket";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";

const LiveCallScreen = ({
  navigation,
  user,
  roomname,
  getSkywriter,
  getToken,
  roomConnect,
  callAccept,
  skywriter,
  token,
  leavingCall,
  clearLiveCall,
  emitLeftLiveCall,
  livecalls,
  callFinished,
  route,
  setDescription,
  incomingCall,
  initiateIncomingJoin,
  getCurrentAvailable,
}) => {
  const dispatch = useDispatch();
  let [initialize, setInitialize] = React.useState(
    "Initializing your call with a skywriter"
  );
  let [subText] = React.useState("Loading");

  const [canjoin, setCanjoin] = React.useState(false);
  const [joining, setJoining] = React.useState(false);


  React.useEffect(() => {
    // emit get skywriter,
    // emit get token,
    // join Room...
    console.log("INITIALIZE", incomingCall);
    if (!joining && !route.params.joinInProgress) {
      AsyncStorage.setItem("InLiveCall", "true");
      getToken();
      incomingCall ? null : getSkywriter(user);
      setDescription(
        "Live call session at " + moment().format("M/D/YYYY [at] h:mm:ss")
      );
      setInitialize(`Connecting`);
    }
  }, []);

  // validate if the skywriter and token exists to be able to move forward to the other screen
  React.useEffect(() => {
    if (skywriter !== null && token !== null) {
      setCanjoin(true && skywriter && token);
    }
  }, [skywriter, token]);


  /**
   * We validate if the user and skywriter exist before emit the roomConnect Action
   */
  React.useEffect(() => {
    if (canjoin) {
      if (!incomingCall && skywriter && user) {
        roomConnect(user, skywriter.userLoggedIn);
      } else {
        // set canJoinRoom and emit accept
        initiateIncomingJoin();
        callAccept({ receiver: user, sender: skywriter.userLoggedIn });
      }

      setJoining(true); //Update on RoomInitiate
    }
  }, [canjoin, incomingCall]);

  React.useEffect(() => {
    if (leavingCall) {
      console.log('LEAVING CALL');
      AsyncStorage.removeItem("InLiveCall");
      setJoining(false);
      setInitialize("Leaving Call");
      emitLeftLiveCall({
        sender: user,
        receiver: livecalls.skywriter.userLoggedIn,
        roomname: livecalls.roomname,
        terminatedBySender: livecalls.isSender,
      });
      dispatch({
        type: 'CALL_FINISHED',
      });
    }
  }, [leavingCall]);

  React.useEffect(() => {
    if (callFinished) {
      getCurrentAvailable(user);
      clearLiveCall();
      navigation.pop();
    }
  }, [callFinished]);


  return joining ? (
    <LiveCallInProgress
      token={token}
      roomname={roomname}
      navigation={navigation}
      skywriter={skywriter ? skywriter : livecalls.skywriter}
      callAlreadyInProgress={
        route.params.joinInProgress ? route.params.joinInProgress : false
      }
    />
  ) : (
    <LiveCallSplashScreen text={subText} headerText={initialize} />
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  skywriter: state.livecalls.skywriter,
  token: state.livecalls.token,
  leavingCall: state.livecalls.leavingCall,
  livecalls: state.livecalls,
  roomname: state.livecalls.roomname,
  savingCallInProgress: state.livecalls.savingCallInProgress,
  callFinished: state.livecalls.callFinished,
  incomingCall: state.livecalls.incomingCall,
});

export default connect(mapStateToProps, {
  roomConnect,
  callAccept,
  getToken,
  getSkywriter,
  clearLiveCall,
  emitLeftLiveCall,
  setDescription,
  initiateIncomingJoin,
  getCurrentAvailable,
})(LiveCallScreen);
const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
  },
});
