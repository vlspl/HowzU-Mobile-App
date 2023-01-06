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
  NativeModules,
  BackHandler,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { Container, Header } from "native-base";
import AsyncStorage from "@react-native-community/async-storage";
import Constants from "../utils/Constants";
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

export default class MedicineStrenth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activebtn: "doctor",
      userrole: "",
      isloading: false,
      tabletStrength: "g",
      tabPower: "",
      tabName: "",
      takeFor: "",
      forwhome: "",
      selectedtcolor: ""
    };
  }

  hardwarebBackAction = () => {
    this.props.navigation.goBack();
    return true;
  };
  componentWillUnmount = () => {
    // this.backHandler.remove();
  };
  //  retrieveData () {

  //   AsyncStorage.getItem(Constants.USER_ROLE).then((value) => {
  //     let valuelowrcase = value.toLowerCase()
  //    console.log("Role Dashboard screen ==================",valuelowrcase)
  //    this.setState({userrole:valuelowrcase , activebtn:valuelowrcase == 'doctor'?'doctor':'patient',isloading: true})
  //   //  this.setState({activebtn:valuelowrcase == 'doctor'?'doctor':'patient'})
  //   //   this.setState({
  //   //     isloading: true
  //   //   });
  //   });

  // };

  OpenDrawer = () => {
    this.props.navigation.goBack();
  };

  handleChange(text) {
    if (isNaN(text)) {
      Toast.show("Please enter only number");
    } else {
      this.setState({ tabPower: text });
    }
  }

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    console.log(
      " MedStrenth componentWillReceiveProps==============================",
      nextProp.route.params
    );
    this.setState(
      {
        tabName: nextProp.route.params.tabName,
        takeFor: nextProp.route.params.takeFor,
        forwhome: nextProp.route.params.forwhome,
        selectedtcolor: nextProp.route.params.color
      },
      () => {}
    );
  };

  componentDidMount = async () => {
    // this.backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.hardwarebBackAction
    // );
    console.log(
      "Med Strenth componentDidMount==============================",
      this.props.route.params
    );
    this.setState(
      {
        tabName: this.props.route.params.tabName,
        takeFor: this.props.route.params.takeFor,
        forwhome: this.props.route.params.forwhome,
        selectedtcolor: this.props.route.params.color
      },
      () => {}
    );
  };

  // AddMedication = (item) => {
  //   //Alert.alert(item.key,item.title);
  //   this.props.navigation.navigate('MedicationCalendrHome');
  // };

  onPressTabletStrength = (selectStr) => {
    // console.log("selectStr=================", selectStr);
    if (selectStr == "g") {
      this.setState({ tabletStrength: "g" }, () => {});
    } else if (selectStr == "IU") {
      this.setState({ tabletStrength: "IU" }, () => {});
    } else if (selectStr == "mg") {
      this.setState({ tabletStrength: "mg" }, () => {});
    }
  };

  saveData = async () => {
    if (this.state.tabPower == "") {
      Toast.show("What Strength is the medicine?");
    } else {
      try {
        this.props.navigation.navigate("MedicatnOftenTake", {
          forwhome: this.state.forwhome,
          tabName: this.state.tabName,
          takeFor: this.state.takeFor,
          color: this.state.selectedtcolor,
          tabStrength: this.state.tabPower + this.state.tabletStrength
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
                source={require("../../icons/strength.png")}
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
                What Strength is the medicine?
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
                  marginTop: 15
                }}
                value={this.state.tabPower}
                underlineColorAndroid="transparent"
                placeholder="What Strength is the medicine?"
                // onChangeText={(text) => this.setState({ tabPower: text })}
                onChangeText={(text) => {
                  this.handleChange(text);
                }}
                keyboardType={"number-pad"}
                allowFontScaling={false}
              />

              <View
                style={{
                  height: 0.5,
                  backgroundColor: "gray",
                  marginLeft: 15,
                  marginRight: 15,
                  marginTop: 10
                }}
              ></View>

              <View
                style={{
                  flexDirection: "row-reverse",
                  height: 50,
                  backgroundColor: "white",
                  margin: 10
                }}
              >
                {this.state.tabletStrength == "mg" ? (
                  <TouchableOpacity
                    style={{
                      width: 60,
                      height: 30,
                      borderColor: "black",
                      backgroundColor: "lightgray",
                      borderWidth: 1,
                      borderRadius: 15,
                      justifyContent: "center"
                    }}
                    onPress={() => this.onPressTabletStrength("mg")}
                  >
                    <Text style={{ textAlign: "center", fontSize: 17 }}>
                      {" "}
                      mg{" "}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{
                      width: 60,
                      height: 30,
                      borderColor: "white",
                      backgroundColor: "white",
                      borderWidth: 1,
                      borderRadius: 15,
                      justifyContent: "center"
                    }}
                    onPress={() => this.onPressTabletStrength("mg")}
                  >
                    <Text style={{ textAlign: "center", fontSize: 17 }}>
                      {" "}
                      mg{" "}
                    </Text>
                  </TouchableOpacity>
                )}

                {this.state.tabletStrength == "IU" ? (
                  <TouchableOpacity
                    style={{
                      width: 60,
                      height: 30,
                      borderColor: "black",
                      backgroundColor: "lightgray",
                      borderWidth: 1,
                      borderRadius: 15,
                      justifyContent: "center"
                    }}
                    onPress={() => this.onPressTabletStrength("IU")}
                  >
                    <Text style={{ textAlign: "center", fontSize: 16 }}>
                      {" "}
                      IU{" "}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{
                      width: 60,
                      height: 30,
                      borderColor: "white",
                      backgroundColor: "white",
                      borderWidth: 1,
                      borderRadius: 15,
                      justifyContent: "center"
                    }}
                    onPress={() => this.onPressTabletStrength("IU")}
                  >
                    <Text style={{ textAlign: "center", fontSize: 16 }}>
                      {" "}
                      IU{" "}
                    </Text>
                  </TouchableOpacity>
                )}

                {this.state.tabletStrength == "g" ? (
                  <TouchableOpacity
                    style={{
                      width: 60,
                      height: 30,
                      borderColor: "black",
                      backgroundColor: "lightgray",
                      borderWidth: 1,
                      borderRadius: 15
                    }}
                    onPress={() => this.onPressTabletStrength("g")}
                  >
                    <Text style={{ textAlign: "center", fontSize: 16 }}>
                      {" "}
                      g{" "}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{
                      width: 60,
                      height: 30,
                      borderColor: "white",
                      backgroundColor: "white",
                      borderWidth: 1,
                      borderRadius: 15
                    }}
                    onPress={() => this.onPressTabletStrength("g")}
                  >
                    <Text style={{ textAlign: "center", fontSize: 16 }}>
                      {" "}
                      g{" "}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
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
