import React from "react";
import { Platform } from "react-native";
import notifee, {
  RepeatFrequency,
  TimestampTrigger,
  TriggerType,
  EventType,
  IOSAuthorizationStatus,
  IOSNotificationSettings,
} from "@notifee/react-native";
import { doseStatus } from "../utils/AllSchemas";

class notifyLocalNotifications {
  constructor() {}
  registernotifee = (
    onOpenLocalNotification,
    onOpenKilledStateNotification
  ) => {
    this.createNotificationListeners(
      onOpenLocalNotification,
      onOpenKilledStateNotification
    );
  };

  createNotificationListeners = async (
    onOpenLocalNotification,
    onOpenKilledStateNotification
  ) => {
    notifee.onForegroundEvent(async ({ type, detail }) => {
      console.log(
        "type",
        type,
        " detail",
        detail,
        "onforeground event",
        "EventType.PRESS",
        EventType.PRESS
      );
      if (type == EventType.PRESS && Platform.OS == "ios") {
        onOpenLocalNotification(type, detail);
        await notifee.cancelNotification(detail.notification.id);
      } else if (
        type == EventType.PRESS &&
        Platform.OS == "android" &&
        detail.pressAction.id == "localandroidnotifcation"
      ) {
        console.log("On foreground events on android press the notifcation ");
        onOpenLocalNotification(type, detail);
        await notifee.cancelNotification(detail.notification.id);
      } else if (type == EventType.DISMISSED) {
        await notifee.cancelNotification(detail.notification.id);
      }
    });
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      console.log("OnBackgroundEvent", type, detail);
      const { notification, pressAction } = detail;
      onOpenLocalNotification(type, detail);
      await notifee.cancelNotification(detail.notification.id);
      // Check if the user pressed the "Mark as read" action
    });
    notifee.requestPermission({
      provisional: true,
      sound: true,
      alert: true,
      criticalAlert: true,
    });

    //when the applicstion is opened from a quite state
    notifee.getInitialNotification().then((notification) => {
      if (notification) {
        console.log(
          notification,
          "intial notifcatoin/////",
          EventType.ACTION_PRESS
        );
        onOpenKilledStateNotification(notification);
        
      }
    });
  };

  onCreateTriggerNotification = async (
    alrm,
    tab,
    time,
    MedicationId,
    Doseid,
    DoseStatusid,
    Platform
  ) => {
    console.log(
      "alrm",
      alrm,
      "tab",
      tab,
      "time",
      time,
      "MedicationId",
      MedicationId,
      "DoseStatusid",
      DoseStatusid,
      "doseStatus",
      doseStatus,
      "Platform",
      Platform
    );
    let currendate = new Date();
    let add1day;

    console.log(Doseid, DoseStatusid, MedicationId, "idsids");
    if (currendate < alrm) {
      add1day = alrm;
    } else {
      add1day = new Date(alrm);
      add1day.setDate(add1day.getDate() + 1);
    }
    console.log(add1day, "add1day****", add1day.getTime());

    const channelId = await notifee.createChannel({
      id: "default",
      name: "Default Channel",
      vibration: true,
      vibrationPattern: [300, 500],
    });
    // Create a time-based trigger
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: add1day.getTime(),
      repeatFrequency: RepeatFrequency.DAILY,
      alarmManager: true,
    };
    // cureenlt disable the categoreis for ios
    // await notifee.setNotificationCategories([
    //   {
    //     id: "medication",
    //     actions: [
    //       { id: "snooze", title: "Snooze" },
    //       {
    //         id: "take",
    //         title: "Take",
    //         foreground: false,
    //       },
    //       {
    //         id: "skip",
    //         title: "Skip",
    //         foreground: false,

    //         // Only show if device is unlocked
    //       },
    //     ],
    //   },
    // ]);
    Platform === "ios"
      ? await notifee.createTriggerNotification(
          {
            title: "notifee******Hi,it's time for your medication",
            body: "Take your " + tab + " med at " + time,
            data: {
              Type: "Local Notifaction",
              DoseInfo_Id: DoseStatusid.toString(),
              MedicationId: MedicationId.toString(),
              DoseInfo_MedicationId: Doseid.toString(),
              IsTaken: "",
              Tabletname: tab,
              Time: time,
            },
          },
          trigger
        )
      : await notifee.createTriggerNotification(
          {
            title: "notifee******Hi,it's time for your medication",
            body: "Take your " + tab + " med at " + time,
            data: {
              Type: "Local Notifaction",
              DoseInfo_Id: DoseStatusid.toString(),
              MedicationId: MedicationId.toString(),
              DoseInfo_MedicationId: Doseid.toString(),
              IsTaken: "",
              Tabletname: tab,
              Time: time,
            },
            android: {
              channelId: channelId,
              pressAction: {
                id: "localandroidnotifcation",
              },
              // actions: [
              //   {
              //     title: "Snooze",
              //     icon: "https://my-cdn.com/icons/snooze.png",
              //     pressAction: {
              //       id: "snooze",
              //       // mainComponent: "MedicationCalendrHome",
              //     },
              //   },
              //   {
              //     title: "Skip",
              //     icon: "https://my-cdn.com/icons/snooze.png",
              //     pressAction: {
              //       id: "skip",
              //       // mainComponent: "MedicationCalendrHome",
              //     },
              //   },
              //   {
              //     title: "Take",
              //     icon: "https://my-cdn.com/icons/snooze.png",
              //     pressAction: {
              //       id: "take",
              //       // mainComponent: "MedicationCalendrHome",
              //     },
              //   },
              // ],
            },
          },
          trigger
        );
  };
}

export const notifyLocalNotificationsService = new notifyLocalNotifications();
