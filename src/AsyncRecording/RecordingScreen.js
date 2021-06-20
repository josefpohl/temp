import React from "react";
import { View, StyleSheet, Button, Text } from "react-native";
import { connect } from "react-redux";
import RecorderComponent from "AsyncRecording/recorder/RecorderComponent";
import RecorderFromV1 from "./RecorderFromV1";

//Josef - I think the worst part about the old recorder was the save and the redux state.
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
      <RecorderComponent navigation={navigation} />
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
