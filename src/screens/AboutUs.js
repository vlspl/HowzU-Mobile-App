import React, { Component } from "react";

import {
  FlatList,
  Alert,
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Dimensions,
  Image
} from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

import { Container } from "native-base";
import Loader from "../appComponents/loader";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default class AboutUs extends Component {
  constructor() {
    super();
    this.state = {
      mobile: "",
      password: "",
      confirmpass: "",
      loading: false,
      secureTextEntry: true,
      confirm: true
    };
  }

  componentDidMount() {}
  onPressprivacyPolicy = () => {
    this.props.navigation.navigate("PrivacyPolicy");
  };
  onPressTnC = () => {
    this.props.navigation.navigate("TermnCondition");
  };
  render() {
    const { navigate } = this.props.navigation;

    const screenHeight = Math.round(Dimensions.get("window").height);
    const screenWidth = Math.round(Dimensions.get("window").width);
    return (
      <Container>
        <Loader loading={this.state.loading} />

        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
            justifyContent: "center"
          }}
        >
          <View
            style={{
              height: screenHeight,
              backgroundColor: "white",
              flexDirection: "column"
            }}
          >
            <ImageBackground
              source={require("../../icons/sign-up-sign-in-background.jpg")}
              style={{
                width: screenWidth,
                height: screenHeight,
                backgroundColor: "transparent"
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  marginTop:
                    Platform.OS === "ios"
                      ? verticalScale(45)
                      : verticalScale(25),
                  justifyContent: "space-between",
                  // justifyContent: "center",
                  height: verticalScale(50),
                  marginBottom:
                    screenHeight <= 640
                      ? verticalScale(100)
                      : verticalScale(120)
                }}
              >
                <TouchableOpacity
                  onPress={() => this.props.navigation.goBack()}
                  style={{ padding: scale(6), marginLeft: scale(30) }}
                >
                  <Image
                    style={{ height: 25, width: 25, marginTop: 5 }}
                    source={require("../../icons/back.png")}
                  ></Image>
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    flex: verticalScale(1),
                    marginRight: scale(50)
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      alignSelf: "center",
                      fontSize: 25,
                      color: "#FFF",
                      fontWeight: "bold"
                    }}
                  >
                    About
                  </Text>
                </View>
              </View>

              <KeyboardAwareScrollView enableOnAndroid={true}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center"

                    // paddingTop: 30,
                    // padding: 8
                  }}
                >
                  <Text
                    style={{
                      textAlign: "justify",

                      fontSize: 17,
                      marginRight: 15,
                      marginLeft: 15
                    }}
                  >
                    Howzu is a self-service personalized digital health valet
                    driving adoption of mobile and web-based remote health
                    services to path labs, enterprise, government and retail
                    consumers.{"\n"}
                  </Text>
                  <Text
                    style={{
                      textAlign: "justify",
                      marginRight: 15,
                      fontSize: 17,

                      marginLeft: 15
                    }}
                  >
                    Visionary Lifesciences Private Limited was incorporated with
                    an underlying objective of creating life-changing
                    technologies to provide the best-in-class healthcare
                    services to its customers. We are headquartered in Pune,
                    India with a branch based out of Mumbai.{"\n"}
                  </Text>
                  <Text
                    style={{
                      fontSize: 17,
                      textAlign: "justify",
                      marginRight: 15,
                      marginLeft: 15
                    }}
                  >
                    Commenced business operations in 2021 with headquarters
                    based in Pune, Maharashtra. A centralized platform of
                    patient EHR that is owned, simplified and updated by the
                    patient. Users will have the ability to grant & revoke
                    access to their EHRs by setting up permissions thereby
                    improving experience & data security. Howzu will
                    chronologically arrange these records and filter them into
                    specific categories to aid in data analytics.{"\n"}
                  </Text>
                  <Text
                    style={{
                      fontSize: 17,
                      textAlign: "justify",
                      marginRight: 15,
                      marginLeft: 15
                    }}
                  >
                    Howzu will chronologically arrange these records and filter
                    them into specific categories to aid in data analytics.
                  </Text>
                </View>

                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-around",
                    margin: 10
                  }}
                >
                  <TouchableOpacity
                    style={{
                      // marginTop: 20,
                      marginLeft: 20,
                      justifyContent: "center"
                    }}
                    onPress={this.onPressprivacyPolicy}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        alignSelf: "center",
                        fontSize: 18,
                        color: "blue",
                        fontWeight: "bold",
                        textDecorationLine: "underline"
                      }}
                    >
                      Privacy Policy
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      // marginTop: 20,
                      marginLeft: 20,
                      justifyContent: "center"
                    }}
                    onPress={this.onPressTnC}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        alignSelf: "center",
                        fontSize: 18,
                        color: "blue",
                        fontWeight: "bold",
                        textDecorationLine: "underline"
                      }}
                    >
                      Terms of Service
                    </Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAwareScrollView>
            </ImageBackground>
          </View>
        </View>
        {/* </KeyboardAvoidingView> */}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  containermain: {
    flex: 1,
    marginTop: 0,
    backgroundColor: "white"
  },
  container: {
    flex: 1,
    flexDirection: "row",
    padding: 3,
    marginLeft: 10,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 2,
    borderRadius: 5,
    backgroundColor: "white",
    elevation: 2
  }
});
