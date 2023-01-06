import React, { Component } from "react";

import { StyleSheet } from "react-native";
import { Container } from "native-base";

import CustomeHeader from "../appComponents/CustomeHeader";
import Constants from "../utils/Constants";
import Loader from "../appComponents/loader";
import NoDataAvailable from "../appComponents/NoDataAvailable";
import { WebView } from "react-native-webview";

export default class TermnCondition extends Component {
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

  CheckStatuscall = async () => {};

  LoadingIndicatorView() {
    return <Loader loading={this.state.isLoading} />;
  }

  render() {
    //const { navigate } = this.props.navigation;

    return (
      <Container>
        {/* <Loader loading={this.state.isLoading} /> */}

        <CustomeHeader
          headerId={1}
          title="Terms and Conditions"
          navigation={this.props.navigation}
        />

        <WebView
          style={{ flex: 1 }}
          renderLoading={this.LoadingIndicatorView}
          source={{
            // uri: "http://visionarylifesciences.com/term-services.html",
            uri: "https://howzu.co.in/term-services.html"
          }}
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
