import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { Icon } from "react-native-elements";
import { AudioRecorder, AudioUtils } from "react-native-audio";
import VUMeter from "AsyncRecording/VUMeter";

export default function RecorderComponent() {
  const [isRecording, setIsRecording] = useState(false);
  const [decibels, setDecibels] = useState(-180);

  async function startRecording() {
    try {
      AudioRecorder.requestAuthorization().then(async () => {
        const filePath = await AudioRecorder.startRecording();
        console.log("Recording now", filePath);
      });
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    prepareRecordingPath();
  }, []);

  AudioRecorder.onProgress = (data) => {
    let decibels = Math.floor(data.currentMetering);
    setDecibels(decibels);
  };

  function prepareRecordingPath(audioPath) {
    AudioRecorder.prepareRecordingAtPath(
      AudioUtils.DocumentDirectoryPath + "/test.aac",
      {
        SampleRate: 22050,
        Channels: 1,
        AudioQuality: "Low",
        AudioEncoding: "aac",
        AudioEncodingBitRate: 32000,
        MeteringEnabled: true,
      }
    );
  }

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
        onPress={startRecording}
      />
      <Text style={styles.buttonLabelText}>Record</Text>
      <VUMeter decibels={decibels} />
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
