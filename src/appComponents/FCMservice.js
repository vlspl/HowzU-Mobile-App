import React from "react";
import messaging from "@react-native-firebase/messaging";
import { Platform } from "react-native";

class FCMService {
  register = (onRegister, onNotification, onOpenNotification) => {
    this.checkPermission(onRegister);
    this.createNotificationListeners(
      onRegister,
      onNotification,
      onOpenNotification
    );
  };

  registerAppWithFCM = async () => {
    if (Platform.OS === "ios") {
      // await messaging().registerDeviceForRemoteMessages();
      await messaging().setAutoInitEnabled(true);
    }
  };

  checkPermission = (onRegister) => {
    messaging()
      .hasPermission()
      .then((enabled) => {
        if (enabled) {
          // console.log("==...==", enabled);
          //user has permissions
          this.getToken(onRegister);
        } else {
          //user dont bhav permissions
          this.requestPermission(onRegister);
        }
      })
      .catch((error) => {
        // console.log("[FCMService] Permisson rejected ", error);
      });
  };

  getToken = (onRegister) => {
    // console.log("---1");
    messaging()
      .getToken()
      .then((fcmToken) => {
        console.log("---token---", fcmToken);
        if (fcmToken) {
          onRegister(fcmToken);
        } else {
          console.log("user dontb hjave device token");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  requestPermission = (onRegister) => {
    messaging()
      .requestPermission()
      .then(() => {
        this.getToken(onRegister);
      })
      .catch((error) => {
        // console.log("dd", error);
      });
  };

  deleteToken = () => {
    // console.log("===,delete token");
    messaging()
      .deleteToken()
      .catch((error) => {
        // console.log("000,", error);
      });
  };

  createNotificationListeners = (
    onRegister,
    onNotification,
    onOpenNotification
  ) => {
    //when application is running but in background

    messaging().onNotificationOpenedApp((remoteMessage) => {
      // console.log(
      //   "when application is running but in background-----",
      //   remoteMessage
      // );
      if (remoteMessage) {
        const notification = remoteMessage.notification;
        onOpenNotification(remoteMessage);
      }
    });

    //when the applicstion is opened from a quite state
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          const notification = remoteMessage.notification;
          console.log(
            "when the applicstion is opened from a quite state--------",
            remoteMessage
          );
          onOpenNotification(remoteMessage);
          // if (Platform.OS === "android") {
          //   onNotification(remoteMessage, true);
          // }
        }
      });

    //foreground state message
    this.messageListener = messaging().onMessage(async (remoteMessage) => {
      // console.log("FOreground State *", remoteMessage);
      if (remoteMessage) {
        // let notification = null
        // if (Platform.OS === "ios") {
        //     notification = remoteMessage.notification
        // }
        // else {
        //     notification = remoteMessage.notification
        // }
        onNotification(remoteMessage, false);
      }
    });

    //Trigger when have new token
    messaging().onTokenRefresh((fcmToken) => {
      //  console.log("___onTokenRef");
      onRegister(fcmToken);
    });
  };

  unRegister = () => {
    this.messageListener();
  };
}

export const fcmService = new FCMService();
