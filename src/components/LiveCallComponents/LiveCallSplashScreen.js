import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { ActivityIndicator, Colors } from "react-native-paper";

const LiveCallSplashScreen = ({
  text,
  headerText,
  user,
  skywriter,
  roomname,
}) => {
  return (
    <View style={styles.splashContatiner}>
      <Text style={styles.header}>{headerText}</Text>
      <Text style={styles.subtext}> {text}</Text>
      <ActivityIndicator
        animating={true}
        colors={Colors.white}
        size={"large"}
      />
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

  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginLeft: 25,
  },
  subtext: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
