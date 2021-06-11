import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { ActivityIndicator, Colors } from "react-native-paper";

export default ({ navigation }) => {
  return (
    <View style={styles.loadingContainer}>
      <View>
        <Image
          source={require("../img/SkywriterMD_Logo_mediumbluebackground.png")}
          style={{
            width: 400,
            height: 150,
            marginBottom: 20,
            marginTop: 100,
          }}
        />
      </View>
      <Text style={styles.loadingText}>Loading....</Text>
      <ActivityIndicator
        animating={true}
        colors={Colors.white}
        size={"large"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2e8ea7",
  },
  loadingText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 40,
  },
});
