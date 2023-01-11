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
  Button,
  PermissionsAndroid,
  Platform,
  Alert,
  useColorScheme
} from "react-native";
import { CommonActions, NavigationAction } from "@react-navigation/native";

import ImagePicker from "react-native-image-crop-picker";
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
import { ListItem, Separator } from "native-base";
import moment from "moment";
import axios from "axios";
import DateTimePicker from "react-native-modal-datetime-picker";
import { color } from "react-native-reanimated";
import { Appearance } from "react-native-appearance";
import { launchImageLibrary } from "react-native-image-picker";
const Rijndael = require("rijndael-js");

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

export default class PrescriptionBookAppoint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appointmenttype: "clinic",
      addressinput: "",
      bookingdate: "",
      // bookingdate: new Date(1598051730000),
      labname: "",
      labcontact: "",
      labaddress: "",
      testprice: "",
      testids: "",
      testidprices: "",
      lablogo: "",
      labid: "",
      bookingId: "",
      isLoading: false,
      isModalVisible: false,
      labslotList: [],
      selectedtimeslot: "", //changed
      selectedtimeslotID: "",
      morningslot: [],
      afternoonslot: [],
      eveningslot: [],
      testcount: "",
      testnames: "",
      docid: "",
      collapsed: true,
      prescriptionName: "",
      prescriptionPic: [],
      progess: 0,
      prescriptionUri: null,
      isUploading: false,
      size: 0,
      progresss: 0,
      imagePath: "",
      isShowDataPicker: false,
      slottosendforbooking: "",
      isPrescription: false,
      isDateTimePickerVisible: false,
      issubmit: false
    };
  }

  // Modal picker

  showDateTimePicker = () => {
    // console.log("os d msnens@@@@@");
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
    // console.log("A date has been picked: ", date);
    this.hideDateTimePicker();
  };
  renderModalPicekr = () => {
    // console.log("modal date picker");
    return (
      <DateTimePicker
        isVisible={this.state.isDateTimePickerVisible}
        onConfirm={this.handleDatePicked}
        onCancel={this.hideDateTimePicker}
        minimumDate={new Date()}
        display="spinner"
      // isDarkModeEnabled={false}
      />
    );
  };

  ClosePOPup = () => {
    // console.log("ClosePOPup=================");
    this.setState({ isPrescription: false }, () => { });
  };

  //Decrypt

  Decrypt = (encryptStr) => {
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

  uploadPrescription = () => {
    var that = this;
    this.setState({ isLoading: true });
    let form = new FormData();
    form.append("", {
      name: this.state.prescriptionPic[0].name,
      uri:
        Platform.OS === "android"
          ? this.state.prescriptionPic[0].uri
          : "file://" + this.state.prescriptionPic[0].uri,
      // uri:  Platform.OS === "android" ? this.state.prescriptionPic[0].uri : this.state.prescriptionPic[0].uri.replace("file://", ""),
      // uri: 'file://' + this.state.prescriptionPic[0].uri,
      type: this.state.prescriptionPic[0].type
    });

    axios({
      method: "post",
      url: Constants.UPLOAD_PRESCRIPTION,
      data: form,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data"
      },
      onUploadProgress(progressEvent) {
        that.setState({
          size: progressEvent.total,
          progresss: progressEvent.loaded / progressEvent.total
        });
      }
    })
      .then((response) => {
        var responseObj = JSON.parse(response.data);
        if (responseObj.Status) {
          this.setState(
            {
              imagePath: responseObj.Path,
              // isLoading: false,
              isUploading: true
            }
            // () => {

            //   this.BookAppointments();

            // }
          );
          this.BookAppointments();
        } else {
          this.setState({
            isLoading: false,
            isUploading: false,
            issubmit: false
          });
          Toast.show(responseObj.data.Msg);
          // console.log(" else  response =================", responseObj);
        }
      })
      .catch((e) => {
        this.setState({
          isLoading: false,
          isUploading: false,
          issubmit: false
        });
        Toast.show("Something Went Wrong, Please Try Again Later");
      });
  };

  UNSAFE_componentWillReceiveProps = (nextprops) => {
    // console.log(
    //   'UNSAFE_componentWillReceiveProps=============================='
    // );

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
      bookingdate: ""
    });

    this.setState({
      labname: nextprops.route.params.labinfo.Labname,
      labcontact: nextprops.route.params.labinfo.LabContact,
      labaddress: nextprops.route.params.labinfo.LabAddress,
      ///testprice: nextprops.route.params.labinfo.Total,
      testids: nextprops.route.params.labinfo.TestId,
      lablogo: nextprops.route.params.labinfo.LabLogo,
      labid: nextprops.route.params.labinfo.Labid,
      //testidprices: nextprops.route.params.labinfo.Testidprices ,
      testnames: nextprops.route.params.labinfo.TestName,
      bookingId: nextprops.route.params.labinfo.BookLabId,
      // bookingdate: nextprops.route.params.labinfo.TestDate,
      selectedtimeslot: nextprops.route.params.labinfo.TimeSlot
    });
  };

  componentDidMount = () => {
    // console.log('componentDidMount==============================');

    this.setState({
      labname: this.props.route.params.labinfo.Labname,
      labcontact: this.props.route.params.labinfo.LabContact,
      labaddress: this.props.route.params.labinfo.LabAddress,
      ///testprice: this.props.route.params.labinfo.Total,
      testids: this.props.route.params.labinfo.TestId,
      lablogo: this.props.route.params.labinfo.LabLogo,
      labid: this.props.route.params.labinfo.Labid,
      ///testidprices: this.props.route.params.labinfo.Testidprices,
      testnames: this.props.route.params.labinfo.TestName,
      bookingId: this.props.route.params.labinfo.BookLabId,
      //bookingdate:  this.props.route.params.labinfo.TestDate,
      selectedtimeslot: this.props.route.params.labinfo.TimeSlot
    });
  };

  handleSelectionMultiple = (id, slotid) => {
    // console.log("SLOT TIME ==============================", id, slotid);
    const slot = gettimezone(id);

    // console.log(slot, "=======Selected Slot");
    this.setState({
      selectedtimeslot: slot,
      selectedtimeslotID: slotid,
      slottosendforbooking: id
    });
    //this.setState({selectedtimeslotID:slotid})
    this.DismissModal();
    // console.log(this.state.selectedtimeslot, "============Select time slot ");
  };

  toggleModal = () => {
    /// this.setState({isModalVisible: !this.state.isModalVisible});

    // if (this.state.bookingdate === '') {
    // changed to
    if (
      this.state.bookingdate === "" ||
      this.state.bookingdate == new Date(1598051730000)
    ) {
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

  onPressSubmit = () => {
    // console.log("onPressSubmit response=================");
    // this.props.navigation.navigate("AllTestList")

    if (this.state.bookingdate == "") {
      // console.log("onPressSubmit response=================");
      Toast.show("Please select booking date");
    } else if (this.state.selectedtimeslot == "") {
      // console.log("onPressSubmit response=================");
      Toast.show("Please select Time slot");
    } else if (this.state.prescriptionName == "") {
      // console.log("onPressSubmit prescription chek response=================");
      Toast.show("Please Select Prescription Image");
      // this.chooseFile();
    } else if (this.state.appointmenttype == "home") {
      if (this.state.addressinput == "") {
        // console.log("onPressSubmit address input response=================");
        Toast.show("Please Enter your address");
      } else {
        // console.log("else **** onPressSubmit response=================");
        this.setState({ isLoading: true, issubmit: true });
        this.uploadPrescription();
      }
    } else {
      // this.setState({issubmit:true})
      // console.log("onPressSubmit response================= *****else");
      this.setState({ isLoading: true, issubmit: true });
      // this.BookAppointments();
      this.uploadPrescription();
    }
  };

  deleteImg = () => {
    this.setState({ prescriptionName: "" });
  };

  BookAppointments = async () => {
    try {
      let response = await axios.post(Constants.TESTBOOK_PRESCRIPTION, {
        LabId: this.state.labid,
        TimeSlot: this.state.slottosendforbooking,
        TestDate: this.state.bookingdate,
        Testprices: "0",
        AppointmentType: this.state.appointmenttype,
        PrescriptionImg: this.state.imagePath,
        SampleCollectionAddress: this.state.addressinput,
        SlotId: this.state.selectedtimeslotID
      });
      this.setState({ isLoading: false });
      if (response.data.Status) {
        this.setState({ isLoading: false, issubmit: false });
        Toast.show(response.data.Msg);
        // console.log(this.props);
        // this.props.navigation.navigate('CheckStatus',{bookingid: response.data.BookingId, from: 'PrescriptionBookAppoint',})
        this.props.navigation.dispatch(
          CommonActions.reset({
            index: 1,
            key: 0,
            routes: [
              {
                name: "Drawer"
              },
              {
                name: "CheckStatus",
                params: {
                  bookingid: response.data.BookingId,
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
      // Toast.show("Network Error");
      Toast.show("Something Went Wrong, Please Try Again Later");

      this.setState({ isLoading: false });
    }
  };

  takePhotoFromCamera = () => {
    this.setState({ isPrescription: false }, () => {
      setTimeout(() => {
        ImagePicker.openCamera({
          width: 1000,
          height: 1000,
          mediaType: "photo"
          // size: 5000000,
        })
          .then((response) => {
            if (response.size > 5000000) {
              Toast.show("Please select image size upto 5MB");
            } else {
              let prescriptionPic = [];
              prescriptionPic.push({
                uri: response.path,
                type: response.mime,
                // name: response.fileName,
                name: response.path.slice(response.path.lastIndexOf("/") + 1)
              });

              this.setState(
                {
                  prescriptionPic: prescriptionPic,
                  prescriptionUri: response.uri,
                  prescriptionName: prescriptionPic[0].name
                },
                () => { }
              );
            }
            // console.log(response, 'from camera');
          })
          .catch((err) => {
            Toast.show("Something Went Wrong, Please Try Again Later");
          });
      }, 1000);
    });
  };

  choosePhotoFromLibrary = () => {
    this.setState({ isPrescription: false, isLoading: false }, () => {
      setTimeout(() => {
        ImagePicker.openPicker({
          width: 1000,
          height: 1000,
          includeExif: true,
          multiple: false,
          mediaType: "photo"
          // size: 5000000,
        })
          .then((response) => {
            if (response.size > 5000000) {
              Toast.show("Please select image size upto 5MB");
            } else {
              let prescriptionPic = [];
              prescriptionPic.push({
                uri: response.path,
                type: response.mime,
                // name: response.fileName,
                name: response.path.slice(response.path.lastIndexOf("/") + 1)
              });
              this.setState({
                prescriptionPic: prescriptionPic,
                prescriptionUri: response.uri,
                prescriptionName: prescriptionPic[0].name
              });
            }
          })
          .catch((err) => {
            alert(err, "alert messaeg");
            this.setState({
              prescriptionPic: "",
              prescriptionUri: "",
              prescriptionName: ""
            });
          });
      }, 1000);
    });
  };

  chooseFile = async () => {
    var options = {
      title: "Select Image",
      // maxWidth: 1000,
      // maxHeight: 1000,
      storageOptions: {
        skipBackup: true,
        path: "images",
        saveToPhotos: true,
        privateDirectory: true,
        includeBase64: true
      }
    };
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Howzu App needs  permission"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.setState({ isPrescription: false, isLoading: false }, () => {
          setTimeout(() => {
            launchImageLibrary(options, (response) => {
              if (response.didCancel) {
                console.log("User cancelled image picker");
              } else if (response.error) {
                console.log("ImagePicker Error: ", response.error);
              } else {
                if (response.assets[0].fileSize > 5000000) {
                  Toast.show("Please select image size upto 5MB");
                } else {
                  let prescriptionPic = [];
                  prescriptionPic.push({
                    uri: response.assets[0]
                      ? response.assets[0].uri
                      : response.uri,
                    type: response.assets[0]
                      ? response.assets[0].type
                      : response.type,
                    name: response.assets[0]
                      ? response.assets[0].fileName
                      : response.fileName
                  });

                  this.setState({
                    // isLoading: true,
                    prescriptionPic: prescriptionPic,
                    prescriptionUri: response.assets[0]
                      ? response.assets[0].uri
                      : response.uri,
                    prescriptionName: prescriptionPic[0].name
                  });
                }
              }
            });
          }, 500);
        });
      } else {
      }
    } else {
      this.setState({ isPrescription: false, isLoading: false }, () => {
        setTimeout(() => {
          launchImageLibrary(options, (response) => {
            if (response.didCancel) {
              console.log("User cancelled image picker");
            } else if (response.error) {
              console.log("ImagePicker Error: ", response.error);
            } else {
              if (response.assets[0].fileSize > 5000000) {
                Toast.show("Please select image size upto 5MB");
              } else {
                let prescriptionPic = [];
                prescriptionPic.push({
                  uri: response.assets[0]
                    ? response.assets[0].uri
                    : response.uri,
                  type: response.assets[0]
                    ? response.assets[0].type
                    : response.type,
                  name: response.assets[0]
                    ? response.assets[0].fileName
                    : response.fileName
                });

                // console.log(prescriptionPic, "prescritopn pic");
                this.setState({
                  // isLoading: true,
                  prescriptionPic: prescriptionPic,
                  prescriptionUri: response.assets[0]
                    ? response.assets[0].uri
                    : response.uri,
                  prescriptionName: prescriptionPic[0].name
                });
              }
            }
          });
        }, 500);
      });
    }
  };

  render() {
    // console.log(this.state.selectedtimeslot, '###Render time slot');
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
        {/* For   CAMERA  */}
        <Modal isVisible={this.state.isPrescription}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignContent: "center"
            }}
          >
            <View
              style={{
                flexDirection: "column",
                width: "80%",
                height: "25%",
                backgroundColor: "white",
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  backgroundColor: "white",
                  marginTop: 10,
                  marginLeft: 0,
                  marginRight: 0,
                  alignItems: "center"
                }}
              >
                <TouchableOpacity onPress={this.takePhotoFromCamera}>
                  <Text
                    style={{ textAlign: "center", fontSize: 16, margin: 10 }}
                  >
                    Take Photo
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.choosePhotoFromLibrary}>
                  <Text
                    style={{ textAlign: "center", fontSize: 15, margin: 10 }}
                    numberOfLines={1}
                  >
                    Choose From Library
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.chooseFile}>
                  <Text
                    style={{ textAlign: "center", fontSize: 15, margin: 10 }}
                    numberOfLines={1}
                  >
                    Choose From Gallery
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.ClosePOPup}>
                  <Text
                    style={{ textAlign: "center", fontSize: 15, margin: 10 }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {/* For TImeSlot */}
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
              backgroundColor: "white",
              marginTop: 0,
              paddingHorizontal: 15
            }}
          >
            <BookAppointmentLabComp
              lablogo={{ uri: Constants.LAB_LOGO + this.state.lablogo }}
              labname={this.state.labname}
              address={this.state.labaddress}
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
                    onpress={() => this.setState({ appointmenttype: "clinic" })}
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
                        appointmenttype: "home"
                      })
                    }
                    buttonimg={require("../../icons/radio-on.png")}
                    gender="Home"
                  ></Rediobutton>
                ) : (
                  <Rediobutton
                    // onpress={() => this.setState({ appointmenttype: 'home' })}
                    onpress={() =>
                      this.setState({
                        appointmenttype: "home",
                        bookingdate: "",
                        isShowDataPicker: false,
                        selectedtimeslot: ""
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
                    ) : (
                      <ScrollView>
                        <TextInput
                          style={{
                            flex: 1,
                            backgroundColor: "white",
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
                  flexDirection: "row-reverse",
                  alignItems: "center"
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      isDateTimePickerVisible:
                        !this.state.isDateTimePickerVisible
                      // isShowDataPicker: !this.state.isShowDataPicker,
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
                    justifyContent: "flex-start",
                    marginLeft: 12
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      this.setState({
                        isDateTimePickerVisible:
                          !this.state.isDateTimePickerVisible
                        // isShowDataPicker: !this.state.isShowDataPicker,
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

              {/* Time Slot */}
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
                  marginTop: 20,
                  borderRadius: 25,
                  borderColor: "gray",
                  borderWidth: 0.5,
                  flexDirection: "row-reverse",
                  alignItems: "center"
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
                    justifyContent: "flex-start",
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

              <Text
                style={{
                  marginTop: 20,
                  fontSize: 14,
                  marginLeft: 5,
                  fontWeight: "bold"
                }}
              >
                Add Prescription
              </Text>
              <View
                style={{
                  height: 0.5,
                  backgroundColor: "gray",
                  marginRight: 5,
                  marginTop: 8
                }}
              ></View>

              <TouchableOpacity
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  height: 70,
                  backgroundColor: "lightgray",
                  marginRight: 5,
                  marginTop: 8,
                  borderRadius: 5,
                  flexDirection: "row"
                }}
                onPress={() => {
                  this.setState({ isPrescription: true });
                }}
              // onPress={this.chooseFile.bind(this)}
              >
                <Image
                  source={require("../../icons/Upload-image-here.png")}
                  style={{
                    height: 30,
                    width: 30,
                    margin: 10,
                    justifyContent: "center",
                    alignSelf: "center"
                  }}
                />
                <Text style={{ color: "gray", fontSize: 18 }}>
                  Upload Prescription here
                </Text>
              </TouchableOpacity>
              {this.state.prescriptionName != "" ? (
                <View
                  style={{
                    flexDirection: "row",
                    height: 40,
                    backgroundColor: "white",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      backgroundColor: "white",
                      alignContent: "center",
                      margin: 5,
                      color: "darkgray",
                      fontSize: 12
                    }}
                  >
                    {this.state.prescriptionName}
                  </Text>
                </View>
              ) : null}

              <TouchableOpacity
                style={{
                  backgroundColor: "#1B2B34",
                  marginTop: 20,
                  marginBottom: 20,
                  borderRadius: 20,
                  height: 40,
                  justifyContent: "center",
                  shadowOffset: { width: 2, height: 3 },
                  elevation: 5,
                  shadowColor: "gray",
                  shadowOpacity: 0.9
                }}
                onPress={() =>
                  this.state.issubmit ? null : this.onPressSubmit()
                }
              >
                <Text
                  style={{
                    textAlign: "center",
                    alignSelf: "center",
                    fontSize: 18,
                    color: "white",
                    fontWeight: "bold"
                  }}
                >
                  SUBMIT
                </Text>
              </TouchableOpacity>
              {/* {this.state.issubmit && (
                <TouchableOpacity
                  style={{
                    backgroundColor: "lightgray",
                    marginTop: 20,
                    marginBottom: 20,
                    borderRadius: 20,
                    height: 40,
                    justifyContent: "center",
                    shadowOffset: { width: 2, height: 3 },
                    elevation: 5,
                    shadowColor: "gray",
                    shadowOpacity: 0.9,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      alignSelf: "center",
                      fontSize: 18,
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    SUBMIT
                  </Text>
                </TouchableOpacity>
              )} */}
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
