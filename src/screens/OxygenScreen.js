import { Container } from "native-base";
import * as React from "react";
import {
  Image,
  Animated,
  ScrollView,
  TextInput,
  View,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView
} from "react-native";
import CustomeHeader from "../appComponents/CustomeHeader";
import { Toast } from "native-base";
import Constants from "../utils/Constants";
import Loader from "../appComponents/loader";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import axios from "axios";
const screenWidth = Math.round(Dimensions.get("window").width);
// import MultiSlider from "react-native-multi-slider";
const minAge = 1;
const segmentsLength = 100;
const segmentsLength1 = 127;
const segmentWidth = 2;
const segmentSpacing = 20;
const spacerWidth = (screenWidth - segmentWidth) / 2;
const snapTo = segmentWidth + segmentSpacing;
const rulerWidth = screenWidth + (segmentsLength - 1) * snapTo;
const indicatorWrapperWidth = 100;

const data = [...Array(segmentsLength + 7).keys()].map((i) => i);

const Ruler = () => {
  return (
    <View style={styles.ruler}>
      <View style={styles.spacer} />
      {data.map((i) => {
        // console.log(i);
        const tenth = i % 10 === 0;
        return (
          <View
            key={i}
            style={[
              styles.segment,
              {
                backgroundColor: tenth ? "#4c3e5c" : "#4c3e5c30",
                height: tenth ? 40 : 20,
                marginRight: 20
                // marginRight: i === data.length - 1 ? 0 : segmentSpacing,
              }
            ]}
          ></View>
        );
      })}

      <View style={styles.spacer} />
    </View>
  );
};

