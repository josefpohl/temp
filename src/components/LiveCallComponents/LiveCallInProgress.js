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
import {
  Button,
  Modal,
  Portal,
  ActivityIndicator,
  Colors,
} from "react-native-paper";
import AsyncStorage from "@react-native-community/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { connect } from "react-redux";
import Toast from "react-native-toast-message";
import RNCallKeep from "react-native-callkeep";
import { v4 as uuid } from "uuid";
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

RNCallKeep.setup({
  ios: {
    appName: "SkywriterMDMobile",
  },
});

import {
  cancelCall,
  afterCallDisconnect,
  resetNotifyProvider,
  addMessage,
  setRoomInformation,
  saveCall,
  skywriterArrived,
} from "../../state/liveCalls";

import Chat from "./Chat";
import RNBeep from "react-native-a-beep";

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
  callAlreadyInProgress,
  livecalls,
  skywriterHasArrived,
  currentlyInLiveCall,
  incomingCall,
}) => {
  const twilioRef = React.useRef(null);
  const [muted, setMuted] = React.useState(false);
  const [canCancel, setCanCancel] = React.useState(!callAlreadyInProgress);
  const [cancelledCall, setCancelledCall] = React.useState(false);
  const [cancelReason, setCancelReason] = React.useState("From Button");
  const [audioTracks, setAudioTracks] = React.useState(new Map());
  const [videoTracks, setVideoTracks] = React.useState(new Map());
  const [connected, setConnected] = React.useState(false);
  const [screenShare, setScreenShare] = React.useState(false);
  const [showScreenShare, setShowScreenShare] = React.useState(false);
  const [callUUID, setCallUUID] = React.useState();
  const [audioConnected, setAudioConnected] = React.useState(false);
  const [announcements, setAnnouncements] = React.useState(
    "Connecting to your call"
  );
  const [networkQuality, setNetworkQuality] = React.useState(5);
  const [error, setError] = React.useState("");
  const [cancelTimeout, setCancelTimeout] = React.useState(false);
  let timer = null;
  React.useEffect(() => {
    console.log(
      `CALL BEING MADE INITIAL: callAccepted ${callAccepted} Audio ${audioConnected}, Sky Arrived ${skywriterHasArrived}`
    );
  }, []);
  React.useEffect(() => {
    console.log(
      `CALL BEING MADE: callAccepted ${callAccepted} Audio ${audioConnected}, Sky Arrived ${skywriterHasArrived}`
    );
    if (
      (skywriter &&
        roomname &&
        callAccepted &&
        audioConnected &&
        skywriterHasArrived &&
        connected) ||
      incomingCall
    ) {
      AsyncStorage.setItem("InLiveCall", "true");
      console.log(`CLEARING TIMEOUT ON LIVE CALL`);
      clearTimeout(timer);
      timer = null;
      setCanCancel(false);
    }

    if (callAccepted) {
      console.log(`LiveCallInProgress Call Accepted`);
      Toast.show({
        text1: "Call was accepted!",
        text2: `Skywriter ${skywriter.userLoggedIn.name} will be arriving shortly.`,
      });
    }

    if (skywriterHasArrived) {
      Toast.show({
        text1: "Skywriter has arrived!",
        text2: `We are joining your call.`,
      });
    }
  }, [
    skywriter,
    roomname,
    callAccepted,
    audioConnected,
    skywriterHasArrived,
    connected,
  ]);

  React.useEffect(() => {
    let timerTO;
    if (!callAccepted) {
      timerTO = setTimeout(() => {
        setCancelReason("Timeout");
        setCancelledCall(true);
        Toast.show({
          text1: `Cancelled`,
          text2: `Your side has failed to connect to the call`,
        });
      }, 10000);
    }
    return () => clearTimeout(timerTO);
  }, [callAccepted]);

  React.useEffect(() => {
    if (!callUUID) {
      console.log("CallKeep setup/Events called");
      callKeepEvents();
      const newCallUUID = uuid.v4();
      startCallKeep(newCallUUID, user.name);
      setCallUUID(newCallUUID);
    }
    return () => endCallKeep();
  }, []);

  React.useEffect(() => {
    console.log(
      `Connected: ${connected} and CanJoinRoom ${canJoinRoom} and In Progress ${callAlreadyInProgress}`
    );
    if (!connected && canJoinRoom && !callAlreadyInProgress) {
      twilioRef.current.connect({
        accessToken: token,
        roomName: roomname,
        enableNetworkQualityReporting: true,
      });
      //twilioRef.current.setLocalAudioEnabled(true);
      setConnected(true);
      console.log("Can now connect");
      Toast.show({
        text1: `Connected`,
        text2: `Your side has been connected to the call`,
      });
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
      callCancelled(user, skywriter.userLoggedIn, cancelReason, roomname);
      cancelCall();
    }
  }, [cancelledCall]);

  React.useEffect(() => {
    if (typeof notified !== "undefined" && notified !== null) {
      RNBeep.beep();
      Toast.show({
        text1: "ALERT!",
        text2: `${notified} needs your attention.`,
      });
    }
    resetNotifyProvider();
  }, [notified]);

  React.useEffect(() => {
    if (canPreSave && !callAlreadyInProgress) {
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

  const callKeepEvents = () => {
    RNCallKeep.addEventListener("answerCall", (data) => {
      let { callUUID } = data;
      console.log("onAnswerCallAction", callUUID);
    });
    RNCallKeep.addEventListener("didReceiveStartCallAction", (data) => {
      let { handle, callUUID, name } = data;
      console.log("didReceiveStartCallAction: ", handle, name, callUUID);
    });
    RNCallKeep.addEventListener("endCall", (data) => {
      console.log("onEndCallAction");
    });
    RNCallKeep.addEventListener("didDisplayIncomingCall", (data) => {
      let { error } = data;
      console.log("onIncomingCallDisplayed", error);
    });
    RNCallKeep.addEventListener("didPerformSetMutedCallAction", (data) => {
      let { muted, callUUID } = data;
      console.log("onToggleMute", muted, callUUID);
    });
    RNCallKeep.addEventListener("didToggleHoldCallAction", (data) => {
      let { hold, callUUID } = data;
      console.log("onToggleHold", hold, callUUID);
    });
    RNCallKeep.addEventListener("didPerformDTMFAction", (data) => {
      let { digits, callUUID } = data;
      console.log("onDTMFAction", digits, callUUID);
    });
    RNCallKeep.addEventListener("didActivateAudioSession", (data) => {
      console.log("audioSessionActivated");
    });
  };

  const startCallKeep = (uuid, name) => {
    console.log(`Start call keep startCall`);
    RNCallKeep.startCall(uuid, name, name);
  };

  endCallKeep = () => {
    console.log("EndCallKeep called");
    RNCallKeep.endCall(callUUID);
    RNCallKeep.removeEventListener("answerCall");
    RNCallKeep.removeEventListener("didReceiveStartCallAction");
    RNCallKeep.removeEventListener("endCall");
    RNCallKeep.removeEventListener("didDisplayIncomingCall");
    RNCallKeep.removeEventListener("didPerformSetMutedCallAction");
    RNCallKeep.removeEventListener("didPerformDTMFAction");
    RNCallKeep.removeEventListener("didActivateAudioSession");
  };

  const muteCall = () => {
    console.log(`Muted changes from ${muted} to ${!muted}`);
    twilioRef.current.setLocalAudioEnabled(muted).then((isEnabled) => {
      console.log(`Audio is now enabled: ${isEnabled}`);
      setMuted(!muted);
    });
  };

  const cancelButton = (
    <View>
      <ActivityIndicator
        animating={true}
        colors={Colors.white}
        size={"large"}
      />
      <Text style={{ fontSize: 36, color: "#fff" }}>{announcements}</Text>
      <Text style={{ fontSize: 35, color: "red" }}>{error}</Text>
      {callAccepted ? null : (
        <Button
          raised
          mode="contained"
          theme={{ roundness: 3 }}
          onPress={() => setCancelledCall(true)}
          style={styles.buttonStyle}
        >
          <Text style={styles.dataElements}>Cancel </Text>
        </Button>
      )}
    </View>
  );

  const endCallButton = (
    <Button
      raised
      mode="contained"
      theme={{ roundness: 3 }}
      style={styles.buttonStyle}
      onPress={() => {
        endCallKeep();
        leaving({
          sender: user,
          receiver: skywriter.userLoggedIn,
          terminatedBySender: isSender,
          from: "Button (IOS)",
          roomname,
        });
      }}
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
    const { roomName, error } = data;
    console.log(`On Room Connected ${roomName} ${JSON.stringify(error)}`);
    if (error) {
      setError(JSON.stringify(error));
    }
    //TODO set ROOM INFO AND TITLE
    let roomInfo = {
      participantSid: data.localParticipant.sid,
      roomSid: data.roomSid,
      participant: data.localParticipant.identity,
    };
    setRoomInformation(roomInfo);
    setAnnouncements("Waiting for skywriter");
  };

  const _onRoomDidDisconnect = ({ roomName, error }) => {
    console.log(`Disconnect: ${roomName} Error ${JSON.stringify(error)}`);
    setError(JSON.stringify(error));
    if (error) {
      Toast.show({
        text1: "ERROR DURING LIVE CALL",
        text2: `Please check your network connection.`,
      });
      endCallKeep();
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
    setError(JSON.stringify(error));
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
    setAudioConnected(true);
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

  const _onNetworkLevelChanged = ({ participant, isLocalUser, quality }) => {
    console.log(
      `Participant: ${JSON.stringify(
        participant
      )} ${isLocalUser} Quality ${JSON.stringify(quality)}`
    );

    if (isLocalUser && (quality === 1 || quality === 2)) {
      //RNBeep.beep();
      Toast.show({
        text1: `Network quality is poor.`,
        text2: `Your network connection is at a ${quality} out of 5. Please consult your local IT group.`,
      });
    }
    if (isLocalUser) {
      setNetworkQuality(quality);
    }
  };

  const getNetwork = () => {
    let modifier = "";
    if (networkQuality === 5 || networkQuality === 4) {
      modifier = "network-strength-4";
    } else if (networkQuality === 3) {
      modifier = "network-strength-3";
    } else if (networkQuality === 2) {
      modifier = "network-strength-2";
    } else if (networkQuality === 1) {
      modifier = "network-strength-1";
    } else if (networkQuality === 0) {
      modifier = "network-strength-outline";
    } else {
      modifier = "network-strength-off";
    }

    return (
      <Icon name={modifier} backgroundColor="#0E8AA5" color="#fff" size={25} />
    );
  };
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={"padding"}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.mainContatiner}>
          <View
            style={{
              justifyContent: "flex-end",
              alignItems: "flex-end",
              alignSelf: "flex-end",
              margin: 10,
              marginTop: 20,
              flexDirection: "row",
            }}
          >
            {getNetwork()}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTextStyle}>
              In Live Call with {skywriter.userLoggedIn.name}
            </Text>
            {canCancel ? null : (
              <Text style={{ fontSize: 35, color: "red" }}>{error}</Text>
            )}
          </View>
          <View style={styles.contentContainer}>
            {canCancel ? null : (
              <View style={styles.chatContainer}>
                <Chat skywriter={skywriter ? skywriter : null} />
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
            onNetworkQualityLevelsChanged={_onNetworkLevelChanged}
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
  currentlyInLiveCall: state.livecalls.currentlyInLiveCall,
  incomingCall: state.livecalls.incomingCall,
  livecalls: state.livecalls,
  skywriterHasArrived: state.livecalls.skywriterHasArrived,
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
