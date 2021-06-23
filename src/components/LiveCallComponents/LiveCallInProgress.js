import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Button, Modal, Portal } from "react-native-paper";
import { connect } from "react-redux";
import Toast from "react-native-toast-message";
import {
  TwilioVideo,
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
} from "react-native-twilio-video-webrtc";
import {
  callCancelled,
  leaving,
  onLeaving,
  alert,
  message,
} from "../../socketio/actions/liveCallSocket/";

import {
  cancelCall,
  afterCallDisconnect,
  resetNotifyProvider,
  addMessage,
  setRoomInformation,
  saveCall,
} from "../../state/liveCalls";

import Chat from "./Chat";
import { isEnabled } from "react-native/Libraries/Performance/Systrace";

const LiveCallInProgress = ({
  navigation,
  token,
  accepted,
  skywriter,
  user,
  roomname,
  provider,
  isSender,
  callCancelled,
  callAccepted,
  canJoinRoom,
  leaving,
  rejectCall,
  message,
  callWillEnd,
  afterCallDisconnect,
  alert,
  notified,
  resetNotifyProvider,
  messages,
  addMessage,
  canPreSave,
  saveCall,
  description,
  setRoomInformation,
  roomInfo,
}) => {
  const twilioRef = React.useRef(null);
  const [muted, setMuted] = React.useState(false);
  const [canCancel, setCanCancel] = React.useState(true);
  const [cancelledCall, setCancelledCall] = React.useState(false);
  const [audioTracks, setAudioTracks] = React.useState(new Map());
  const [videoTracks, setVideoTracks] = React.useState(new Map());
  const [connected, setConnected] = React.useState(false);
  const [screenShare, setScreenShare] = React.useState(false);
  const [showScreenShare, setShowScreenShare] = React.useState(false);
  const [saveable, setSaveable] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  React.useEffect(() => {
    if (skywriter && roomname && callAccepted) {
      setCanCancel(false);
    }
  }, [skywriter, roomname, callAccepted]);

  React.useEffect(() => {
    console.log(`Connected: ${connected} and CanJoinRoom ${canJoinRoom}`);
    if (!connected && canJoinRoom) {
      twilioRef.current.connect({
        accessToken: token,
        roomName: roomname,
      });
      //twilioRef.current.setLocalAudioEnabled(true);
      setConnected(true);
      console.log("Can now connect");
    }
  }, [canJoinRoom, connected]);

  React.useEffect(() => {
    if (callWillEnd) {
      console.log(`LEAVING due to `);
      twilioRef.current.disconnect();
      //save call
      //navigation.pop();
      afterCallDisconnect();
    }
  }, [callWillEnd]);

  React.useEffect(() => {
    if (cancelledCall) {
      console.log("Cancelled Call set");
      callCancelled(user, skywriter.userLoggedIn, "From Button", roomname);
      cancelCall();
    }
  }, [cancelledCall]);

  React.useEffect(() => {
    if (typeof notified !== "undefined" && notified !== null) {
      Toast.show({
        text1: "ALERT!",
        text2: `${notified} needs your attention.`,
      });
    }
    resetNotifyProvider();
  }, [notified]);

  React.useEffect(() => {
    if (canPreSave) {
      console.log(`SAVING CALL FROM LIVECALL IN PROGRESS -- PRE-SAVE`);
      //CONSIDER MOVING THIS TO HOOK
      let jobData = {};
      jobData.description = description;
      jobData.skywriter = skywriter.userLoggedIn._id
        ? skywriter.userLoggedIn._id
        : skywriter.id;
      jobData.provider = user._id ? user._id : user.id;
      jobData.roomInfo = roomInfo;
      jobData.lastModified = new Date().toISOString();
      saveCall(jobData, true); //set isPreSave
    }
  }, [canPreSave]);

  const muteCall = () => {
    console.log(`Muted changes from ${muted} to ${!muted}`);
    twilioRef.current.setLocalAudioEnabled(muted).then((isEnabled) => {
      console.log(`Audio is now enabled: ${isEnabled}`);
      setMuted(!muted);
    });
  };

  const cancelButton = (
    <Button
      raised
      mode="contained"
      theme={{ roundness: 3 }}
      onPress={() => setCancelledCall(true)}
      style={styles.buttonStyle}
    >
      <Text style={styles.dataElements}>Cancel </Text>
    </Button>
  );

  const endCallButton = (
    <Button
      raised
      mode="contained"
      theme={{ roundness: 3 }}
      style={styles.buttonStyle}
      onPress={() =>
        leaving({
          sender: user,
          receiver: skywriter.userLoggedIn,
          terminatedBySender: isSender,
          from: "From Button",
          roomname,
        })
      }
    >
      <Text style={styles.dataElements}>End Call </Text>
    </Button>
  );

  const alertButton = (
    <Button
      raised
      mode="contained"
      theme={{ roundness: 3 }}
      style={styles.buttonStyle}
      onPress={() =>
        alert({
          sender: user,
          receiver: skywriter.userLoggedIn,
        })
      }
    >
      <Text style={styles.dataElements}>Alert </Text>
    </Button>
  );
  const muteButton = (
    <Button
      raised
      mode="contained"
      theme={{ roundness: 3 }}
      onPress={() => muteCall()}
      style={styles.buttonStyle}
    >
      <Text style={styles.dataElements}>{muted ? "Unmute" : "Mute"}</Text>
    </Button>
  );

  const screenShareButton = (
    <Button
      raised
      mode="contained"
      theme={{ roundness: 3 }}
      onPress={() => setShowScreenShare(!showScreenShare)}
      style={styles.buttonStyle}
    >
      <Text style={styles.dataElements}>
        {showScreenShare ? "Hide Screen" : "Show Screen"}
      </Text>
    </Button>
  );
  const _onRoomDidConnect = (data) => {
    //{ roomName, error }
    console.log(`On Room Connected`);
    console.log(
      `From room did connect ${data.roomName} ${data.roomSid} ${data.localParticipant.identity} ${data.localParticipant.sid}`
    );
    //TODO set ROOM INFO AND TITLE
    let roomInfo = {
      participantSid: data.localParticipant.sid,
      roomSid: data.roomSid,
      participant: data.localParticipant.identity,
    };
    setRoomInformation(roomInfo);
  };

  const _onRoomDidDisconnect = ({ roomName, error }) => {
    console.log(`Disconnect: ${roomName} Error ${JSON.stringify(error)}`);
    if (error) {
      Toast.show({
        text1: "ERROR DURING LIVE CALL",
        text2: `Please check your network connection.`,
      });
      leaving({
        sender: user,
        receiver: skywriter.userLoggedIn,
        terminatedBySender: false,
        from: "On Error",
        roomname,
        error: true,
      });
    }
  };
  const _onRoomDidFailToConnect = (error) => {
    console.log("[FailToConnect]ERROR: ", error);
  };

  const _onParticipantAddedAudioTrack = ({ participant, track }) => {
    console.log("onParticipantAddedAudioTrack: ", participant, track);

    setAudioTracks(
      new Map([
        ...audioTracks,
        [
          track.trackSid,
          { participantSid: participant.sid, audioTrackSid: track.trackSid },
        ],
      ])
    );
  };

  const _onParticipantRemovedAudioTrack = ({ participant, track }) => {
    console.log("onParticipantRemovedAudioTrack: ", participant, track);

    const audioTracksLocal = audioTracks;
    audioTracksLocal.delete(track.trackSid);

    setAudioTracks(audioTracksLocal);
  };

  const _onParticipantDisabledAudioTrack = ({ participant, track }) => {
    console.log("Disabled Audio Track --", participant, track);
  };

  const _onParticipantAddedVideoTrack = ({ participant, track }) => {
    console.log("Remote participant adding video track", participant, track);
    setVideoTracks(
      new Map([
        ...videoTracks,
        [
          track.trackSid,
          {
            enabled: false,
            participantSid: participant.sid,
            videoTrackSid: track.trackSid,
          },
        ],
      ])
    );
    setScreenShare(true);
    setShowScreenShare(true);
  };

  const _onParticipantRemovedVideoTrack = ({ participant, track }) => {
    console.log("Remote participant Removing video track", participant, track);
    const videoTracksLocal = videoTracks;
    videoTracksLocal.delete(track.trackSid);

    setVideoTracks(videoTracksLocal);
    setScreenShare(false);
    setShowScreenShare(!showScreenShare);
  };
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={"padding"}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.mainContatiner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTextStyle}>
              In Live Call with {skywriter.userLoggedIn.name}
            </Text>
          </View>
          <View style={styles.contentContainer}>
            {canCancel ? null : (
              <View style={styles.chatContainer}>
                <Chat skywriter={skywriter} />
              </View>
            )}
            <View style={styles.buttonContainer}>
              {canCancel ? cancelButton : endCallButton}
              {canCancel ? null : alertButton}
              {canCancel ? null : muteButton}
              {canCancel ? null : screenShare ? screenShareButton : null}
            </View>
          </View>
          <TwilioVideoLocalView enabled={true} />

          {Array.from(videoTracks, ([trackSid, trackIdentifier]) => {
            return (
              <View key={trackSid}>
                <Portal>
                  <Modal
                    visible={showScreenShare}
                    onDismiss={() => setShowScreenShare(false)}
                    contentContainerStyle={styles.modalContainerStyle}
                  >
                    <View
                      key={trackSid}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <View style={styles.modalHeader}>
                        <Button
                          raised
                          mode="contained"
                          theme={{ roundness: 3 }}
                          onPress={() => setShowScreenShare(false)}
                        >
                          <Text style={styles.dataElements}>Hide Screen </Text>
                        </Button>
                      </View>
                      <View>
                        <TwilioVideoParticipantView
                          style={styles.remoteVideo}
                          scaleType={"fit"}
                          key={trackSid}
                          trackIdentifier={trackIdentifier}
                          enabled={true}
                        />
                      </View>
                    </View>
                  </Modal>
                </Portal>
              </View>
            );
          })}

          <TwilioVideo
            ref={twilioRef}
            autoInitializeCamera={false}
            onRoomDidConnect={_onRoomDidConnect}
            onRoomDidDisconnect={_onRoomDidDisconnect}
            onRoomDidFailToConnect={_onRoomDidFailToConnect}
            onParticipantAddedAudioTrack={_onParticipantAddedAudioTrack}
            onParticipantDisabledAudioTrack={_onParticipantDisabledAudioTrack}
            onParticipantRemovedAudioTrack={_onParticipantRemovedAudioTrack}
            onParticipantAddedVideoTrack={_onParticipantAddedVideoTrack}
            onParticipantRemovedVideoTrack={_onParticipantRemovedVideoTrack}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
