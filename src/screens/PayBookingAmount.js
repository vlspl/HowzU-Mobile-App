import React, { Component } from "react";

import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Alert,
  BackHandler,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Image,
} from "react-native";
import { WebView } from "react-native-webview";
import Modal from "react-native-modal";
import { Container, Toast, Header, Body, Left, Right } from "native-base";
import axios from "axios";
import Constants from "../utils/Constants";
import Loader from "../appComponents/loader";
import { CommonActions } from "@react-navigation/native";

var bookingid = "";

const CustomeHeader = (props) => {
  // console.log(props, "Custom header");
  const screenWidth = Math.round(Dimensions.get("window").width);
  return (
    <Header
      androidStatusBarColor="#275BB4"
      noShadow
      style={{ backgroundColor: "#275BB4" }}
    >
      <ImageBackground
        source={require("../../icons/bg-all.png")}
        style={{ width: screenWidth, height: "100%", flexDirection: "row" }}
        resizeMode="contain"
      >
        <Left>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                "Payment !",
                "Are you sure you want to cancel the payment?",
                [
                  {
                    text: "No",
                    onPress: () => {
                      null;
                    },
                    style: "cancel",
                  },
                  {
                    text: "YES",
                    onPress: () => {
                      props.navigation.navigate("PatientDashboard");
                      // props.navigation.dispatch(
                      //   CommonActions.reset({
                      //     index: 1,
                      //     routes: [
                      //       {
                      //         name: 'Drawer',
                      //       },
                      //       {
                      //         name: 'Appointments',
                      //         params: { refresh: 'refresh' },
                      //       },
                      //       {
                      //         name: 'CheckStatus',
                      //         params: {
                      //           bookingid: bookingid,
                      //           from: 'BookAppointment',
                      //         },
                      //       },
                      //     ],
                      //   })
                      // );
                    },
                  },
                ]
              );
            }}
            style={{ padding: 5 }}
          >
            <Image
              style={{ height: 25, width: 25 }}
              source={require("../../icons/back.png")}
            ></Image>
          </TouchableOpacity>
        </Left>

        <Body>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
              {props.title}
            </Text>
          </View>
        </Body>
        <Right></Right>
      </ImageBackground>
    </Header>
  );
};

