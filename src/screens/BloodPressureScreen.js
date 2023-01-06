import { Container } from "native-base";
import * as React from "react";
import {
  Image,
  StatusBar,
  Animated,
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
const { width } = Dimensions.get("window");
import CustomeHeader from "../appComponents/CustomeHeader";
import DynamicallySelectedPicker from "react-native-dynamically-selected-picker";
import TestInputCard from "../appComponents/TextInputCard";
import { Toast } from "native-base";
// import Toast from "react-native-tiny-toast";
import Constants from "../utils/Constants";
import Loader from "../appComponents/loader";
import DateTimePicker from "react-native-modal-datetime-picker";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
// import RangeSlider from "react-native-range-slider";
import moment from "moment";
import axios from "axios";
const screenWidth = Math.round(Dimensions.get("window").width);
// import MultiSlider from "react-native-multi-slider";
const minAge = 1;
const segmentsLength = 181;
const segmentsLength1 = 121;
const segmentWidth = 2;
const segmentSpacing = 20;
const spacerWidth = (width - segmentWidth) / 2;
const segmentWidth1 = 2;
const segmentSpacing1 = 20;

const snapTo = segmentWidth + segmentSpacing;
const snapTo1 = segmentWidth1 + segmentSpacing1;

const rulerWidth = width + (segmentsLength - 1) * snapTo;
const indicatorWrapperWidth = 100;
const minAge1 = 0;
const rulerWidth1 = width + (segmentsLength1 - 1) * snapTo1;

const data = [...Array(segmentsLength + 6).keys()].map((i) => i + minAge);
// console.log(data, "././");
const data1 = [...Array(segmentsLength1 + 7).keys()].map((i) => i + minAge1);

const Ruler = () => {
  return (
    <View style={styles.ruler}>
      <View style={styles.spacer} />
      {data.map((i) => {
        const tenth = i % 10 === 0;
        return (
          <View
            key={i}
            style={[
              styles.segment,
              {
                backgroundColor: tenth ? "#4c3e5c" : "#4c3e5c30",
                height: tenth ? 40 : 20,
                marginRight: 20,
                // marginRight: i === data.length - 1 ? 0 : segmentSpacing,
              },
            ]}
          ></View>
        );
      })}

      <View style={styles.spacer} />
    </View>
  );
};
const Ruler1 = () => {
  return (
    <View style={styles.ruler1}>
      <View style={styles.spacer} />
      {data1.map((i) => {
        const tenth = i % 10 === 0;
        return (
          <View
            key={i}
            style={[
              styles.segment,
              {
                backgroundColor: tenth ? "#4c3e5c" : "#4c3e5c30",
                height: tenth ? 40 : 20,
                marginRight: i === data1.length - 1 ? 0 : segmentSpacing,
              },
            ]}
          />
        );
      })}

      <View style={styles.spacer} />
    </View>
  );
};

export default class BloodPressureScreen extends React.Component {
  textRef = React.createRef();
  textRef1 = React.createRef();
  scrollRef = React.createRef();
  scrollRef1 = React.createRef();

  value = 0;
  value1 = 0;
  constructor(props) {
    super(props);
    this.state = {
      systblic: "",
      scrolledX: new Animated.Value(0),
      initialAge: 120,
      scrolledX1: new Animated.Value(0),
      initialAge1: 80,
      dia: "",
      puls: "",
      iserr: false,
      notes: "",
      isLoading: false,
      bloodpressureresult: "",
      bookingdate: moment(new Date()).format("ddd, Do MMMM YYYY, hh:mm A"),
      isDateTimePickerVisible: false,
      datetosave: moment(new Date()).format("DD/MM/YYYY"),
      incorrectinput: false,
      valuerange: 160,
      singleSliderValues: [],
      multiSliderValues: [],
    };
    this.state.scrolledX.addListener(({ value }) => {
      const sliderValue = Math.round(value / snapTo);
      if (this.textRef && this.textRef.current) {
        // console.log(":::::", `${sliderValue + minAge}`);
        this.setState({ systblic: `${sliderValue + minAge}` });

        this.textRef.current.setNativeProps({
          text: `${sliderValue + minAge}`,
        });
      }
    });
    this.state.scrolledX1.addListener(({ value }) => {
      const sliderValue = Math.round(value / snapTo1);
      if (this.textRef1 && this.textRef1.current) {
        this.setState({ dia: `${sliderValue + minAge1}` });
        this.textRef1.current.setNativeProps({
          text: `${sliderValue + minAge1}`,
        });
      }
    });
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

  updateSelectedItem(index) {
    this.setState({ selectedItemIndex: index });
  }

  saveData = async () => {
    //  console.log(this.state.bloodpressureresult, "::::");
    this.setState({
      incorrectinput: false,
    });
    // const res1 = this.state.systblic + "/" + this.state.dia;

    if (Number(this.state.dia) >= Number(this.state.systblic)) {
      Toast.show({
        text:
          "Diastolic value must be lower than  systolic value. select the number between  0 and " +
          this.state.systblic,
        duration: 3000,
      });
    } else if (
      this.state.puls != "" &&
      (this.state.puls < 35 || this.state.puls > 210)
    ) {
      Toast.show({
        text: " Enter number between 35 and 210 ",
        duration: 3000,
      });
    } else {
      let systblic = Number(this.state.systblic);
      let dia = Number(this.state.dia);

      // console.log(systblic);

      if (systblic >= 90 && systblic < 120 && dia >= 60 && dia < 80) {
        // //console.log('"Optimal"');
        this.setState({
          bloodpressureresult: "Optimal",
        });
      } else if (systblic < 90 && dia < 60) {
        //console.log(".././", "Normal");
        this.setState({
          bloodpressureresult: "Low Blood Pressure",
        });
      } else if (systblic >= 120 && systblic <= 129 && dia >= 80 && dia <= 84) {
        //console.log(".././", "Normal");
        this.setState({
          bloodpressureresult: "Normal",
        });
      } else if (systblic >= 130 && systblic <= 139 && dia >= 85 && dia <= 89) {
        //console.log('"high Normal"');
        this.setState({
          bloodpressureresult: "High Normal",
        });
      } else if (systblic >= 140 && systblic <= 159 && dia >= 90 && dia <= 99) {
        //console.log('"Grade1 Hypertension"');
        this.setState({
          bloodpressureresult: "Grade1 Hypertension",
        });
      } else if (
        systblic >= 160 &&
        systblic <= 179 &&
        dia >= 100 &&
        dia < 109
      ) {
        //console.log('"Grade2 Hypertension"');
        this.setState({
          bloodpressureresult: "Grade2 Hypertension",
        });
      } else if (systblic >= 180 && dia > 110) {
        //console.log('"Grade3 Hypertension"');
        this.setState({
          bloodpressureresult: "Grade3 Hypertension/Hypertensive urgency",
        });
      }
      //  else if (systblic > 140 && dia < 90) {
      //   //console.log('"Isolated Systolic Hypertension"');

      //   this.setState({
      //     bloodpressureresult: "Isolated Systolic Hypertension/",
      //   });
      // }
      else {
        //console.log(systblic, dia);
        this.setState({ incorrectinput: true });
        Toast.show({
          text: "Please select the correct values",
          duration: 3000,
        });
      }
      if (this.state.incorrectinput) {
        // //console.log("if values of err");
      } else {
        // //console.log(this.state.incorrectinput, "..;;;;;");
        this.setState(
          {
            isLoading: true,
          },
          () => {
            this.calculate();
          }
        );
      }
    }
  };

  componentDidMount() {
    setTimeout(() => {
      if (this.scrollRef && this.scrollRef.current) {
        this.scrollRef.current.scrollTo({
          x: this._calculateOffset(),
          y: 0,
          animated: true,
        });
      }
    }, 1000);

    setTimeout(() => {
      if (this.scrollRef1 && this.scrollRef1.current) {
        this.scrollRef1.current.scrollTo({
          x: this._calculateOffset1(),
          y: 0,
          animated: true,
        });
      }
    }, 1000);
  }

  UNSAFE_componentWillReceiveProps() {
    this.setState({
      bookingdate: moment(new Date()).format("ddd, Do MMMM YYYY, hh:mm A"),
      isDateTimePickerVisible: false,
      datetosave: moment(new Date()).format("DD/MM/YYYY"),
      iserr: false,
      notes: "",
      puls: "",
      bloodpressureresult: "",
    });
    // console.log("^^^&&&********");
  }
  _calculateOffset = () => {
    return snapTo * (this.state.initialAge - minAge);
  };
  _calculateOffset1 = () => {
    return snapTo1 * (this.state.initialAge1 - minAge1);
  };

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
    const res = this.state.systblic + "/" + this.state.dia;
    const plusrate = this.state.puls == "" ? 0 : this.state.puls;
    // console.log(this.textRef <= 180, "////???");

    try {
      const response = await axios.post(Constants.ADD_BLOODPRESURE, {
        Bloodpressure: res,
        PulseRate: plusrate,
        // PulseRate: this.state.puls,
        Notes: this.state.notes,
        Result: this.state.bloodpressureresult,
        Date: this.state.datetosave,
      });
      this.setState({ isLoading: false });
      if (response.data.Status) {
        Toast.show({ text: response.data.Msg });
        this.props.navigation.navigate("PatientDashboard", {
          refresh: "refresh",
        });
      } else {
        Toast.show({ text: response.data.Msg });
      }
    } catch (err) {
      Toast.show({ text: "Something went wrong, please try again later" });
      this.setState({ isLoading: false });
      // console.log(err, "blood pressure ");
    }
  };

  render() {
    // console.log(this.textRef.current, "refds ");

    // console.log(screenWidth, "**8");
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : 0}
      >
        <Container>
          <Loader loading={this.state.isLoading} />
          <CustomeHeader
            title="Blood Pressure"
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
                marginTop: 20,
                marginLeft: 10,
              }}
            >
              <Image
                source={require("../../icons/heartred.png")}
                style={{
                  height: 20,
                  width: 20,
                  marginLeft: 10,
                  justifyContent: "center",
                  alignSelf: "center",
                  // margin: 10,
                }}
              />
              <Text style={[styles.title, { marginLeft: 10 }]}>
                Systolic (mmHg)
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
            <Animated.ScrollView
              style={{
                backgroundColor: "white",
                marginTop: 0,
                flex: 1,
                // marginTop: screenWidth <= 360 ? 50 : 0,
              }}
              horizontal
              ref={this.scrollRef}
              onLayout={(event) => {
                this.frameWidth = event.nativeEvent.layout.width;
                const maxOffset = this.contentWidth - this.frameWidth;
                if (maxOffset < this.xOffset) {
                  this.xOffset = maxOffset;
                }
              }}
              onContentSizeChange={(contentWidth) => {
                this.contentWidth = contentWidth;
                const maxOffset = this.contentWidth - this.frameWidth;
                if (maxOffset < this.xOffset) {
                  this.xOffset = maxOffset;
                }
              }}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: { x: this.state.scrolledX },
                    },
                  },
                ],
                { useNativeDriver: true }
              )}
              snapToInterval={snapTo}
              scrollEventThrottle={16}
              showsHorizontalScrollIndicator={false}
              bounces={false}
            >
              <Ruler />
            </Animated.ScrollView>
            <View
              style={{
                height: 0.5,
                backgroundColor: "#d8d8d8",
                marginLeft: 3,
                marginRight: 3,
                marginTop: 0,
                padding: 0.5,
              }}
            ></View>

            <View style={styles.indicatorWrapper}>
              <TextInput ref={this.textRef} style={styles.text} />
              <View style={[styles.segment, styles.indicator]} />
            </View>

            <View
              style={{
                flexDirection: "row",
                // marginTop: 20,
                marginLeft: 10,
              }}
            >
              <Image
                source={require("../../icons/heartred.png")}
                style={{
                  height: 20,
                  width: 20,
                  marginLeft: 10,
                  justifyContent: "center",
                  alignSelf: "center",
                  // margin: 10,
                }}
              />
              <Text style={[styles.title, { marginLeft: 10 }]}>
                Diastolic (mmHg)
              </Text>
            </View>
            <Animated.ScrollView
              style={{
                backgroundColor: "white",
                flex: 1,
              }}
              horizontal
              ref={this.scrollRef1}
              onLayout={(event) => {
                this.frameWidth = event.nativeEvent.layout.width;
                const maxOffset = this.contentWidth - this.frameWidth;
                if (maxOffset < this.xOffset) {
                  this.xOffset = maxOffset;
                }
              }}
              onContentSizeChange={(contentWidth) => {
                this.contentWidth = contentWidth;
                const maxOffset = this.contentWidth - this.frameWidth;
                if (maxOffset < this.xOffset) {
                  this.xOffset = maxOffset;
                }
              }}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: { x: this.state.scrolledX1 },
                    },
                  },
                ],
                { useNativeDriver: true }
              )}
              snapToInterval={snapTo1}
              scrollEventThrottle={16}
              showsHorizontalScrollIndicator={false}
              bounces={false}
            >
              <Ruler1 />
            </Animated.ScrollView>
            <View
              style={{
                height: 0.5,
                backgroundColor: "#d8d8d8",
                marginLeft: 3,
                marginRight: 3,
                marginTop: 0,
                padding: 0.5,
              }}
            ></View>

            <View style={styles.indicatorWrapper}>
              <TextInput ref={this.textRef1} style={styles.text} />

              <View style={[styles.segment, styles.indicator]} />
            </View>

            <View
              style={{
                flex: 1,
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
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
                marginTop: 0,
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
                marginTop: 20,
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
  spacer: {
    width: 0.1,
    height: 100,
  },
  container: {
    top: 100,
  },
  title: {
    padding: 20,
    fontSize: 18,
  },
  ruler: {
    width: rulerWidth,
    alignItems: "flex-end",
    justifyContent: "flex-start",
    flexDirection: "row",
    flex: 1,
  },
  ruler1: {
    width: rulerWidth1,
    alignItems: "flex-end",
    justifyContent: "flex-start",
    flexDirection: "row",
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "red",
  },
  segment: {
    width: segmentWidth,
  },
  text: {
    fontSize: 22,
    // fontFamily: "Menlo",
    marginBottom: 10,
    // color: "#275BB4",
  },
  indicator: {
    height: 32,
    width: segmentWidth + 2,
    backgroundColor: "#f5afaf",
    // paddingRight: 1,
  },
  indicatorWrapper: {
    position: "relative",
    left: Platform.OS === "ios" ? 60 : screenWidth <= 411 ? 60 : 80,

    // right: (width - indicatorWrapperWidth) / 2,
    bottom: Platform.OS === "ios" ? 66 : screenWidth >= 411 ? 95 : 90,
    alignItems: "center",
    justifyContent: "center",
    width: indicatorWrapperWidth,
  },
  title: {
    fontSize: 16,
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
