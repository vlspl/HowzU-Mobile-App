import React from "react";

import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  TextInput,
  BackHandler,
  Button
} from "react-native";
import { CommonActions } from "@react-navigation/native";

import CustomeHeader from "../appComponents/CustomeHeader";
import BookAppointmentLabComp from "../appComponents/BookAppointmentLabComp";
import Rediobutton from "../appComponents/Rediobutton";
import DatePicker from "react-native-datepicker";
const Rijndael = require("rijndael-js");

global.Buffer = global.Buffer || require("buffer").Buffer;

import Constants from "../utils/Constants";
import AsyncStorage from "@react-native-community/async-storage";
import Loader from "../appComponents/loader";
import { Container } from "native-base";
import Modal from "react-native-modal";
import Toast from "react-native-tiny-toast";
import {
  Collapse,
  CollapseHeader,
  CollapseBody
} from "accordion-collapse-react-native";
import { Thumbnail, List, ListItem, Separator } from "native-base";
import moment from "moment";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import DateTimePicker from "react-native-modal-datetime-picker";
import axios from "axios";
function getDayName(dateStr, locale) {
  var date = new Date(dateStr);
  return date.toLocaleDateString(locale, { weekday: "long" });
}

function getDayOfWeek(date) {
  const dayOfWeek = new Date(date).getDay();
  return isNaN(dayOfWeek)
    ? null
    : [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ][dayOfWeek];
}

function gettimezone(str) {
  var Array = str.split("-");
  var from = Array[0];
  const fromnumber = moment(from, ["HH.mm"]).format("hh:mm a");
  var to = Array[1];
  const tonumber = moment(to, ["HH.mm"]).format("hh:mm a");

  return fromnumber + " - " + tonumber;
}

