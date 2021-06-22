import React from "react";
import { Text, View, ScrollView, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { connect } from "react-redux";
import { addMessage } from "../../state/liveCalls";
import { message } from "../../socketio/actions/liveCallSocket/";

import ChatBubble from "./ChatBubble";

const Chat = ({ messages, user, skywriter, addMessage }) => {
  const [messageList, setMessageList] = React.useState([]);

  React.useEffect(() => {
    const messageText = messages.map((m, idx) => (
      <ChatBubble key={idx} message={m} user={user} />
    ));
    //console.log(messageText);
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
          message: "Yohoho little dude",
        });
        addMessage({ message: "Yohoho little dude", sender: user });
      }}
    >
      <Text style={styles.dataElements}>Message </Text>
    </Button>
  );

  return (
    <View>
      <ScrollView>{messageList}</ScrollView>
      {messageButton}
    </View>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  messages: state.livecalls.messages,
});

export default connect(mapStateToProps, { addMessage })(Chat);
const styles = StyleSheet.create({
  dataElements: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 25,
  },
});
