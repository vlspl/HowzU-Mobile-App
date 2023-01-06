import { Container } from "native-base";

import * as React from "react";
import {
  Image,
  ScrollView,
  TextInput,
  View,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import CustomeHeader from "../appComponents/CustomeHeader";
import { Toast } from "native-base";
import Constants from "../utils/Constants";
import Loader from "../appComponents/loader";
import DateTimePicker from "react-native-modal-datetime-picker";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import Slider from "react-native-slider";
import moment from "moment";
import axios from "axios";
const screenWidth = Math.round(Dimensions.get("window").width);

export default class BloodPressureScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cel: "",

      fare: "",
      puls: "",
      iserr: false,
      notes: "",
      isLoading: false,
      result: "",

      bookingdate: moment(new Date()).format("ddd, Do MMMM YYYY, hh:mm A"),
      isDateTimePickerVisible: false,
      datetosave: moment(new Date()).format("DD/MM/YYYY"),
      incorrectinput: false,
      fare: 86,
      cel: 30,
    };
  }

  // modal picker

  showDateTimePicker = () => {
    // console.log("os d msnens@@@@@");
    this.setState({ isDateTimePickerVisible: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = (date) => {
    // let formatdate = moment(date).format("ddd, Do MMMM YYYY, hh:mm A");
    let formatdate = moment(date).format("ddd, Do MMMM YYYY");
    let formatdate1 = moment(date).format("DD/MM/YYYY");

    this.setState({
      bookingdate: formatdate,
      datetosave: formatdate1,
    });
    this.hideDateTimePicker();
  };
  renderModalPicekr = () => {
    // console.log("modal date picker");
    return (
      <DateTimePicker
        isVisible={this.state.isDateTimePickerVisible}
        onConfirm={this.handleDatePicked}
        onCancel={this.hideDateTimePicker}
        maximumDate={new Date()}
        display="spinner"
      />
    );
  };

  saveData = async () => {
    this.setState({
      incorrectinput: false,
    });

    if (
      this.state.puls != "" &&
      (this.state.puls < 35 || this.state.puls > 210)
    ) {
      Toast.show({
        text: " Enter number between 35 and 210 ",
        duration: 3000,
      });
    } else {
      let cel = this.state.cel.toFixed(1);

      // console.log(cel, "cel");

      if (cel < 36.5) {
        // console.log("less than 35 ");
        this.setState({
          result: "Hypothermia",
        });
      } else if (cel >= 36.5 && cel < 37.5) {
        // console.log("grater than 36.5 ");
        this.setState({
          result: "Normal",
        });
      } else if (cel >= 37.5 && cel < 38.3) {
        // console.log("grater than 37.5 ");
        this.setState({
          result: "Fever",
        });
      } else if (cel >= 38.4) {
        // console.log("grater than 40 ");
        this.setState({
          result: "High Fever",
        });
      } else if (cel < 30) {
        this.setState({ incorrectinput: true });
        Toast.show({
          text: "Please select the correct values ",
          duration: 3000,
        });
      }
      this.setState(
        {
          isLoading: true,
        },
        () => {
          this.calculate();
        }
      );
    }
    // console.log(this.state.result);
  };

  componentDidMount() {}

  UNSAFE_componentWillReceiveProps() {
    this.setState({
      bookingdate: moment(new Date()).format("ddd, Do MMMM YYYY, hh:mm A"),
      isDateTimePickerVisible: false,
      datetosave: moment(new Date()).format("DD/MM/YYYY"),
      iserr: false,
      notes: "",
      puls: "",
      result: "",
    });
    // console.log("^^^&&&********");
  }

  handleChange(text) {
    if (isNaN(text)) {
      Toast.show({ text: "Please enter only number" });
    } else {
      if (text < 35 || text > 210) {
        this.setState({ iserr: true, puls: text });
      } else {
        this.setState({ iserr: false, puls: text });
      }
    }
  }

  calculate = async () => {
    const res = Number(this.state.cel.toFixed(1));
    const plusrate = this.state.puls == "" ? 0 : this.state.puls;
    // console.log(res, "res >>>>>", this.state.result);

    if (this.state.incorrectinput) {
    } else {
      //   console.log("else part of zxiosi");
      try {
        const response = await axios.post(Constants.ADD_TEMPERTURE, {
          Temprature: res,
          PulseRate: plusrate,
          Notes: this.state.notes,
          Date: this.state.datetosave,
          Result: this.state.result,
        });
        this.setState({ isLoading: false });
        if (response.data.Status) {
          Toast.show({ text: response.data.Msg });
          this.props.navigation.navigate("PatientDashboard", { refresh: true });
        } else {
          Toast.show({ text: response.data.Msg });
        }
      } catch (err) {
        Toast.show({ text: "Something went wrong, please try again later" });
        this.setState({ isLoading: false });
        // console.log(err, "Tem ");
      }
    }
  };
  TempratureCalculate = (value) => {
    // console.log(value, ":::::::::.....");
    let far = value * (9 / 5) + 32;
    // let far = (5 / 9) * (value - 32);
    this.setState({ cel: value, fare: far });
  };

  TempinFarehnight = (value) => {
    // console.log(value, ":::::::::.....");
    let cel = (5 / 9) * (value - 32);
    this.setState({ cel: cel, fare: value });
  };
  render() {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : 0}
      >
        <Container>
          <Loader loading={this.state.isLoading} />
          <CustomeHeader
            title="Body Temperature"
            headerId={1}
            navigation={this.props.navigation}
          />

          <ScrollView
            alwaysBounceVertical={true}
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 0 }}
          >
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
                margin: 10,
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    isDateTimePickerVisible:
                      !this.state.isDateTimePickerVisible,
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
                    alignSelf: "center",
                  }}
                />
                {this.state.isDateTimePickerVisible
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
                  backgroundColor: "lightgray",
                }}
              ></View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  marginLeft: 12,
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      isDateTimePickerVisible:
                        !this.state.isDateTimePickerVisible,
                    })
                  }
                >
                  {this.state.bookingdate != "" ? (
                    <Text
                      style={{
                        marginLeft: 12,
                        color: "black",
                        alignSelf: "stretch",
                      }}
                    >
                      {this.state.bookingdate}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        marginLeft: 12,
                        color: "gray",
                        alignSelf: "stretch",
                      }}
                    >
                      Date of Booking
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                marginTop: 40,
                marginLeft: 10,
              }}
            >
              <Image
                source={require("../../icons/tempbluenew.png")}
                style={{
                  height: 40,
                  width: 40,
                  marginLeft: 10,
                  justifyContent: "center",
                  alignSelf: "center",
                  // margin: 10,
                }}
              />
              <Text
                style={[
                  styles.title,
                  {
                    fontSize: 18,
                    marginLeft: 10,
                    marginTop: 10,
                    textAlign: "center",
                  },
                ]}
              >
                Body Temperature(°C)
              </Text>
              <View
                style={{
                  height: 0.5,
                  backgroundColor: "#d8d8d8",
                  marginLeft: 3,
                  marginRight: 3,
                  marginTop: 10,
                  padding: 0.5,
                }}
              ></View>
            </View>

            <View style={{ flex: 1, margin: 30 }}>
              <Slider
                step={0.1}
                minimumValue={30}
                maximumValue={42}
                value={this.state.cel}
                onValueChange={(value) => this.TempratureCalculate(value)}
                minimumTrackTintColor="#275BB4"
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor="#275BB4"
              />
              <Text style={{ fontSize: 16 }}> {this.state.cel.toFixed(1)}</Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                // marginTop: 20,
                marginLeft: 10,
                marginTop: 40,
              }}
            >
              <Image
                source={require("../../icons/tempbluenew.png")}
                style={{
                  height: 40,
                  width: 40,
                  marginLeft: 10,
                  justifyContent: "center",
                  alignSelf: "center",
                  // margin: 10,
                }}
              />
              <Text
                style={[
                  styles.title,
                  {
                    fontSize: 18,
                    marginLeft: 10,
                    marginTop: 10,
                    textAlign: "center",
                  },
                ]}
              >
                Body Temperature (°F)
              </Text>
            </View>
            <View style={{ flex: 1, margin: 30 }}>
              <Slider
                step={0.1}
                minimumValue={86}
                maximumValue={108}
                value={this.state.fare}
                onValueChange={(value) => this.TempinFarehnight(value)}
                minimumTrackTintColor="#275BB4"
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor="#275BB4"
              />
              <Text>{this.state.fare.toFixed(1)}</Text>
            </View>

            <View
              style={{
                flex: 1,
                marginTop: 10,
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  marginTop: 10,
                }}
              >
                <Image
                  source={require("../../icons/plusrate.png")}
                  style={{
                    height: 30,
                    width: 30,
                    marginLeft: 8,
                  }}
                />
                <Text
                  style={{
                    fontSize: 16,
                    marginLeft: 10,
                    textAlign: "center",
                    marginTop: 1,
                  }}
                >
                  Pulse rate
                </Text>

                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "baseline",
                  }}
                >
                  <TextInput
                    style={{
                      fontSize: 17,
                      textAlign: "left",
                      padding: 0,
                      marginLeft: 100,
                      justifyContent: "flex-end",
                    }}
                    value={this.state.puls}
                    underlineColorAndroid="transparent"
                    placeholder="Pulse rate"
                    onChangeText={(text) => {
                      this.handleChange(text);
                    }}
                    keyboardType="numeric"
                    maxLength={3}
                    placeholderTextColor="lightgray"
                    allowFontScaling={false}
                  />
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        marginLeft: 10,
                        marginRight: 10,
                        textAlign: "center",
                        marginTop: screenWidth <= 360 ? 2 : 0,
                      }}
                    >
                      bpm
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "baseline",
                  marginRight: 20,
                }}
              >
                {this.state.iserr && (
                  <Text
                    style={{
                      fontSize: 12,
                      textAlign: "left",
                      color: "red",
                    }}
                  >
                    Enter number between 35 and 210
                  </Text>
                )}
              </View>
            </View>
            <View
              style={{
                // height: 80,
                backgroundColor: "transparent",
                flexDirection: "column",
                marginTop: 10,
                marginLeft: 5,
                marginRight: 5,
              }}
            >
              <View
                style={{
                  height: 50,
                  backgroundColor: "white",
                  flexDirection: "row",
                  marginTop: 10,
                  marginLeft: 0,
                  marginRight: 0,
                  borderColor: "lightgray",
                }}
              >
                <Image
                  source={require("../../icons/notes2.png")}
                  style={{
                    height: 20,
                    width: 20,
                    marginLeft: 8,
                    justifyContent: "center",
                    alignSelf: "center",
                  }}
                />
                <View
                  style={{
                    height: 34,
                    width: 1,
                    marginTop: 8,
                    marginBottom: 8,
                    marginLeft: 10,
                    // backgroundColor: "lightgray",
                  }}
                ></View>

                <TextInput
                  style={{
                    textAlign: "left",
                    flex: 1,
                    paddingLeft: 10,
                    fontSize: 17,
                  }}
                  value={this.state.notes}
                  underlineColorAndroid="transparent"
                  placeholder="Notes"
                  onChangeText={(text) => {
                    this.setState({ notes: text });
                  }}
                  placeholderTextColor="lightgray"
                  allowFontScaling={false}
                />
              </View>
            </View>
            {/* bottom buttons */}
            <View
              style={{
                height: 60,
                marginBottom: 0,
                backgroundColor: "white",
                flexDirection: "row-reverse",
                justifyContent: "space-between",
                marginTop: 30,
              }}
            >
              <TouchableOpacity
                style={{
                  height: 60,
                  marginBottom: 0,
                  backgroundColor: "white",
                  flexDirection: "row-reverse",
                  marginRight: 10,
                }}
                onPress={() => this.saveData()}
                underlayColor="#fff"
              >
                <Text style={styles.loginText}> Save </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  height: 60,
                  marginBottom: 0,
                  backgroundColor: "white",
                  flexDirection: "row-reverse",
                  marginLeft: 10,
                }}
                underlayColor="#fff"
                onPress={() => this.props.navigation.goBack(null)}
              >
                <Text style={[styles.loginText, { marginLeft: 20 }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Container>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "red",
  },

  title: {
    fontSize: 20,
    color: "#000",
    flexDirection: "column",
    backgroundColor: "white",
  },
  loginText: {
    color: "#2e62ae",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 20,
  },
});
