import React, { Component } from "react";

import { StyleSheet } from "react-native";
import { Container } from "native-base";

import CustomeHeader from "../appComponents/CustomeHeader";
import Constants from "../utils/Constants";
import Loader from "../appComponents/loader";
import NoDataAvailable from "../appComponents/NoDataAvailable";
import { WebView } from "react-native-webview";

export default class PrivacyPolicy extends Component {
  /* Return object for populate the list */
  constructor(props) {
    super(props);
    //setting default state
    this.state = {
      isLoading: false
    };

    //   console.log("constructort==============================");
  }

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // console.log(
    //   "Check status componentWillReceiveProps==============================",
    //   this.props.route.params
    // );
    this.setState({ isLoading: true });

    this.CheckStatuscall();
  };

  onPressRefresh = () => {
    this.setState({ isLoading: true });
    this.CheckStatuscall();
  };

  componentDidMount = () => {
    // console.log(
    //   "Check status componentDidMount==============================",
    //   this.props.route.params
    // );

    this.setState({ isLoading: true });

    this.CheckStatuscall();
  };

  LoadingIndicatorView() {
    return <Loader loading={this.state.isLoading} />;
  }

  CheckStatuscall = async () => { };

  render() {
    //const { navigate } = this.props.navigation;

    return (
      <Container>
        {/* <Loader loading={this.state.isLoading} /> */}

        <CustomeHeader
          headerId={1}
          title="privacy policy"
          navigation={this.props.navigation}
        />

        <WebView
          style={{ flex: 1 }}
          source={{
            // uri: "http://visionarylifesciences.com/privacy-policy.html",
            uri: "https://howzu.co.in/privacy-policy.aspx"
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
