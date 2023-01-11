import React from "react";

import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput
} from "react-native";
// import RNDateTimePicker from '@react-native-community/datetimepicker';
import CustomeHeader from "../appComponents/CustomeHeader";
import BookAppointmentLabComp from "../appComponents/BookAppointmentLabComp";
import Rediobutton from "../appComponents/Rediobutton";
import Constants from "../utils/Constants";
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
import axios from "axios";
const Rijndael = require("rijndael-js");
import { CommonActions } from "@react-navigation/native";
import DateTimePicker from "react-native-modal-datetime-picker";
import { color } from "react-native-reanimated";

//const bufferFrom = require('buffer-from')
global.Buffer = global.Buffer || require("buffer").Buffer;

function gettimezone(str) {
  // console.log(str, "get time zone ########*******");
  var Array = str.split("-");
  var from = Array[0];
  const fromnumber = moment(from, ["HH.mm"]).format("hh:mm a");
  var to = Array[1];
  const tonumber = moment(to, ["HH.mm"]).format("hh:mm a");

  return fromnumber + " - " + tonumber;
}

export default class PatientdashboardComp extends React.Component {
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
      RcomId: "",
      fromPage: "",
      slottosendforbooking: "",
      isonlinePayment: false,
      PaymentMethod: "",
      isDateTimePickerVisible: false
    };
    /// this.onPressLifestyle = this.onPressLifestyle.bind(this);
  }

  UNSAFE_componentWillReceiveProps = (nextprops) => {
    // console.log(
    //   "******Book Appointment UNSAFE_componentWillReceiveProps of Suggested Test Booking==============================",
    //   nextprops.route.params.labinfo
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
        selectedtimeslot: "",
        docid: "",
        fromPage: "",
        isonlinePayment: false,
        PaymentMethod: ""
      });

      let count = nextprops.route.params.labinfo.Testids.replace(
        /(^,)|(,$)/g,
        ""
      ).split(",").length;
      // console.log("test count ==============================", count);
      // console.log(
      //   "test ids ==============================",
      //   nextprops.route.params.labinfo.Testids
      // );
      // console.log(
      //   "test prices ==============================",
      //   nextprops.route.params.labinfo.Testidprices
      // );

      this.setState({
        testcount: count,
        docid: nextprops.route.params.labinfo.DoctorId,
        // RcomId: nextprops.route.params.RecommendationId,
        labname: nextprops.route.params.labinfo.LabName,
        labcontact: nextprops.route.params.labinfo.LabContact,
        labaddress: nextprops.route.params.labinfo.LabAddress,
        testprice: nextprops.route.params.labinfo.Total,
        testids: nextprops.route.params.labinfo.Testids,
        lablogo: nextprops.route.params.labinfo.LabLogo,
        labid: nextprops.route.params.labinfo.LabId,
        testidprices: nextprops.route.params.labinfo.Testidprices,
        testnames: nextprops.route.params.labinfo.Testnames,
        fromPage: nextprops.route.params.from,
        isonlinePayment: nextprops.route.params.labinfo.LabOnlinePayment
      });
    } else {
      // console.log("Suggested test Booking");
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
        selectedtimeslot: "",
        docid: "",
        RcomId: "",
        fromPage: "",
        isonlinePayment: false,
        PaymentMethod: "",
        bookingdate: ""
      });

      let count = nextprops.route.params.labinfo.testId.split(",").length;
      // console.log("suggested test count ==============================", count);
      // console.log(
      //   " suggested test ids ==============================",
      //   nextprops.route.params.labinfo.testId
      // );
      // console.log(
      //   " suggested test prices ==============================",
      //   nextprops.route.params.labinfo.TestPrice
      // );
      this.setState({
        testcount: count,
        docid: nextprops.route.params.labinfo.DoctorId,
        RcomId: nextprops.route.params.labinfo.RecommendationId,
        labname: nextprops.route.params.labinfo.LabName,
        labcontact: nextprops.route.params.labinfo.LabContact,
        labaddress: nextprops.route.params.labinfo.LabAddress,

        // labcontact: this.props.route.params.labinfo.LabContact,
        // labaddress: this.props.route.params.labinfo.LabAddress,
        testprice: nextprops.route.params.labinfo.Total,
        testids: nextprops.route.params.labinfo.testId,
        lablogo: nextprops.route.params.labinfo.LabLogo,

        // lablogo: this.props.route.params.labinfo.LabLogo,
        labid: nextprops.route.params.labinfo.LabId,
        testidprices: nextprops.route.params.labinfo.TestPrice,
        testnames: nextprops.route.params.labinfo.TestName,
        fromPage: nextprops.route.params.from,
        isonlinePayment: nextprops.route.params.labinfo.LabOnlinePayment
      });
    }
  };
  hardwarebBackAction = () => {
    this.props.navigation.goBack();
    return true;
  };
  componentWillUnmount = () => {
    // this.backHandler.remove();
  };

  componentDidMount = () => {
    // this.backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.hardwarebBackAction
    // );
    // console.log(
    //   " test Booking  componentDidMount==============================",
    //   this.props.route.params
    // );
    if (this.props.route.params.from == "manually") {
      let count = this.props.route.params.labinfo.Testids.replace(
        /(^,)|(,$)/g,
        ""
      ).split(",").length;
      // console.log("test count ==============================", count);
      // console.log(
      //   "test ids ==============================",
      //   this.props.route.params.labinfo.Testids
      // );
      // console.log(
      //   "test prices ==============================",
      //   this.props.route.params.labinfo.Testidprices
      // );
      this.setState({
        testcount: count,
        docid: this.props.route.params.DoctorId,
        // RcomId: this.props.route.params.RecommendationId,
        labname: this.props.route.params.labinfo.LabName,
        labcontact: this.props.route.params.labinfo.LabContact,
        labaddress: this.props.route.params.labinfo.LabAddress,
        testprice: this.props.route.params.labinfo.Total,
        testids: this.props.route.params.labinfo.Testids,
        lablogo: this.props.route.params.labinfo.LabLogo,
        labid: this.props.route.params.labinfo.LabId,
        testidprices: this.props.route.params.labinfo.Testidprices,
        testnames: this.props.route.params.labinfo.Testnames,
        fromPage: this.props.route.params.from,
        isonlinePayment: this.props.route.params.labinfo.LabOnlinePayment,
        bookingdate: ""
      });
    } else {
      let count = this.props.route.params.labinfo.testId.split(",").length;
      // console.log(this.props.route.params.labinfo.testId.split(',').length,'suggested test count ==============================', count);
      // console.log(
      //   " suggested test ids ==============================",
      //   this.props.route.params.labinfo
      // );
      // console.log(
      //   ' suggested test prices ==============================',
      //   this.props.route.params.labinfo.TestPrice
      // );

      // {"DoctorId": "1", "LabId": "3", "RecomendationId": "10", "TestId": "121,123", "Type": "Test"},
      this.setState({
        testcount: count,
        docid: this.props.route.params.labinfo.DoctorId,
        RcomId: this.props.route.params.labinfo.RecommendationId,
        labname: this.props.route.params.labinfo.LabName,
        labcontact: this.props.route.params.labinfo.LabContact,
        labaddress: this.props.route.params.labinfo.LabAddress,
        testprice: this.props.route.params.labinfo.Total,
        testids: this.props.route.params.labinfo.testId,
        lablogo: this.props.route.params.labinfo.LabLogo,
        labid: this.props.route.params.labinfo.LabId,
        testidprices: this.props.route.params.labinfo.TestPrice,
        testnames: this.props.route.params.labinfo.TestName,
        fromPage: this.props.route.params.from,
        isonlinePayment: this.props.route.params.labinfo.LabOnlinePayment,
        bookingdate: ""
      });
    }
  };

  handleSelectionMultiple = (id, slotid) => {
    // console.log("SLOT TIME ==============================", id, slotid);
    const slot = gettimezone(id);

    this.setState({
      selectedtimeslot: slot,
      selectedtimeslotID: slotid,
      slottosendforbooking: id
    });
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
    // console.log('dateStr ==============', this.state.bookingdate);
    let day = moment(this.state.bookingdate, "DD/MM/YYYY").format("dddd");
    // console.log('dayName//////////// ==============', day);
    // console.log('labid//////////// ==============', this.state.labid);
    // console.log(
    //   'appointmenttype//////////// ==============',
    //   this.state.appointmenttype
    // );

    this.setState({ morningslot: [], afternoonslot: [], eveningslot: [] });

    try {
      let response = await axios.post(Constants.LAB_DATASLOT, {
        LabId: this.state.labid,
        Weekday: day,
        AppointmentType: this.state.appointmenttype
      });
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
        this.setState({ isLoading: false, isModalVisible: false });
      }
    } catch (errors) {
      // Toast.show(" Network Error");
      Toast.show("Something Went Wrong, Please Try Again Later");

      this.setState({ isLoading: false, isModalVisible: false });
      console.log(errors);
    }
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
        if (this.state.fromPage == "manually") this.BookAppointments();
        else {
          this.suggestedBookAppointments();
        }
      }
    } else {
      this.setState({ isLoading: true });
      if (this.state.fromPage == "manually") this.BookAppointments();
      else {
        this.suggestedBookAppointments();
      }
    }
  };

  suggestedBookAppointments = async () => {
    // var dt = this.state.bookingdate.toDateString();

    // console.log('LabId =================', this.state.labid);
    // console.log('TimeSlot =================', this.state.selectedtimeslot);
    // console.log(
    //   'Booking date =================',
    //   this.state.bookingdate,

    //   'Its formatted'
    // );
    // console.log('total amount =================', this.state.testprice);
    // console.log('Type =================', this.state.appointmenttype);
    // console.log(
    //   'TestIds =================',
    //   this.state.testids.replace(/(^,)|(,$)/g, '')
    // );
    // console.log(
    //   'Test Prices =================',
    //   this.state.testidprices.replace(/(^,)|(,$)/g, '')
    // );
    // console.log('Test count =================', this.state.testcount);
    // console.log('Docor id', this.state.docid);
    // console.log('RecommendationId id', this.state.RcomId);
    let PaymentMethod = "";
    PaymentMethod = this.state.isonlinePayment ? "Online" : "";

    try {
      let response = await axios.post(Constants.BOOK_SUGGESTED_APPOINTMENT, {
        LabId: this.state.labid,
        DoctorId: this.state.docid,
        TimeSlot: this.state.slottosendforbooking,
        TestDate: this.state.bookingdate,
        // TestDate: formatdate.replace(/\-/g, '/'),
        TotalAmount: this.state.testprice,
        AppointmentType: this.state.appointmenttype,
        TestCount: this.state.testcount,
        TestId: this.state.testids.replace(/(^,)|(,$)/g, ""),
        TestPrice: this.state.testidprices.replace(/(^,)|(,$)/g, ""),
        SampleCollectionAddress: this.state.addressinput,
        RcomId: this.state.RcomId,
        SlotId: this.state.selectedtimeslotID,
        PaymentMethod: PaymentMethod
      });
      // console.log('data==============', response.data);
      this.setState({ loading: false });

      if (response.data.Status) {
        // Toast.show(response.data.Msg);
        this.setState({ isLoading: false });
        // Toast.show('Navigating to the Payment Page ')
        // this.props.navigation.navigate('Appointments');
        // this.props.navigation.navigate('CheckStatus', {
        //   bookingid: response.data.BookingId,
        // });

        //change from Chekstatus to new Screen Payment where user can pay the  and tehn oly navigate to chek status

        if (this.state.isonlinePayment) {
          this.props.navigation.navigate("PayBookingAmount", {
            bookingid: response.data.BookingId
          });
        }
        // else {
        //   this.props.navigation.navigate('CheckStatus', {
        //     bookingid: response.data.BookingId,
        //   });
        // }
        else {
          Toast.show(response.data.Msg);
          // this.props.navigation.navigate('PatientDashboard');
          this.props.navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [
                {
                  name: "Drawer"
                },
                {
                  name: "Appointments",
                  params: { refresh: "refresh" }
                },
                {
                  name: "CheckStatus",
                  params: {
                    bookingid: response.data.BookingId,
                    from: "BookAppointment"
                  }
                }
              ]
            })
          );
        }
      } else {
        Toast.show(response.data.Msg);
        this.setState({
          isLoading: false,
          bookingdate: "",
          selectedtimeslot: ""
        });
      }
    } catch (errors) {
      // Toast.show("Network Error");
      Toast.show("Something Went Wrong, Please Try Again Later");
      this.setState({
        isLoading: false,
        bookingdate: "",
        selectedtimeslot: ""
      });
      console.log(errors, "Suggested Book Appointment  ");
    }
  };

  BookAppointments = async () => {
    let PaymentMethod = "";
    PaymentMethod = this.state.isonlinePayment ? "Online" : "";
    let testids = this.state.testids.replace(/(^,)|(,$)/g, "");
    let testprices = this.state.testidprices.replace(/(^,)|(,$)/g, "");
    var data = JSON.stringify({
      LabId: this.state.labid,
      DoctorId: "",
      TimeSlot: this.state.slottosendforbooking,
      TestDate: this.state.bookingdate,
      TotalAmount: this.state.testprice,
      AppointmentType: this.state.appointmenttype,
      TestCount: this.state.testcount,
      TestId: testids,
      TestPrice: testprices,
      SampleCollectionAddress: this.state.addressinput,
      SlotId: this.state.selectedtimeslotID,
      PaymentMethod: PaymentMethod
    });
    try {
      let response = await axios.post(Constants.BOOK_APPOINTMENT, {
        LabId: this.state.labid,
        DoctorId: "",
        TimeSlot: this.state.slottosendforbooking,
        TestDate: this.state.bookingdate,
        TotalAmount: this.state.testprice,
        AppointmentType: this.state.appointmenttype,
        TestCount: this.state.testcount,
        TestId: testids,
        TestPrice: testprices,
        SampleCollectionAddress: this.state.addressinput,
        SlotId: this.state.selectedtimeslotID,
        PaymentMethod: PaymentMethod
      });
      // let response = await axios.post(Constants.BOOK_APPOINTMENT, data);
      this.setState({ loading: false });

      if (response.data.Status) {
        this.setState({ isLoading: false });
        // Toast.show(response.data.Msg);
        // this.props.navigation.navigate('Appointments');
        // this.props.navigation.navigate('CheckStatus', {
        //   bookingid: response.data.BookingId,
        // });

        //change from Chekstatus to new Screen Payment where user can pay the  and tehn oly navigate to chek status

        // console.log(this.state.isonlinePayment, "Online Payment ");
        if (this.state.isonlinePayment) {
          this.props.navigation.navigate("PayBookingAmount", {
            bookingid: response.data.BookingId
          });
        } else {
          Toast.show(response.data.Msg);
          // this.props.navigation.navigate('PatientDashboard');
          this.props.navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [
                {
                  name: "Drawer"
                },
                {
                  name: "Appointments",
                  params: { refresh: true }
                },
                {
                  name: "CheckStatus",
                  params: {
                    bookingid: response.data.BookingId,
                    from: "BookAppointment"
                  }
                }
              ]
            })
          );
        }
      }
    } catch (errors) {
      Toast.show("Something Went Wrong, Please Try Again Later");

      // Toast.show("Network Error");
      this.setState({ isLoading: false });
      console.log(errors, "Book Appo manuallyerror ////");
    }
  };

  Decrypt = (encryptStr) => {
    // console.log('Decrypt  ====================================', encryptStr);
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

  // modal picker

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = (date) => {
    let formatdate = moment(date).format("DD/MM/YYYY");

    this.setState({
      // BirthDate: selectedDate,
      bookingdate: formatdate,
      // isShowDataPicker: false,
      selectedtimeslot: ""
    });
    this.hideDateTimePicker();
  };
  renderModalPicekr = () => {
    return (
      <DateTimePicker
        isVisible={this.state.isDateTimePickerVisible}
        onConfirm={this.handleDatePicked}
        onCancel={this.hideDateTimePicker}
        minimumDate={new Date()}
        mode="date"
        display="spinner"
      />
    );
  };

  render() {
    const screenWidth = Math.round(Dimensions.get("window").width);
    /// const navigation = useNavigation();
    var valuee = "";
    return (
      <Container>
        <CustomeHeader
          title="Appointment "
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
              <View
                style={{
                  backgroundColor: "white",
                  flexDirection: "column",
                  borderRadius: 0
                }}
              >
                <TouchableOpacity
                  style={{
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    marginTop: 10,
                    marginBottom: 0
                  }}
                  onPress={this.DismissModal.bind(this)}
                >
                  <Image
                    source={require("../../icons/CLOSE2.png")}
                    style={{
                      height: 25,
                      width: 25,
                      marginRight: 15,
                      // margin: 15,
                      marginTop: 0
                    }}
                  />
                </TouchableOpacity>
              </View>
              <Image
                source={require("../../icons/clock_1.png")}
                style={{
                  height: 40,
                  width: 40,
                  marginTop: 10,
                  justifyContent: "center",
                  alignSelf: "center"
                }}
              />

              <Text
                style={{
                  marginTop: 10,
                  fontSize: 20,
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
                    style={{ height: 45, backgroundColor: "white" }}
                  >
                    <Separator bordered>
                      <Text style={{ fontSize: 18 }}>Morning</Text>
                    </Separator>
                  </CollapseHeader>
                  <CollapseBody>
                    {this.state.morningslot.length > 0 ? (
                      this.state.morningslot.map((item, index) => {
                        const slot = gettimezone(item.From);

                        return (
                          <ListItem
                            key={index}
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
                    style={{ height: 45, backgroundColor: "white" }}
                  >
                    <Separator bordered>
                      <Text style={{ fontSize: 18 }}>Afternoon</Text>
                    </Separator>
                  </CollapseHeader>
                  <CollapseBody>
                    {this.state.afternoonslot.length > 0 ? (
                      this.state.afternoonslot.map((item, index) => {
                        const slot = gettimezone(item.From);

                        return (
                          <ListItem
                            key={index}
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
                    style={{ height: 45, backgroundColor: "white" }}
                  >
                    <Separator bordered>
                      <Text style={{ fontSize: 18 }}>Evening</Text>
                    </Separator>
                  </CollapseHeader>
                  <CollapseBody>
                    {this.state.eveningslot.length > 0 ? (
                      this.state.eveningslot.map((item, index) => {
                        const slot = gettimezone(item.From);

                        return (
                          <ListItem
                            key={index}
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
              </ScrollView>
            </View>
          </View>
        </Modal>
        <View style={styles.MainContainer}>
          <ScrollView
            alwaysBounceVertical={true}
            showsHorizontalScrollIndicator={false}
            style={{
              flex: 1,
              backgroundColor: "white",
              marginTop: 0,
              paddingHorizontal: 15,
              marginBottom: 1
            }}
          >
            <BookAppointmentLabComp
              lablogo={{ uri: Constants.LAB_LOGO + this.state.lablogo }}
              labname={this.state.labname}
              price={"Rs." + this.state.testprice}
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
                  padding: 8
                }}
              >
                {this.state.appointmenttype == "clinic" ? (
                  // <TextInput
                  //   style={{
                  //     flex: 1,
                  //     backgroundColor: 'white',
                  //     color: 'black',
                  //     marginLeft: 16,
                  //   }}
                  //   value={this.state.labaddress}
                  //   onChangeText=""
                  //   multiline={true}
                  //   underlineColorAndroid="transparent"
                  //   placeholder=""
                  //   editable={false}
                  // />
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
                          textAlign: "center",
                          textAlignVertical: "center",
                          margin: 20,
                          marginLeft: 17
                        }}
                      // numberOfLines={5}
                      >
                        {this.state.labaddress}
                      </Text>
                    </ScrollView>
                  </View>
                ) : (
                  <TextInput
                    style={{
                      flex: 1,
                      backgroundColor: "white",
                      color: "black",
                      marginLeft: 17
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
                      isDateTimePickerVisible:
                        !this.state.isDateTimePickerVisible
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
                  {this.state.isDateTimePickerVisible
                    ? this.renderModalPicekr()
                    : null}

                  {/* {this.state.isShowDataPicker && this.renderDatePicker()} */}
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

                    // justifyContent: 'flex-start',
                    marginLeft: 12
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      this.setState({
                        isDateTimePickerVisible:
                          !this.state.isDateTimePickerVisible
                      })
                    }
                  >
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
                    // justifyContent: 'flex-start',
                    marginLeft: 12,
                    justifyContent: "center"
                  }}
                >
                  <TouchableOpacity
                    // style={{ flex: 1, marginLeft: 20 }}
                    onPress={this.toggleModal}
                  >
                    {this.state.selectedtimeslot === undefined ||
                      this.state.selectedtimeslot === "" ? (
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
                  elevation: 3,
                  shadowOffset: { width: 2, height: 3 },
                  shadowColor: "gray",
                  shadowOpacity: 0.9,
                  alignItems: "center"
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
