import React from "react";
import { View, StyleSheet, Button, Text } from "react-native";
import { connect } from "react-redux";
import LiveCallSplashScreen from "./LiveCallSplashScreen";
import LiveCallInProgress from "./LiveCallInProgress";
import {
  getSkywriter,
  getToken,
  clearLiveCall,
  saveCall,
} from "../../state/liveCalls";

import { roomConnect } from "../../socketio/actions/liveCallSocket";

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
}) => {
  let [initialize, setInitialize] = React.useState("Loading");

  const [canjoin, setCanjoin] = React.useState(false);
  const [joining, setJoining] = React.useState(false);

  React.useEffect(() => {
    // get skywriter,
    // get token,
    // join Room...
    console.log("INITIALIZE");
    if (!joining) {
      getToken();
      getSkywriter(user);
      setInitialize("Connecting");
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
    return setCanjoin(false);
  }, [canjoin]);

  React.useEffect(() => {
    console.log("LEAVING CALL");
    if (leavingCall) {
      setJoining(false);
      setInitialize("Leaving Call");
      saveCall().then(() => {
        console.log("SAVING CALL USE EFFECT");
        clearLiveCall();
        setTimeout(() => navigation.pop(), 2000);
      });
    }
  }, [leavingCall]);
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
});

export default connect(mapStateToProps, {
  roomConnect,
  getToken,
  getSkywriter,
  clearLiveCall,
})(LiveCallScreen);
const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
  },
});
