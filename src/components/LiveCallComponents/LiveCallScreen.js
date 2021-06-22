import React from "react";
import { View, StyleSheet, Button, Text } from "react-native";
import { connect } from "react-redux";
import moment from "moment";
import LiveCallSplashScreen from "./LiveCallSplashScreen";
import LiveCallInProgress from "./LiveCallInProgress";
import {
  getSkywriter,
  getToken,
  clearLiveCall,
  saveCall,
  setDescription,
  updateCall,
} from "../../state/liveCalls";

import {
  roomConnect,
  emitLeftLiveCall,
} from "../../socketio/actions/liveCallSocket";
import Toast from "react-native-toast-message";

const LiveCallScreen = ({
  navigation,
  user,
  skywriterCalling,
  getSkywriter,
  getToken,
  roomConnect,
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
}) => {
  let [initialize, setInitialize] = React.useState("Loading");

  const [canjoin, setCanjoin] = React.useState(false);
  const [joining, setJoining] = React.useState(false);

  const makeSaveCall = () => {
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
    if (!joining) {
      getToken();
      getSkywriter(user);
      setDescription(
        "Live call session at " + moment().format("M/D/YYYY [at] h:mm:ss")
      );
      setInitialize(`Connecting`);
    }
  }, []);

  React.useEffect(() => {
    console.log("SKYWRITER");
    skywriterCalling ? setCanjoin(true && token) : setCanjoin(true && token);
  }, [skywriter]);

  React.useEffect(() => {
    console.log("TOKEN");
    setCanjoin(true && skywriter);
  }, [token]);

  React.useEffect(() => {
    console.log("CAN JOIN");
    if (canjoin) {
      roomConnect(user, skywriter.userLoggedIn);

      setJoining(true); //Update on RoomInitiate
    }
    //return () => setCanjoin(false);
  }, [canjoin]);

  React.useEffect(() => {
    console.log(`LEAVING CALL invoked`);
    if (leavingCall) {
      console.log(`LEAVING CALL ${JSON.stringify(user.name)}`);
      setJoining(false);
      setInitialize("Leaving Call");
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
      console.log(`FINISHING CALL invoked`);

      //  setTimeout(() => {
      console.log(`FINISHING CALL`);
      clearLiveCall();
      navigation.pop();
      //}, 1000);
    }
  }, [callFinished]);

  return joining ? (
    <LiveCallInProgress
      token={token}
      navigation={navigation}
      skywriter={skywriter}
    />
  ) : (
    <LiveCallSplashScreen text={initialize} />
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  skywriter: state.livecalls.skywriter,
  token: state.livecalls.token,
  leavingCall: state.livecalls.leavingCall,
  livecalls: state.livecalls,
  savingCallInProgress: state.livecalls.savingCallInProgress,
  callFinished: state.livecalls.callFinished,
});

export default connect(mapStateToProps, {
  roomConnect,
  getToken,
  getSkywriter,
  clearLiveCall,
  emitLeftLiveCall,
  setDescription,
  saveCall,
  updateCall,
})(LiveCallScreen);
const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
  },
});