export default class PayBookingAmount extends Component {
  webview = null;
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      showPaymentModal: false,
      isPaymentFail: false,
      webViewHide: false,
      backpreesed: false,
      isError: false,
      msg: "",
    };
  }

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // console.log(
    //   "Check status componentWillReceiveProps==============================",
    //   nextProp.route.params.bookingid,
    //   nextProp.route.params.msg
    // );
    if (nextProp.route.params.bookingid) {
      this.setState({ isLoading: false, msg: nextProp.route.params.msg });

      bookingid = nextProp.route.params.bookingid;
    }
  };

  componentDidMount = () => {
    // console.log(
    //   "Check status componentDidMount==============================",
    //   this.props.route.params.bookingid,
    //   this.props.route.params.msg
    // );

    if (this.props.route.params.bookingid) {
      bookingid = this.props.route.params.bookingid;
      this.setState({ isLoading: false, msg: this.props.route.params.msg });
    }
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
  };

  componentWillUnmount = () => {
    this.backHandler.remove();
  };
  backAction = () => {
    Alert.alert(
      "Payment !",
      "by canceling the payment Your booking will not be confirmed?",
      [
        {
          text: "No",
          onPress: () => {
            null;
            this.setState({ backpreesed: false });
          },
          style: "cancel",
        },
        {
          text: "YES",

          onPress: () => {
            this.setState({ backpreesed: true });
            this.backHandler.remove();
            this.props.navigation.navigate("PatientDashboard");
            // this.props.navigation.dispatch(
            //   CommonActions.reset({
            //     index: 1,
            //     routes: [
            //       {
            //         name: 'Drawer',
            //       },
            //       {
            //         name: 'Appointments',
            //         params: { refresh: 'refresh' },
            //       },
            //       {
            //         name: 'CheckStatus',
            //         params: {
            //           bookingid: bookingid,
            //           from: 'BookAppointment',
            //         },
            //       },
            //     ],
            //   })
            // );

            // this.props.navigation.reset({
            //   routes: [
            //     {
            //       name: 'CheckStatus',
            //       params: { bookingid: bookingid, from: 'Pay' },
            //     },
            //   ],
            // });
          },
        },
      ]
    );
    return true;
  };

  LoadingIndicatorView() {
    return <Loader loading={true} />;
  }

  handleWebViewNavigationStateChange = (newNavState) => {
    // console.log(this.props, 'Payment');
    // console.log(newNavState, newNavState.title, 'handek web view*****000');

    if (
      newNavState.url ==
      "https://visionarylifescience.com/AtomPaymentSuccess.aspx"
    ) {
      this.setState({ isPaymentFail: true, webViewHide: true });
      Toast.show({ text: this.state.msg });
      this.props.navigation.dispatch(
        CommonActions.reset({
          index: 1,
          key: 0,
          routes: [
            {
              name: "Drawer",
            },
            {
              name: "Appointments",
              params: { refresh: "refresh" },
            },
            {
              name: "CheckStatus",
              params: {
                bookingid: bookingid,
                from: "BookAppointment",
              },
            },
          ],
        })
      );
    } else if (
      newNavState.url == "https://visionarylifescience.com/AtomPaymentFail.aspx"
    ) {
      Alert.alert("Payment  Failed !", "Booking Canceled ", [
        {
          text: "Ok",
          onPress: () => this.props.navigation.navigate("PatientDashboard"),
          style: "cancel",
        },
      ]);
    } else if (newNavState.title == "Error") {
      // console.log("##############ERROR+++++++++++++++++++");
      this.setState({ isError: true });
    }
  };

  render() {
    return (
      <Container>
        <Loader loading={this.state.isLoading} />

        <CustomeHeader
          headerId={1}
          title="Payment  "
          navigation={this.props.navigation}
        />
        <View
          style={{ flexDirection: "column", flex: 1, backgroundColor: "white" }}
        >
          {bookingid != "" &&
            this.state.backpreesed === false &&
            this.state.isLoading === false && (
              <WebView
                ref={(ref) => (this.webview = ref)}
                source={{
                  uri:
                    "https://visionarylifescience.com/AtomPayment.aspx?Id=" +
                    bookingid,
                }}
                javaScriptEnabled={true}
                renderLoading={this.LoadingIndicatorView}
                startInLoadingState={true}
                onError={(syntheticEvent) => {
                  const { nativeEvent } = syntheticEvent;
                  this.setState({ isError: true });
                  // alert('&*&*&*&*WebView error: ', nativeEvent);
                }}
                onNavigationStateChange={
                  this.handleWebViewNavigationStateChange
                }
                onMessage={(event) => {
                  // console.log(event, "&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
                  alert(event.nativeEvent.data);
                }}
              />
            )}
        </View>
        {/* {this.state.isError == true && (
          <Modal isVisible={this.state.isError}>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              {Alert.alert("Internal Error !", " Booking Failed", [
                {
                  text: "Ok",
                  onPress: () =>
                    this.props.navigation.navigate("PatientDashboard", {}),

                  style: "cancel",
                },
              ])}
            </View>
          </Modal>
        )} */}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  containermain: {
    flex: 1,
    marginTop: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    flexDirection: "row",
    padding: 5,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 6,
    marginBottom: 6,
    borderRadius: 5,
    backgroundColor: "white",
    elevation: 2,
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    flexDirection: "row",
    // backgroundColor: 'gray',
    marginRight: 10,
    fontWeight: "bold",
  },
  container_text: {
    flex: 1,
    flexDirection: "column",
    marginTop: 0,
    marginLeft: 20,
    justifyContent: "center",
    backgroundColor: "white",
  },
  description: {
    fontSize: 13,
    marginTop: 0,
    color: "#595858",
    marginLeft: 6,
    /// backgroundColor: 'gray',
  },
  suggestbtnTitle: {
    // flex:1,
    fontSize: 11,
    marginLeft: 5,
    paddingRight: 0,
    color: "blue",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    color: "midnightblue",
  },
  photo: {
    height: 54,
    width: 54,
    //shadowOffset: { width: 3, height: 3 },
    //shadowColor: 'gray',
    // shadowOpacity: 0.7,

    borderWidth: 0,
    borderRadius: 27,
  },
  email: {
    fontSize: 11,
    //fontStyle: 'italic',
    marginTop: 6,
    color: "gray",
    marginLeft: 0,
    // alignSelf: 'flex-end',

    // backgroundColor: 'gray',
  },
  image: {
    height: 22,
    width: 22,
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-end",
    marginRight: 5,

    // justifyContent: 'center'
  },
  touchable: {
    alignItems: "center",
    justifyContent: "center",
  },

  SuggestTesttouch: {
    //flex:1,
    height: 20,
    marginTop: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
  },

  titlesubview: {
    flex: 1,
    flexDirection: "row",
    //alignSelf: 'flex-end',
    backgroundColor: "white",
  },

  DRnamesubview: {
    flex: 1,
    flexDirection: "row",
    //alignSelf: 'flex-end',
    backgroundColor: "white",
  },
  sharebtnview: {
    flex: 0.3,
    // flexDirection: 'row',
    alignSelf: "flex-end",
    height: 22,
    width: 72,
    marginTop: 0,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },

  Reportview: {
    flex: 0.3,
    flexDirection: "row",
    alignSelf: "flex-end",
    height: 22,
    width: 70,
    marginRight: 10,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    // paddingTop: 0,
    //backgroundColor: '#003484',
    borderRadius: 11,
  },

  Mobilesubview: {
    flex: 1,
    flexDirection: "row",
    marginTop: 2,
    // alignSelf: 'flex-end',
  },
  Icons: {
    height: 22,
    width: 22,
    marginTop: 0,
    paddingTop: 0,
  },
  Iconsemail: {
    height: 15,
    width: 15,
    marginTop: 6,
  },

  eyeicon: {
    height: 15,
    width: 15,
    marginTop: 0,
    paddingLeft: 2,
  },

  emailsubview: {
    flex: 1,
    flexDirection: "row",
    // alignSelf: 'flex-end',
    //justifyContent: 'space-between',
    // alignContent: 'flex-end',
    //marginTop:4,
    backgroundColor: "white",
  },

  DoctorProfile: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-end",
    alignContent: "flex-end",
    textAlign: "right",
    color: "black",
    fontSize: 11,
  },

  Separator: {
    height: 0.5,
    backgroundColor: "gray",
    marginLeft: 0,
    marginRight: 0,
    marginTop: 10,
  },
});
