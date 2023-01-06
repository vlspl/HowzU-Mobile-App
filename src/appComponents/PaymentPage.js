import React, { Component } from "react";
import { WebView } from "react-native-webview";
import { ActivityIndicator, StyleSheet } from "react-native";
import Loader from "../appComponents/loader";

class PaymentPage extends Component {
  constructor(props) {
    super(props);
    // console.log(this.props.bookingid, 'paymetn page ');
  }
  LoadingIndicatorView() {
    return (
      <Loader loading={this.state.isLoading} />

      // <ActivityIndicator
      //   color="#009b88"
      //   size="large"
      //   style={styles.ActivityIndicatorStyle}
      // />
    );
  }

  render() {
    // console.log(this.props.bookingid, 'paymetn page ');

    return (
      <WebView
        source={{
          uri:
            "http://b515d0957eb5.ngrok.io/vls-asp-dot-net/AtomPayment.aspx?Id=" +
            this.props.bookingid,
        }}
        javaScriptEnabled={true}
        renderLoading={this.LoadingIndicatorView}
        startInLoadingState={true}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          alert("WebView error: ", nativeEvent);
        }}
        onMessage={(event) => alert(event.nativeEvent.data)}
      />
    );
  }
}

const styles = StyleSheet.create({
  ActivityIndicatorStyle: {
    flex: 1,
    justifyContent: "center",
  },
});

export default PaymentPage;
