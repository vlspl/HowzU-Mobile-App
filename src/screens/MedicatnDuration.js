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
  NativeModules
} from "react-native";
import { Container, Header } from "native-base";
import CustomFooter from "../appComponents/CustomFooter";
import PatientdashboardComp from "../appComponents/PatientdashboardComp";
import DoctordashboardComp from "../appComponents/DoctordashboardComp";
import AsyncStorage from "@react-native-community/async-storage";
import Constants from "../utils/Constants";
import Loader from "../appComponents/loader";
import ActionButton from "react-native-action-button";
import DatePicker from "react-native-datepicker";
import Toast from "react-native-tiny-toast";
import moment from "moment";
import DateTimePicker from "react-native-modal-datetime-picker";

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

export default class MedicatnDuration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activebtn: "doctor",
      userrole: "",
      isloading: false,
      doseDuration: "",
      setPickerDate: "",
      duration: 0,
      dose: "",
      firstDose: "",
      secondDose: "",
      thirdDose: "",
      tabName: "",
      takeFor: "",
      tabStrength: "",
      doseCount: 0,

      firstDoseTime: "",
      secondDoseTime: "",
      thirdDoseTime: "",

      firstDoseAlrm: "",
      secondDoseAlrm: "",
      thirdDoseAlrm: "",

      firstDoseQuantity: "",
      secondDoseQuantity: "",
      thirdDoseQuantity: "",
      comparestartdate: "",
      startDate: "",
      endDate: "",
      isShowDataPicker: false,
      forwhome: "",
      selectedtcolor: ""
    };
  }

  hideDateTimePicker = () => {
    this.setState({ isShowDataPicker: false });
  };

  handleDatePicked = (date) => {
    let formatdate = moment(date).format("DD/MM/YY");
    let defaultdate = moment(this.state.startDate, "DD/MM/YY").format(
      "MM/DD/YYYY"
    );
    let enddate = moment(formatdate, "DD/MM/YY").format("MM/DD/YYYY");

    let date1 = new Date(enddate);
    let date2 = new Date(defaultdate);

    let diff = Math.abs(date1 - date2);
    let diffindays = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
    this.setState({
      setPickerDate: formatdate,
      endDate: date,
      doseDuration: "Set end date",
      isShowDataPicker: false,
      duration: diffindays
    });

    this.hideDateTimePicker();
  };
  renderModalPicekr = () => {
    return (
      <DateTimePicker
        isVisible={this.state.isShowDataPicker}
        onConfirm={this.handleDatePicked}
        onCancel={this.hideDateTimePicker}
        minimumDate={this.state.comparestartdate}
        display="spinner"
      />
    );
  };

  OpenDrawer = () => {
    this.props.navigation.goBack();
  };

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    console.log(
      " MedDuration componentWillReceiveProps==============================",
      nextProp.route.params.color
    );
    // console.log(
    //   " MedDuration componentWillReceiveProps==============================",
    //   nextProp.route.params.tabName,
    //   nextProp.route.params.takeFor,
    //   nextProp.route.params.tabStrength,
    //   nextProp.route.params.doseCount,
    //   nextProp.route.params.firstDose,
    //   nextProp.route.params.secondDose,
    //   nextProp.route.params.thirdDose,
    //   nextProp.route.params.firstDoseTime,
    //   nextProp.route.params.secondDoseTime,
    //   nextProp.route.params.thirdDoseTime,
    //   nextProp.route.params.firstDoseAlrm,
    //   nextProp.route.params.secondDoseAlrm,
    //   nextProp.route.params.thirdDoseAlrm,

    //   nextProp.route.params.firstDoseQuantity,
    //   nextProp.route.params.secondDoseQuantity,
    //   nextProp.route.params.thirdDoseQuantity,
    //   nextProp.route.params.startDate,
    //   "comparestartdate",
    //   nextProp.route.params.comparestartdate
    // );
    this.setState(
      {
        forwhome: nextProp.route.params.forwhome,
        selectedtcolor: nextProp.route.params.color,

        tabName: nextProp.route.params.tabName,
        takeFor: nextProp.route.params.takeFor,
        tabStrength: nextProp.route.params.tabStrength,
        doseCount: nextProp.route.params.doseCount,
        firstDose: nextProp.route.params.firstDose,
        secondDose: nextProp.route.params.secondDose,
        thirdDose: nextProp.route.params.thirdDose,
        firstDoseTime: nextProp.route.params.firstDoseTime,
        secondDoseTime: nextProp.route.params.secondDoseTime,
        thirdDoseTime: nextProp.route.params.thirdDoseTime,

        firstDoseAlrm: nextProp.route.params.firstDoseAlrm,
        secondDoseAlrm: nextProp.route.params.secondDoseAlrm,
        thirdDoseAlrm: nextProp.route.params.thirdDoseAlrm,

        firstDoseQuantity: nextProp.route.params.firstDoseQuantity,
        secondDoseQuantity: nextProp.route.params.secondDoseQuantity,
        thirdDoseQuantity: nextProp.route.params.thirdDoseQuantity,
        startDate: nextProp.route.params.startDate,
        comparestartdate: nextProp.route.params.comparestartdate
      },
      () => { }
    );
  };

  componentDidMount = async () => {
    console.log(
      "MedDuration componentDidMount==============================",
      this.props.route.params.color
    );
    // console.log(
    //   "MedDuration componentDidMount==============================",
    //   this.props.route.params.tabName,
    //   this.props.route.params.takeFor,
    //   this.props.route.params.tabStrength,
    //   this.props.route.params.doseCount,
    //   this.props.route.params.firstDose,
    //   this.props.route.params.secondDose,
    //   this.props.route.params.thirdDose,
    //   this.props.route.params.firstDoseTime,
    //   this.props.route.params.secondDoseTime,
    //   this.props.route.params.thirdDoseTime,

    //   this.props.route.params.firstDoseQuantity,
    //   this.props.route.params.secondDoseQuantity,
    //   this.props.route.params.thirdDoseQuantity,
    //   this.props.route.params.startDate,
    //   "comparestartdate",
    //   this.props.route.params.comparestartdate
    // );
    this.setState(
      {
        forwhome: this.props.route.params.forwhome,
        selectedtcolor: this.props.route.params.color,

        tabName: this.props.route.params.tabName,
        takeFor: this.props.route.params.takeFor,
        tabStrength: this.props.route.params.tabStrength,
        doseCount: this.props.route.params.doseCount,
        firstDose: this.props.route.params.firstDose,
        secondDose: this.props.route.params.secondDose,
        thirdDose: this.props.route.params.thirdDose,
        firstDoseTime: this.props.route.params.firstDoseTime,
        secondDoseTime: this.props.route.params.secondDoseTime,
        thirdDoseTime: this.props.route.params.thirdDoseTime,
        firstDoseAlrm: this.props.route.params.firstDoseAlrm,
        secondDoseAlrm: this.props.route.params.secondDoseAlrm,
        thirdDoseAlrm: this.props.route.params.thirdDoseAlrm,

        firstDoseQuantity: this.props.route.params.firstDoseQuantity,
        secondDoseQuantity: this.props.route.params.secondDoseQuantity,
        thirdDoseQuantity: this.props.route.params.thirdDoseQuantity,
        startDate: this.props.route.params.startDate,
        comparestartdate: this.props.route.params.comparestartdate
      },
      () => { }
    );
  };

  // AddMedication = () => {
  //   //Alert.alert(item.key,item.title);
  //   this.props.navigation.navigate('MedicationCalendrHome');
  // };

  onPressSelect = (selectStr) => {
    // console.log("selectStr=================", selectStr);
    if (selectStr == "30 days") {
      this.setState(
        {
          doseDuration: "30 days",
          endDate: moment(this.state.startDate, "DD-MM-YYYY").add(30, "days"),
          setPickerDate: "",
          duration: 30
        },
        () => {
          // console.log("endDate=================", this.state.endDate);
        }
      );
    } else if (selectStr == "1 week") {
      this.setState(
        {
          doseDuration: "1 week",
          endDate: moment(this.state.startDate, "DD-MM-YYYY").add(7, "days"),
          setPickerDate: "",
          duration: 7
        },
        () => {
          // console.log("endDate=================", this.state.endDate);
        }
      );
    } else if (selectStr == "10 days") {
      this.setState(
        {
          doseDuration: "10 days",
          endDate: moment(this.state.startDate, "DD-MM-YYYY").add(10, "days"),
          setPickerDate: "",
          duration: 10
        },
        () => {
          // console.log("endDate=================", this.state.endDate);
        }
      );
    } else if (selectStr == "5 days") {
      this.setState(
        {
          doseDuration: "5 days",
          endDate: moment(this.state.startDate, "DD-MM-YYYY").add(5, "days"),
          setPickerDate: "",
          duration: 5
        },
        () => {
          //   console.log("endDate=================", this.state.endDate);
        }
      );
    } else if (selectStr == "Set end date") {
      // console.log(
      //   this.state.endDate - this.state.startDate,
      //   "minus start date"
      // );
      this.setState(
        { doseDuration: "Set end date", isShowDataPicker: true },
        () => {
          // console.log('endDate=================',this.state.endDate)
          // this.setState({endDate:this.state.setPickerDate});
        }
      );
    } else if (selectStr == "Ongoing treatment") {
      this.setState(
        { doseDuration: "Ongoing treatment", endDate: null, setPickerDate: "" },
        () => {
          // console.log("endDate=================", this.state.endDate);
        }
      );
    }
  };

  saveData = async () => {
    if (this.state.endDate == "") {
      Toast.show(" How long is the treatment from the start date?");
    } else {
      try {
        //this.props.navigation.navigate('MedicationTakenFood',{refresh:'refresh'})
        this.props.navigation.navigate("MedicationTakenFood", {
          tabName: this.state.tabName,
          takeFor: this.state.takeFor,
          tabStrength: this.state.tabStrength,
          doseCount: this.state.doseCount,
          firstDose: this.state.firstDose,
          secondDose: this.state.secondDose,
          thirdDose: this.state.thirdDose,
          firstDoseTime: this.state.firstDoseTime,
          secondDoseTime: this.state.secondDoseTime,
          thirdDoseTime: this.state.thirdDoseTime,

          firstDoseAlrm: this.state.firstDoseAlrm,
          secondDoseAlrm: this.state.secondDoseAlrm,
          thirdDoseAlrm: this.state.thirdDoseAlrm,
          forwhome: this.state.forwhome,
          color: this.state.selectedtcolor,

          firstDoseQuantity: this.state.firstDoseQuantity,
          secondDoseQuantity: this.state.secondDoseQuantity,
          thirdDoseQuantity: this.state.thirdDoseQuantity,
          startDate: this.state.startDate,
          comparestartdate: this.state.comparestartdate,
          endDate: this.state.endDate,
          doseDuration: this.state.doseDuration,
          duration: this.state.duration
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
                source={require("../../icons/duration.png")}
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
                  marginRight: 15
                }}
              >
                How long is the treatment from the start date?
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
              backgroundColor: "white"
            }}
          >
            {this.state.doseDuration == "30 days" ? (
              <TouchableOpacity
                style={{ height: 50, flexDirection: "column", marginTop: 0 }}
                onPress={() => this.onPressSelect("30 days")}
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
                  30 days
                </Text>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "lightgray",
                    padding: 0.5,
                    marginLeft: 25,
                    marginRight: 25,
                    marginTop: 10
                  }}
                ></View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{ height: 50, flexDirection: "column", marginTop: 0 }}
                onPress={() => this.onPressSelect("30 days")}
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
                  30 days
                </Text>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "lightgray",
                    padding: 0.5,
                    marginLeft: 25,
                    marginRight: 25,
                    marginTop: 10
                  }}
                ></View>
              </TouchableOpacity>
            )}

            {this.state.doseDuration == "1 week" ? (
              <TouchableOpacity
                style={{ height: 50, flexDirection: "column", marginTop: 0 }}
                onPress={() => this.onPressSelect("1 week")}
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
                  1 week
                </Text>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "lightgray",
                    padding: 0.5,
                    marginLeft: 25,
                    marginRight: 25,
                    marginTop: 10
                  }}
                ></View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{ height: 50, flexDirection: "column", marginTop: 0 }}
                onPress={() => this.onPressSelect("1 week")}
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
                  1 week
                </Text>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "lightgray",
                    padding: 0.5,
                    marginLeft: 25,
                    marginRight: 25,
                    marginTop: 10
                  }}
                ></View>
              </TouchableOpacity>
            )}

            {this.state.doseDuration == "10 days" ? (
              <TouchableOpacity
                style={{ height: 50, flexDirection: "column", marginTop: 0 }}
                onPress={() => this.onPressSelect("10 days")}
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
                  10 days
                </Text>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "lightgray",
                    padding: 0.5,
                    marginLeft: 25,
                    marginRight: 25,
                    marginTop: 10
                  }}
                ></View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{ height: 50, flexDirection: "column", marginTop: 0 }}
                onPress={() => this.onPressSelect("10 days")}
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
                  10 days
                </Text>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "lightgray",
                    padding: 0.5,
                    marginLeft: 25,
                    marginRight: 25,
                    marginTop: 10
                  }}
                ></View>
              </TouchableOpacity>
            )}

            {this.state.doseDuration == "5 days" ? (
              <TouchableOpacity
                style={{ height: 50, flexDirection: "column", marginTop: 0 }}
                onPress={() => this.onPressSelect("5 days")}
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
                  5 days
                </Text>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "lightgray",
                    padding: 0.5,
                    marginLeft: 25,
                    marginRight: 25,
                    marginTop: 10
                  }}
                ></View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{ height: 50, flexDirection: "column", marginTop: 0 }}
                onPress={() => this.onPressSelect("5 days")}
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
                  5 days
                </Text>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "lightgray",
                    padding: 0.5,
                    marginLeft: 25,
                    marginRight: 25,
                    marginTop: 10
                  }}
                ></View>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={{ height: 40, flexDirection: "column", marginBottom: 10 }}
              onPress={() => this.onPressSelect("Set end date")}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "normal",
                  textAlign: "left",
                  color: this.state.setPickerDate == "" ? "gray" : "black",
                  marginLeft: 25
                }}
              >
                {this.state.setPickerDate == ""
                  ? " Set end date"
                  : this.state.setPickerDate}
              </Text>

              {this.state.isShowDataPicker ? this.renderModalPicekr() : null}

              <View
                style={{
                  height: 0.5,
                  backgroundColor: "lightgray",
                  marginLeft: 25,
                  marginRight: 25,
                  marginTop: 20,
                  padding: 0.5
                }}
              ></View>
            </TouchableOpacity>
            {/* currently hiding the ongoing tratement part will do this later  */}
            {/* {this.state.doseDuration == "Ongoing treatment" ? (
              <TouchableOpacity
                style={{ height: 50, flexDirection: "column", marginTop: 10 }}
                onPress={() => this.onPressSelect("Ongoing treatment")}
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
                  Ongoing treatment
                </Text>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "lightgray",
                    padding: 0.5,
                    marginLeft: 25,
                    marginRight: 25,
                    marginTop: 10,
                  }}
                ></View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{ height: 50, flexDirection: "column", marginTop: 10 }}
                onPress={() => this.onPressSelect("Ongoing treatment")}
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
                  Ongoing treatment
                </Text>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "lightgray",
                    padding: 0.5,
                    marginLeft: 25,
                    marginRight: 25,
                    marginTop: 10,
                  }}
                ></View>
              </TouchableOpacity>
            )} */}
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
