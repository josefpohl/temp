import "react-native-gesture-handler";
import React from "react";
import { Provider } from "react-redux";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
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
    <SafeAreaProvider>
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <AppStateListener />
        <Navigation />
      </PaperProvider>
    </Provider>
    </SafeAreaProvider>

  );
}
