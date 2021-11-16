import React from "react";
import { connect } from "react-redux";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../components/HomeComponents/HomeScreen";
import OtherScreen from "../components/HomeComponents/OtherScreen";
import RecordingScreen from "../AsyncRecording/RecordingScreen";
import JobScreen from "../components/JobComponents/JobScreen";
import LiveCallScreen from "../components/LiveCallComponents/LiveCallScreen";
import LoginForm from "../components/AuthComponents/LoginForm";
import Loading from "../components/common/Loading";
import SocketLoading from "../components/common/SocketLoading";

import Toast from "react-native-toast-message";

const HomeStack = createStackNavigator();
const HomeStackScreen = () => (
  <HomeStack.Navigator initialRouteName="Home">
    <HomeStack.Screen
      name="Home"
      component={HomeScreen}
      options={{ headerTitle: "Skywriter MD" }}
    />
    <HomeStack.Screen name="Jobs" component={JobScreen} />
    <HomeStack.Screen
      name="Recording"
      component={RecordingScreen}
      options={{ gestureEnabled: false, headerShown: false }}
    />
    <HomeStack.Screen
      name="LiveCall"
      component={LiveCallScreen}
      options={{ gestureEnabled: false, headerShown: false }}
    />
    <HomeStack.Screen name="Other" component={OtherScreen} />
  </HomeStack.Navigator>
);

const AuthStack = createStackNavigator();
const AuthStackScreen = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen name="Login" component={LoginForm} />
  </AuthStack.Navigator>
);
const Navigation = (props) => {
  return (
    <NavigationContainer>
      {
        props.loading ? (
          <Loading />
        ) : props.socketLoading ? (
          <SocketLoading step={props.socket} />
        ) : props.isAuthenticated ? (
          <HomeStackScreen />
        ) : (
          <AuthStackScreen />
        )
      }
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </NavigationContainer>
  );
};

const mapStateToProps = (state) => {
  return {
    socketLoading: state.auth.socketLoading,
    socket: state.auth.socket,
    isAuthenticated: state.auth.isAuthenticated,
    loading: state.auth.loading,
    inLiveCall: state.livecalls.inLiveCall,
  };
};

export default connect(mapStateToProps, {})(Navigation);
const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#aaa",
  },
});
