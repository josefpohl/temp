import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { Icon } from "react-native-elements";
import { AudioRecorder, AudioUtils } from "react-native-audio";
import VUMeter from "AsyncRecording/VUMeter";
import { v4 as uuid } from "uuid";
import { Alert } from "react-native";

//TODO
//1. UI wise, how does this look?
//2. Start recording functionality - OK
//2.1. Title entered modal?
//2.2 If playing, render stop button
//3. Playback/Pause/Resume/Record functionality
//4. File upload functionality
//5. Some kind of call functionality?
//6. Delete functionality
//If recording is paused, show player

export default function RecorderComponent() {
  const [isRecording, setIsRecording] = useState(false);
  const [decibels, setDecibels] = useState(-180);
  const [audioFileName, setAudioFileName] = useState("");

  async function startRecording() {
    try {
      const audioFileName = `/${uuid()}.aac`;
      setAudioFileName(audioFileName);
      AudioRecorder.requestAuthorization().then(async () => {
        await prepareRecordingPath(audioFileName);
        const filePath = await AudioRecorder.startRecording();
        console.log("Recording now", filePath);
      });
      setIsRecording(true);
    } catch (err) {
      console.error(err);
    }
  }

  async function endRecording() {
    await AudioRecorder.stopRecording();
    Alert.alert(audioFileName);
    setIsRecording(false);
  }

  AudioRecorder.onProgress = (data) => {
    let decibels = Math.floor(data.currentMetering);
    setDecibels(decibels);
  };

  async function prepareRecordingPath(audioFileName) {
    await AudioRecorder.prepareRecordingAtPath(
      AudioUtils.DocumentDirectoryPath + audioFileName,
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
    return (
      <>
        <Icon size={100} name="stop" color="black" onPress={endRecording} />
        <VUMeter decibels={decibels} />
      </>
    );
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
