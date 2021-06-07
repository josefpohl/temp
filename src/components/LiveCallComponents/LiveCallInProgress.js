import React from "react";
import { Text, View, Button, StyleSheet } from "react-native";
import {
  TwilioVideo,
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
} from "react-native-twilio-video-webrtc";

const LiveCallInProgress = ({
  token,
  accepted,
  skywriter,
  roomname,
  provider,
  isSender,
}) => {
  const [muted, setMuted] = React.useState(false);

  return (
    <View>
      <Text>In with {skywriter.userLoggedIn.name}</Text>

      <TwilioVideo />
    </View>
  );
};

export default LiveCallInProgress;
