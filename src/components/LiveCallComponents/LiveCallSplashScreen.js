import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Button } from "react-native-paper";

const LiveCallSplashScreen = ({ text, user, skywriter, roomname }) => {
  return (
    <View style={styles.splashContatiner}>
      <Text>Initiating your call with a Skywriter</Text>
      <Text> {text}</Text>
    </View>
  );
};

export default LiveCallSplashScreen;

const styles = StyleSheet.create({
  splashContatiner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#b3b3b3",
  },
  dataElements: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 25,
  },
});
