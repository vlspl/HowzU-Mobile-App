import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableHighlight,
  Image,
  ScrollView,
  ImageBackground,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { Container } from "native-base";
import Voice from "@react-native-voice/voice";
import { DrawerActions } from "@react-navigation/native";

import axios from "axios";
import Constants from "../utils/Constants";
import AsyncStorage from "@react-native-community/async-storage";
import { Header, Body, Left, Right, Icon, Input } from "native-base";
const screenWidth = Math.round(Dimensions.get("window").width);

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50
  },
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#FFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  action: {
    width: "100%",
    textAlign: "center",
    color: "white",
    paddingVertical: 8,
    marginVertical: 5,
    fontWeight: "bold"
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
    fontSize: 18,
    marginTop: 10
  },
  stat: {
    textAlign: "center",
    color: "#B0171F",
    marginBottom: 1,
    marginTop: 30
  }
});
const AudioScreen = ({ navigation }) => {
  // console.log(navigation);
  const [started, setStarted] = useState("");
  const [end, setEnd] = useState("");
  const [isstarted, setisMicStarted] = useState(false);

  const [pitch, setPitch] = useState("");

  const [error, setError] = useState("");

  const [partialResults, setPartialResults] = useState([]);
  const [speech, Setspeech] = useState("");
  const [results, setResults] = useState([]);
  const [userrole, Setuserrole] = useState("");
  const [hydrationdetailsexist, Sethydrationdetailsexist] = useState(false);
  const [curTime, SetcurTime] = useState(0);
  const [issec, Setsec] = useState(false);
  const [isLoading, setLoading] = useState(false);
  function onSpeechResults(e) {
    let sen = e.value[0].toLowerCase();
    console.log(sen.includes("medication"));
    let speech = e.value[0].toLowerCase().split(" ").slice(-1)[0];
    // let speech = e.value[0].toLowerCase().split(" ").slice(-1)[0];

    Setspeech(speech);
    console.log(
      "=====onSpeechResults:after recognisize  ",
      sen.includes("voice")
    );
    setResults(e.value);
    if (
      sen.includes("home") ||
      sen.includes("main") ||
      sen.includes("mainpage") ||
      sen.includes("dashboard") ||
      sen.includes("home screen") ||
      sen.includes("landing page")
    ) {
      navigation.navigate("PatientDashboard", {});
      setResults(e.value);
      setPartialResults(e.value);
      setTimeout(() => {
        _destroyRecognizer();
      }, 1000);
    } else if (sen.includes("close") || sen.includes("close drawer")) {
      navigation.dispatch(DrawerActions.closeDrawer());
      setResults(e.value);
      setPartialResults(e.value);
      // setTimeout(() => {
      //   _destroyRecognizer();
      // }, 1000);
    } else if (
      sen.includes("hamburger") ||
      sen.includes("menu") ||
      sen.includes("menus") ||
      sen.includes("drawer")
    ) {
      navigation.dispatch(DrawerActions.openDrawer());
      setResults(e.value);
      setPartialResults(e.value);
      // setTimeout(() => {
      //   _destroyRecognizer();
      // }, 1000);
    } else if (
      sen.includes("family") ||
      sen.includes("family member") ||
      sen.includes("add family member")
    ) {
      navigation.navigate("FamilyMemberList", { refresh: true });
      setResults(e.value);
      setPartialResults(e.value);
      setTimeout(() => {
        _destroyRecognizer();
      }, 1000);
    } else if (
      sen.includes("reschedule") ||
      sen.includes("rebooking") ||
      sen.includes("reschedule")
    ) {
      navigation.navigate("RescheduleAppoint", { refresh: true });
      setResults(e.value);
      setPartialResults(e.value);
      setTimeout(() => {
        _destroyRecognizer();
      }, 1000);
    } else if (
      sen.includes("booking") ||
      sen.includes("book") ||
      sen.includes("book a test") ||
      sen.includes("test booking") ||
      sen.includes("lab test")
    ) {
      navigation.navigate("ChooseBookingScreen", {});
      setResults(e.value);
      setPartialResults(e.value);
      setTimeout(() => {
        _destroyRecognizer();
      }, 1000);
    } else if (sen.includes("doctors") || sen.includes("doctor")) {
      navigation.navigate("MyDoctors", { refresh: true });
      setResults(e.value);
      setPartialResults(e.value);
      setTimeout(() => {
        _destroyRecognizer();
      }, 1000);
    } else if (sen.includes("shared reports") || sen.includes("shared")) {
      navigation.navigate("ShareReport", { refresh: true });
      setResults(e.value);
      setPartialResults(e.value);
      setTimeout(() => {
        _destroyRecognizer();
      }, 1000);
    } else if (
      sen.includes("upload manually") ||
      sen.includes("add old report") ||
      sen.includes("old report")
    ) {
      navigation.navigate("ReportManualPunch", { refresh: true });
      setResults(e.value);
      setPartialResults(e.value);
      setTimeout(() => {
        _destroyRecognizer();
      }, 1000);
    } else if (
      (sen.includes("voice") && sen.includes("report with the voice")) ||
      sen.includes("old report voice") ||
      sen.includes("report voice")
    ) {
      navigation.navigate("ReportPunchWithVoice", { refresh: true });
      setResults(e.value);
      setPartialResults(e.value);
      setTimeout(() => {
        _destroyRecognizer();
      }, 1000);
    } else if (
      (sen.includes("voice") == false && sen.includes("reports")) ||
      sen.includes("report") ||
      sen.includes("my report")
    ) {
      navigation.navigate("MyReports", { refresh: true });
      setResults(e.value);
      setPartialResults(e.value);
      setTimeout(() => {
        _destroyRecognizer();
      }, 1000);
    } else if (
      sen.includes("trend") ||
      sen.includes("trends") ||
      sen.includes("analysis")
    ) {
      navigation.navigate("CompareReportsList", { refresh: true });
      setResults(e.value);
      setPartialResults(e.value);
      setTimeout(() => {
        _destroyRecognizer();
      }, 1000);
    } else if (sen.includes("appointment") || sen.includes("appointments")) {
      navigation.navigate("Appointments", { refresh: true });
      setResults(e.value);
      setPartialResults(e.value);
      setTimeout(() => {
        _destroyRecognizer();
      }, 1000);
    } else if (sen.includes("suggested test") || sen.includes("suggested ")) {
      navigation.navigate("SuggestTest", { refresh: true });
      setResults(e.value);
      setPartialResults(e.value);
      setTimeout(() => {
        _destroyRecognizer();
      }, 1000);
    } else if (sen.includes("payment")) {
      navigation.navigate("PaymentHistory", { refresh: true });
      setResults(e.value);
      setPartialResults(e.value);
      setTimeout(() => {
        _destroyRecognizer();
      }, 1000);
    } else if (sen.includes("medication") || sen.includes("medicine")) {
      navigation.navigate("MedicationCalendrHome", { refresh: true });
      setResults(e.value);
      setPartialResults(e.value);
      setTimeout(() => {
        _destroyRecognizer();
      }, 1000);
    } else if (sen.includes("my health") || sen.includes("health diary")) {
      navigation.navigate("HealthDiary", { refresh: true });
      setResults(e.value);
      setPartialResults(e.value);
      setTimeout(() => {
        _destroyRecognizer();
      }, 1000);
    } else if (sen.includes("hydration") || sen.includes("water")) {
      HydrationNavigtion();
      console.log(hydrationdetailsexist, "hyhydrationdetailsexist");

      setResults(e.value);
      setPartialResults(e.value);
      setTimeout(() => {
        _destroyRecognizer();
      }, 1000);
    } else if (sen.includes("edit") || sen.includes("edit profile")) {
      editProfileScreen();
      setTimeout(() => {
        _destroyRecognizer();
      }, 1000);
      setResults(e.value);
      setPartialResults(e.value);
    } else if (sen.includes("profile")) {
      console.log("retrving data", userrole);
      setResults(e.value);
      setPartialResults(e.value);
      ProfileScreen();
      // navigation.navigate("UserProfile", { refresh: true, role: userrole });
    } else if (sen.includes("bmi")) {
      navigation.navigate("BMIGender", { refresh: true });
      setTimeout(() => {
        _destroyRecognizer();
      }, 1000);
      setResults(e.value);
      setPartialResults(e.value);
    } else if (sen.includes("blood pressure")) {
      navigation.navigate("BloodPressure", { refresh: true });
      setTimeout(() => {
        _destroyRecognizer();
      }, 1000);
      setResults(e.value);
      setPartialResults(e.value);
    } else if (sen.includes("oxygen")) {
      navigation.navigate("Oxygen", { refresh: true });
      setTimeout(() => {
        _destroyRecognizer();
      }, 1000);
      setResults(e.value);
      setPartialResults(e.value);
    } else if (
      sen.includes("body temperature") ||
      sen.includes("add temperature") ||
      sen.includes("record temperature") ||
      sen.includes("temperature") ||
      sen.includes("save temperature") ||
      sen.includes("add fever") ||
      sen.includes("record fever") ||
      sen.includes("fever")
    ) {
      navigation.navigate("Temprature", { refresh: true });
      setTimeout(() => {
        _destroyRecognizer();
      }, 1000);
      setResults(e.value);
      setPartialResults(e.value);
    } else if (sen.includes("about")) {
      navigation.navigate("About", { refresh: true });
      setTimeout(() => {
        _destroyRecognizer();
      }, 1000);
      setResults(e.value);
      setPartialResults(e.value);
    } else if (
      sen.includes("log out") ||
      sen.includes("logout") ||
      sen.includes("out")
    ) {
      console.log("======logout", sen);
      onPressLogoutYes();
      // navigation.navigate("About", { refresh: true });
      setResults(e.value);
      setPartialResults(e.value);
      setTimeout(() => {
        _destroyRecognizer();
      }, 1000);
    }
    // setTimeout(() => {
    //   _destroyRecognizer();
    // }, 1000);
  }
  function onSpeechStart(e) {
    console.log("onSpeechStart: ", e);
    setStarted("√");
    if (curTime) {
      clearInterval(SetcurTime(0));
    }
    setTimeout(() => {
      Setsec(true);
      _stopRecognizing();
    }, 3000);
  }
  function onSpeechEnd(e) {
    setisMicStarted(false);
    console.log("onSpeechEnd: ", e);
    // setEnd(e.error);
  }
  function onSpeechError(e) {
    console.log("onSpeechError: ", e);
    setError(e.value);
  }
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      retrieveData();
      _startRecognizing();
      onSpeechStart();
    });

    // function onSpeechPartialResults(e) {
    //   console.log("onSpeechPartialResults: ", e);
    //   setPartialResults(e.value);
    // }
    // function onSpeechVolumeChanged(e) {
    //   console.log("onSpeechVolumeChanged: ", e);
    //   setPitch(e.value);
    // }

    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    // Voice.onSpeechPartialResults = onSpeechPartialResults;
    // Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

    return () => {
      unsubscribe;
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const _startRecognizing = async () => {
    console.log(";_startRecognizing;;;////");
    setPitch("");
    setError("");
    setStarted("");
    setResults([]);
    setPartialResults([]);
    setEnd("");
    setisMicStarted(true);
    setLoading(true);
    Setsec(false);
    try {
      await Voice.start("en-US");
    } catch (e) {
      console.error(e);
    }
  };

  const _stopRecognizing = async () => {
    console.log("_________Stop====");
    setisMicStarted(false);
    setLoading(false);
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };
  const _cancelRecognizing = async () => {
    setisMicStarted(false);
    setLoading(false);
    //Cancels the speech recognition
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
    // error(e);
  };

  const _destroyRecognizer = async () => {
    console.log("Destroys the current SpeechRecognizer instance");
    setisMicStarted(false);
    setLoading(false);
    //Destroys the current SpeechRecognizer instance
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }

    setPitch("");
    setError("");
    setStarted("");
    setResults([]);
    setPartialResults([]);
    setEnd("");
  };
  const onPressLogoutYes = async () => {
    console.log(" token on logo]=t  ==============");

    try {
      response = await axios.post(Constants.FIREBASE_REGISTER_TOKEN + null);

      console.log("fcm token on logo]=t  ==============", response.data);
    } catch (errors) {
      //Toast.show("Something Went Wrong, Please Try Again Later");
      console.log(errors, "errors");
    }

    await AsyncStorage.removeItem(Constants.ACCOUNT_ROLE);
    await AsyncStorage.removeItem(Constants.TOKEN_KEY);
    await AsyncStorage.removeItem(Constants.USER_ROLE);
    await AsyncStorage.removeItem(Constants.USER_MOBILE);
    await AsyncStorage.removeItem(Constants.USER_NAME);

    // await AsyncStorage.removeItem('ActiveUser');
    await AsyncStorage.removeItem(Constants.REGISTRATION_STATUS);

    navigation.dispatch(DrawerActions.openDrawer());

    navigation.reset({
      index: 0,
      routes: [{ name: "LoginScreen" }]
    });
  };
  const retrieveData = async () => {
    // console.log(activebtrole, "**********Patent Dashboardcurrent role");
    setPitch("");
    setError("");
    setStarted("");
    setResults([]);
    setPartialResults([]);
    setEnd("");

    try {
      AsyncStorage.getItem(Constants.USER_ROLE).then((value) => {
        let valuelowrcase = value.toLowerCase();
        console.log(valuelowrcase, "valuelowrcase909097&*&*&*&*&*&");
        Setuserrole(valuelowrcase);
      });

      console.log(userrole, "909097&*&*&*&*&*&");
      const response = await axios.get(Constants.GET_HYDRATION_DETAILS);
      console.log("///////retrving data", response.data);
      if (response.data.Status) {
        console.log("retrving data");
        Sethydrationdetailsexist(true);
      } else {
        Sethydrationdetailsexist(false);
      }
    } catch (error) {}
  };
  const HydrationNavigtion = async () => {
    try {
      const response = await axios.get(Constants.GET_HYDRATION_DETAILS);
      console.log("///////retrving data", response.data);
      if (response.data.Status) {
        console.log("retrving data");
        Sethydrationdetailsexist(true);

        navigation.navigate("HydrationScreen", {
          refresh: true
        });
      } else {
        Sethydrationdetailsexist(false);
        navigation.navigate("HydGenderScreen", { refresh: true });
      }
    } catch (error) {}
  };
  const ProfileScreen = async () => {
    console.log("My Profile ");
    try {
      let val = await AsyncStorage.getItem(Constants.USER_ROLE);
      console.log(JSON.stringify(val), "val 909097&*&*&*&*&*&");

      // AsyncStorage.getItem(Constants.USER_ROLE).then((value) => {
      //   let valuelowrcase = value.toLowerCase();
      //   val = valuelowrcase;
      //   Setuserrole(valuelowrcase);
      // });

      // console.log(userrole, "909097&*&*&*&*&*&");
      if (val != null) {
        navigation.navigate("UserProfile", {
          refresh: true,
          role: val.toLocaleLowerCase()
        });
      }
    } catch (error) {
      console.log("ERR profile", error);
    }
  };
  const editProfileScreen = async () => {
    try {
      let val = await AsyncStorage.getItem(Constants.USER_ROLE);
      console.log(JSON.stringify(val), "val 909097&*&*&*&*&*&");
      if (val != null) {
        navigation.navigate("UserEditProfile", {
          refresh: true,
          role: val.toLocaleLowerCase()
        });
      }
    } catch (error) {
      console.log("Edit profile ERR profile", error);
    }
  };
  console.log(curTime, "curTime", isstarted, "isstarted", error);
  return (
    <Container>
      <Header
        androidStatusBarColor="#275BB4"
        noShadow
        style={{ backgroundColor: "#275BB4" }}
      >
        <ImageBackground
          source={require("../../icons/bg-all.png")}
          style={{ width: screenWidth, height: "100%", flexDirection: "row" }}
          resizeMode="contain"
        >
          <Left>
            <TouchableOpacity
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              style={{ padding: 5, marginLeft: 10 }}
            >
              <Image
                style={{ height: 25, width: 25 }}
                source={require("../../icons/menu.png")}
              ></Image>
            </TouchableOpacity>
          </Left>

          <Body>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
              >
                Speak
              </Text>
            </View>
          </Body>
          <Right>
            {/* <TouchableOpacity
              style={{ padding: 5 }}
              onPress={props.onPress}
            ></TouchableOpacity> */}
          </Right>
        </ImageBackground>
      </Header>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={styles.instructions}>
            Please Press mike to start Recognition
          </Text>
          <TouchableHighlight
            onPress={_startRecognizing}
            style={{ marginVertical: 20, marginTop: 120 }}
          >
            {isstarted ? (
              <Image
                style={{ height: 200, width: 200 }}
                source={require("../../icons/speackanim.gif")}
                // source={require("../../icons/microphone_ui_animation.gif")}

                // source={{
                //   uri: "https://raw.githubusercontent.com/AboutReact/sampleresource/master/microphone.png"
                // }}
              />
            ) : (
              <Image
                style={{ height: 200, width: 200 }}
                source={require("../../icons/voice.png")}
              />
            )}
          </TouchableHighlight>
          {/* {isstarted ? (
            <TouchableHighlight
              onPress={_startRecognizing}
              style={{ marginVertical: 20, marginTop: 120 }}
            >
              <Image
                style={{ height: 200, width: 200 }}
                source={require("../../icons/speackanim.gif")}
              />
            </TouchableHighlight>
          ) : (
            <TouchableHighlight
              onPress={_startRecognizing}
              style={{ marginVertical: 20, marginTop: 120 }}
            >
              <Image
                style={{ height: 200, width: 200 }}
                source={require("../../icons/voice.png")}
              />
            </TouchableHighlight>
          )} */}

          {isstarted && (
            <>
              <Text style={styles.stat}>try saying hydration reminder</Text>
            </>
          )}
          {/* {results.length <= 0 && issec && isstarted && (
            <>
              <Text style={styles.stat}>Didn't get that try again</Text>
              {_stopRecognizing}
            </>
          )} */}
          {results.length <= 0 && issec && (
            <>
              {/* {_stopRecognizing} */}
              <Text style={styles.stat}>
                Didn't get that try again,tap the mic
              </Text>
            </>
          )}
          <ScrollView style={{ marginBottom: 42 }}>
            {results.map((result, index) => {
              return (
                <Text key={`result-${index}`} style={styles.stat}>
                  {result}
                </Text>
              );
            })}
          </ScrollView>
          {/* <View
            style={{
              flexDirection: "row",
              alignItems: "space-between",
              position: "absolute",
              bottom: 0
            }}
          >
            <TouchableHighlight
              onPress={_stopRecognizing}
              style={{ flex: 1, backgroundColor: "#3012ae" }}
            >
              <Text style={styles.action}>Stop</Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={_cancelRecognizing}
              style={{ flex: 1, backgroundColor: "#3012ae" }}
            >
              <Text style={styles.action}>Cancel</Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={_destroyRecognizer}
              style={{ flex: 1, backgroundColor: "#3062ae" }}
            >
              <Text style={styles.action}>Destroy</Text>
            </TouchableHighlight>
          </View> */}
        </View>
      </SafeAreaView>
    </Container>
  );
};

export default AudioScreen;
