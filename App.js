import React, { useState, useEffect } from "react";
// import { Root } from "native-base";
import MainRoute from "./src/routes/MainRoutes";

import axios from "./src/utils/AxiosInterseptorRequest";
import notifee, {
  EventType,
  IOSAuthorizationStatus,
} from "@notifee/react-native";
import { notifyLocalNotificationsService } from "./src/appComponents/notifiylocal";
import AsyncStorage from "@react-native-community/async-storage";

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;
  console.log(
    notification,
    " on bg event for android in app.js notifcation",
    pressAction,
    "pressAction"
  );
});

export default () => {
  const [loading, setLoading] = useState(true);
  // async function bootstrap() {
  //   const initialNotification = await notifee.getInitialNotification();

  //   if (initialNotification) {
  //     console.log(
  //       "Notification caused application to open",
  //       initialNotification.notification
  //     );
  //     console.log(
  //       "Press action used to open the app",
  //       initialNotification.pressAction
  //     );
  //   }
  // }

  // useEffect(() => {
  //   bootstrap()
  //     .then(() => setLoading(false))
  //     .catch(console.error);
  // }, []);

  // if (loading) {
  //   return null;
  // } else
  return <MainRoute />;
};
