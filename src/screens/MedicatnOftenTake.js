import React from "react";

import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Platform,
  NativeModules
} from "react-native";
import { Container } from "native-base";
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

export default class MedicatnOftenTake extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activebtn: "doctor",
      userrole: "",
      isloading: false,
      oftenTake: "",
      tabName: "",
      takeFor: "",
      tabStrength: "",
      doseCount: 0,
      forwhome: "",
      selectedtcolor: ""
    };
  }

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

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    console.log(
      " MedOftentake componentWillReceiveProps==============================",
      nextProp.route.params
    );
    this.setState(
      {
        tabName: nextProp.route.params.tabName,
        takeFor: nextProp.route.params.takeFor,
        tabStrength: nextProp.route.params.tabStrength,
        forwhome: nextProp.route.params.forwhome,
        selectedtcolor: nextProp.route.params.color
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

  componentDidMount = async () => {
    // this.backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.hardwarebBackAction
    // );
    console.log(
      "MedOftentake componentDidMount==============================",
      this.props.route.params.color
    );
    this.setState(
      {
        forwhome: this.props.route.params.forwhome,

        tabName: this.props.route.params.tabName,
        takeFor: this.props.route.params.takeFor,
        tabStrength: this.props.route.params.tabStrength,
        selectedtcolor: this.props.route.params.color
      },
      () => {}
    );
  };

  // AddMedication = () => {
  //   //Alert.alert(item.key,item.title);
  //   this.props.navigation.navigate('MedicationCalendrHome');
  // };

  onPressSelect = (selectStr) => {
    // console.log("selectStr=================", selectStr);
    if (selectStr == "Once daily") {
      this.setState({ oftenTake: "Once daily", doseCount: 1 }, () => {});
    } else if (selectStr == "Twice daily") {
      this.setState({ oftenTake: "Twice daily", doseCount: 2 }, () => {});
    } else if (selectStr == "3 times a day") {
      this.setState({ oftenTake: "3 times a day", doseCount: 3 }, () => {});
    }
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
    if (this.state.doseCount == 0) {
      Toast.show("How often do you take it?");
    } else {
      try {
        this.props.navigation.navigate("MedicationFirstDoseTime", {
          tabName: this.state.tabName,
          takeFor: this.state.takeFor,
          tabStrength: this.state.tabStrength,
          doseCount: this.state.doseCount,
          forwhome: this.state.forwhome,
          color: this.state.selectedtcolor
        });
      } catch (e) {
        //alert('Failed to save the data to the storage')
      }
    }
  };

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
                source={require("../../icons/timedose.png")}
                // source={require("../../icons/all-pages-icon.png")}
                style={{ height: 80, width: 80 }}
                resizeMode="cover"
              />
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: "normal",
                  textAlign: "center",
                  color: "white",
                  marginTop: 10
                }}
              >
                How often do you take it?
              </Text>
            </View>
          </View>
        </ImageBackground>

        <View style={{ flex: 1, flexDirection: "column" }}>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              backgroundColor: "white"
            }}
          >
            {this.state.oftenTake == "Once daily" ? (
              <TouchableOpacity
                style={{ height: 50, flexDirection: "column", marginTop: 5 }}
                onPress={() => this.onPressSelect("Once daily")}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    textAlign: "left",
                    color: "black",
                    marginLeft: 25
                  }}
                >
                  Once daily
                </Text>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "gray",
                    marginLeft: 25,
                    marginRight: 25,
                    marginTop: 10
                  }}
                ></View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{ height: 50, flexDirection: "column", marginTop: 5 }}
                onPress={() => this.onPressSelect("Once daily")}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "normal",
                    textAlign: "left",
                    color: "gray",
                    marginLeft: 25
                  }}
                >
                  Once daily
                </Text>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "gray",
                    marginLeft: 25,
                    marginRight: 25,
                    marginTop: 10
                  }}
                ></View>
              </TouchableOpacity>
            )}

            {this.state.oftenTake == "Twice daily" ? (
              <TouchableOpacity
                style={{ height: 50, flexDirection: "column", marginTop: 5 }}
                onPress={() => this.onPressSelect("Twice daily")}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    textAlign: "left",
                    color: "black",
                    marginLeft: 25
                  }}
                >
                  Twice daily
                </Text>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "gray",
                    marginLeft: 25,
                    marginRight: 25,
                    marginTop: 10
                  }}
                ></View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{ height: 50, flexDirection: "column", marginTop: 5 }}
                onPress={() => this.onPressSelect("Twice daily")}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "normal",
                    textAlign: "left",
                    color: "gray",
                    marginLeft: 25
                  }}
                >
                  Twice daily
                </Text>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "gray",
                    marginLeft: 25,
                    marginRight: 25,
                    marginTop: 10
                  }}
                ></View>
              </TouchableOpacity>
            )}

            {this.state.oftenTake == "3 times a day" ? (
              <TouchableOpacity
                style={{ height: 50, flexDirection: "column", marginTop: 5 }}
                onPress={() => this.onPressSelect("3 times a day")}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    textAlign: "left",
                    color: "black",
                    marginLeft: 25
                  }}
                >
                  3 times a day
                </Text>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "gray",
                    marginLeft: 25,
                    marginRight: 25,
                    marginTop: 10
                  }}
                ></View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{ height: 50, flexDirection: "column", marginTop: 5 }}
                onPress={() => this.onPressSelect("3 times a day")}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "normal",
                    textAlign: "left",
                    color: "gray",
                    marginLeft: 25
                  }}
                >
                  3 times a day
                </Text>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "gray",
                    marginLeft: 25,
                    marginRight: 25,
                    marginTop: 10
                  }}
                ></View>
              </TouchableOpacity>
            )}
          </View>
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
