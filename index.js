/**
 * @format
 */

import { AppRegistry } from "react-native";
import React from "react";
import App from "./App";
import { name as appName } from "./app.json";
import { Text, TextInput } from "react-native";

import messaging from "@react-native-firebase/messaging";
import notifee, { EventType } from "@notifee/react-native";
import CalendarStrip from "react-native-calendar-strip";
// import {fcmService} from "../vls-react-native/src/appComponents/FCMservice";
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Message handled in the background!", remoteMessage);
});

if (Text.defaultProps == null) {
  Text.defaultProps = {};
  Text.defaultProps.allowFontScaling = false;
}

if (TextInput.defaultProps == null) {
  // TextInput.defaultProps = {};
  // TextInput.defaultProps.allowFontScaling = false;
  TextInput.defaultProps = {
    ...(TextInput.defaultProps || {}),
    allowFontScaling: false,
  };
}
<CalendarStrip shouldAllowFontScaling={false} />;
AppRegistry.registerComponent(appName, () => App);
