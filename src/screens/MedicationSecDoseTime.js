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
  Alert,
  BackHandler,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { Container, Header } from "native-base";
import Toast from "react-native-tiny-toast";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import DateTimePicker from "react-native-modal-datetime-picker";
const screenWidth = Math.round(Dimensions.get("window").width);
const { StatusBarManager } = NativeModules;
import moment from "moment";
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

export default class MedicationSecDoseTime extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activebtn: "doctor",
      userrole: "",
      isloading: false,
      dose: "",
      title: "At what time of day do you take your Second dose?",
      firstDose: "",
      secondDose: "",
      thirdDose: "",
      isShow: "firstdose",
      tabName: "",
      takeFor: "",
      tabStrength: "",
      doseCount: 0,
      dosetime: "",

      firstDoseTime: "",
      firstDoseAlrm: "",
      secondDoseTime: "",
      secondDoseAlrm: "",
      thirdDoseTime: "",
      thirdDoseAlrm: "",
      forwhome: "",
      medQuantity: "",
      firstDoseQuantity: "",
      secondDoseQuantity: "",
      thirdDoseQuantity: "",
      isShowDataPicker: false,
      isOpen: "dose",
      selectedtcolor: ""
    };
  }

  showDateTimePicker = () => {
    // console.log('os d msnens@@@@@')
    this.setState({ isShowDataPicker: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isShowDataPicker: false });
  };

  handleDatePicked = (date) => {
    console.log("A date has been picked: ", date);
    // let formatdate = moment(currentDate).format('hh:mm A');
    let formatdate = moment(date).format("hh:mm A");

    this.setState({
      isShowDataPicker: false,
      dosetime: formatdate,
      secondDoseAlrm: date,
      doseDuration: "Set end date"
    });

    this.hideDateTimePicker();
  };
  renderModalPicekr = () => {
    // console.log("modal date picker");
    return (
      <DateTimePicker
        mode="time"
        isVisible={this.state.isShowDataPicker}
        onConfirm={this.handleDatePicked}
        onCancel={this.hideDateTimePicker}
      />
    );
  };

  OpenDrawer = () => {
    this.props.navigation.goBack();
  };

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // console.log(
    //   " MedSecDose componentWillReceiveProps==============================",
    //   nextProp.route.params.firstDoseAlrm,
    //   nextProp.route.params.tabName,
    //   nextProp.route.params.takeFor,
    //   nextProp.route.params.tabStrength,
    //   nextProp.route.params.doseCount,
    //   nextProp.route.params.firstDose,
    //   nextProp.route.params.secondDose,
    //   nextProp.route.params.thirdDose,
    //   nextProp.route.params.firstDoseTime,
    //   nextProp.route.params.firstDoseAlrm,
    //   nextProp.route.params.secondDoseTime,
    //   nextProp.route.params.thirdDoseTime,
    //   nextProp.route.params.firstDoseQuantity,
    //   nextProp.route.params.secondDoseQuantity,
    //   nextProp.route.params.thirdDoseQuantity
    // );
    this.setState(
      {
        tabName: nextProp.route.params.tabName,
        takeFor: nextProp.route.params.takeFor,
        forwhome: nextProp.route.params.forwhome,

        tabStrength: nextProp.route.params.tabStrength,
        doseCount: nextProp.route.params.doseCount,
        firstDose: nextProp.route.params.firstDose,
        secondDose: nextProp.route.params.secondDose,
        thirdDose: nextProp.route.params.thirdDose,
        firstDoseTime: nextProp.route.params.firstDoseTime,
        firstDoseAlrm: nextProp.route.params.firstDoseAlrm,
        secondDoseTime: nextProp.route.params.secondDoseTime,
        secondDoseAlrm: nextProp.route.params.secondDoseAlrm,

        thirdDoseTime: nextProp.route.params.thirdDoseTime,
        thirdDoseAlrm: nextProp.route.params.thirdDoseAlrm,

        firstDoseQuantity: nextProp.route.params.firstDoseQuantity,
        secondDoseQuantity: nextProp.route.params.secondDoseQuantity,
        thirdDoseQuantity: nextProp.route.params.thirdDoseQuantity,
        selectedtcolor: nextProp.route.params.color
      },
      () => {}
    );
  };

  componentDidMount = async () => {
    console.log(this.props.route.params.color);
    // console.log(
    //   "MedSecDose componentDidMount==============================",
    //   this.props.route.params.firstDoseAlrm,

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
    //   this.props.route.params.thirdDoseQuantity
    // );
    this.setState(
      {
        forwhome: this.props.route.params.forwhome,
        tabName: this.props.route.params.tabName,
        takeFor: this.props.route.params.takeFor,
        tabStrength: this.props.route.params.tabStrength,
        doseCount: this.props.route.params.doseCount,
        firstDose: this.props.route.params.firstDose,
        secondDose: this.props.route.params.secondDose,
        thirdDose: this.props.route.params.thirdDose,
        firstDoseTime: this.props.route.params.firstDoseTime,
        firstDoseAlrm: this.props.route.params.firstDoseAlrm,
        secondDoseTime: this.props.route.params.secondDoseTime,
        secondDoseAlrm: this.props.route.params.secondDoseAlrm,

        thirdDoseTime: this.props.route.params.thirdDoseTime,
        thirdDoseAlrm: this.props.route.params.thirdDoseAlrm,

        firstDoseQuantity: this.props.route.params.firstDoseQuantity,
        secondDoseQuantity: this.props.route.params.secondDoseQuantity,
        thirdDoseQuantity: this.props.route.params.thirdDoseQuantity,
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

  saveData = async () => {
    try {
      this.props.navigation.navigate("MedicatnDoseTime", {
        refresh: "refresh"
      });
    } catch (e) {
      //alert('Failed to save the data to the storage')
    }
  };
  //For Android

  onChange = (event, selectedDate) => {
    console.log(selectedDate, "Second Dose time@@@@@selected Date");

    if (event.type == "set") {
      const currentDate = selectedDate;

      let formatdate = moment(currentDate).format("hh:mm A");
      // .replace(/\-/g, '/');

      this.setState({
        isShowDataPicker: false,
        dosetime: formatdate,
        secondDoseAlrm: selectedDate,
        doseDuration: "Set end date"
      });
    } else {
      this.setState({
        isShowDataPicker: false,
        // dosetime: formatdate, // formatdate,
        secondDoseAlrm: selectedDate,
        doseDuration: "Set end date"
      });
    }
  };

  renderDatePicker = () => {
    return (
      <>
        {Platform.OS === "ios"
          ? "ios"
          : "android" && (
              <RNDateTimePicker
                testID="dateTimePicker"
                value={new Date()}
                mode="time"
                is24Hour={false}
                display="default"
                onChange={this.onChange}
              />
            )}
      </>
    );
  };

  saveFirstDose = async () => {
    console.log("sec Dose call =================");

    if (this.state.dose == "") {
      Toast.show("Please Select Dose Time");

      //   Alert('Select Dose Time')
    } else {
      this.setState(
        {
          firstDose: this.state.dose,
          isOpen: "dosetime",
          title: "At what time of day do you take your second dose?"
        },
        () => {
          // this.setState({dose:''})
        }
      );
    }
  };

  Dosetimenext = async () => {
    // console.log("First Dose call =================", this.state.doseCount);

    if (
      this.state.dose == "" ||
      this.state.dosetime == "" ||
      this.state.medQuantity == ""
    ) {
      Toast.show("Please Select Dose Time and quantity");
    } else {
      if (this.state.doseCount > 2) {
        this.setState(
          {
            secondDose: this.state.dose,
            secondDoseTime: this.state.dosetime,
            secondDoseAlrm: this.state.secondDoseAlrm,
            secondDoseQuantity: this.state.medQuantity
          },
          () => {
            this.props.navigation.navigate("MedicationThirdDoseTime", {
              firstDose: this.state.firstDose,
              secondDose: this.state.secondDose,
              thirdDose: this.state.thirdDose,
              tabName: this.state.tabName,
              takeFor: this.state.takeFor,
              tabStrength: this.state.tabStrength,
              doseCount: this.state.doseCount,
              forwhome: this.state.forwhome,
              color: this.state.selectedtcolor,

              firstDoseTime: this.state.firstDoseTime,
              firstDoseAlrm: this.state.firstDoseAlrm,
              secondDoseTime: this.state.secondDoseTime,
              secondDoseAlrm: this.state.secondDoseAlrm,
              thirdDoseAlrm: this.state.thirdDoseAlrm,

              thirdDoseTime: this.state.thirdDoseTime,
              firstDoseQuantity: this.state.firstDoseQuantity,
              secondDoseQuantity: this.state.secondDoseQuantity,
              thirdDoseQuantity: this.state.thirdDoseQuantity
            });
          }
        );
        //this.setState({dose:'',isShow:'seconddose',title:'At what time of day do you take your second dose?'})
      } else {
        this.setState(
          {
            secondDose: this.state.dose,
            secondDoseTime: this.state.dosetime,
            secondDoseAlrm: this.state.secondDoseAlrm,
            secondDoseQuantity: this.state.medQuantity
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
              forwhome: this.state.forwhome,
              color: this.state.selectedtcolor,
              firstDoseTime: this.state.firstDoseTime,
              firstDoseAlrm: this.state.firstDoseAlrm,
              secondDoseTime: this.state.secondDoseTime,
              secondDoseAlrm: this.state.secondDoseAlrm,

              thirdDoseTime: this.state.thirdDoseTime,
              thirdDoseAlrm: this.state.thirdDoseAlrm,

              firstDoseQuantity: this.state.firstDoseQuantity,
              secondDoseQuantity: this.state.secondDoseQuantity,
              thirdDoseQuantity: this.state.thirdDoseQuantity
            });
          }
        );
      }
    }
  };

  // saveSecondDose = async () => {

  //   console.log('second Dose call =================')

  //   if (this.state.dose == ''){
  //     Toast.show('Please Select Dose Time')
  //   }else{
  //     if (this.state.doseCount > 2){
  //     this.setState({ secondDose:this.state.dose,isShow:'thirddose',title:'At what time of day do you take your third dose?'}, () => {
  //       this.setState({dose:''})
  //     });
  //   }else{
  //     this.setState({ secondDose:this.state.dose}, () => {
  //       this.props.navigation.navigate('MedicatnDoseTime',{firstDose:this.state.firstDose,
  //         secondDose:this.state.secondDose,
  //         thirdDose:this.state.thirdDose,
  //         tabName:this.state.tabName,
  //         takeFor:this.state.takeFor,
  //         tabStrength:this.state.tabStrength,
  //         doseCount:this.state.doseCount})
  //     });

  //   }
  // }
  // }

  // saveThirdDose = async () => {

  //   console.log('third Dose call =================')

  //   if (this.state.dose == ''){
  //     Toast.show('Please Select Dose Time')

  //   }else{
  //     if (this.state.doseCount > 2){
  //     this.setState({ thirdDose:this.state.dose}, () => {
  //       this.setState({dose:''})
  //         this.props.navigation.navigate('MedicatnDoseTime',{firstDose:this.state.firstDose,
  //           secondDose:this.state.secondDose,
  //           thirdDose:this.state.thirdDose,
  //           tabName:this.state.tabName,
  //           takeFor:this.state.takeFor,
  //           tabStrength:this.state.tabStrength,
  //           doseCount:this.state.doseCount})
  //       });

  //   }else{

  //   }
  // }
  // }

  DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  );
  render() {
    const { StatusBarManager } = NativeModules;
    const STATUSBAR_HEIGHT =
      Platform.OS === "ios" ? 20 : StatusBarManager.HEIGHT;
    console.log("statusheight===", StatusBarManager.HEIGHT);

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
                source={require("../../icons/firstdosetme.png")}
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
                  marginTop: 10,
                  marginLeft: 15,
                  marginRight: 15
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
          {this.state.isOpen == "dose" ? (
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                backgroundColor: "white"
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
                      marginLeft: 25
                    }}
                  >
                    Morning
                  </Text>
                  <View
                    style={{
                      height: 0.5,
                      backgroundColor: "#d8d8d8",
                      marginLeft: 15,
                      marginRight: 10,
                      marginTop: 10,
                      padding: 0.5
                    }}
                  />
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
                      marginLeft: 25
                    }}
                  >
                    Morning
                  </Text>
                  <View
                    style={{
                      height: 0.5,
                      backgroundColor: "#d8d8d8",
                      marginLeft: 15,
                      marginRight: 10,
                      marginTop: 10,
                      padding: 0.5
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
                      marginLeft: 25
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
                      marginTop: 10
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
                      marginLeft: 25
                    }}
                  >
                    Noon
                  </Text>
                  <View
                    style={{
                      height: 0.5,
                      backgroundColor: "#d8d8d8",
                      marginLeft: 25,
                      marginRight: 25,
                      marginTop: 10,
                      padding: 0.5
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
                      marginLeft: 25
                    }}
                  >
                    Evening
                  </Text>
                  <View
                    style={{
                      height: 0.5,
                      backgroundColor: "#d8d8d8",
                      padding: 0.5,
                      marginLeft: 25,
                      marginRight: 25,
                      marginTop: 10
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
                      marginLeft: 25
                    }}
                  >
                    Evening
                  </Text>
                  <View
                    style={{
                      height: 0.5,
                      backgroundColor: "#d8d8d8",
                      padding: 0.5,

                      marginLeft: 25,
                      marginRight: 25,
                      marginTop: 10
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
                      marginLeft: 25
                    }}
                  >
                    Night
                  </Text>
                  <View
                    style={{
                      height: 0.5,
                      backgroundColor: "#d8d8d8",
                      padding: 0.5,

                      marginLeft: 25,
                      marginRight: 25,
                      marginTop: 10
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
                      marginLeft: 25
                    }}
                  >
                    Night
                  </Text>
                  <View
                    style={{
                      height: 0.5,
                      backgroundColor: "#d8d8d8",
                      padding: 0.5,

                      marginLeft: 25,
                      marginRight: 25,
                      marginTop: 10
                    }}
                  ></View>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <this.DismissKeyboard>
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  backgroundColor: "white"
                }}
              >
                <View
                  style={{
                    height: 80,
                    flexDirection: "column",
                    backgroundColor: "white"
                  }}
                >
                  <TextInput
                    style={{
                      textAlign: "center",
                      flex: 1,
                      fontSize: 17,
                      marginLeft: 50,
                      marginRight: 50
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
                      backgroundColor: "#d8d8d8",
                      padding: 0.5,

                      marginLeft: 50,
                      marginRight: 50,
                      marginTop: 0
                    }}
                  ></View>
                </View>

                <View
                  style={{
                    height: 40,
                    marginLeft: 50,
                    marginRight: 50
                  }}
                >
                  <TouchableOpacity
                    style={{
                      height: 60,
                      flexDirection: "column",
                      marginBottom: 10,
                      marginTop: 80,
                      justifyContent: "center",
                      backgroundColor: "gray",
                      alignContent: "center",
                      alignItems: "center"
                    }}
                    onPress={() =>
                      this.setState({
                        isShowDataPicker: !this.state.isShowDataPicker
                      })
                    }
                  >
                    {this.state.dosetime != "" ? (
                      <Text
                        style={{
                          color: "white",

                          fontSize: 25
                        }}
                      >
                        {this.state.dosetime}
                        {/* {moment(this.state.dosetime).format('hh:mm A')} */}
                      </Text>
                    ) : (
                      <Text
                        style={{
                          fontSize: 25,
                          // marginLeft: 25,
                          color: "white"
                          // alignSelf: 'stretch',
                        }}
                      >
                        Dose time
                      </Text>
                    )}
                  </TouchableOpacity>
                  {Platform.OS === "ios" && this.state.isShowDataPicker
                    ? this.renderModalPicekr()
                    : null}
                  {this.state.isShowDataPicker &&
                    Platform.OS === "android" &&
                    this.renderDatePicker()}
                </View>
              </View>
            </this.DismissKeyboard>
          )}

          {this.state.isOpen == "dose" ? (
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
                onPress={() => this.saveFirstDose()}
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
                underlayColor="#fff"
                onPress={() => this.props.navigation.goBack()}
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
          ) : null}

          {this.state.isOpen == "dosetime" ? (
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
                onPress={() => this.Dosetimenext()}
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
                underlayColor="#fff"
                // new
                onPress={() => this.setState({ isOpen: "dose" })}
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
