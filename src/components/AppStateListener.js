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
import {
  logoutUser,
  userLoadingComplete,
} from "../actions/authenticationActions";

import {
  showSocketLoading,
  showSocketReconnect,
  showSocketFailed,
  hideSocketLoading
} from "../actions/socketActions";

import Toast from "react-native-toast-message";

export default function AppStateListener() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const liveCallState = useSelector((state) => state.livecalls);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('useEffect liveCallState', liveCallState);
    AppState.addEventListener("change", _handleAppStateChange);
    dispatch(connect());
    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  useEffect(() => {
    async function getSocket() {
      const value = await AsyncStorage.getItem("socketId");

      if (value !== null) {
        dispatch(hideSocketLoading());
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
        AsyncStorage.getItem("user").then((user) => {
          dispatch(getCurrentAvailable(JSON.parse(user)));
        });
      } else {
        if (count == 2) {
          dispatch(showSocketReconnect());
          dispatch(connect());

          setTimeout(() => {
            AsyncStorage.getItem("user").then((user) => {
              dispatch(userConnected(JSON.parse(user)));
            });
            dispatch(onUserConnected(2));
            setCount(count + 1);
          }, 40000);
        } else {
          dispatch(showSocketFailed());
          AsyncStorage.getItem("user").then((user) => {
            dispatch(logoutUser(user));
          });
        }
      }
    }
    
    if (count > 0 && (count < 3 && authState.isAuthenticated) || count == 2) {
      if (count == 2) {
        setTimeout(() => {
          getSocket();
        }, 1000);
      } else {
        getSocket();
      }
    }
  }, [count]);

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      AsyncStorage.getItem("InLiveCall").then((value) => {
        if (value !== "true") {
          AsyncStorage.getItem("user").then((user) => {
            if (user) {
              AsyncStorage.getItem("inactiveTime").then((time) => {
                const now = new Date().getTime();
                const inactive = Number.parseInt(time);
                const diff = now - inactive;
                if (diff > (60 * 1000 * 15)) {
                  dispatch(logoutUser(JSON.parse(user)));
                  Toast.show({
                    text1: "Idle time log out",
                    text2:
                      "You were inactive for a time that exceeded 15 minutes.",
                  });
                  dispatch(userLoadingComplete());
                } else {
                  dispatch(showSocketLoading());
                  dispatch(connect());
                  dispatch(userConnected(JSON.parse(user)));
                  dispatch(onUserConnected(2));

                  setCount(count + 2);
                  //re-initialize all other events...
                  /*dispatch(onUserDisconnected());
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
                  dispatch(getCurrentAvailable(JSON.parse(user)));*/
                  // dispatch(userLoadingComplete()); this is not included
                }
              });
            }
          });
        }
      });
    }

    if (
      appState.current.match(/active/) &&
      nextAppState.match(/inactive|background/)
    ) {
      AsyncStorage.getItem("InLiveCall").then((value) => {
        if (value !== "true") {
          console.log(`Not in live call`);
          AsyncStorage.setItem("inactiveTime", new Date().getTime().toString());
          dispatch(disconnect());
          AsyncStorage.removeItem("socketId");
          setCount(0);
        }
      });
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
  };

  return null;
}
