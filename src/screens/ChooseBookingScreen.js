import React, { Component } from "react";

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  BackHandler
} from "react-native";
import { Container, Toast } from "native-base";

import CustomeHeader from "../appComponents/CustomeHeader";

var TestID = "";
var Testcount = "";

export default class ChooseBookingScreen extends Component {
  constructor(props) {
    super(props);
    //setting default state
    this.state = {
      isLoading: false,
      pageNo: 1,
      searchString: "",
      AllLabList: [],
      TempLabList: [],
      paginationLoading: false,
      isNetConnected: true,
      searchLoading: false,
      refreshing: false,
      selectedtestId: [],
      testIdsStr: "",
      testcount: "",
      clickcount: 0,
      iscurrent: false,
      totalcliks: 0
    };
  }

  //  Choose test option selected
  OpenTestList = () => {
    this.props.navigation.navigate("LabListForBooking", {
      refresh: true
    });
    //old
    // this.props.navigation.navigate('AllTestList', {
    //   refresh: true,
    //   // comeback: this.onComeBackAgain,
    // });
  };
  onComeBackAgain = () => {
    this.setState(
      {
        userDetails: [],
        isLoading: true
      },
      () => {}
    );
    var role = AsyncStorage.getItem(Constants.ACCOUNT_ROLE);
    this.props.navigation.reset("PatientDashboard", {
      refresh: "refresh",
      role: role
    });
  };

  // Upload Prescription
  OpenLabList = () => {
    this.props.navigation.navigate("PrescriptionLabList", {
      refresh: true
      // comeback: this.onComeBackAgain,
    });
  };

  render() {
    return (
      <Container>
        <CustomeHeader
          title="Book Test"
          navigation={this.props.navigation}
          headerId={1}
        />

        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <TouchableOpacity
            onPress={this.OpenLabList}
            style={{
              height: 140,
              width: 140,
              backgroundColor: "white",
              flexDirection: "column",
              justifyContent: "center",
              borderRadius: 70,
              borderColor: "gray",
              borderWidth: 1
            }}
          >
            <Image
              style={{
                height: 140,
                width: 140,
                justifyContent: "center",
                borderRadius: 70
              }}
              source={require("../../icons/Appointments.png")}
            />
          </TouchableOpacity>
          <Text style={{ marginTop: 10, fontSize: 17, fontWeight: "bold" }}>
            Upload Prescription
          </Text>

          <TouchableOpacity
            onPress={this.OpenTestList}
            style={{
              marginTop: 50,
              height: 140,
              width: 140,
              backgroundColor: "white",
              flexDirection: "column",
              justifyContent: "center",
              borderRadius: 70,
              borderColor: "gray",
              borderWidth: 1
            }}
          >
            <Image
              style={{
                height: 140,
                width: 140,
                justifyContent: "center",
                borderRadius: 70
              }}
              source={require("../../icons/Appointments.png")}
            />
          </TouchableOpacity>
          <Text style={{ marginTop: 10, fontSize: 17, fontWeight: "bold" }}>
            Book Test
          </Text>
        </View>
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
