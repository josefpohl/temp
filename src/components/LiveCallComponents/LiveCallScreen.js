import React from "react";
import { View, StyleSheet, Button, Text } from "react-native";
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
  saveCall,
  setDescription,
  updateCall,
  initiateIncomingJoin,
} from "../../state/liveCalls";

import {
  roomConnect,
  callAccept,
  emitLeftLiveCall,
} from "../../socketio/actions/liveCallSocket";
import Toast from "react-native-toast-message";

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
  saveCall,
  updateCall,
  callFinished,
  route,
  setDescription,
  incomingCall,
  initiateIncomingJoin,
  getCurrentAvailable,
}) => {
  let [initialize, setInitialize] = React.useState(
    "Initializing your call with a skywriter"
  );
  let [subText, setSubText] = React.useState("Loading");

  const [canjoin, setCanjoin] = React.useState(false);
  const [joining, setJoining] = React.useState(false);

  const makeSaveCall = () => {
    console.log('makeSaveCall --> skywriter', skywriter);
    let jobData = {};
    jobData.description = livecalls.description;
    jobData.skywriter = skywriter.userLoggedIn._id
      ? skywriter.userLoggedIn._id
      : skywriter.id;
    jobData.provider = user._id ? user._id : user.id;
    jobData.roomInfo = livecalls.roomInfo;
    jobData.lastModified = new Date().toISOString();
    if (livecalls.savedLiveCall) {
      updateCall(jobData);
    } else {
      saveCall(jobData); //.then(() => {
    }
    console.log(`SAVING CALL`);
  };

  React.useEffect(() => {
    // get skywriter,
    // get token,
    // join Room...
    console.log("INITIALIZE");
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


  React.useEffect(() => {
    if (canjoin) {
      if (!incomingCall) {
        roomConnect(user, skywriter.userLoggedIn);
      } else {
        //set canJoinRoom
        // emit accept
        initiateIncomingJoin();
        callAccept({ receiver: user, sender: skywriter.userLoggedIn });
      }

      setJoining(true); //Update on RoomInitiate
    }
    //return () => setCanjoin(false);
  }, [canjoin]);

  React.useEffect(() => {
    if (leavingCall) {
      AsyncStorage.removeItem("InLiveCall");
      setJoining(false);
      setInitialize("Leaving Call");
      setSubText("Saving and refreshing content");
      emitLeftLiveCall({
        sender: user,
        receiver: livecalls.skywriter.userLoggedIn,
        roomname: livecalls.roomname,
        terminatedBySender: livecalls.isSender,
      });

      makeSaveCall();
    }
  }, [leavingCall]);

  React.useEffect(() => {
    if (callFinished) {
      //  setTimeout(() => {
      getCurrentAvailable(user);
      clearLiveCall();
      navigation.pop();
      //}, 1000);
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
  saveCall,
  updateCall,
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
