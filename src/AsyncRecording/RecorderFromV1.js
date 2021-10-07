import React, { Component } from "react";
import { connect } from "react-redux";

import {
  Text,
  View,
  StyleSheet,
  Modal,
  TextInput,
  TouchableHighlight,
  Platform,
  Alert,
} from "react-native";
import { v4 as uuid } from "uuid";
import { titleChanged, uploadNewJob } from "../actions/jobActions";
import { Icon } from "react-native-elements";
import { AudioRecorder, AudioUtils } from "react-native-audio";
import Player from "./Player";
import { MicrophoneIcon } from "components/common/MicrophoneIcon";
import { ignoreIncomingCall, ignoreAllCalls } from "../actions/liveCallActions";
import IgnoreAcceptModal from "components/LiveCallComponents/IgnoreAcceptModal";

class RecordScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: true,
      titleEntered: false,
      hasPermission: undefined,
      isRecording: false,
      isRecordingPaused: false,
      playerVisible: false,
      recordSecondsCounter: 0.0,
      audioFileName: null,
      fileBasis: null,
      extension: "aac",
      isReset: false,
      showIncomingCallModal: false,
    };
  }
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("titleParam", "Record a dictation"),
      // headerRight: (
      //   <LogoutButton navigation={navigation.getParam("navigator")} />
      // ),
    };
  };

  generateUUID = () => {
    if (!this.state.fileBasis) {
      const uuidValue = uuid();
      this.setState({ fileBasis: uuidValue });
      return uuidValue;
    } else {
      return this.state.fileBasis;
    }
  };
  componentDidMount() {
    //const fileBase = this.generateUUID();
    //Stefan - not sure what this does, but it errors on it upon pasting
    //this.props.navigation.setParams({ navigator: this.props.navigation });
    this.prepRecorder();

    // this.props.socket.on(ROOM_CONNECT, () => {
    //   if (this.state.isRecording || this.state.isRecordingPaused) {
    //     console.log("ROOM_CONNECT IN RECORD SCREEN -- immediately ignore");
    //     //this.props.ignoreIncomingCall(true);
    //   } else {
    //     this.notifyOfIncomingCall();
    //     console.log("ROOM CONNECT IN RECORD SCREEN VIEW -- handle this");
    //   }
    // });
  }

  componentDidUpdate(prevProps) {
    if (
      !prevProps.livecalls.incoming_call_forward &&
      this.props.livecalls.incoming_call_forward
    ) {
      this.notifyOfIncomingCall();
      console.log("CDU in Record Screen incoming call");
    }

    if (
      !prevProps.livecalls.incoming_call_cancel &&
      this.props.livecalls.incoming_call_cancel
    ) {
      this.closeIncomingCallModal();
      console.log("CDU in Record Screen incoming call CANCELLED");
    }
  }

  // componentWillUnmount() {
  //   this.props.socket.off(ROOM_CONNECT);
  // }
  notifyOfIncomingCall = () => {
    this.setState({ modalVisible: false, showIncomingCallModal: true });
  };

  closeIncomingCallModal = () => {
    this.setState({ modalVisible: true, showIncomingCallModal: false });
  };

  closeIncomingCallModalAccept = () => {
    this.setState({
      showIncomingCallModal: false,
      modalVisible: false,
      titleEntered: true,
    });
  };
  renderIncomingCallModal = () => {
    if (this.state.showIncomingCallModal) {
      return (
        <IgnoreAcceptModal
          ignorePress={this.closeIncomingCallModal}
          acceptPress={this.closeIncomingCallModalAccept}
          message="Accepting will reset your title and content done so far."
        />
      );
    } else {
      return null;
    }
  };

  prepRecorder = () => {
    const fileBase = this.generateUUID();
    let filePath;

    if (!this.state.audioFileName) {
      //generate a uuid path name
      filePath =
        AudioUtils.DocumentDirectoryPath +
        "/" +
        fileBase +
        "." +
        this.state.extension;
      this.setState({ audioFileName: filePath });
    }
    AudioRecorder.requestAuthorization().then((isAuthorised) => {
      this.setState({ hasPermission: isAuthorised });

      if (!isAuthorised) return;

      this.prepareRecordingPath(filePath);

      AudioRecorder.onProgress = (data) => {
        this.setState({ recordSecondsCounter: Math.floor(data.currentTime) });
      };

      AudioRecorder.onFinished = (data) => {
        if (Platform.OS === "ios") {
          this.completeRecording(
            data.status === "OK",
            data.audioFileURL,
            data.audioFileSize
          );
        }
      };
    });
  };

  updateTextChanged = (text) => {
    this.props.titleChanged(text);
    //this.setState({ title: text });
  };

  closeModal = () => {
    if (this.props.title !== "") {
      this.setState({ modalVisible: false, titleEntered: true });
    }
  };

  cancelFromModal = () => {
    this.setState({ modalVisible: false, titleEntered: true });
    this.props.navigation.navigate("Home");
  };
  //Recorder information setup
  prepareRecordingPath = (audioPath) => {
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: "Low",
      AudioEncoding: "aac",
      AudioEncodingBitRate: 32000,
      // SampleRate: 44100.0,
      // Channels: 2,
      // AudioQuality: 'High',
      //AudioEncoding: 'ima4',
      //OutputFormat: 'mpeg_4'
      // AudioSource: 0
    });
  };

  startRecording = async () => {
    // start recording

    if (this.state.isRecording) {
      console.log("Can I disable this button, Already recording");
      return;
    }

    if (!this.state.hasPermission) {
      console.log("Permissions have not been granted to use audio");
      return;
    }
    this.props.ignoreAllCalls(true);
    // if (this.state.finishedRecording) {
    //   this.prepareRecordingPath(this.state.audioFileName);
    // }

    this.setState({
      isRecording: true,
      isRecordingPaused: false,
      finishedRecording: false,
    });

    try {
      const filePath = await AudioRecorder.startRecording();
    } catch (error) {
      console.error("Recording start error -- ", error);
    }
  };

  pauseRecording = async () => {
    if (!this.state.isRecording) {
      console.log("Can I disable this button, NOT CURRENTLY RECORDING");
      return;
    }

    try {
      setTimeout(async () => {
        const filePath = await AudioRecorder.pauseRecording();
        this.setState({
          isRecordingPaused: true,
        });
      }, 500);

      // this.loadPlayer();
    } catch (error) {
      console.log("Recording Pause Error -- ", error);
    }
    // switch to player view
  };

  resumeRecording = async () => {
    if (!this.state.isRecordingPaused) {
      console.log("Can this button be disabled, recording is not paused");
      return;
    }

    //Not sure why we are doing this, something with player functionality? - Stefan
    if (this.sound) {
      this.sound.release();
      this.sound = null;
    }

    try {
      await AudioRecorder.resumeRecording();
      this.setState({
        isRecordingPaused: false,
      });
    } catch (error) {
      console.log("ERROR on resuming recording --", error);
    }

    // switch to record view
    // record
  };

  endRecording = async (doUpload) => {
    this.setState({
      finishedRecording: true,
      isRecording: false,
      isRecordingPaused: false,
    });

    try {
      const filePath = await AudioRecorder.stopRecording();
      if (doUpload) {
        this.upload();
      }
      if (Platform.OS === "android") {
        this.completeRecording(true, filePath);
      }
      this.props.ignoreAllCalls(false);
      return filePath;
    } catch (error) {
      console.error(error);
    }
    // save recording
    // upload file
    // destroy recorder
  };

  completeRecording = (didSucceed, filePath, fileSize) => {
    if (didSucceed && !this.state.isReset) {
      this.props.navigation.navigate("Home");
    } else if (this.state.isReset) {
      this.setState({ isReset: false });
    }
  };

  deleteAndStartOver = () => {
    Alert.alert(
      "Delete Recording",
      "Delete and start over!!!!",
      [
        { text: "Delete", onPress: () => this.resetRecorder() },
        {
          text: "Cancel",
          onPress: () => console.log("Do Nothing... no delete"),
        },
      ],
      { cancelable: true }
    );
  };

  resetRecorder = () => {
    // end current recording
    this.endRecording(false);

    this.setState({ audioFileName: "", isReset: true }, () =>
      this.prepRecorder()
    );
    //reset file name
    //reset preparation
    // show modal, reset title (maybe leave text)
    this.setState({ modalVisible: true });
  };
  renderRecordButton = () => {
    if (this.state.isRecording) {
      return null;
    }
    return (
      <View style={styles.buttonView}>
        <Icon
          size={100}
          name="fiber-manual-record"
          disabled={!this.state.titleEntered}
          color="red"
          onPress={this.startRecording}
        />
        <Text style={styles.buttonLabelText}>Record</Text>
      </View>
    );
  };

  renderRecordPauseResumeButton = () => {
    if (!this.state.isRecording) {
      return null;
    } else if (this.state.isRecordingPaused) {
      //resume
      return (
        <View style={styles.buttonView}>
          <Icon
            size={100}
            name="fiber-manual-record"
            color="white"
            onPress={this.resumeRecording}
          />
          <Text style={styles.buttonLabelText}>Resume</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.buttonView}>
          <Icon
            size={100}
            name="pause"
            color="white"
            onPress={this.pauseRecording}
          />
          <Text style={styles.buttonLabelText}>Pause</Text>
        </View>
      );
    }
  };

  renderRecordEndButton = () => {
    if (this.state.isRecording) {
      return (
        <View style={styles.buttonView}>
          <Icon
            size={100}
            name="stop"
            color="red"
            onPress={this.endRecording}
          />
          <Text style={styles.buttonLabelText}>End</Text>
        </View>
      );
    }
  };

  renderDeleteButton = () => {
    if (this.state.isRecordingPaused) {
      return (
        <View style={styles.buttonView}>
          <Icon
            size={100}
            name="delete"
            color="red"
            onPress={this.deleteAndStartOver}
          />
          <Text style={styles.buttonLabelText}>Delete</Text>
        </View>
      );
    } else {
      return null;
    }
  };

  renderPlayer = () => {
    if (this.state.isRecordingPaused) {
      return <Player audioFileName={this.state.audioFileName} />;
    } else if (this.state.isRecording) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <MicrophoneIcon />
        </View>
      ); //<Icon size={100} name="mic" />;
    } else {
      return <Icon size={100} name="mic" color="white" />;
    }
  };

  upload = () => {
    const jobData = new FormData();
    const fileName = this.state.fileBasis + "." + this.state.extension;
    jobData.append("selectedFile", {
      uri: "file://" + this.state.audioFileName,
      name: fileName,
    });
    jobData.append("lastModified", new Date());
    jobData.append("name", fileName);
    jobData.append("description", this.props.title);
    jobData.append("type", "audio/" + this.state.extension);
    jobData.append("duration", this.state.recordSecondsCounter);
    this.props.uploadNewJob({
      jobData,
      audioFileName: this.state.audioFileName,
    });
  };

  render() {
    return (
      <View style={styles.fullPaneStyle}>
        {this.state.showIncomingCallModal && this.renderIncomingCallModal()}
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 25, fontWeight: "bold", color: "#fff" }}>
            {this.props.title}
          </Text>
        </View>
        <Modal
          animationType="fade"
          transparent
          onRequestClose={() => {}}
          visible={this.state.modalVisible}
          supportedOrientations={["landscape", "portrait"]}
        >
          <View style={styles.modalContentStyle}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeaderStyle}>
                <Text style={styles.modalHeaderText}>
                  Patient/Task Identification
                </Text>
              </View>
              <View style={styles.modalFormStyle}>
                <View style={styles.modalTextContainerStyle}>
                  <TextInput
                    style={styles.modalTextInputStyle}
                    onChangeText={(changedText) => {
                      this.updateTextChanged(changedText);
                    }}
                    autoFocus={true}
                    autoCorrect={false}
                    value={this.props.title}
                    placeholder="Add a patient or task identifier."
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  <TouchableHighlight
                    style={styles.submitCancelButton}
                    onPress={() => {
                      this.closeModal();
                    }}
                  >
                    <Text style={styles.submitCancelButtonText}>Save</Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    style={styles.submitCancelButton}
                    onPress={() => {
                      this.cancelFromModal();
                    }}
                  >
                    <Text style={styles.submitCancelButtonText}>Cancel</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </View>
        </Modal>
        <View style={styles.controlBoxPlayerStyle}>{this.renderPlayer()}</View>
        <View style={styles.controlBoxStyle}>
          {this.renderRecordButton()}

          {this.renderRecordPauseResumeButton()}
          {this.renderDeleteButton()}
          {this.renderRecordEndButton()}
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    title: state.jobs.title,
    livecalls: state.livecalls,
  };
};

