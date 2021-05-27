import React, { useState } from "react";
import { Text, View } from "react-native";
import { Icon } from "react-native-elements";

export default function RecorderComponent() {
  const [isRecording, setIsRecording] = useState(false);

  if (isRecording) {
    return null;
  }
  return (
    <View style={styles.buttonView}>
      <Icon
        size={100}
        name="fiber-manual-record"
        // disabled={!this.state.titleEntered}
        color="red"
        onPress={this.startRecording}
      />
      <Text style={styles.buttonLabelText}>Record</Text>
    </View>
  );
}

const styles = {
  buttonView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
};
