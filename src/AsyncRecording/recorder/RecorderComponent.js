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
//2.2 If playing, render stop button - OK
//2.3 If playing, render pause button
//3. Playback/Pause/Resume/Record functionality
//4. File upload functionality
//5. Some kind of call functionality?
//6. Delete functionality
//If recording is paused, show player

const PLAYERSTATE = {
  STOPPED: "STOPPED",
  RECORDING: "RECORDING",
  PLAYING: "PLAYING",
  PAUSED: "PAUSED",
};
Object.freeze(PLAYERSTATE);

export default function RecorderComponent() {
  const [playerState, setPlayerState] = useState(PLAYERSTATE.STOPPED);
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
      setPlayerState(PLAYERSTATE.RECORDING);
    } catch (err) {
      console.error(err);
    }
  }

  async function endRecording() {
    await AudioRecorder.stopRecording();
    Alert.alert(audioFileName);
    setPlayerState(PLAYERSTATE.STOPPED);
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

  async function pauseRecording() {
    try {
      console.log("Pausing recording");
      setTimeout(async () => {
        await AudioRecorder.pauseRecording();
        setPlayerState(PLAYERSTATE.PAUSED);
      }, 500);
    } catch (error) {
      console.log("Recording Pause Error -- ", error);
    }
  }

  if (playerState === PLAYERSTATE.RECORDING) {
    return (
      <View style={styles.buttonView}>
        <Icon size={100} name="stop" color="black" onPress={endRecording} />
        <Text style={styles.buttonLabelText}>End recording</Text>
        <Icon size={100} name="pause" color="white" onPress={pauseRecording} />
        <Text style={styles.buttonLabelText}>Pause</Text>
        <VUMeter decibels={decibels} />
      </View>
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
