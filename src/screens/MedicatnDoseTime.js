import React, { useState } from "react";

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
        backgroundColor: "#275BB4",
      }}
    >
      <StatusBar barStyle="light-content" />
    </View>
  );
}

export default class MedicatnDoseTime extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activebtn: "doctor",
      userrole: "",
      isloading: false,
      doseDuration: "",
      setEndDate: "",

      dose: "",
      title: "At what time of day do you take your first dose @@@?",
      firstDose: "",
      secondDose: "",
      thirdDose: "",
      isShow: "firstdose",
      tabName: "",
      takeFor: "",
      tabStrength: "",
      doseCount: 0,

      firstDoseTime: "",
      secondDoseTime: "",
      thirdDoseTime: "",

      medQuantity: "",
      firstDoseQuantity: "",
      secondDoseQuantity: "",
      thirdDoseQuantity: "",
    };
  }

  retrieveData() {
    AsyncStorage.getItem(Constants.USER_ROLE).then((value) => {
      let valuelowrcase = value.toLowerCase();
      // console.log('Role Dashboard screen ==================', valuelowrcase);
      this.setState({
        userrole: valuelowrcase,
        activebtn: valuelowrcase == "doctor" ? "doctor" : "patient",
        isloading: true,
      });
      //  this.setState({activebtn:valuelowrcase == 'doctor'?'doctor':'patient'})
      //   this.setState({
      //     isloading: true
      //   });
    });
  }

  OpenDrawer = () => {
    this.props.navigation.openDrawer();
  };

  AddMedication = () => {
    //Alert.alert(item.key,item.title);
    this.props.navigation.navigate("MedicationCalendrHome");
  };

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // console.log(
    //   "*******MedicatnDoseTime MedDose Time componentWillReceiveProps==============================",
    //   nextProp.route.params.tabName,
    //   nextProp.route.params.takeFor,
    //   nextProp.route.params.tabStrength,
    //   nextProp.route.params.doseCount,
    //   nextProp.route.params.firstDose,
    //   nextProp.route.params.secondDose,
    //   nextProp.route.params.thirdDose
    // );
    this.setState(
      {
        tabName: nextProp.route.params.tabName,
        takeFor: nextProp.route.params.takeFor,
        tabStrength: nextProp.route.params.tabStrength,
        doseCount: nextProp.route.params.doseCount,
        firstDose: nextProp.route.params.firstDose,
        secondDose: nextProp.route.params.secondDose,
        thirdDose: nextProp.route.params.thirdDose,
      },
      () => {}
    );
  };

  componentDidMount = async () => {
    // console.log(
    //   "MedicatnDoseTime ******MedDose Time componentDidMount==============================",

    //   this.props.route.params.tabName,
    //   this.props.route.params.takeFor,
    //   this.props.route.params.tabStrength,
    //   this.props.route.params.doseCount,
    //   this.props.route.params.firstDose,
    //   this.props.route.params.secondDose,
    //   this.props.route.params.thirdDose
    // );
    this.setState(
      {
        tabName: this.props.route.params.tabName,
        takeFor: this.props.route.params.takeFor,
        tabStrength: this.props.route.params.tabStrength,
        doseCount: this.props.route.params.doseCount,
        firstDose: this.props.route.params.firstDose,
        secondDose: this.props.route.params.secondDose,
        thirdDose: this.props.route.params.thirdDose,
      },
      () => {}
    );
  };

  // onPressPatientView = () => {
  //   this.setState({ activebtn: 'patient' }, () => {
  //     this.saveData();
  //   });
  //   console.log('onPressPatientView=================');
  // };

  // onPressMyDoctorView = () => {
  //   this.setState({ activebtn: 'doctor' }, () => {
  //     this.saveData();
  //   });
  //   console.log('onPressMyDoctorView=================');
  // };

  saveData = async () => {
    try {
      this.props.navigation.navigate("MedicationStartDate", {
        refresh: "refresh",
      });
    } catch (e) {}
  };

  saveFirstDose = async () => {
    // console.log("First Dose call =================", this.state.dose);

    if (this.state.dose == "") {
      Toast.show("Please Select Dose Time");

      //   Alert('Select Dose Time')
    } else {
      if (this.state.doseCount > 1) {
        this.setState(
          {
            firstDoseTime: this.state.dose,
            firstDoseQuantity: this.state.medQuantity,
            isShow: "seconddose",
            title: "At what time of day do you take your second dose?",
          },
          () => {
            this.setState({ dose: "", medQuantity: "" });
          }
        );
        //this.setState({dose:'',isShow:'seconddose',title:'At what time of day do you take your second dose?'})
      } else {
        this.setState(
          {
            firstDoseTime: this.state.dose,
            firstDoseQuantity: this.state.medQuantity,
          },
          () => {
            this.props.navigation.navigate("MedicationStartDate", {
              firstDose: this.state.firstDose,
              secondDose: this.state.secondDose,
              thirdDose: this.state.thirdDose,
              tabName: this.state.tabName,
              takeFor: this.state.takeFor,
              tabStrength: this.state.tabStrength,
              doseCount: this.state.doseCount,
              firstDoseTime: this.state.firstDoseTime,
              secondDoseTime: this.state.secondDoseTime,
              thirdDoseTime: this.state.thirdDoseTime,
              firstDoseQuantity: this.state.firstDoseQuantity,
              secondDoseQuantity: this.state.secondDoseQuantity,
              thirdDoseQuantity: this.state.thirdDoseQuantity,
            });
          }
        );
      }
    }
  };

  saveSecondDose = async () => {
    // console.log("Medi Dose Time second Dose call =================");

    if (this.state.dose == "") {
      Toast.show("Please Select Dose Time");
    } else {
      if (this.state.doseCount > 2) {
        this.setState(
          {
            secondDoseTime: this.state.dose,
            secondDoseQuantity: this.state.medQuantity,
            isShow: "thirddose",
            title: "At what time of day do you take your third dose?",
          },
          () => {
            this.setState({ dose: "", medQuantity: "" });
          }
        );
      } else {
        this.setState(
          {
            secondDoseTime: this.state.dose,
            secondDoseQuantity: this.state.medQuantity,
          },
          () => {
            this.props.navigation.navigate("MedicationStartDate", {
              firstDose: this.state.firstDose,
              secondDose: this.state.secondDose,
              thirdDose: this.state.thirdDose,
              tabName: this.state.tabName,
              takeFor: this.state.takeFor,
              tabStrength: this.state.tabStrength,
              doseCount: this.state.doseCount,
              firstDoseTime: this.state.firstDoseTime,
              secondDoseTime: this.state.secondDoseTime,
              thirdDoseTime: this.state.thirdDoseTime,
              firstDoseQuantity: this.state.firstDoseQuantity,
              secondDoseQuantity: this.state.secondDoseQuantity,
              thirdDoseQuantity: this.state.thirdDoseQuantity,
            });
          }
        );
      }
    }
  };

  saveThirdDose = async () => {
    // console.log("third Dose call =================");

    if (this.state.dose == "") {
      Toast.show("Please Select Dose Time");
    } else {
      if (this.state.doseCount > 2) {
        this.setState(
          {
            thirdDoseTime: this.state.dose,
            thirdDoseQuantity: this.state.medQuantity,
          },
          () => {
            this.setState({ dose: "", medQuantity: "" });
            this.props.navigation.navigate("MedicationStartDate", {
              firstDose: this.state.firstDose,
              secondDose: this.state.secondDose,
              thirdDose: this.state.thirdDose,
              tabName: this.state.tabName,
              takeFor: this.state.takeFor,
              tabStrength: this.state.tabStrength,
              doseCount: this.state.doseCount,
              firstDoseTime: this.state.firstDoseTime,
              secondDoseTime: this.state.secondDoseTime,
              thirdDoseTime: this.state.thirdDoseTime,
              firstDoseQuantity: this.state.firstDoseQuantity,
              secondDoseQuantity: this.state.secondDoseQuantity,
              thirdDoseQuantity: this.state.thirdDoseQuantity,
            });
          }
        );
      } else {
      }
    }
  };

  render() {
    const { StatusBarManager } = NativeModules;
    const STATUSBAR_HEIGHT =
      Platform.OS === "ios" ? 20 : StatusBarManager.HEIGHT;
    // console.log("statusheight===", StatusBarManager.HEIGHT);
    // const [date, setDate] = useState(new Date())

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
                marginTop: 5,
              }}
            >
              <TouchableOpacity
                style={{ marginLeft: 8, height: 35, width: 35, marginTop: 5 }}
                onPress={this.OpenDrawer}
              >
                <Image
                  source={require("../../icons/menu.png")}
                  style={{ marginLeft: 5, height: 32, width: 32 }}
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
                  justifyContent: "center",
                  alignSelf: "center",
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
                backgroundColor: "transparent",
              }}
            >
              <Image
                source={require("../../icons/all-pages-icon.png")}
                style={{ height: 80, width: 80 }}
                resizeMode="cover"
              />
              <Text
                style={{
                  fontSize: 26,
                  fontWeight: "normal",
                  textAlign: "center",
                  color: "white",
                  marginTop: 10,
                  marginLeft: 15,
                  marginRight: 15,
                }}
              >
                {this.state.title}
              </Text>
            </View>
          </View>
        </ImageBackground>

        <View
          style={{ flex: 1, flexDirection: "column", backgroundColor: "white" }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              backgroundColor: "white",
            }}
          >
            <View
              style={{
                height: 80,
                flexDirection: "column",
                backgroundColor: "white",
              }}
            >
              <Text
                style={{
                  flex: 1,
                  marginLeft: 50,
                  color: "gray",
                  marginTop: 20,
                }}
              >
                Enter Medicine Quantity
              </Text>
              <TextInput
                style={{
                  textAlign: "center",
                  flex: 1,
                  fontSize: 17,
                  marginLeft: 50,
                  marginRight: 50,
                }}
                value={this.state.medQuantity}
                //underlineColorAndroid="transparent"
                placeholder="Medicine Quantity"
                onChangeText={(text) => {
                  this.setState({ medQuantity: text });
                }}
                keyboardType={"number-pad"}
                allowFontScaling={false}
              />

              <View
                style={{
                  height: 0.5,
                  backgroundColor: "gray",
                  marginLeft: 50,
                  marginRight: 50,
                  marginTop: 0,
                }}
              ></View>
            </View>

            {/* <TouchableOpacity
              style={{
                height: 60,
                flexDirection: 'column',
                marginBottom: 10,
                marginTop: 80,
                justifyContent: 'center',
                backgroundColor: 'white',
                alignContent: 'center',
                alignItems: 'center',
                backgroundColor: 'red',
              }}
            >
              {/* <Text style ={{flex:1 ,marginLeft:0,color:'gray',marginTop:0}}>Select Dose time</Text> */}

            {/* <View
                style={{
                  height: 0.5,
                  backgroundColor: 'gray',
                  marginLeft: 0,
                  marginRight: 0,
                  marginTop: 0,
                }}
              ></View>
            </TouchableOpacity> */}
          </View>

          {this.state.isShow == "firstdose" ? (
            <View
              style={{
                height: 60,
                marginBottom: 0,
                backgroundColor: "white",
                flexDirection: "row-reverse",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                style={{
                  height: 60,
                  marginBottom: 0,
                  backgroundColor: "white",
                  flexDirection: "row-reverse",
                }}
                //style={styles.loginScreenButton}
                onPress={() => this.saveFirstDose()}
                underlayColor="#fff"
              >
                <Image
                  style={{
                    resizeMode: "contain",
                    height: 25,
                    width: 25,
                    marginRight: 20,
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
                  flexDirection: "row-reverse",
                }}
                underlayColor="#fff"
              >
                <Text style={styles.loginText}> Back </Text>
                <Image
                  style={{
                    resizeMode: "contain",
                    height: 25,
                    width: 25,
                    marginLeft: 20,
                  }}
                  source={require("../../icons/prev.png")}
                />
              </TouchableOpacity>
            </View>
          ) : null}

          {this.state.isShow == "seconddose" ? (
            <View
              style={{
                height: 60,
                marginBottom: 0,
                backgroundColor: "white",
                flexDirection: "row-reverse",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                style={{
                  height: 60,
                  marginBottom: 0,
                  backgroundColor: "white",
                  flexDirection: "row-reverse",
                }}
                //style={styles.loginScreenButton}
                onPress={() => this.saveSecondDose()}
                underlayColor="#fff"
              >
                <Image
                  style={{
                    resizeMode: "contain",
                    height: 25,
                    width: 25,
                    marginRight: 20,
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
                  flexDirection: "row-reverse",
                }}
                underlayColor="#fff"
              >
                <Text style={styles.loginText}> Back </Text>
                <Image
                  style={{
                    resizeMode: "contain",
                    height: 25,
                    width: 25,
                    marginLeft: 20,
                  }}
                  source={require("../../icons/prev.png")}
                />
              </TouchableOpacity>
            </View>
          ) : null}

          {this.state.isShow == "thirddose" ? (
            <View
              style={{
                height: 60,
                marginBottom: 0,
                backgroundColor: "white",
                flexDirection: "row-reverse",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                style={{
                  height: 60,
                  marginBottom: 0,
                  backgroundColor: "white",
                  flexDirection: "row-reverse",
                }}
                //style={styles.loginScreenButton}
                onPress={() => this.saveThirdDose()}
                underlayColor="#fff"
              >
                <Image
                  style={{
                    resizeMode: "contain",
                    height: 25,
                    width: 25,
                    marginRight: 20,
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
                  flexDirection: "row-reverse",
                }}
                underlayColor="#fff"
                // new
                onPress={() => this.setState({ isShow: "seconddose" })}
              >
                <Text style={styles.loginText}> Back </Text>
                <Image
                  style={{
                    resizeMode: "contain",
                    height: 25,
                    width: 25,
                    marginLeft: 20,
                  }}
                  source={require("../../icons/prev.png")}
                />
              </TouchableOpacity>
            </View>
          ) : null}
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
    flexDirection: "column",
  },

  container_text: {
    flex: 1,
    flexDirection: "column",
    marginTop: 0,
    marginLeft: 5,
    justifyContent: "center",
    backgroundColor: "white",
  },

  Separator: {
    height: 0.5,
    backgroundColor: "gray",
    marginLeft: 0,
    marginRight: 0,
    marginTop: 10,
  },
  loginText: {
    color: "#2e62ae",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
});
