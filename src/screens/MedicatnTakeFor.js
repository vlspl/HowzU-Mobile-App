import React from "react";

import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Platform,
  BackHandler,
  NativeModules,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { Container, Header } from "native-base";
import CustomFooter from "../appComponents/CustomFooter";
import PatientdashboardComp from "../appComponents/PatientdashboardComp";
import DoctordashboardComp from "../appComponents/DoctordashboardComp";
import AsyncStorage from "@react-native-community/async-storage";
import Constants from "../utils/Constants";
import Loader from "../appComponents/loader";
import ActionButton from "react-native-action-button";
import Toast from "react-native-tiny-toast";

const screenWidth = Math.round(Dimensions.get("window").width);
const { StatusBarManager } = NativeModules;

function StatusBarPlaceHolder() {
  return (
    <View
      style={{
        width: "100%",
        height: Platform.OS === "ios" ? StatusBarManager.HEIGHT : 0,
        backgroundColor: "#275BB4"
      }}
    >
      <StatusBar barStyle="light-content" />
    </View>
  );
}

export default class MedicatnTakeFor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activebtn: "doctor",
      userrole: "",
      isloading: false,
      tabName: "",
      takeFor: "",
      isErr: false,
      forwhome: "",
      selectedtcolor: ""
    };
  }

  retrieveData() {
    AsyncStorage.getItem(Constants.USER_ROLE).then((value) => {
      let valuelowrcase = value.toLowerCase();
      // console.log('Role Dashboard screen ==================', valuelowrcase);
      this.setState({
        userrole: valuelowrcase,
        activebtn: valuelowrcase == "doctor" ? "doctor" : "patient",
        isloading: true
      });
      //  this.setState({activebtn:valuelowrcase == 'doctor'?'doctor':'patient'})
      //   this.setState({
      //     isloading: true
      //   });
    });
  }

  OpenDrawer = () => {
    this.props.navigation.goBack();
  };

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    console.log(
      " MedTakeFor componentWillReceiveProps==============================",
      nextProp.route.params
    );
    this.setState(
      {
        tabName: nextProp.route.params.tabName,
        forwhome: nextProp.route.params.forwhome,
        selectedtcolor: nextProp.route.params.color
      },
      () => {}
    );
  };

  componentDidMount = async () => {
    console.log(
      " MedTakeFor componentWillReceiveProps==============================",
      this.props.route.params
    );
    this.setState(
      {
        tabName: this.props.route.params.tabName,
        forwhome: this.props.route.params.forwhome,
        selectedtcolor: this.props.route.params.color
      },
      () => {}
    );
  };

  hardwarebBackAction = () => {
    this.props.navigation.goBack();
    return true;
  };
  componentWillUnmount = () => {
    // this.backHandler.remove();
  };
  // onPressPatientView = () => {
  //   this.setState({ activebtn: 'patient'}, () => {
  //     this.saveData();
  //   });
  //   console.log('onPressPatientView=================')

  // }

  // onPressMyDoctorView = () => {
  //   this.setState({ activebtn: 'doctor'}, () => {
  //     this.saveData();
  //   });
  //   console.log('onPressMyDoctorView=================')
  // }

  saveData = async () => {
    if (this.state.takeFor == "") {
      Toast.show("What are you taking it for?");
    } else {
      try {
        this.props.navigation.navigate("MedicineStrenth", {
          forwhome: this.state.forwhome,
          tabName: this.state.tabName,
          takeFor: this.state.takeFor,
          color: this.state.selectedtcolor
        });
      } catch (e) {
        //alert('Failed to save the data to the storage')
      }
    }
  };

  DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  );

  onTextChanged(text) {
    if (text == "") {
      this.setState({ takeFor: text, isErr: false });
    }

    if (!isNaN(text)) {
      this.setState({ isErr: true });
    } else {
      this.setState({ takeFor: text, isErr: false });
    }
  }
  render() {
    const { StatusBarManager } = NativeModules;
    const STATUSBAR_HEIGHT =
      Platform.OS === "ios" ? 20 : StatusBarManager.HEIGHT;
    // console.log("statusheight===", StatusBarManager.HEIGHT);

    ///const { navigate } = this.props.navigation;
    const screenWidth = Math.round(Dimensions.get("window").width);

    return (
      <Container>
        <StatusBarPlaceHolder />

        <ImageBackground
          source={require("../../icons/medicationHeader.png")}
          style={{ width: screenWidth, height: 250, marginTop: 0 }}
          resizeMode="stretch"
        >
          <View style={{ flex: 1, flexDirection: "column" }}>
            <View
              style={{
                height: 50,
                backgroundColor: "transparent",
                flexDirection: "row",
                marginTop: 5
              }}
            >
              <TouchableOpacity
                style={{ marginLeft: 8, height: 35, width: 35, marginTop: 5 }}
                onPress={this.OpenDrawer}
              >
                <Image
                  source={require("../../icons/back.png")}
                  style={{ marginLeft: 5, height: 28, width: 28 }}
                  resizeMode="cover"
                />
              </TouchableOpacity>

              <Text
                style={{
                  textAlign: "left",
                  fontSize: 22,
                  flex: 1,
                  marginLeft: 25,
                  height: 40,
                  color: "white",
                  marginTop: 5
                  // justifyContent: "center",
                  // alignSelf: "center"
                }}
              >
                Medication
              </Text>
            </View>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "transparent"
              }}
            >
              <Image
                source={require("../../icons/whatforit.png")}
                // source={require("../../icons/symptoms.png")}
                // source={require("../../icons/all-pages-icon.png")}
                style={{ height: 80, width: 80 }}
                resizeMode="cover"
              />
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "normal",
                  textAlign: "center",
                  color: "white",
                  marginTop: 10
                }}
              >
                What are you taking it for?
              </Text>
            </View>
          </View>
        </ImageBackground>

        <View
          style={{ flex: 1, flexDirection: "column", backgroundColor: "white" }}
        >
          <this.DismissKeyboard>
            <View style={{ flex: 1, flexDirection: "column" }}>
              <TextInput
                style={{
                  textAlign: "center",
                  paddingLeft: 15,
                  fontSize: 18,
                  backgroundColor: "white",
                  marginTop: 50
                }}
                value={this.state.takeFor}
                underlineColorAndroid="transparent"
                placeholder="What are you taking it for"
                onChangeText={(text) => this.onTextChanged(text)}
                allowFontScaling={false}
              />

              <View
                style={{
                  height: 0.5,
                  backgroundColor: "gray",
                  marginLeft: 15,
                  marginRight: 15,
                  marginTop: 10,
                  padding: 0.5
                }}
              ></View>
              {this.state.isErr && (
                <Text
                  style={{
                    textAlign: "center",
                    paddingLeft: 15,
                    fontSize: 12,
                    backgroundColor: "white",
                    marginTop: 45,
                    color: "red"
                  }}
                >
                  Please enter character{" "}
                </Text>
              )}
            </View>
          </this.DismissKeyboard>
          <View
            style={{
              height: 60,
              marginBottom: 0,
              backgroundColor: "white",
              flexDirection: "row-reverse",
              justifyContent: "space-between"
            }}
          >
            <TouchableOpacity
              style={{
                height: 60,
                marginBottom: 0,
                backgroundColor: "white",
                flexDirection: "row-reverse"
              }}
              //style={styles.loginScreenButton}
              onPress={() => this.saveData()}
              underlayColor="#fff"
            >
              <Image
                style={{
                  resizeMode: "contain",
                  height: 25,
                  width: 25,
                  marginRight: 20
                }}
                source={require("../../icons/next.png")}
              />
              <Text style={styles.loginText}> Next </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                height: 60,
                marginBottom: 0,
                backgroundColor: "white",
                flexDirection: "row-reverse"
              }}
              //style={styles.loginScreenButton}
              onPress={() => this.props.navigation.goBack()}
              underlayColor="#fff"
            >
              <Text style={styles.loginText}> Back </Text>

              <Image
                style={{
                  resizeMode: "contain",
                  height: 25,
                  width: 25,
                  marginLeft: 20
                }}
                source={require("../../icons/prev.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: "center",
    flex: 1,
    paddingTop: 0,
    backgroundColor: "white",
    flexDirection: "column"
  },

  container_text: {
    flex: 1,
    flexDirection: "column",
    marginTop: 0,
    marginLeft: 5,
    justifyContent: "center",
    backgroundColor: "white"
  },

  Separator: {
    height: 0.5,
    backgroundColor: "gray",
    marginLeft: 0,
    marginRight: 0,
    marginTop: 10
  },
  loginText: {
    color: "#2e62ae",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10
  }
});
