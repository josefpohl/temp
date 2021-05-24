import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import {
  userConnected,
  onUserConnected,
} from "../socketio/actions/userConnected";
import { disconnect } from "../socketio/actions/connect";

export default function AppStateListener() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground!");
      dispatch(onUserConnected());
      console.log(authState);
      AsyncStorage.getItem("user").then((user) =>
        dispatch(userConnected(JSON.parse(user)))
      );
    }

    if (
      appState.current.match(/active/) &&
      nextAppState.match(/inactive|background/)
    ) {
      dispatch(disconnect());
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    console.log("AppState", appState.current);
  };

  return null;
}
