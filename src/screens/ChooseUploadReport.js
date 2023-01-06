import React, { Component } from "react";

import {
  FlatList,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Alert,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  BackHandler
} from "react-native";
import { Container } from "native-base";
import axios from "axios";
import Constants from "../utils/Constants";
import Loader from "../appComponents/loader";
import NoDataAvailable from "../appComponents/NoDataAvailable";
import LablistComp from "../appComponents/LablistComp";
import CustomeHeader from "../appComponents/CustomeHeader";

var TestID = "";
var Testcount = "";

export default class ChooseUploadReport extends Component {
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
      testcount: ""
    };
  }

  removeDuplicate = (datalist) => {
    return datalist.filter(function (a) {
      return !this[a.LabId] && (this[a.LabId] = true);
    }, Object.create(null));
  };

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // console.log(
    //   'Choose booking componentWillReceiveProps==============================',
    //   nextProp.route
    // );
  };

  componentDidMount = () => {
    // console.log(
    //   'Choose booking componentDidMount==============================',
    //   this.props.route
    // );
    // this.backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.hardwarebBackAction
    // );
  };

  ReportManualPunch = () => {
    // console.log("REport Fill ===================================");
    this.props.navigation.navigate("ReportManualPunch", {
      refresh: ""
    });
  };

  hardwarebBackAction = () => {
    this.props.navigation.goBack();
    return true;
  };
  componentWillUnmount = () => {
    // this.backHandler.remove();
  };
  OpenLabList = () => {
    // console.log("Report upldo====================================");
    this.props.navigation.navigate("ReportPicUpload", {
      refresh: ""
    });
  };

  render() {
    const { data, isLoading } = this.state;

    return (
      <Container>
        <CustomeHeader
          title="My Report"
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
              height: 120,
              width: 120,
              backgroundColor: "white",
              flexDirection: "column",
              justifyContent: "center",
              borderRadius: 60,
              borderColor: "gray",
              borderWidth: 1
            }}
          >
            <Image
              style={{
                height: 120,
                width: 120,
                justifyContent: "center",
                borderRadius: 60
              }}
              source={require("../../icons/Appointments.png")}
            />
          </TouchableOpacity>
          <Text style={{ marginTop: 10, fontSize: 17, fontWeight: "bold" }}>
            Upload Report
          </Text>

          <TouchableOpacity
            onPress={this.ReportManualPunch}
            style={{
              marginTop: 50,
              height: 120,
              width: 120,
              backgroundColor: "white",
              flexDirection: "column",
              justifyContent: "center",
              borderRadius: 60,
              borderColor: "gray",
              borderWidth: 1
            }}
          >
            <Image
              style={{
                height: 120,
                width: 120,
                justifyContent: "center",
                borderRadius: 60
              }}
              source={require("../../icons/Appointments.png")}
            />
          </TouchableOpacity>
          <Text style={{ marginTop: 10, fontSize: 17, fontWeight: "bold" }}>
            Fill Report
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
