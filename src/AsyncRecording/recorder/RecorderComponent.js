import React, { useState } from "react";
import { connect } from "react-redux";
import { Text, View, Alert, InputAccessoryView } from "react-native";
import { Button } from "react-native-paper";
import { Icon } from "react-native-elements";
import { AudioRecorder, AudioUtils } from "react-native-audio";
import VUMeter from "AsyncRecording/VUMeter";
import { v4 as uuid } from "uuid";
import { useDispatch } from "react-redux";
import {
  uploadNewJob,
  getMyJobs,
  setInAsyncRecording,
  setEndRecording,
} from "actions/jobActions";
import PatientTaskModal from "AsyncRecording/recorder/PatienTaskModal";
import RecordIcon from "./RecordIcon";
import Player from "./Player";

//TODO
//1. UI wise, how should this look?
//2. Start recording functionality - OK
//2.2 If playing, render stop button - OK
//2.3 If playing, render pause button - OK
//2.4 When paused, render Resume recording button - OK
//2.5 End recording functionality - OK
//3. File upload functionality - OK
//4. Some kind of call functionality?
//5. Delete functionality - OK
//6. If recording is paused, show player - OK
//7. Title entered modal? - OK

const PLAYERSTATE = {
  STOPPED: "STOPPED",
  RECORDING: "RECORDING",
  PLAYING: "PLAYING",
  PAUSED: "PAUSED",
};
Object.freeze(PLAYERSTATE);

const fileExtension = ".aac";

const RecorderComponent = ({
  navigation,
  user,
  isRecording,
  setInAsyncRecording,
  setEndRecording,
  titleR,
  audioFB,
  audioFP,
  playerStateR,
}) => {
  const [playerState, setPlayerState] = useState(
    playerStateR || PLAYERSTATE.STOPPED
  );
  const [decibels, setDecibels] = useState(-180);
  const [recordSecondsCounter, setRecordSecondsCounter] = useState(0);
  const [audioFilePath, setAudioFilePath] = useState(audioFP);
  const [audioFileBase, setAudioFileBase] = useState(audioFB);
  const [title, setTitle] = useState(titleR);
  const [showTitleModal, setShowTitleModal] = useState(!isRecording);
  const [infoStored, setInfoStored] = useState(false);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (isRecording) {
      setPlayerState(playerState);
      console.log(`RECORDER: ${title} ${audioFileBase} ${audioFilePath}`);
    }
  }, []);

  React.useEffect(() => {
    if (playerState !== PLAYERSTATE.STOPPED)
      dispatch(
        setInAsyncRecording({
          playerState: playerState, // PLAYERSTATE.RECORDING,
          title: title,
          audioFilePath: audioFilePath,
          audioFileBase: audioFileBase,
        })
      );
    setInfoStored(true);
  }, [playerState]);

  async function startRecording() {
    try {
      const audioFileBase = uuid();
      setAudioFileBase(audioFileBase);
      AudioRecorder.requestAuthorization().then(async () => {
        await prepareRecordingPath(audioFileBase);
        await AudioRecorder.startRecording();
        setPlayerState(PLAYERSTATE.RECORDING);
        console.log("Recording now");
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function endRecording() {
    await AudioRecorder.stopRecording();
    setPlayerState(PLAYERSTATE.STOPPED);
    prepareFileAndUpload();
    navigation.pop();
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
        userid: user.id,
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
    console.log(`AudioFilePath ${audioFilePath}`);
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

  function deleteAndStartOver() {
    Alert.alert(
      "Delete Recording",
      "Delete and start over!",
      [
        {
          text: "Delete",
          onPress: async () => {
            await AudioRecorder.stopRecording();
            setPlayerState(PLAYERSTATE.STOPPED);
          },
        },
        {
          text: "Cancel",
          onPress: () => console.log("Do Nothing... no delete"),
        },
      ],
      { cancelable: true }
    );
  }

  let content = (
    <View>
      <RecordIcon onPress={startRecording} labelText="Record" />
      <View style={{ marginTop: 50 }}>
        <Button
          raised
          mode="contained"
          theme={{ roundness: 3 }}
          onPress={() => navigation.pop()}
        >
          <Text>Cancel</Text>
        </Button>
      </View>
    </View>
  );

  if (playerState === PLAYERSTATE.RECORDING) {
    content = (
      <View style={styles.buttonView}>
        <VUMeter decibels={decibels} />
        <View
          style={{
            flexDirection: "row",
            marginTop: 50,
            flex: 1,
            justifyContent: "center",
            alignContent: "space-around",
          }}
        >
          <View style={{ flexDirection: "column", margin: 50 }}>
            <Icon size={100} name="stop" color="red" onPress={endRecording} />
            <Text style={styles.titleText}>Finish </Text>
            <Text style={styles.titleText}>Recording </Text>
          </View>
          <View style={{ flexDirection: "column", margin: 50 }}>
            <Icon
              size={100}
              name="pause"
              color="red"
              onPress={pauseRecording}
            />
            <Text style={styles.titleText}>Pause</Text>
          </View>
        </View>
      </View>
    );
  }

  if (playerState === PLAYERSTATE.PAUSED) {
    content = (
      <>
        <Player audioFileName={audioFilePath} />
        <RecordIcon labelText="Resume recording" onPress={resumeRecording} />
        <View style={styles.buttonView}>
          <Icon
            size={100}
            name="delete"
            color="red"
            onPress={deleteAndStartOver}
          />
          <Text style={styles.buttonLabelText}>Delete</Text>
        </View>
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
          dispatch(setEndRecording);
          navigation.navigate("Home");
        }}
      />
      <Text style={styles.titleText}>{title}</Text>
      {content}
    </View>
  );
};

const mapStateToProps = (state) => ({
  isRecording: state.jobs.isRecording,
  titleR: state.jobs.title,
  audioFB: state.jobs.audioFileBase,
  audioFP: state.jobs.audioFilePath,
  playerStateR: state.jobs.playerState,
  //currentTitle: state.jobs.currentTitle,
});
export default connect(mapStateToProps, {
  setInAsyncRecording,
  setEndRecording,
})(RecorderComponent);
const styles = {
  buttonView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  titleText: {
    fontSize: 36,
    fontWeight: "600",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    color: "#fff",
  },
  buttonLabelText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
  },
};
