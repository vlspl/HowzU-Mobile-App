import React from "react";

import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Platform,
  NativeModules,
  Alert,
} from "react-native";
import { Container, Header } from "native-base";
import CustomFooter from "../appComponents/CustomFooter";
import PatientdashboardComp from "../appComponents/PatientdashboardComp";
import DoctordashboardComp from "../appComponents/DoctordashboardComp";
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

export default class MedicatnDose extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activebtn: "doctor",
      userrole: "",
      isloading: false,
      dose: "",
      title: "At what time of day do you take your first dose?",
      firstDose: "",
      secondDose: "",
      thirdDose: "",
      isShow: "firstdose",
      tabName: "",
      takeFor: "",
      tabStrength: "",
      doseCount: 0,
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

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // console.log(
    //   ' MedDose componentWillReceiveProps==============================',
    //   nextProp.route.params.tabName,
    //   nextProp.route.params.takeFor,
    //   nextProp.route.params.tabStrength,
    //   nextProp.route.params.doseCount
    // );
    this.setState(
      {
        tabName: nextProp.route.params.tabName,
        takeFor: nextProp.route.params.takeFor,
        tabStrength: nextProp.route.params.tabStrength,
        doseCount: nextProp.route.params.doseCount,
      },
      () => {}
    );
  };

  componentDidMount = async () => {
    // console.log(
    //   'MedDose componentDidMount==============================',
    //   this.props.route.params.tabName,
    //   this.props.route.params.takeFor,
    //   this.props.route.params.tabStrength,
    //   this.props.route.params.doseCount
    // );
    this.setState(
      {
        tabName: this.props.route.params.tabName,
        takeFor: this.props.route.params.takeFor,
        tabStrength: this.props.route.params.tabStrength,
        doseCount: this.props.route.params.doseCount,
      },
      () => {}
    );
  };

  AddMedication = () => {
    //Alert.alert(item.key,item.title);
    this.props.navigation.navigate("MedicationCalendrHome");
  };

  onPressSelect = (selectStr) => {
    // console.log("selectStr=================", selectStr);
    if (selectStr == "Morning") {
      this.setState({ dose: "Morning" }, () => {});
    } else if (selectStr == "Noon") {
      this.setState({ dose: "Noon" }, () => {});
    } else if (selectStr == "Evening") {
      this.setState({ dose: "Evening" }, () => {});
    } else if (selectStr == "Night") {
      this.setState({ dose: "Night" }, () => {});
    }
  };

  onPressPatientView = () => {
    this.setState({ activebtn: "patient" }, () => {
      this.saveData();
    });
    // console.log("onPressPatientView=================");
  };

  onPressMyDoctorView = () => {
    this.setState({ activebtn: "doctor" }, () => {
      this.saveData();
    });
    // console.log("onPressMyDoctorView=================");
  };

  saveData = async () => {
    try {
      this.props.navigation.navigate("MedicatnDoseTime", {
        refresh: "refresh",
      });
    } catch (e) {
      //alert('Failed to save the data to the storage')
    }
  };

  saveFirstDose = async () => {
    // console.log("First Dose call =================");

    if (this.state.dose == "") {
      Toast.show("Please Select Dose Time");

      //   Alert('Select Dose Time')
    } else {
      if (this.state.doseCount > 1) {
        this.setState(
          {
            firstDose: this.state.dose,
            isShow: "seconddose",
            title: "At what time of day do you take your second dose?",
          },
          () => {
            this.setState({ dose: "" });
          }
        );
        //this.setState({dose:'',isShow:'seconddose',title:'At what time of day do you take your second dose?'})
      } else {
        this.setState({ firstDose: this.state.dose }, () => {
          this.props.navigation.navigate("MedicatnDoseTime", {
            firstDose: this.state.firstDose,
            secondDose: this.state.secondDose,
            thirdDose: this.state.thirdDose,
            tabName: this.state.tabName,
            takeFor: this.state.takeFor,
            tabStrength: this.state.tabStrength,
            doseCount: this.state.doseCount,
          });
        });
      }
    }
  };

  saveSecondDose = async () => {
    // console.log("second Dose call =================");

    if (this.state.dose == "") {
      Toast.show("Please Select Dose Time");
    } else {
      if (this.state.doseCount > 2) {
        this.setState(
          {
            secondDose: this.state.dose,
            isShow: "thirddose",
            title: "At what time of day do you take your third dose?",
          },
          () => {
            this.setState({ dose: "" });
          }
        );
      } else {
        this.setState({ secondDose: this.state.dose }, () => {
          this.props.navigation.navigate("MedicatnDoseTime", {
            firstDose: this.state.firstDose,
            secondDose: this.state.secondDose,
            thirdDose: this.state.thirdDose,
            tabName: this.state.tabName,
            takeFor: this.state.takeFor,
            tabStrength: this.state.tabStrength,
            doseCount: this.state.doseCount,
          });
        });
      }
    }
  };

  saveThirdDose = async () => {
    // console.log("third Dose call =================");

    if (this.state.dose == "") {
      Toast.show("Please Select Dose Time");
    } else {
      if (this.state.doseCount > 2) {
        this.setState({ thirdDose: this.state.dose }, () => {
          this.setState({ dose: "" });
          this.props.navigation.navigate("MedicatnDoseTime", {
            firstDose: this.state.firstDose,
            secondDose: this.state.secondDose,
            thirdDose: this.state.thirdDose,
            tabName: this.state.tabName,
            takeFor: this.state.takeFor,
            tabStrength: this.state.tabStrength,
            doseCount: this.state.doseCount,
          });
        });
      } else {
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
                  fontSize: 25,
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
            {this.state.dose == "Morning" ? (
              <TouchableOpacity
                style={{ height: 50, flexDirection: "column", marginTop: 2 }}
                onPress={() => this.onPressSelect("Morning")}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    textAlign: "left",
                    color: "black",
                    marginLeft: 25,
                  }}
                >
                  Morning
                </Text>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "gray",
                    marginLeft: 25,
                    marginRight: 25,
                    marginTop: 10,
                  }}
                ></View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{ height: 50, flexDirection: "column", marginTop: 2 }}
                onPress={() => this.onPressSelect("Morning")}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "normal",
                    textAlign: "left",
                    color: "gray",
                    marginLeft: 25,
                  }}
                >
                  Morning
                </Text>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "gray",
                    marginLeft: 25,
                    marginRight: 25,
                    marginTop: 10,
                  }}
                ></View>
              </TouchableOpacity>
            )}

            {this.state.dose == "Noon" ? (
              <TouchableOpacity
                style={{ height: 50, flexDirection: "column", marginTop: 2 }}
                onPress={() => this.onPressSelect("Noon")}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    textAlign: "left",
                    color: "black",
                    marginLeft: 25,
                  }}
                >
                  Noon
                </Text>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "gray",
                    marginLeft: 25,
                    marginRight: 25,
                    marginTop: 10,
                  }}
                ></View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{ height: 50, flexDirection: "column", marginTop: 2 }}
                onPress={() => this.onPressSelect("Noon")}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "normal",
                    textAlign: "left",
                    color: "gray",
                    marginLeft: 25,
                  }}
                >
                  Noon
                </Text>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "gray",
                    marginLeft: 25,
                    marginRight: 25,
                    marginTop: 10,
                  }}
                ></View>
              </TouchableOpacity>
            )}

            {this.state.dose == "Evening" ? (
              <TouchableOpacity
                style={{ height: 50, flexDirection: "column", marginTop: 2 }}
                onPress={() => this.onPressSelect("Evening")}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    textAlign: "left",
                    color: "black",
                    marginLeft: 25,
                  }}
                >
                  Evening
                </Text>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "gray",
                    marginLeft: 25,
                    marginRight: 25,
                    marginTop: 10,
                  }}
                ></View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{ height: 50, flexDirection: "column", marginTop: 2 }}
                onPress={() => this.onPressSelect("Evening")}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "normal",
                    textAlign: "left",
                    color: "gray",
                    marginLeft: 25,
                  }}
                >
                  Evening
                </Text>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "gray",
                    marginLeft: 25,
                    marginRight: 25,
                    marginTop: 10,
                  }}
                ></View>
              </TouchableOpacity>
            )}

            {this.state.dose == "Night" ? (
              <TouchableOpacity
                style={{ height: 50, flexDirection: "column", marginTop: 2 }}
                onPress={() => this.onPressSelect("Night")}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    textAlign: "left",
                    color: "black",
                    marginLeft: 25,
                  }}
                >
                  Night
                </Text>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "gray",
                    marginLeft: 25,
                    marginRight: 25,
                    marginTop: 10,
                  }}
                ></View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{ height: 50, flexDirection: "column", marginTop: 2 }}
                onPress={() => this.onPressSelect("Night")}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "normal",
                    textAlign: "left",
                    color: "gray",
                    marginLeft: 25,
                  }}
                >
                  Night
                </Text>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "gray",
                    marginLeft: 25,
                    marginRight: 25,
                    marginTop: 10,
                  }}
                ></View>
              </TouchableOpacity>
            )}
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
