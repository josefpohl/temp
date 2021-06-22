import React from "react";
import { Text, View, StyleSheet } from "react-native";

export default ChatBubble = ({ message, user }) => {
  if (user.id === message.sender.id) {
    return (
      <View style={styles.outerWrapperRight}>
        <View style={styles.rightContainer}>
          <Text style={styles.nameText}>{message.sender.name}</Text>
          <Text style={styles.chatText}>{message.message}</Text>
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.outerWrapperLeft}>
        <View style={styles.leftContainer}>
          <Text style={styles.nameText}>{message.sender.name}</Text>
          <Text style={styles.chatText}>{message.message}</Text>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  leftContainer: {
    alignItems: "flex-start",
    marginBottom: 10,
    marginLeft: 5,
  },
  rightContainer: {
    alignItems: "flex-end",
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5,
  },
  outerWrapperLeft: {
    marginTop: 10,
    backgroundColor: "#A5D3DD",
    marginRight: 20,
    marginLeft: 2,
  },
  outerWrapperRight: {
    marginTop: 10,
    backgroundColor: "#A5D3DD",
    marginLeft: 20,
    marginRight: 2,
  },
  nameText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  chatText: {
    fontSize: 16,
  },
});
