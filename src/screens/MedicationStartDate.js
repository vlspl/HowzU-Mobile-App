import React, { useState } from "react";

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
  BackHandler
} from "react-native";
import { Container, Header } from "native-base";
import Toast from "react-native-tiny-toast";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
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

export default class MedicationStartDate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activebtn: "doctor",
      userrole: "",
      isloading: false,
      doseDuration: "",
      setEndDate: "",

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
      comparedateforenddate: "",
      startDate: "",
      isShowDataPicker: false,
      forwhome: "",
      selectedtcolor: ""
    };
  }

  // retrieveData() {
  //   AsyncStorage.getItem(Constants.USER_ROLE).then((value) => {
  //     let valuelowrcase = value.toLowerCase();
  //     console.log('Role Dashboard screen ==================', valuelowrcase);
  //     this.setState({
  //       userrole: valuelowrcase,
  //       activebtn: valuelowrcase == 'doctor' ? 'doctor' : 'patient',
  //       isloading: true,
  //     });
  //     //  this.setState({activebtn:valuelowrcase == 'doctor'?'doctor':'patient'})
  //     //   this.setState({
  //     //     isloading: true
  //     //   });
  //   });
  // }

  OpenDrawer = () => {
    this.props.navigation.goBack();
  };

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // console.log(
    //   ' MedstartDate componentWillReceiveProps==============================',
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
    //   nextProp.route.params.thirdDoseQuantity
    // );
    this.setState(
      {
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
        forwhome: nextProp.route.params.forwhome,

        firstDoseAlrm: nextProp.route.params.firstDoseAlrm,
        secondDoseAlrm: nextProp.route.params.secondDoseAlrm,
        thirdDoseAlrm: nextProp.route.params.thirdDoseAlrm,

        firstDoseQuantity: nextProp.route.params.firstDoseQuantity,
        secondDoseQuantity: nextProp.route.params.secondDoseQuantity,
        thirdDoseQuantity: nextProp.route.params.thirdDoseQuantity
      },
      () => { }
    );
  };

  componentDidMount = async () => {
    // this.backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.hardwarebBackAction
    // );
    // console.log(
    //   'MedstartDate componentDidMount==============================',
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
    //   this.props.route.params.firstDoseAlrm,
    //   this.props.route.params.secondDoseAlrm,
    //   this.props.route.params.thirdDoseAlrm,

    //   this.props.route.params.firstDoseQuantity,
    //   this.props.route.params.secondDoseQuantity,
    //   this.props.route.params.thirdDoseQuantity
    // );
    this.setState(
      {
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
        forwhome: this.props.route.params.forwhome,

        firstDoseAlrm: this.props.route.params.firstDoseAlrm,
        secondDoseAlrm: this.props.route.params.secondDoseAlrm,
        thirdDoseAlrm: this.props.route.params.thirdDoseAlrm,

        firstDoseQuantity: this.props.route.params.firstDoseQuantity,
        secondDoseQuantity: this.props.route.params.secondDoseQuantity,
        thirdDoseQuantity: this.props.route.params.thirdDoseQuantity
      },
      () => { }
    );
  };
  hardwarebBackAction = () => {
    this.props.navigation.goBack();
    return true;
  };
  componentWillUnmount = () => {
    // this.backHandler.remove();
  };

  // AddMedication = () => {
  //   //Alert.alert(item.key,item.title);
  //   this.props.navigation.navigate('MedicationCalendrHome');
  // };

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
    //var items = {};
    if (this.state.startDate == "") {
      Toast.show("Please Select Start Date");
    } else {
      try {
        this.props.navigation.navigate("MedicatnDuration", {
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
          forwhome: this.state.forwhome,
          color: this.state.selectedtcolor,

          firstDoseAlrm: this.state.firstDoseAlrm,
          secondDoseAlrm: this.state.secondDoseAlrm,
          thirdDoseAlrm: this.state.thirdDoseAlrm,

          startDate: this.state.startDate,
          firstDoseQuantity: this.state.firstDoseQuantity,
          secondDoseQuantity: this.state.secondDoseQuantity,
          thirdDoseQuantity: this.state.thirdDoseQuantity,
          comparestartdate: this.state.comparedateforenddate
        });
      } catch (e) { }
    }
  };

  hideDateTimePicker = () => {
    this.setState({ isShowDataPicker: false });
  };

  handleDatePicked = (date) => {
    // console.log(date, "start date of the medice ");
    // 2021-02-06T10:06:00.000Z
    // let formatdate = moment(currentDate).format('hh:mm A');
    let formatdate = moment(date).format("DD/MM/YY");

    this.setState({
      isShowDataPicker: false,
      startDate: formatdate,
      comparedateforenddate: date
    });

    this.hideDateTimePicker();
  };
  renderModalPicekr = () => {
    // console.log("modal date picker");
    return (
      <DateTimePicker
        isVisible={this.state.isShowDataPicker}
        onConfirm={this.handleDatePicked}
        onCancel={this.hideDateTimePicker}
        minimumDate={new Date()}
        display="spinner"
      />
    );
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
                source={require("../../icons/startdate.png")}
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
                Set start date
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
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <TouchableOpacity
              style={{
                height: 50,
                flexDirection: "column",
                marginBottom: 10,
                borderWidth: 1,
                borderColor: "white",
                justifyContent: "center"
              }}
              onPress={() =>
                // this.showDateTimePicker
                this.setState({
                  // isShowDataPicker: !this.state.isShowDataPicker,
                  isShowDataPicker: !this.state.isShowDataPicker
                })
              }
            >
              <Text
                style={{
                  fontSize: 25,
                  color: "gray"
                }}
              >
                {this.state.startDate == ""
                  ? "Select date"
                  : this.state.startDate}
              </Text>

              {this.state.isShowDataPicker ? this.renderModalPicekr() : null}

              <View
                style={{
                  height: 0.5,
                  backgroundColor: "lightgray",
                  marginLeft: 0,
                  marginRight: 0,
                  marginTop: 0,
                  padding: 0.5
                }}
              ></View>
            </TouchableOpacity>
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
