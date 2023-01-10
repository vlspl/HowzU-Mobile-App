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
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import { Container, Header } from "native-base";
import AsyncStorage from "@react-native-community/async-storage";
import Constants from "../utils/Constants";
import DatePicker from "react-native-datepicker";
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

export default class MedicationThirdDoseTime extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activebtn: "doctor",
      userrole: "",
      isloading: false,
      dose: "",
      title: "At what time of day do you take your Third dose?",
      firstDose: "",
      secondDose: "",
      thirdDose: "",
      isShow: "firstdose",
      tabName: "",
      takeFor: "",
      tabStrength: "",
      doseCount: 0,
      isShowDataPicker: false,
      dosetime: "",
      selectedtcolor: "",
      firstDoseTime: "",
      secondDoseTime: "",
      thirdDoseTime: "",
      firstDoseAlrm: "",
      secondDoseAlrm: "",
      thirdDoseAlrm: "",
      medQuantity: "",
      firstDoseQuantity: "",
      secondDoseQuantity: "",
      thirdDoseQuantity: "",
      forwhome: "",
      isOpen: "dose"
    };
  }

  showDateTimePicker = () => {
    //  console.log('os d msnens@@@@@')
    this.setState({ isShowDataPicker: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isShowDataPicker: false });
  };

  handleDatePicked = (date) => {
    let formatdate = moment(date).format("hh:mm A");
    this.setState({
      isShowDataPicker: false,
      dosetime: formatdate,
      thirdDoseAlrm: date,
      doseDuration: "Set end date"
    });
    // console.log("A date has been picked: ", date);
    this.hideDateTimePicker();
  };
  renderModalPicekr = () => {
    // console.log('modal date picker')
    return (
      <DateTimePicker
        isVisible={this.state.isShowDataPicker}
        onConfirm={this.handleDatePicked}
        onCancel={this.hideDateTimePicker}
        mode="time"
      />
    );
  };
  //For Android

  onChange = (event, selectedDate) => {
    // console.log(selectedDate, '@@@@@ thired Dose selected Date');
    if (event.type == "set") {
      const currentDate = selectedDate || date;

      let formatdate = moment(currentDate).format("hh:mm A");
      // .replace(/\-/g, '/');

      this.setState({
        isShowDataPicker: false,
        dosetime: formatdate,
        thirdDoseAlrm: selectedDate,
        doseDuration: "Set end date"
      });
    } else {
      this.setState({
        isShowDataPicker: false,
        // dosetime: formatdate,
        thirdDoseAlrm: selectedDate,
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
              // minimumDate={new Date()}
              // maximumDate={new Date('12/10/2021')}
              onChange={this.onChange}
            />
          )}
      </>
    );
  };

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
    //   " MedthirdDose componentWillReceiveProps==============================",
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
    //   nextProp.route.params.firstDoseQuantity,
    //   nextProp.route.params.secondDoseQuantity,
    //   nextProp.route.params.thirdDoseQuantity,
    //   nextProp.route.params.firstDoseAlrm,
    //   nextProp.route.params.secondDoseAlrm,
    //   nextProp.route.params.thirdDoseAlrm
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
        firstDoseTime: nextProp.route.params.firstDoseTime,
        secondDoseTime: nextProp.route.params.secondDoseTime,
        forwhome: nextProp.route.params.forwhome,
        selectedtcolor: nextProp.route.params.color,

        firstDoseAlrm: nextProp.route.params.firstDoseAlrm,
        secondDoseAlrm: nextProp.route.params.secondDoseAlrm,
        thirdDoseAlrm: nextProp.route.params.thirdDoseAlrm,
        thirdDoseTime: nextProp.route.params.thirdDoseTime,
        firstDoseQuantity: nextProp.route.params.firstDoseQuantity,
        secondDoseQuantity: nextProp.route.params.secondDoseQuantity,
        thirdDoseQuantity: nextProp.route.params.thirdDoseQuantity
      },
      () => { }
    );
  };

  componentDidMount = async () => {
    // console.log(
    //   "MedthirdDose componentDidMount==============================",
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
    //   this.props.route.params.firstDoseAlrm,
    //   this.props.route.params.secondDoseAlrm,
    //   this.props.route.params.thirdDoseAlrm
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
        firstDoseTime: this.props.route.params.firstDoseTime,
        secondDoseTime: this.props.route.params.secondDoseTime,
        thirdDoseTime: this.props.route.params.thirdDoseTime,
        firstDoseAlrm: this.props.route.params.firstDoseAlrm,
        secondDoseAlrm: this.props.route.params.secondDoseAlrm,
        thirdDoseAlrm: this.props.route.params.thirdDoseAlrm,
        forwhome: this.props.route.params.forwhome,
        firstDoseQuantity: this.props.route.params.firstDoseQuantity,
        secondDoseQuantity: this.props.route.params.secondDoseQuantity,
        thirdDoseQuantity: this.props.route.params.thirdDoseQuantity,
        selectedtcolor: this.props.route.params.color
      },
      () => { }
    );
  };

  // AddMedication = () => {
  //   //Alert.alert(item.key,item.title);
  //   this.props.navigation.navigate('MedicationCalendrHome');
  // };

  onPressSelect = (selectStr) => {
    if (selectStr == "Morning") {
      this.setState({ dose: "Morning" }, () => { });
    } else if (selectStr == "Noon") {
      this.setState({ dose: "Noon" }, () => { });
    } else if (selectStr == "Evening") {
      this.setState({ dose: "Evening" }, () => { });
    } else if (selectStr == "Night") {
      this.setState({ dose: "Night" }, () => { });
    }
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
      this.props.navigation.navigate("MedicatnDoseTime", {
        refresh: "refresh"
      });
    } catch (e) {
      //alert('Failed to save the data to the storage')
    }
  };

  saveFirstDose = async () => {
    if (this.state.dose == "") {
      Toast.show("Please Select Dose Time");

      //   Alert('Select Dose Time')
    } else {
      this.setState(
        {
          firstDose: this.state.dose,
          isOpen: "dosetime",
          title: "At what time of day do you take your Third dose?"
        },
        () => {
          //this.setState({dose:''})
        }
      );
      //this.setState({dose:'',isShow:'seconddose',title:'At what time of day do you take your second dose?'})
    }
  };

  Dosetimenext = async () => {
    if (
      this.state.dose == "" ||
      this.state.dosetime == "" ||
      this.state.medQuantity == ""
    ) {
      Toast.show("Please Select Dose Time and quantity");
    } else {
      this.setState(
        {
          thirdDose: this.state.dose,
          thirdDoseTime: this.state.dosetime,
          thirdDoseAlrm: this.state.thirdDoseAlrm,
          thirdDoseQuantity: this.state.medQuantity
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
            color: this.state.selectedtcolor,

            firstDoseTime: this.state.firstDoseTime,
            secondDoseTime: this.state.secondDoseTime,
            thirdDoseTime: this.state.thirdDoseTime,
            firstDoseAlrm: this.state.firstDoseAlrm,
            secondDoseAlrm: this.state.secondDoseAlrm,
            thirdDoseAlrm: this.state.thirdDoseAlrm,
            forwhome: this.state.forwhome,

            firstDoseQuantity: this.state.firstDoseQuantity,
            secondDoseQuantity: this.state.secondDoseQuantity,
            thirdDoseQuantity: this.state.thirdDoseQuantity
          });
        }
      );
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
                      padding: 0.5,

                      marginLeft: 25,
                      marginRight: 25,
                      marginTop: 10
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
                      padding: 0.5,

                      marginLeft: 25,
                      marginRight: 25,
                      marginTop: 10
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
                  {/* <Text
                  style={{
                    flex: 1,
                    marginLeft: 50,
                    color: 'gray',
                    marginTop: 20,
                  }}
                >
                  Enter Medicine Quantity
                </Text> */}
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
                      backgroundColor: "gray",
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
                          // marginLeft: 25,
                          color: "white",
                          // alignSelf: 'stretch',
                          fontSize: 25
                        }}
                      >
                        {this.state.dosetime}
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
                  {this.state.isShowDataPicker && Platform.OS === "ios"
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
