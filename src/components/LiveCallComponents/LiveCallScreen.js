import React from "react";
import { View, StyleSheet, Button, Text } from "react-native";
import { connect } from "react-redux";
import LiveCallSplashScreen from "./LiveCallSplashScreen";
import LiveCallInProgress from "./LiveCallInProgress";
import { getSkywriter, getToken } from "../../state/liveCalls";

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
}) => {
  let [initialize, setInitialize] = React.useState("Loading");

  const [canjoin, setCanjoin] = React.useState(false);
  const [joining, setJoining] = React.useState(false);

  React.useEffect(() => {
    // get skywriter,
    // get token,
    // join Room...
    getToken();
    getSkywriter(user);
    setInitialize("Connecting");
  }, [initialize]);

  React.useEffect(() => {
    skywriterCalling ? setCanjoin(true && token) : setCanjoin(true && token);
  }, [skywriter]);

  React.useEffect(() => {
    setCanjoin(true && skywriter);
  }, [token]);

  React.useEffect(() => {
    if (canjoin) {
      roomConnect(user, skywriter.userLoggedIn);

      setJoining(true); //Update on RoomInitiate
    }
  }, [canjoin]);
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
});

export default connect(mapStateToProps, {
  roomConnect,
  getToken,
  getSkywriter,
})(LiveCallScreen);
const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
  },
});
