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
  updateCall
} from "../../state/liveCalls";

import Chat from "./Chat";
import RNBeep from "react-native-a-beep";

const LiveCallInProgress = ({
  token,
  skywriter,
  user,
  roomname,
  isSender,
  callCancelled,
  callAccepted,
  canJoinRoom,
  leaving,
  callWillEnd,
  afterCallDisconnect,
  alert,
  notified,
  resetNotifyProvider,
  saveCall,
  updateCall,
  description,
  setRoomInformation,
  roomInfo,
  callAlreadyInProgress,
  livecalls,
  skywriterHasArrived,
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
  const [announcements, setAnnouncements] = React.useState("");
  const [subAnnouncements, setSubAnnouncements] = React.useState("");
  const [networkQuality, setNetworkQuality] = React.useState(5);
  const [callSuccessfulyConnected, seIsCallConnected] = React.useState(false);
  const [error, setError] = React.useState("");
  // added to control if call is cancel by provider [in the getting call information screen] or room not connected [in the error message screen]
  const [cancelControl, setCancelControl] = React.useState(0);
  // const [cancelTimeout, setCancelTimeout] = React.useState(false);
  let timer = null;

  // Notify if the call was accepted and if the Skywriter has arrived
  React.useEffect(() => {
    if (
      (skywriter &&
      roomname &&
      callAccepted &&
      audioConnected &&
      skywriterHasArrived &&
      connected &&
      callSuccessfulyConnected) || incomingCall
    ) {
      AsyncStorage.setItem("InLiveCall", "true");
      clearTimeout(timer);
      timer = null;
      setCanCancel(false);
    }

    if (callAccepted) {
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
    incomingCall,
    callSuccessfulyConnected
  ]);

  // A 10-second timer is triggered to cancel the call if is not answered
  React.useEffect(() => {
    let timerTO;
    if (!callAccepted) {
      timerTO = setTimeout(() => {
        setCancelReason("Timeout");
        setCancelledCall(true);
        Toast.show({
          text1: 'Cancelled',
          text2: 'The call was not answered.',
        });
      }, 10000);
    }
    return () => clearTimeout(timerTO);
  }, [callAccepted]);


  React.useEffect(() => {
    if (!callUUID) {
      callKeepEvents();
      const newCallUUID = uuid.v4();
      startCallKeep(newCallUUID, user.name);
      setCallUUID(newCallUUID);
    }
    return () => endCallKeep();
  }, []);

  // Set connection with twilio
  React.useEffect(() => {
    console.log('token --> ',token, ' roomname --> ',roomname);
    if (!connected && canJoinRoom && !callAlreadyInProgress
    && token && roomname) {
      setAnnouncements("Connecting to your call")
      twilioRef.current.connect({
        accessToken: token,
        roomName: roomname,
        enableNetworkQualityReporting: true,
      });
      seIsCallConnected(true);
      twilioRef.current.setLocalAudioEnabled(true); // enable audio
      setConnected(true);
      Toast.show({
        text1: 'Connected',
        text2: 'Your side has been connected to the call',
      });
    } else {
      /**
       * Add timer to let provider know that the app is doing something
       */
      setAnnouncements("Getting Call Information");
      setCancelControl(1); // call cancelled by provider
      setTimeout(() => {
        setSubAnnouncements("it's taking more than usual, please wait")
      }, 20000)

      /**
       * Trigger message to let the provider know that the call failed to connect
       */
      setTimeout(() => {
        setAnnouncements("");
        setSubAnnouncements("");
        setError("Error: Your side failed to connect to the call");
        setCancelControl(2); // room not connected
      }, 40000)
    }
  }, [
    canJoinRoom,
    connected,
    callAlreadyInProgress,
    roomname
  ]);

  React.useEffect(() => {
    if (!skywriterHasArrived) setAnnouncements("Waiting for skywriter")
  }, [skywriterHasArrived])

  React.useEffect(() => {
    console.log('callWillEnd', callWillEnd);
    if (callWillEnd) {
      twilioRef.current.disconnect();
      //save call
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

  /**
    Here we make sure that the call will be saved once:
    - The Skywriter exists and arrived
    - Room is connected
    - Check if the call hasn't been saved to avoid duplicates
    - The call was accepted
    - And the provider is already in call (as double check)
  **/
  React.useEffect(() => {
    if (skywriter &&
        skywriterHasArrived &&
        connected &&
        livecalls.callAccepted &&
        !livecalls.savedLiveCall &&
        livecalls.currentlyInLiveCall) {
      console.log('SAVE CALL METHOD SHOULD BE CALLED');
      let jobData = {};
      jobData.description = description;
      jobData.skywriter = skywriter.userLoggedIn._id
        ? skywriter.userLoggedIn._id
        : skywriter.id;
      jobData.provider = user._id ? user._id : user.id;
      jobData.roomInfo = roomInfo;
      jobData.lastModified = new Date().toISOString();
      saveCall(jobData, true);
    }
  }, [
    skywriter,
    livecalls,
    skywriterHasArrived,
    connected,
    callAlreadyInProgress
  ]);

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
      console.log("onEndCallAction", data);
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
      console.log("audioSessionActivated", data);
    });
  };

  const startCallKeep = (uuid, name) => {
    console.log(`Start call keep startCall`, uuid, name);
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
    twilioRef.current.setLocalAudioEnabled(muted).then((isEnabled) => {
      setMuted(!muted);
    });
  };

  // sets the cancel call reason
  const controlCallCancel = () => {
    if (cancelControl == 1) {
      setCancelReason("Cancelled by provider");
    } else if (cancelControl == 2) {
      setCancelReason("Room not connected");
    }
    setCancelledCall(true);
  };

  const cancelButton = (
    <View>
      {
        !error && (
          <ActivityIndicator
            animating={true}
            colors={Colors.white}
            size={"large"}
          />
        )
      }
      <Text style={{ fontSize: 36, color: "#fff", textAlign: "center" }}>{announcements}</Text>
      <Text style={{ fontSize: 25, color: "#fff", textAlign: "center" }}>{subAnnouncements}</Text>
      <Text style={{ fontSize: 35, color: "red" }}>{error}</Text>
      {callSuccessfulyConnected ? null : (
        <Button
          raised
          mode="contained"
          theme={{ roundness: 3 }}
          onPress={() => controlCallCancel()}
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
    console.log('_onRoomDidConnect roomName', roomName);
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
  };

  const _onRoomDidDisconnect = ({ roomName, error }) => {
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
    setError(JSON.stringify(error));
  };

  const _onParticipantAddedAudioTrack = ({ participant, track }) => {
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
    const audioTracksLocal = audioTracks;
    audioTracksLocal.delete(track.trackSid);

    setAudioTracks(audioTracksLocal);
  };

  const _onParticipantDisabledAudioTrack = ({ participant, track }) => {
    console.log("Disabled Audio Track --", participant, track);
  };

  const _onParticipantAddedVideoTrack = ({ participant, track }) => {
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
    const videoTracksLocal = videoTracks;
    videoTracksLocal.delete(track.trackSid);

    setVideoTracks(videoTracksLocal);
    setScreenShare(false);
    setShowScreenShare(!showScreenShare);
  };

  const _onNetworkLevelChanged = ({ participant, isLocalUser, quality }) => {
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
  callAccepted: state.livecalls.callAccepted,
  canJoinRoom: state.livecalls.canJoinRoom,
  rejectCall: state.livecalls.rejectCall,
  callWillEnd: state.livecalls.callWillEnd,
  notified: state.livecalls.notified,
  isSender: state.livecalls.isSender,
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
  updateCall,
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