export default class OxygenScreen extends React.Component {
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
      initialAge: 95,
      scrolledX1: new Animated.Value(0),
      initialAge1: 80,
      oxy: "",
      puls: "",
      iserr: false,
      notes: "",
      isLoading: false,
      result: "",
      bookingdate: moment(new Date()).format("ddd, Do MMMM YYYY, hh:mm A"),
      isDateTimePickerVisible: false,
      datetosave: moment(new Date()).format("DD/MM/YYYY"),
      incorrectinput: false,
      valuerange: 160,
      singleSliderValues: [],
      multiSliderValues: []
    };
    this.state.scrolledX.addListener(({ value }) => {
      const sliderValue = Math.round(value / snapTo);
      if (this.textRef && this.textRef.current) {
        // console.log(":::::", `${sliderValue + minAge}`);
        this.setState({ oxy: `${sliderValue + minAge}` });

        this.textRef.current.setNativeProps({
          text: `${sliderValue + minAge}%`
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
      datetosave: formatdate1
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
    //  console.log(this.state.bloodpressureresult, "::::");
    this.setState({
      incorrectinput: false
    });
    // const res1 = this.state.systblic + "/" + this.state.dia;

    if (
      this.state.puls != "" &&
      (this.state.puls < 35 || this.state.puls > 210)
    ) {
      Toast.show({
        text: " Enter number between 35 and 210 ",
        duration: 3000
      });
    } else {
      let oxy = Number(this.state.oxy);
      if (oxy >= 95) {
        //.log('"Optimal"');
        this.setState({
          result: "Normal"
        });
      } else if (oxy >= 91 && oxy <= 94) {
        //.log(".././", "Normal");
        this.setState({
          result: "Mild Hypoxemia"
        });
      } else if (oxy >= 86 && oxy <= 90) {
        //.log(".././", "Normal");
        this.setState({
          result: "Moderate Hypoxemia"
        });
      } else if (oxy >= 35 && oxy <= 85) {
        //.log(".././", "Normal");
        this.setState({
          result: "Severely Hypoxemia"
        });
      } else if (oxy < 10) {
        this.setState({ incorrectinput: true });
        Toast.show({
          text: "Please select the correct values",
          duration: 3000
        });
      }
      if (this.state.incorrectinput) {
        // console.log("if values of err");
      } else {
        this.setState(
          {
            // isLoading: true,
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
          animated: true
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
      result: ""
    });
  }
  _calculateOffset = () => {
    return snapTo * (this.state.initialAge - minAge);
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
    const res = Number(this.state.oxy);
    const plusrate = this.state.puls == "" ? 0 : this.state.puls;
    //.log(res, "////???");
    if (this.state.oxy <= 34) {
      Toast.show({
        text: "Please select the correct values",
        duration: 3000
      });
      //.log("true nsmnm");
    } else {
      this.setState({ isLoading: true });
      try {
        const response = await axios.post(Constants.ADD_OXYGEN, {
          Oxygen: res,
          PulseRate: plusrate,
          Notes: this.state.notes,
          Result: this.state.result,
          Date: this.state.datetosave
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
      }
    }
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
            title="Oxygen"
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
                margin: 10
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    isDateTimePickerVisible: !this.state.isDateTimePickerVisible
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
            <View
              style={{
                flexDirection: "row",
                marginTop: 20,
                marginLeft: 10
              }}
            >
              <Image
                source={require("../../icons/OXYGEN-BLUE.png")}
                style={{
                  height: 70,
                  width: 70,
                  marginLeft: 10,
                  justifyContent: "center",
                  alignSelf: "center"
                  // margin: 10,
                }}
              />
              <Text
                style={[
                  styles.title,
                  {
                    fontSize: 18,
                    marginLeft: 10,
                    marginTop: 30,
                    textAlign: "center"
                  }
                ]}
              >
                Oxygen SpO2 %
              </Text>
              <View
                style={{
                  height: 0.5,
                  backgroundColor: "#d8d8d8",
                  marginLeft: 3,
                  marginRight: 3,
                  marginTop: 10,
                  padding: 0.5
                }}
              ></View>
            </View>
            <Animated.ScrollView
              style={{
                backgroundColor: "white",
                marginTop: 0,
                flex: 1
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
                      contentOffset: { x: this.state.scrolledX }
                    }
                  }
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
                padding: 0.5
              }}
            ></View>
            <View style={styles.indicatorWrapper}>
              <TextInput ref={this.textRef} style={styles.text} />

              <View style={[styles.segment, styles.indicator]} />
            </View>
            <View
              style={{
                flex: 1
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row"
                }}
              >
                <Image
                  source={require("../../icons/plusrate.png")}
                  style={{
                    height: 30,
                    width: 30,
                    marginLeft: 8
                  }}
                />
                <Text
                  style={{
                    fontSize: 16,
                    marginLeft: 10,
                    textAlign: "center",
                    marginTop: 1
                  }}
                >
                  Pulse rate
                </Text>

                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "baseline"
                  }}
                >
                  <TextInput
                    style={{
                      fontSize: 17,
                      textAlign: "left",
                      padding: 0,
                      marginLeft: 100,
                      justifyContent: "flex-end"
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
                      justifyContent: "flex-end"
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        marginLeft: 10,
                        marginRight: 10,
                        textAlign: "center",
                        marginTop: screenWidth <= 360 ? 2 : 0
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
                  marginRight: 20
                }}
              >
                {this.state.iserr && (
                  <Text
                    style={{
                      fontSize: 12,
                      textAlign: "left",
                      color: "red"
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
                marginRight: 5
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
                  borderColor: "lightgray"
                }}
              >
                <Image
                  source={require("../../icons/notes2.png")}
                  style={{
                    height: 20,
                    width: 20,
                    marginLeft: 8,
                    justifyContent: "center",
                    alignSelf: "center"
                  }}
                />
                <View
                  style={{
                    height: 34,
                    width: 1,
                    marginTop: 8,
                    marginBottom: 8,
                    marginLeft: 10
                    // backgroundColor: "lightgray",
                  }}
                ></View>

                <TextInput
                  style={{
                    textAlign: "left",
                    flex: 1,
                    paddingLeft: 10,
                    fontSize: 17
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
                marginTop: 20
              }}
            >
              <TouchableOpacity
                style={{
                  height: 60,
                  marginBottom: 0,
                  backgroundColor: "white",
                  flexDirection: "row-reverse",
                  marginRight: 10
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
                  marginLeft: 10
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
    height: 100
  },
  container: {
    top: 100
  },
  title: {
    padding: 20,
    fontSize: 25,
    flexDirection: "column",
    backgroundColor: "white",
    color: "#000"
  },
  ruler: {
    width: rulerWidth,
    alignItems: "flex-end",
    justifyContent: "flex-start",
    flexDirection: "row",
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
    // backgroundColor: "red",
  },
  segment: {
    width: segmentWidth
  },
  text: {
    fontSize: 22,
    // fontFamily: "Menlo",
    marginBottom: 10
    // color: "#275BB4",
  },
  indicator: {
    height: 32,
    width: segmentWidth + 2,
    backgroundColor: "#f5afaf"
    // paddingRight: 1,
  },
  indicatorWrapper: {
    position: "relative",
    left: Platform.OS === "ios" ? 60 : screenWidth <= 411 ? 60 : 80,

    // right: (width - indicatorWrapperWidth) / 2,
    bottom: Platform.OS === "ios" ? 66 : screenWidth >= 411 ? 95 : 90,
    alignItems: "center",
    justifyContent: "center",
    width: indicatorWrapperWidth
  },
  title: {
    fontSize: 16,
    color: "#000",
    flexDirection: "column",
    backgroundColor: "white"
  },
  loginText: {
    color: "#2e62ae",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 20
  }
});
