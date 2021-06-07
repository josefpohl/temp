import React from "react";
import { View, StyleSheet, Text } from "react-native";

export default LiveCallSplashScreen = ({ text }) => {
  return (
    <View style={styles.splashContatiner}>
      <Text>Initiating your call with a Skywriter</Text>
      <Text> {text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  splashContatiner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#b3b3b3",
  },
});
