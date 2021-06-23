import React from "react";
import { View, StyleSheet, Button, Text } from "react-native";
import { connect } from "react-redux";
import moment from "moment";
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
      incomingCall
        ? console.log(
            `Incoming Call - NO Get skywriter needed ${skywriter.userLoggedIn.name}`
          )
        : getSkywriter(user);
      setDescription(
        "Live call session at " + moment().format("M/D/YYYY [at] h:mm:ss")
      );
      setInitialize(`Connecting`);
    }
  }, []);

  React.useEffect(() => {
    console.log("SKYWRITER");
    if (skywriter !== null) {
      setCanjoin(true && token);
    }
  }, [skywriter]);

  React.useEffect(() => {
    if (token !== null) {
      console.log("TOKEN");
      setCanjoin(true && skywriter);
    }
  }, [token]);

  React.useEffect(() => {
    console.log("CAN JOIN");
    if (canjoin) {
      if (!incomingCall) {
        roomConnect(user, skywriter.userLoggedIn);
      } else {
        console.log("NEED TO JOIN ROOM AND ACCEPT");
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
      console.log(`LEAVING CALL ${JSON.stringify(user.name)}`);
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
      console.log(`FINISHING CALL invoked`);

      //  setTimeout(() => {
      getCurrentAvailable(user);
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
    <LiveCallSplashScreen text={subText} headerText={initialize} />
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
