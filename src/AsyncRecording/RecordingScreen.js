import React from "react";
import { View, StyleSheet, Button, Text } from "react-native";
import { connect } from "react-redux";
import RecorderComponent from "AsyncRecording/recorder/RecorderComponent";
//import RecorderFromV1 from "./RecorderFromV1";
import { setInAsyncRecording } from "actions/jobActions";

//Josef - I think the worst part about the old recorder was the save and the redux state.
const RecordingScreen = ({ navigation, user, setInAsyncRecording }) => {
  return (
    <View style={styles.homeContainer}>
      <Text style={styles.recordHeader}>Recording</Text>
      <RecorderComponent navigation={navigation} user={user} />
    </View>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, { setInAsyncRecording })(
  RecordingScreen
);

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2e9aa7",
  },
  recordHeader: {
    fontSize: 48,
    color: "#fff",
  },
});
