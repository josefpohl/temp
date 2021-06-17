import "react-native-gesture-handler";
import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from "react-native";
import { Provider } from "react-redux";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import store from "./src/store";
import Navigation from "./src/navigation/navigation";
import AppStateListener from "./src/components/AppStateListener";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#346c7c",
    accent: "teal",
  },
};

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <AppStateListener />
        <Navigation />
      </PaperProvider>
    </Provider>
  );
}
