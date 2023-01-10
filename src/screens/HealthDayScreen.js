import React, { Component } from "react";

import {
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Text,
  Dimensions,
  Image
} from "react-native";

import {
  Container,
  Header,
  Body,
  Left,
  Right,
  Icon,
  Input,
  View
} from "native-base";

import Constants from "../utils/Constants";
import Loader from "../appComponents/loader";
import NoDataAvailable from "../appComponents/NoDataAvailable";
import { WebView } from "react-native-webview";
import Share from "react-native-share";
const CustomeHeader = (props) => {
  // console.log(props, 'Custom header');
  const screenWidth = Math.round(Dimensions.get("window").width);

  if (props.headerId == 1) {
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
              onPress={() => props.navigation.goBack()}
              style={{ padding: 5 }}
            >
              <Image
                style={{ height: 25, width: 25 }}
                source={require("../../icons/back.png")}
              ></Image>
            </TouchableOpacity>
          </Left>

          <Body>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
              >
                {props.title}
              </Text>
            </View>
          </Body>
          <Right>
            <TouchableOpacity
              style={{ padding: 5 }}
              onPress={props.onPressShare}
            >
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "bold",
                  color: "white",
                  marginLeft: 15
                }}
              >
                {props.rightTitle}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ padding: 5 }}
              onPress={props.onPressShare}
            >
              <Image
                source={require("../../icons/headershare.png")}
                style={{ height: 25, width: 25 }}
              />
            </TouchableOpacity>
          </Right>
        </ImageBackground>
      </Header>
    );
  }
};
export default class HealthDayScreen extends Component {
  /* Return object for populate the list */
  constructor(props) {
    super(props);
    //setting default state
    this.state = {
      isLoading: false,
      Link: "",
      title: ""
    };

    //   console.log("constructort==============================");
  }

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    console.log(
      "Check status componentWillReceiveProps==============================",
      this.props.route.params.pagetitle
    );
    this.setState({
      isLoading: true,
      Link: nextProp.route.params.Link,
      title: nextProp.route.params.pagetitle
    });

    this.CheckStatuscall();
  };

  onPressRefresh = () => {
    this.setState({ isLoading: true });
    this.CheckStatuscall();
  };

  componentDidMount = () => {
    console.log(
      "Check status componentDidMount==============================",
      this.props.route.params
    );

    this.setState({
      isLoading: true,
      Link: this.props.route.params.Link,
      title: this.props.route.params.pagetitle
    });

    this.CheckStatuscall();
  };

  myCustomShare = async () => {
    const shareOptions = {
      message: "Read the full article at.",
      url: this.state.Link
    };

    try {
      const ShareResponse = await Share.open(shareOptions);
    } catch (error) {
      console.log("Error => ", error);
    }
  };

  LoadingIndicatorView() {
    return <Loader loading={this.state.isLoading} />;
  }

  CheckStatuscall = async () => { };

  render() {
    //const { navigate } = this.props.navigation;

    return (
      <Container>
        <CustomeHeader
          headerId={1}
          title={this.state.title}
          navigation={this.props.navigation}
          onPressShare={this.myCustomShare}
        />

        <WebView
          style={{ flex: 1 }}
          source={{
            // uri: "http://visionarylifesciences.com/privacy-policy.html",
            uri: this.state.Link
          }}
          renderLoading={this.LoadingIndicatorView}
        />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  containermain: {
    flex: 1,
    marginTop: 1,
    backgroundColor: "white"
  }
});