//autoInitializeCamera={false}
const mapStateToProps = (state) => ({
  user: state.auth.user,
  roomname: state.livecalls.roomname,
  callAccepted: state.livecalls.callAccepted,
  canJoinRoom: state.livecalls.canJoinRoom,
  rejectCall: state.livecalls.rejectCall,
  callWillEnd: state.livecalls.callWillEnd,
  notified: state.livecalls.notified,
  messages: state.livecalls.messages,
  isSender: state.livecalls.isSender,
  canPreSave: state.livecalls.canPreSave,
  description: state.livecalls.description,
  roomInfo: state.livecalls.roomInfo,
});
export default connect(mapStateToProps, {
  callCancelled, //socket
  leaving,
  cancelCall, //redux
  afterCallDisconnect,
  alert,
  resetNotifyProvider,
  message,
  addMessage,
  saveCall,
  setRoomInformation,
})(LiveCallInProgress);
const styles = StyleSheet.create({
  mainContatiner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: "#b3b3b3",
  },
  contentContainer: {
    flexDirection: "row",
    flex: 8,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: "#999",
  },
  dataElements: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 25,
  },
  remoteVideo: {
    width: Dimensions.get("window").width - 50,
    height: Dimensions.get("window").height - 150,
  },
  modalHeader: { flexDirection: "row" },
  modalHeaderText: {
    fontSize: 25,
    color: "black",
    fontWeight: "bold",
  },
  modalContainerStyle: { backgroundColor: "white", padding: 20 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignContent: "space-around",
  },
  buttonStyle: {
    margin: 10,
  },
  headerTextStyle: {
    fontSize: 36,
    fontWeight: "bold",

    color: "black",
  },
  callContainer: {
    flex: 1,
    marginTop: 50,
    flexDirection: "column",
    alignSelf: "stretch",
  },
  buttonContainer: {
    flex: 3,
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
  },
});
