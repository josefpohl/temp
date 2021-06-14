import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { connect } from "react-redux";
import {
  TwilioVideo,
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
} from "react-native-twilio-video-webrtc";
import {
  callCancelled,
  leaving,
  onLeaving,
} from "../../socketio/actions/liveCallSocket/";

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
  leavingCall,
}) => {
  const twilioRef = React.useRef(null);
  const [muted, setMuted] = React.useState(false);
  const [canCancel, setCanCancel] = React.useState(true);
  const [audioTracks, setAudioTracks] = React.useState(new Map());
  const [connected, setConnected] = React.useState(false);
  React.useEffect(() => {
    if (skywriter && roomname && callAccepted) {
      setCanCancel(false);
    }
  }, [skywriter, roomname, callAccepted]);

  React.useEffect(() => {
    if (!connected && canJoinRoom) {
      twilioRef.current.connect({
        accessToken: token,
        roomName: roomname,
        enableVideo: false,
      });

      setConnected(true);
    }
  }, [canJoinRoom, connected]);

  React.useEffect(() => {
    if (leavingCall) {
      twilioRef.current.disconnect();
      //save call
      navigation.pop();
    }
  }, [leavingCall]);
  const cancelButton = (
    <Button
      raised
      mode="contained"
      theme={{ roundness: 3 }}
      onPress={() => callCancelled(user, skywriter, "From Button", roomname)}
    >
      <Text style={styles.dataElements}>Cancel </Text>
    </Button>
  );

  const endCallButton = (
    <Button
      raised
      mode="contained"
      theme={{ roundness: 3 }}
      onPress={() =>
        leaving({
          sender: user,
          receiver: skywriter.userLoggedIn,
          terminatedBySender: true,
          from: "From Button",
          roomname,
        })
      }
    >
      <Text style={styles.dataElements}>End Call </Text>
    </Button>
  );

  const _onRoomDidConnect = (data) => {
    //{ roomName, error }
    console.log(`On Room Connected ${JSON.stringify(data)}`);
    console.log(
      `From room did connect ${data.roomName} ${data.roomSid} ${data.localParticipant.identity}`
    );
  };

  const _onRoomDidDisconnect = ({ roomName, error }) => {
    console.log(`Disconnect: ${roomName} Error ${JSON.stringify(error)}`);
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

  return (
    <View style={styles.splashContatiner}>
      <Text>In with {skywriter.userLoggedIn.name}</Text>
      {canCancel ? cancelButton : endCallButton}
      <Text>Welcome to the call...</Text>
      <TwilioVideoLocalView enabled={true} />
      <TwilioVideo
        ref={twilioRef}
        onRoomDidConnect={_onRoomDidConnect}
        onRoomDidDisconnect={_onRoomDidDisconnect}
        onRoomDidFailToConnect={_onRoomDidFailToConnect}
        onParticipantAddedAudioTrack={_onParticipantAddedAudioTrack}
        onParticipantDisabledAudioTrack={_onParticipantDisabledAudioTrack}
        onParticipantRemovedAudioTrack={_onParticipantRemovedAudioTrack}
      />
    </View>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  roomname: state.livecalls.roomname,
  callAccepted: state.livecalls.callAccepted,
  canJoinRoom: state.livecalls.canJoinRoom,
  leavingCall: state.livecalls.leavingCall,
});
export default connect(mapStateToProps, { callCancelled, leaving })(
  LiveCallInProgress
);
const styles = StyleSheet.create({
  splashContatiner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#b3b3b3",
  },
  dataElements: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 25,
  },
});
