import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import {
  userConnected,
  onUserConnected,
} from "../socketio/actions/userConnected";
import { onUserDisconnected } from "../socketio/actions/userDisconnected";
import { disconnect, connect } from "../socketio/actions/connect";
import { getCurrentAvailable } from "../actions/availableActions";
import {
  onCallAccept,
  onMessage,
  onRoomInitiate,
  onSkywriterArrived,
  onLeaving,
  onLeftLiveCall,
  onInLiveCall,
  onTerminate,
  onCallReject,
  onAlert,
  onRoomConnect,
} from "../socketio/actions/liveCallSocket";
export default function AppStateListener() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);
    dispatch(connect());
    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      dispatch(connect());
      console.log("App has come to the foreground!");
      console.log(authState);
      AsyncStorage.getItem("user").then((user) => {
        if (user) {
          dispatch(userConnected(JSON.parse(user)));
          //re-initialize all other events...
          dispatch(onUserConnected());
          dispatch(onUserDisconnected());
          dispatch(onRoomInitiate());
          dispatch(onCallAccept());
          dispatch(onMessage());
          dispatch(onSkywriterArrived());
          dispatch(onLeaving());
          dispatch(onLeftLiveCall());
          dispatch(onInLiveCall());
          dispatch(onTerminate());
          dispatch(onCallReject());
          dispatch(onAlert());
          dispatch(onRoomConnect());
          console.log(`GET CURRENT AVAILABLES for ${user}`);
          dispatch(getCurrentAvailable(JSON.parse(user)));
        }
      });
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
