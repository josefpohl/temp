import React from "react";
import { View, StyleSheet, Button, Text } from "react-native";
import { connect } from "react-redux";
import RecorderComponent from "AsyncRecording/RecorderComponent";
import RecorderExample from "./RecorderExample";

const RecordingScreen = ({ navigation, user }) => {
  return (
    <View style={styles.homeContainer}>
      <Text>Hello Recording Screen {user.name}</Text>
      <Button
        color="#fff"
        title="Go Home"
        onPress={() => {
          navigation.navigate("Home");
        }}
      />
      <RecorderExample />
    </View>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, {})(RecordingScreen);

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
  },
});
