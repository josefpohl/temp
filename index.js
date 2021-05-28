/**
 * @format
 */

import { AppRegistry } from "react-native";
import { LogBox } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";

LogBox.ignoreLogs([
  "Module AudioRecorderManager requires main queue setup since it overrides",
]);

AppRegistry.registerComponent(appName, () => App);
