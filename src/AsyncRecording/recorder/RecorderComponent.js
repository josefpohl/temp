import React, { useState } from "react";
import { Text, View } from "react-native";
import { Icon } from "react-native-elements";
import { AudioRecorder, AudioUtils } from "react-native-audio";
import VUMeter from "AsyncRecording/VUMeter";
import { v4 as uuid } from "uuid";
import { useDispatch } from "react-redux";
import { uploadNewJob } from "actions/jobActions";
import PatientTaskModal from "AsyncRecording/recorder/PatienTaskModal";

//TODO
//1. UI wise, how should this look?
//2. Start recording functionality - OK
//2.2 If playing, render stop button - OK
//2.3 If playing, render pause button - OK
//2.4 When paused, render Resume recording button - OK
//2.5 End recording functionality - OK
//3. File upload functionality - OK
//4. Some kind of call functionality?
//5. Delete functionality
//6. If recording is paused, show player
//7. Title entered modal?

const PLAYERSTATE = {
  STOPPED: "STOPPED",
  RECORDING: "RECORDING",
  PLAYING: "PLAYING",
  PAUSED: "PAUSED",
};
Object.freeze(PLAYERSTATE);

const fileExtension = ".aac";

export default function RecorderComponent({ navigation }) {
  const [playerState, setPlayerState] = useState(PLAYERSTATE.STOPPED);
  const [decibels, setDecibels] = useState(-180);
  const [recordSecondsCounter, setRecordSecondsCounter] = useState(0);
  const [audioFilePath, setAudioFilePath] = useState("");
  const [audioFileBase, setAudioFileBase] = useState("");
  const [title, setTitle] = useState("");
  const [showTitleModal, setShowTitleModal] = useState(true);
  const dispatch = useDispatch();

  async function startRecording() {
    try {
      const audioFileBase = uuid();
      setAudioFileBase(audioFileBase);
      AudioRecorder.requestAuthorization().then(async () => {
        await prepareRecordingPath(audioFileBase);
        await AudioRecorder.startRecording();
        console.log("Recording now");
      });
      setPlayerState(PLAYERSTATE.RECORDING);
    } catch (err) {
      console.error(err);
    }
  }

  async function endRecording() {
    await AudioRecorder.stopRecording();
    setPlayerState(PLAYERSTATE.STOPPED);
    prepareFileAndUpload();
  }

  async function prepareFileAndUpload() {
    const jobData = new FormData();
    jobData.append("selectedFile", {
      uri: "file://" + audioFilePath,
      name: audioFileBase + fileExtension,
    });
    jobData.append("lastModified", new Date());
    jobData.append("name", audioFileBase);
    jobData.append("description", title);
    jobData.append("type", "audio/aac");
    jobData.append("duration", recordSecondsCounter);
    console.log("jobData", JSON.stringify(jobData));
    dispatch(
      uploadNewJob({
        jobData,
        audioFileName: audioFilePath,
      })
    );
  }

  AudioRecorder.onProgress = (data) => {
    let decibels = Math.floor(data.currentMetering);
    setDecibels(decibels);
    setRecordSecondsCounter(Math.floor(data.currentTime));
  };

  async function prepareRecordingPath(audioFileBase) {
    const audioFilePath =
      AudioUtils.DocumentDirectoryPath + "/" + audioFileBase + fileExtension;
    setAudioFilePath(audioFilePath);
    await AudioRecorder.prepareRecordingAtPath(audioFilePath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: "Low",
      AudioEncoding: "aac",
      AudioEncodingBitRate: 32000,
      MeteringEnabled: true,
    });
  }

  async function pauseRecording() {
    try {
      setTimeout(async () => {
        await AudioRecorder.pauseRecording();
        setPlayerState(PLAYERSTATE.PAUSED);
      }, 500);
    } catch (error) {
      console.error("Recording Pause Error -- ", error);
    }
  }

  async function resumeRecording() {
    try {
      await AudioRecorder.resumeRecording();
      setPlayerState(PLAYERSTATE.RECORDING);
    } catch (error) {
      console.error("ERROR on resuming recording --", error);
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

  if (playerState === PLAYERSTATE.PAUSED) {
    return (
      <>
        <Icon
          size={100}
          name="fiber-manual-record"
          color="red"
          onPress={resumeRecording}
        />
        <Text style={styles.buttonLabelText}>Resume recording</Text>
      </>
    );
  }

  return (
    <View style={styles.buttonView}>
      <PatientTaskModal
        updateTextChange={setTitle}
        modalVisible={showTitleModal}
        title={title}
        closeModal={() => setShowTitleModal(false)}
        cancelFromModal={() => {
          setShowTitleModal(false);
          navigation.navigate("Home");
        }}
      />
      <Text>{title}</Text>
      <Icon
        size={100}
        name="fiber-manual-record"
        color="red"
        onPress={startRecording}
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