export default connect(mapStateToProps, {
  titleChanged,
  uploadNewJob,
  ignoreIncomingCall,
  ignoreAllCalls,
})((props) => <RecordScreen {...props} />);

const styles = StyleSheet.create({
  fullPaneStyle: {
    flex: 1,
    backgroundColor: "#2b608a",
    justifyContent: "center",
    alignItems: "stretch",
  },
  controlBoxStyle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  controlBoxPlayerStyle: {
    flex: 1,
    backgroundColor: "#0E8AA5",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContentStyle: {
    flex: 1,

    backgroundColor: "rgba(0,0,0,.5)",
  },
  modalContainer: {
    flex: 1,
    marginTop: 100,
    marginBottom: 100,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: "#ffffff",
  },
  modalHeaderStyle: {
    height: 40,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#1BAFD9",
  },
  modalHeaderText: {
    fontSize: 24,
    fontWeight: "500",
    color: "#fff",
  },
  modalFormStyle: {
    flex: 1,
    paddingTop: 100,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#0E8AA5",
  },

  modalTextContainerStyle: {
    flexDirection: "row",
    height: 40,
  },
  modalTextInputStyle: {
    color: "#000",
    backgroundColor: "#ddd",
    paddingRight: 15,
    paddingLeft: 15,
    fontSize: 32,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#fff",
    marginLeft: 10,
    marginRight: 10,
    flex: 1,
    justifyContent: "flex-start",
    flexDirection: "row",
    position: "relative",
  },
  submitCancelButton: {
    backgroundColor: "#1BAFD9",
    margin: 30,
    borderRadius: 5,
  },
  submitCancelButtonText: {
    fontSize: 24,
    padding: 10,
    color: "#fff",
    fontWeight: "500",
  },
  buttonView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  buttonLabelText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
  },
});
