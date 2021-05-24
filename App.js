import "react-native-gesture-handler";
import React from "react";
import { Provider } from "react-redux";
import store from "./src/store";
import Navigation from "./src/navigation/navigation";
import AppStateListener from "./src/components/AppStateListener";

export default function App() {
  return (
    <Provider store={store}>
      <AppStateListener />
      <Navigation />
    </Provider>
  );
}
