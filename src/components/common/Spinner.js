import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  spinnerStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
function Spinner(props) {
  const { size } = props;
  return (
    <View style={styles.spinnerStyle}>
      <ActivityIndicator color="fff" size={size || "large"} />
    </View>
  );
}

export { Spinner };
