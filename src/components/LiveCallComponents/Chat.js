import React from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import { connect } from "react-redux";
import { addMessage } from "../../state/liveCalls";
import { message } from "../../socketio/actions/liveCallSocket/message";

import ChatBubble from "./ChatBubble";

const Chat = ({ messages, message, user, skywriter, addMessage }) => {
  const [messageList, setMessageList] = React.useState([]);
  const [outgoing, setOutgoing] = React.useState("");
  React.useEffect(() => {
    const messageText = messages.map((m, idx) => (
      <ChatBubble key={idx} message={m} user={user} />
    ));
    setMessageList(messageText);
  }, [messages]);
  const messageButton = (
    <Button
      raised
      mode="contained"
      theme={{ roundness: 3 }}
      onPress={() => {
        message({
          sender: user,
          receiver: skywriter.userLoggedIn,
          message: outgoing,
        });
        addMessage({ message: outgoing, sender: user });
        setOutgoing("");
      }}
      style={{ marginTop: 10, marginBottom: 5 }}
    >
      <Text style={styles.dataElements}>Send </Text>
    </Button>
  );

  return (
    <View style={styles.chatContainer}>
      <ScrollView>{messageList}</ScrollView>
      <TextInput
        placeholder="message"
        value={outgoing}
        onChangeText={(outgoing) => {
          setOutgoing(outgoing);
        }}
      />

      {messageButton}
    </View>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  messages: state.livecalls.messages,
});

export default connect(mapStateToProps, { message, addMessage })(Chat);
const styles = StyleSheet.create({
  dataElements: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 2,
  },
  chatContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  chatPanelChats: {
    flex: 5,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  chatEnter: {
    flex: 1,
    alignItems: "stretch",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: "#111",
  },
});
