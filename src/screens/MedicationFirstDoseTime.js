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
  Keyboard,
  TouchableWithoutFeedback
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

export default class MedicationFirstDoseTime extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowDataPicker: false,
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

      dosetime: "",

      firstDoseTime: "",
      firstDoseAlrm: "",
      secondDoseTime: "",
      secondDoseAlrm: "",
      thirdDoseTime: "",
      thirdDoseAlrm: "",

      medQuantity: "",
      firstDoseQuantity: "",
      secondDoseQuantity: "",
      thirdDoseQuantity: "",
      isShowDataPicker: false,

      isOpen: "dose",
      forwhome: "",
      selectedtcolor: ""
    };
  }

  OpenDrawer = () => {
    this.props.navigation.goBack();
  };

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    console.log(
      " MedDose componentWillReceiveProps==============================",
      nextProp.route.params.color
    );
    this.setState(
      {
        tabName: nextProp.route.params.tabName,
        takeFor: nextProp.route.params.takeFor,
        tabStrength: nextProp.route.params.tabStrength,
        doseCount: nextProp.route.params.doseCount,
        forwhome: nextProp.route.params.forwhome,
        selectedtcolor: nextProp.route.params.color
      },
      () => {}
    );
  };

  componentDidMount = async () => {
    console.log(
      "MedDose componentDidMount==============================",
      this.props.route.params.color
    );

    this.setState(
      {
        forwhome: this.props.route.params.forwhome,

        tabName: this.props.route.params.tabName,
        takeFor: this.props.route.params.takeFor,
        tabStrength: this.props.route.params.tabStrength,
        doseCount: this.props.route.params.doseCount,
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
  // AddMedication = () => {
  //   //Alert.alert(item.key,item.title);
  //   this.props.navigation.navigate('MedicationCalendrHome');
  // };

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
    //  console.log("onPressPatientView=================");
  };

  onPressMyDoctorView = () => {
    this.setState({ activebtn: "doctor" }, () => {
      this.saveData();
    });
    //  console.log("onPressMyDoctorView=================");
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

  saveFirstDose = async () => {
    // console.log("First Dose call =================");

    if (this.state.dose == "") {
      Toast.show("Please Select Dose Time");
    } else {
      this.setState(
        {
          firstDose: this.state.dose,
          isOpen: "dosetime",
          title: "At what time of day do you take your First dose?"
        },
        () => {
          //this.setState({dose:''})
        }
      );
      //this.setState({dose:'',isShow:'seconddose',title:'At what time of day do you take your second dose?'})
    }
  };

  //For Android

  onChange = (event, selectedDate) => {
    const now = new Date(selectedDate);
    // console.log("new date", new Date());
    // console.log(
    //   "added",
    //   now.getTime() + 330,
    //   new Date(now.getTime() + 330 * 60 * 1000)
    // );
    // console.log('now',now,'get hours',now.getHours(),'minute',now.getMinutes(),'sec',now.getSeconds(),'utc',now.getUTCDate(),'',now.getUTCHours());
    const date = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getUTCDate(),
      now.getMinutes(),
      now.getSeconds()
    );
    console.log(date, "date");
    if (event.type == "set") {
      const currentDate = selectedDate;
      let selctedtime = moment(currentDate).format("DD-MM-YYYY hh:mm:ss");
      let formatdate = moment(currentDate).format("hh:mm A");
      // .replace(/\-/g, '/');
      console.log(
        "selctedtime",
        selctedtime,
        "************",
        selectedDate,
        "selected time",
        selctedtime,
        "elected time"
      );
      this.setState({
        isShowDataPicker: false,
        // firstDoseAlrm:date,
        firstDoseAlrm: selectedDate,
        dosetime: formatdate,
        doseDuration: "Set end date"
      });
    } else {
      this.setState({
        isShowDataPicker: false,
        firstDoseAlrm: selectedDate,
        // dosetime: formatdate,
        doseDuration: "Set end date"
      });
    }
  };

  renderDatePicker = () => {
    return (
      <RNDateTimePicker
        testID="dateTimePicker"
        value={new Date()}
        mode="time"
        is24Hour={false}
        // display="default"
        // minimumDate={new Date()}
        // maximumDate={new Date('12/10/2021')}
        onChange={this.onChange}
      />
    );
  };

  // Modal picker

  showDateTimePicker = () => {
    // console.log("os d msnens@@@@@");
    this.setState({ isShowDataPicker: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isShowDataPicker: false });
  };

  handleDatePicked = (date) => {
    let formatdate = moment(date).format("hh:mm A");
    this.setState({
      isShowDataPicker: false,
      firstDoseAlrm: date,
      dosetime: formatdate,
      doseDuration: "Set end date"
    });

    this.hideDateTimePicker();
  };
  renderModalPicekr = () => {
    // console.log("modal date picker");

    return (
      <DateTimePicker
        mode="time"
        timePickerModeAndroid="clock"
        // locale="en_GB"
        isVisible={this.state.isShowDataPicker}
        onConfirm={this.handleDatePicked}
        onCancel={this.hideDateTimePicker}
      />
    );
  };

  DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  );
  Dosetimenext = async () => {
    // console.log("Next Dose time Dose call =================");

    if (
      this.state.dose == "" ||
      this.state.dosetime == "" ||
      this.state.medQuantity == ""
    ) {
      Toast.show("Please Select Dose Time and quantity");
    } else {
      if (this.state.doseCount > 1) {
        this.setState(
          {
            firstDose: this.state.dose,
            firstDoseTime: this.state.dosetime,
            firstDoseAlrm: this.state.firstDoseAlrm,
            firstDoseQuantity: this.state.medQuantity
          },
          () => {
            this.props.navigation.navigate("MedicationSecDoseTime", {
              firstDose: this.state.firstDose,
              secondDose: this.state.secondDose,
              thirdDose: this.state.thirdDose,
              tabName: this.state.tabName,
              takeFor: this.state.takeFor,
              forwhome: this.state.forwhome,
              color: this.state.selectedtcolor,
              tabStrength: this.state.tabStrength,
              doseCount: this.state.doseCount,

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
        //this.setState({dose:'',isShow:'seconddose',title:'At what time of day do you take your second dose?'})
      } else {
        this.setState(
          {
            firstDose: this.state.dose,
            firstDoseAlrm: this.state.firstDoseAlrm,

            firstDoseTime: this.state.dosetime,
            firstDoseQuantity: this.state.medQuantity
          },
          () => {
            this.props.navigation.navigate("MedicationStartDate", {
              firstDose: this.state.firstDose,
              secondDose: this.state.secondDose,
              thirdDose: this.state.thirdDose,
              tabName: this.state.tabName,
              takeFor: this.state.takeFor,
              forwhome: this.state.forwhome,
              color: this.state.selectedtcolor,
              tabStrength: this.state.tabStrength,
              doseCount: this.state.doseCount,

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
                source={require("../../icons/firstdosetme.png")}
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
                  style={{ height: 50, flexDirection: "column", marginTop: 5 }}
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
                      // backgroundColor: 'gray',
                      marginLeft: 25,
                      marginRight: 25,
                      marginTop: 10,
                      padding: 0.5
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
                      // backgroundColor: 'gray',
                      marginLeft: 25,
                      marginRight: 25,
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
                      backgroundColor: "#d8d8d8",
                      // backgroundColor: 'gray',
                      marginLeft: 25,
                      marginRight: 25,
                      marginTop: 10,
                      padding: 0.5
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
                      // backgroundColor: 'gray',
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
                      // backgroundColor: 'gray',
                      marginLeft: 25,
                      marginRight: 25,
                      marginTop: 10,
                      padding: 0.5
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
                      // backgroundColor: 'gray',
                      marginLeft: 25,
                      marginRight: 25,
                      marginTop: 10,
                      padding: 0.5
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
                      // backgroundColor: 'gray',
                      marginLeft: 25,
                      marginRight: 25,
                      marginTop: 10,
                      padding: 0.5
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
                      // backgroundColor: 'gray',
                      marginLeft: 25,
                      marginRight: 25,
                      marginTop: 10,
                      padding: 0.5
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
                    placeholder="Medicine Quantity "
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
                        {/* {moment(this.state.dosetime).format('hh:mm A')} */}
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
                  {this.state.isShowDataPicker
                    ? Platform.OS === "ios"
                      ? this.renderModalPicekr()
                      : null
                    : null}
                  {this.state.isShowDataPicker
                    ? Platform.OS === "android" && this.renderDatePicker()
                    : null}
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
