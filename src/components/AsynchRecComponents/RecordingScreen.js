import React from "react";
import { View, StyleSheet, Button, Text } from "react-native";
import { connect } from "react-redux";
import Toast from "react-native-toast-message";

const RecordingScreen = ({ navigation, user }) => {
  React.useEffect(() => {
    Toast.show({
      text1: "Wow",
      text2: "This is more really important text",
      autoHide: true,
      visibilityTime: 5000,
    });
  }, []);
  const buttonPress = () => {
    Toast.show({
      text1: "Why hello!",
      text2: "This would be an important message",
    });
  };

  return (
    <View style={styles.homeContainer}>
      <Text>Hello Recording Screen {user.name}</Text>
      <Text>Now with TOAST examples!!!</Text>
      <Button
        color="#fff"
        title="Go Home"
        onPress={() => {
          navigation.navigate("Home");
        }}
      />
      <Button
        color="#fff"
        title="Alert"
        onPress={() => {
          buttonPress();
        }}
      />
    </View>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, {})(RecordingScreen);

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
