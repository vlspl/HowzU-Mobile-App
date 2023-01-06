import PushNotification from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { Platform } from "react-native";

class LocaNotificationService {
  configure = (onOpenNotification) => {
    PushNotification.configure({
      onRegister: function (token) {
        // PushNotificationIOS.requestPermissions({alert:true,sound:true,badge:false})
        // console.log("getting token localnotification service register", token);
      },
      onNotification: function (notification, props) {
        // console.log(
        //   "localnotification service register onnotification",
        //   JSON.stringify(notification)
        // );
        if (!notification?.data) {
          return;
        }
        // notification.userInteraction = true
        onOpenNotification(
          Platform.OS === "ios" ? notification.data : notification
        );

        //only call callback if not from foreground

        if (Platform.OS === "ios") {
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      },
      //IOS ONLY (optional) default :all _permission to resgister.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // popInitialNotification: false,
      popInitialNotification: true,

      requestPermissions: true,
    });
  };

  setPermissions = () => {
    PushNotificationIOS.requestPermissions({
      alert: true,
      sound: true,
      badge: false,
    });
  };

  createDefaultChannels() {
    PushNotification.createChannel(
      {
        channelId: "default-channel-id", // (required)
        channelName: `Default channel`, // (required)
        channelDescription: "A default channel", // (optional) default: undefined.
        soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      (created) =>
        console.log(`createChannel 'default-channel-id' returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
    PushNotification.createChannel(
      {
        channelId: "sound-channel-id", // (required)
        channelName: `Sound channel`, // (required)
        channelDescription: "A sound channel", // (optional) default: undefined.
        soundName: "sample.mp3", // (optional) See `soundName` parameter of `localNotification` function
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      (created) =>
        console.log(`createChannel 'sound-channel-id' returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
  }
  unregister = () => {
    PushNotification.unregister();
  };

  checkInitialNotification = () => {
    PushNotification.popInitialNotification((notification) => {
      // console.log(notification);
    });
  };

  showNotification = (id, title, message, data = {}, options = {}) => {
    // console.log("____calling+___");
    PushNotification.localNotification({
      ...this.buildAndroidNotification(id, title, message, data, options),

      //ios and android properties
      ...this.buildIOSNotification(id, title, message, data, options),

      //ios and android properties
      title: title || "",
      message: message || "",
      playSound: options.playSound || false,
      soundName: options.soundName || "default",
      userInteraction: false,
    });
  };

  buildAndroidNotification = (id, title, message, data = {}, options = {}) => {
    return {
      channelId: options.soundName ? "sound-channel-id" : "default-channel-id",
      id: id,
      autoCancel: true,
      largeIcon: options.largeIcon || "ic_launcher",
      smallIcon: options.smallIcon || "ic_notification",
      bigText: message || "",
      dubText: title || "",
      vibrate: options.vibrate || true,
      vibration: options.vibration || 300,
      priority: options.priority || "high",
      importance: options.importance || "high",
      data: data,
    };
  };

  buildIOSNotification = (id, title, message, data = {}, options = {}) => {
    return {
      alertAction: options.alertAction || "view",
      category: options.category || "",
      userInfo: {
        id: id,
        item: data,
      },
    };
  };

  cancelAllLocalNotifications = () => {
    if (Platform.OS === "ios") {
      PushNotificationIOS.removeAllDeliveredNotifications();
    } else {
      PushNotification.cancelAllLocalNotifications();
    }
  };

  removeAllDeliveredNotificationByID = (notificationId) => {
    // console.log(
    //   "__localnotificationservice removenotification by id",
    //   notificationId
    // );
    PushNotification.cancelAllLocalNotifications({ id: `${notificationId}` });
  };
}

export const localNotificationService = new LocaNotificationService();