export default class RescheduleBookAppointment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appointmenttype: "clinic",
      addressinput: "",
      bookingdate: "",
      labname: "",
      labcontact: "",
      labaddress: "",
      testprice: "",
      testids: "",
      testidprices: "",
      lablogo: "",
      labid: "",
      bookingId: "",
      isLoading: "",
      isModalVisible: false,
      labslotList: [],
      selectedtimeslot: "",
      selectedtimeslotID: "",
      morningslot: [],
      afternoonslot: [],
      eveningslot: [],
      testcount: "",
      testnames: "",
      docid: "",
      collapsed: true,
      isShowDataPicker: false,
      bookeddatefrom: "",
      dbappointmenttype: ""
    };
    /// this.onPressLifestyle = this.onPressLifestyle.bind(this);
  }

  // RN Picker
  renderDatePicker = () => {
    return (
      <>
        {Platform.OS === "ios"
          ? "ios"
          : "android" && (
            <RNDateTimePicker
              testID="dateTimePicker"
              value={new Date()}
              mode="date"
              is24Hour={true}
              display="default"
              minimumDate={new Date()}
              maximumDate={new Date("12/10/2021")}
              onChange={this.onChange}
            />
          )}
      </>
    );
  };
  //RN Picker Onchange
  onChange = (event, selectedDate) => {
    if (event.type == "set") {
      const currentDate = selectedDate || date;
      let formatdate = moment(currentDate).format("DD/MM/YYYY");
      // .replace(/\-/g, '/');

      // setShow(Platform.OS === 'ios');

      this.setState({
        // bookingdate: currentDate,
        bookingdate: formatdate,
        isShowDataPicker: false,
        selectedtimeslot: ""
      });
    } else {
      this.setState({
        isShowDataPicker: false
      });
    }
  };

  showDateTimePicker = () => {
    // console.log("os d msnens@@@@@");
    this.setState({ isShowDataPicker: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isShowDataPicker: false });
  };

  handleDatePicked = (date) => {
    // let formatdate = moment(currentDate).format('hh:mm A');
    let formatdate = moment(date).format("DD/MM/YYYY");

    this.setState({
      bookingdate: formatdate,
      isShowDataPicker: false,
      selectedtimeslot: ""
    });
    this.hideDateTimePicker();
  };
  renderModalPicekr = () => {
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

  onPresscalender = () => {
    //Alert.alert(item.key,item.title);
    // this.props.navigation.navigate("AllTestList")
  };

  onPresstimeslot = () => {
    //Alert.alert(item.key,item.title);
    // this.props.navigation.navigate("AllTestList")
  };

  UNSAFE_componentWillReceiveProps = (nextprops) => {
    // console.log(
    //   "UNSAFE_componentWillReceiveProps=============================="
    // );
    if (nextprops.route.params.from == "manually") {
      this.setState({
        addressinput: "",
        labname: "",
        labcontact: "",
        labaddress: "",
        testprice: "",
        testids: "",
        testidprices: "",
        lablogo: "",
        labid: "",
        isLoading: "",
        testcount: "",
        testnames: "",
        bookingdate: "",
        SampleCollectionAddress: "",
        dbappointmenttype: ""
      });

      this.setState({
        labname: nextprops.route.params.labinfo.LabName,
        labcontact: nextprops.route.params.labinfo.LabContact,
        labaddress: nextprops.route.params.labinfo.LabAddress,
        ///testprice: nextprops.route.params.labinfo.Total,
        testids: nextprops.route.params.labinfo.TestId,
        lablogo: nextprops.route.params.labinfo.LabLogo,
        labid: nextprops.route.params.labinfo.LabId,
        //testidprices: nextprops.route.params.labinfo.Testidprices ,
        testnames: nextprops.route.params.labinfo.TestName,
        bookingId: nextprops.route.params.labinfo.BookLabId,
        bookingdate: nextprops.route.params.labinfo.TestDate,
        selectedtimeslot: nextprops.route.params.labinfo.TimeSlot,
        bookeddatefrom: nextprops.route.params.labinfo.BookDate,
        appointmenttype: nextprops.route.params.labinfo.AppointmentType,
        dbappointmenttype: nextprops.route.params.labinfo.AppointmentType,
        addressinput: nextprops.route.params.labinfo.SampleCollectionAddress

        // addressinput:
        //   nextprops.route.params.labinfo.AppointmentType == "home"
        //     ? nextprops.route.params.labinfo.SampleCollectionAddress
        //     : nextprops.route.params.labinfo.LabAddress,
      });
    }
  };

  componentDidMount = () => {
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.hardwarebBackAction
    );
    if (this.props.route.params.from == "manually") {
      this.setState({
        labname: this.props.route.params.labinfo.LabName,
        labcontact: this.props.route.params.labinfo.LabContact,
        labaddress: this.props.route.params.labinfo.LabAddress,
        ///testprice: this.props.route.params.labinfo.Total,
        testids: this.props.route.params.labinfo.TestId,
        lablogo: this.props.route.params.labinfo.LabLogo,
        labid: this.props.route.params.labinfo.LabId,
        ///testidprices: this.props.route.params.labinfo.Testidprices,
        testnames: this.props.route.params.labinfo.TestName,
        bookingId: this.props.route.params.labinfo.BookLabId,
        bookingdate: this.props.route.params.labinfo.TestDate,
        selectedtimeslot: this.props.route.params.labinfo.TimeSlot,
        appointmenttype: this.props.route.params.labinfo.AppointmentType,
        dbappointmenttype: this.props.route.params.labinfo.AppointmentType,
        addressinput: this.props.route.params.labinfo.SampleCollectionAddress

        // addressinput:
        //   this.props.route.params.labinfo.AppointmentType == "home"
        //     ? this.props.route.params.labinfo.SampleCollectionAddress
        //     : this.props.route.params.labinfo.LabAddress,
      });
    }
  };

  handleSelectionMultiple = (id, slotid) => {
    //  console.log("SLOT TIME ==============================", id, slotid);
    const slot = gettimezone(id);

    this.setState({ selectedtimeslot: slot, selectedtimeslotID: slotid });
    //this.setState({selectedtimeslotID:slotid})
    this, this.DismissModal();
  };

  toggleModal = () => {
    /// this.setState({isModalVisible: !this.state.isModalVisible});

    if (this.state.bookingdate == "") {
      Toast.show("Please select booking date");
    } else {
      this.setState({ isLoading: true });

      this.Getlabdataslot();
    }
  };

  DismissModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  Getlabdataslot = async () => {
    // console.log("dateStr ==============", this.state.bookingdate);
    let day = moment(this.state.bookingdate, "DD/MM/YYYY").format("dddd");
    // console.log("dayName//////////// ==============", day);
    // console.log("labid//////////// ==============", this.state.labid);
    // console.log(
    //   "appointmenttype//////////// ==============",
    //   this.state.appointmenttype
    // );

    this.setState({ morningslot: [], afternoonslot: [], eveningslot: [] });
    // this.setState({ afternoonslot: []})
    // this.setState({ eveningslot: []})

    try {
      let response = await axios.post(Constants.LAB_DATASLOT, {
        LabId: this.state.labid,
        Weekday: day,
        AppointmentType: this.state.appointmenttype
      });
      // console.log("lab data slot ==============", response.data);
      this.setState({ isLoading: false });

      if (response.data.Status) {
        let morningData = this.state.morningslot;
        let afternoonData = this.state.afternoonslot;
        let eveningData = this.state.eveningslot;

        this.setState({ isModalVisible: !this.state.isModalVisible });

        response.data.LabSlotDetails.map((item) => {
          if (item.Slot == "Morning") {
            morningData.push(item);
          } else if (item.Slot == "Afternoon") {
            afternoonData.push(item);
          } else if (item.Slot == "Evening") {
            eveningData.push(item);
          }
        });
        this.setState({
          morningslot: morningData,
          afternoonslot: afternoonData,
          eveningslot: eveningData
        });
        ///this.setState({ afternoonslot: afternoonData})
        this.setState({ isLoading: false });
      } else {
        Toast.show(response.data.Msg);
        this.setState({ isLoading: false });
      }
    } catch (errors) {
      // Toast.show(errors);
      Toast.show("Something Went Wrong, Please Try Again Later");

      this.setState({ isLoading: false });
      console.log(errors);
    }
  };

  Decrypt = (encryptStr) => {
    // console.log("Decrypt  ====================================", encryptStr);
    if (encryptStr) {
      const cipher = new Rijndael("1234567890abcder", "cbc");
      const plaintext = Buffer.from(
        cipher.decrypt(
          new Buffer(encryptStr, "base64"),
          128,
          "1234567890abcder"
        )
      );
      return plaintext.toString();
    } else return "";
  };
  onPressSubmit = () => {
    // console.log("onPressSubmit response=================");
    // this.props.navigation.navigate("AllTestList")

    if (this.state.bookingdate == "") {
      Toast.show("Please select booking date");
    } else if (this.state.selectedtimeslot == "") {
      Toast.show("Please select Time slot");
    } else if (this.state.appointmenttype == "home") {
      if (this.state.addressinput == "") {
        Toast.show("Please Enter your address");
      } else {
        this.setState({ isLoading: true });
        this.BookAppointments();
      }
    } else {
      this.setState({ isLoading: true });
      this.BookAppointments();
    }
  };

  BookAppointments = async () => {
    // console.log("bookingId =================", this.state.bookingId);
    // console.log("TimeSlot =================", this.state.selectedtimeslot);
    // console.log("Booking date =================", this.state.bookingdate);
    // console.log("Type =================", this.state.appointmenttype);

    try {
      let response = await axios.post(Constants.TESTBOOK_RESCHEDULE, {
        BookingId: this.state.bookingId,
        TimeSlot: this.state.selectedtimeslot,
        TestDate: this.state.bookingdate,
        AppinmentType: this.state.appointmenttype,
        SampleCollectionAddress: this.state.addressinput
      });
      // console.log("data==============", response.data);
      this.setState({ loading: false });

      if (response.data.Status) {
        this.setState({ isLoading: false });
        Toast.show(response.data.Msg);
        //this.props.navigation.navigate("Appointments")
        // this.props.navigation.navigate('CheckStatus', {
        //   bookingid: this.state.bookingId,
        // });
        this.props.navigation.dispatch(
          CommonActions.reset({
            index: 1,

            routes: [
              {
                name: "Drawer"
              },
              {
                name: "CheckStatus",
                params: {
                  bookingid: this.state.bookingId,
                  from: "PrescriptionBookAppoint"
                }
              }
            ]
          })
        );
      } else {
        Toast.show(response.data.Msg);
        this.setState({ isLoading: false });
      }
    } catch (errors) {
      ///Toast.show(errors)
      Toast.show("Something Went Wrong, Please Try Again Later");

      this.setState({ isLoading: false });
      console.log(errors);
    }
  };

  hardwarebBackAction = () => {
    this.props.navigation.goBack();
    return true;
  };
  componentWillUnmount = () => {
    this.backHandler.remove();
  };
  render() {
    const screenWidth = Math.round(Dimensions.get("window").width);
    return (
      <Container>
        <CustomeHeader
          title="Appointment"
          headerId={1}
          navigation={this.props.navigation}
        />
        <Loader loading={this.state.isLoading} />
        <Modal isVisible={this.state.isModalVisible}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignContent: "center"
            }}
          >
            <View
              style={{
                height: "60%",
                width: "100%",
                backgroundColor: "white",
                flexDirection: "column",
                borderRadius: 0
              }}
            >
              <Image
                source={require("../../icons/clock_1.png")}
                style={{
                  height: 50,
                  width: 50,
                  marginTop: 10,
                  justifyContent: "center",
                  alignSelf: "center"
                }}
              />

              <Text
                style={{
                  marginTop: 10,
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "gray",
                  textAlign: "center"
                }}
              >
                Time Slot
              </Text>
              <View
                style={{
                  height: 0.5,
                  backgroundColor: "gray",
                  marginRight: 5,
                  marginTop: 8
                }}
              ></View>
              <ScrollView
                alwaysBounceVertical={true}
                showsHorizontalScrollIndicator={false}
                style={{
                  backgroundColor: "white",
                  marginTop: 0,
                  paddingHorizontal: 0
                }}
              >
                <Collapse isCollapsed={this.state.collapsed}>
                  <CollapseHeader
                    style={{ height: 50, backgroundColor: "white" }}
                  >
                    <Separator bordered>
                      <Text style={{ fontSize: 20 }}>Morning</Text>
                    </Separator>
                  </CollapseHeader>
                  <CollapseBody>
                    {this.state.morningslot.length > 0 ? (
                      this.state.morningslot.map((item, index) => {
                        const slot = gettimezone(item.From);

                        return (
                          <ListItem
                            onPress={() =>
                              this.handleSelectionMultiple(
                                item.From,
                                item.SlotId
                              )
                            }
                          >
                            {/* <TouchableOpacity> */}
                            <Text>{slot}</Text>
                            {/* </TouchableOpacity> */}
                          </ListItem>
                        );
                      })
                    ) : (
                      <ListItem>
                        <Text>No slot available</Text>
                      </ListItem>
                    )}
                  </CollapseBody>
                </Collapse>
                <Collapse isCollapsed={this.state.collapsed}>
                  <CollapseHeader
                    style={{ height: 50, backgroundColor: "white" }}
                  >
                    <Separator bordered>
                      <Text style={{ fontSize: 20 }}>Afternoon</Text>
                    </Separator>
                  </CollapseHeader>
                  <CollapseBody>
                    {this.state.afternoonslot.length > 0 ? (
                      this.state.afternoonslot.map((item, index) => {
                        const slot = gettimezone(item.From);

                        return (
                          <ListItem
                            onPress={() =>
                              this.handleSelectionMultiple(
                                item.From,
                                item.SlotId
                              )
                            }
                          >
                            <Text>{slot}</Text>
                          </ListItem>
                        );
                      })
                    ) : (
                      <ListItem>
                        <Text>No slot available</Text>
                      </ListItem>
                    )}
                  </CollapseBody>
                </Collapse>

                <Collapse isCollapsed={this.state.collapsed}>
                  <CollapseHeader
                    style={{ height: 50, backgroundColor: "white" }}
                  >
                    <Separator bordered>
                      <Text style={{ fontSize: 20 }}>Evening</Text>
                    </Separator>
                  </CollapseHeader>
                  <CollapseBody>
                    {this.state.eveningslot.length > 0 ? (
                      this.state.eveningslot.map((item, index) => {
                        const slot = gettimezone(item.From);

                        return (
                          <ListItem
                            onPress={() =>
                              this.handleSelectionMultiple(
                                item.From,
                                item.SlotId
                              )
                            }
                          >
                            {/* <TouchableOpacity> */}
                            <Text>{slot}</Text>
                            {/* </TouchableOpacity> */}
                          </ListItem>
                        );
                      })
                    ) : (
                      <ListItem>
                        <Text>No slot available</Text>
                      </ListItem>
                    )}
                  </CollapseBody>
                </Collapse>
              </ScrollView>
            </View>
          </View>
        </Modal>
        <View style={styles.MainContainer}>
          <ScrollView
            alwaysBounceVertical={true}
            showsHorizontalScrollIndicator={false}
            style={{
              backgroundColor: "white",
              marginTop: 0,
              paddingHorizontal: 15
            }}
          >
            <BookAppointmentLabComp
              lablogo={{ uri: Constants.LAB_LOGO + this.state.lablogo }}
              labname={this.state.labname}
              address={this.state.testnames}
              phone={this.Decrypt(this.state.labcontact)}
            ></BookAppointmentLabComp>

            <View style={{ flex: 1, flexDirection: "column" }}>
              <Text style={{ marginTop: 10, fontSize: 14, fontWeight: "bold" }}>
                Appointment Type
              </Text>
              <View
                style={{
                  height: 0.5,
                  backgroundColor: "gray",
                  marginRight: 5,
                  marginTop: 8
                }}
              ></View>
              <View
                style={{
                  height: 40,
                  backgroundColor: "transparent",
                  marginTop: 5,
                  flexDirection: "row"
                }}
              >
                {this.state.appointmenttype == "clinic" ? (
                  <Rediobutton
                    onpress={() =>
                      this.setState({
                        appointmenttype: "clinic",
                        selectedtimeslot: "",
                        bookingdate: ""
                      })
                    }
                    buttonimg={require("../../icons/radio-on.png")}
                    gender="Clinic"
                  ></Rediobutton>
                ) : (
                  <Rediobutton
                    onpress={() =>
                      this.setState({
                        appointmenttype: "clinic",
                        selectedtimeslot: "",
                        bookingdate: ""
                      })
                    }
                    buttonimg={require("../../icons/radio-off.png")}
                    gender="Clinic"
                  ></Rediobutton>
                )}
                {this.state.appointmenttype == "home" ? (
                  <Rediobutton
                    onpress={() =>
                      this.setState({
                        appointmenttype: "home",
                        selectedtimeslot: "",
                        bookingdate: ""
                      })
                    }
                    buttonimg={require("../../icons/radio-on.png")}
                    gender="Home"
                  ></Rediobutton>
                ) : (
                  <Rediobutton
                    onpress={() =>
                      this.setState({
                        appointmenttype: "home",
                        selectedtimeslot: "",
                        bookingdate: ""
                      })
                    }
                    buttonimg={require("../../icons/radio-off.png")}
                    gender="Home"
                  ></Rediobutton>
                )}
              </View>
              {this.state.appointmenttype == "clinic" ? (
                <Text
                  style={{ marginTop: 20, fontSize: 14, fontWeight: "bold" }}
                >
                  Address
                </Text>
              ) : (
                <Text
                  style={{ marginTop: 20, fontSize: 14, fontWeight: "bold" }}
                >
                  Add Address
                </Text>
              )}

              <View
                style={{
                  height: 80,
                  backgroundColor: "white",
                  marginRight: 5,
                  marginTop: 15,
                  borderRadius: 20,
                  borderColor: "gray",
                  borderWidth: 0.5,
                  padding: 8,
                  justifyContent: "center",
                  alignItems: "flex-start"
                }}
              >
                {this.state.appointmenttype == "clinic" ? (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "flex-start",
                      alignItems: "flex-start"
                    }}
                  >
                    <ScrollView>
                      <Text
                        style={{
                          flex: 1,
                          backgroundColor: "white",
                          color: "black",
                          padding: 5,
                          marginTop: 15,
                          marginLeft: 5
                        }}
                        onChangeText=""
                        multiline={true}
                        underlineColorAndroid="transparent"
                        placeholder=""
                        editable={false}
                      >
                        {this.state.labaddress}
                      </Text>
                    </ScrollView>
                  </View>
                ) : (
                  <>
                    {Platform.OS == "ios" ? (
                      <TextInput
                        style={{
                          flex: 1,
                          backgroundColor: "white",
                          color: "black"
                        }}
                        value={this.state.addressinput}
                        onChangeText={(text) =>
                          this.setState({ addressinput: text })
                        }
                        multiline={true}
                        underlineColorAndroid="transparent"
                        placeholder="Enter your address here..."
                        allowFontScaling={false}
                      />
                    ) : (
                      <ScrollView>
                        <TextInput
                          style={{
                            flex: 1,
                            backgroundColor: "white",
                            color: "black",
                            marginLeft: 17,
                            textAlignVertical: "top",
                            textAlign: "left"
                          }}
                          numberOfLines={1}
                          value={this.state.addressinput}
                          onChangeText={(text) =>
                            this.setState({ addressinput: text })
                          }
                          multiline={true}
                          underlineColorAndroid="transparent"
                          placeholder="Enter your address here..."
                          allowFontScaling={false}
                        />
                      </ScrollView>
                    )}
                  </>
                )}
              </View>

              <View
                style={{
                  height: 40,
                  backgroundColor: "white",
                  marginRight: 5,
                  marginTop: 20,
                  borderRadius: 25,
                  borderColor: "gray",
                  borderWidth: 0.5,
                  flexDirection: "row-reverse"
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      isShowDataPicker: !this.state.isShowDataPicker
                    })
                  }
                  style={{ justifyContent: "center" }}
                >
                  <Image
                    source={require("../../icons/date-of-birth.png")}
                    style={{
                      height: 20,
                      width: 20,
                      marginRight: 18,
                      justifyContent: "center",
                      alignSelf: "center"
                    }}
                  />
                  {this.state.isShowDataPicker
                    ? this.renderModalPicekr()
                    : null}
                </TouchableOpacity>
                <View
                  style={{
                    height: 25,
                    width: 1,
                    marginTop: 8,
                    marginBottom: 8,
                    marginRight: 10,
                    backgroundColor: "lightgray"
                  }}
                ></View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    marginLeft: 12
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      this.setState({
                        isShowDataPicker: !this.state.isShowDataPicker
                      })
                    }
                    style={{ justifyContent: "center" }}
                  >
                    {/* <Text
                      style={{
                        marginLeft: 12,
                        color: "black",
                        alignSelf: "flex-start",
                      }}
                    >
                      {this.state.bookingdate}
                    </Text> */}
                    {this.state.bookingdate != "" ? (
                      <Text
                        style={{
                          marginLeft: 12,
                          color: "black",
                          alignSelf: "stretch"
                        }}
                      >
                        {this.state.bookingdate}
                      </Text>
                    ) : (
                      <Text
                        style={{
                          marginLeft: 12,
                          color: "gray",
                          alignSelf: "stretch"
                        }}
                      >
                        Date of Booking
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <Text
                style={{
                  marginTop: 20,
                  fontSize: 14,
                  marginLeft: 5,
                  fontWeight: "bold"
                }}
              >
                Select time slot
              </Text>

              <View
                style={{
                  height: 40,
                  backgroundColor: "white",
                  marginRight: 5,
                  marginTop: 15,
                  borderRadius: 20,
                  borderColor: "gray",
                  borderWidth: 0.5,
                  flexDirection: "row-reverse"
                }}
              >
                <TouchableOpacity
                  style={{
                    height: 20,
                    width: 20,
                    marginRight: 18,
                    justifyContent: "center",
                    alignSelf: "center"
                  }}
                  onPress={this.toggleModal}
                >
                  <Image
                    source={require("../../icons/clock_1.png")}
                    style={{
                      height: 20,
                      width: 20,
                      marginRight: 0,
                      justifyContent: "center",
                      alignSelf: "center"
                    }}
                  />
                </TouchableOpacity>

                <View
                  style={{
                    height: 25,
                    width: 1,
                    marginTop: 8,
                    marginBottom: 8,
                    marginRight: 10,
                    backgroundColor: "lightgray"
                  }}
                ></View>

                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    marginLeft: 12
                  }}
                >
                  <TouchableOpacity onPress={this.toggleModal}>
                    {this.state.selectedtimeslot === undefined ||
                      this.state.selectedtimeslot == "" ? (
                      <Text
                        style={{
                          marginLeft: 12,
                          color: "gray",
                          alignSelf: "stretch"
                        }}
                      >
                        Select time slot
                      </Text>
                    ) : (
                      <Text
                        style={{
                          marginLeft: 12,
                          color: "black",
                          alignSelf: "stretch"
                        }}
                      >
                        {this.state.selectedtimeslot}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={{
                  backgroundColor: "#1B2B34",
                  marginTop: 30,
                  borderRadius: 20,
                  height: 40,
                  justifyContent: "center",
                  shadowOffset: { width: 2, height: 3 },
                  shadowColor: "gray",
                  shadowOpacity: 0.9,
                  elevation: 5
                }}
                onPress={this.onPressSubmit}
              >
                <Text
                  style={{
                    textAlign: "center",
                    alignSelf: "center",
                    fontSize: 18,
                    color: "white",
                    fontWeight: "bold",
                    marginBottom: 10
                  }}
                >
                  SUBMIT
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
    backgroundColor: "white"
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
  }
});
