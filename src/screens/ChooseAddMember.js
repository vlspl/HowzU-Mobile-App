import React, { Component } from "react";
//import CustomListview from './Screen/DoctorList'

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
  BackHandler,
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

export default class ChooseAddMember extends Component {
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
    };
  }

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // console.log(
    //   'Choose booking componentWillReceiveProps=============================='
    // );
  };

  componentDidMount = () => {
    // this.backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.hardwarebBackAction
    // );
    // console.log(
    //   "Choose booking componentDidMount=============================="
    // );
  };
  hardwarebBackAction = () => {
    this.props.navigation.goBack();
    return true;
  };
  componentWillUnmount = () => {
    // this.backHandler.remove();
  };

  RegisternewMember = () => {
    // console.log("index====================================");
    this.props.navigation.navigate("AddNewFamilyMember", {
      refresh: "",
    });
  };

  ExistingMember = () => {
    // console.log("index====================================");
    this.props.navigation.navigate("ExistingMemberList", {
      refresh: "true",
    });
  };

  render() {
    const { data, isLoading } = this.state;

    return (
      <Container>
        <CustomeHeader
          title="Family Member"
          navigation={this.props.navigation}
          headerId={1}
        />
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={this.ExistingMember}
            style={{
              height: 140,
              width: 140,
              backgroundColor: "white",
              flexDirection: "column",
              justifyContent: "center",
              borderRadius: 70,
              borderColor: "gray",
              borderWidth: 1,
            }}
          >
            <Image
              style={{
                height: 140,
                width: 140,
                justifyContent: "center",
                borderRadius: 70,
              }}
              source={require("../../icons/Existing-Member.png")}
            />
          </TouchableOpacity>
          <Text style={{ marginTop: 10, fontSize: 18, fontWeight: "bold" }}>
            Existing Member
          </Text>

          <TouchableOpacity
            onPress={this.RegisternewMember}
            style={{
              marginTop: 50,
              height: 140,
              width: 140,
              backgroundColor: "white",
              flexDirection: "column",
              justifyContent: "center",
              borderRadius: 70,
              borderColor: "gray",
              borderWidth: 1,
            }}
          >
            <Image
              style={{
                height: 140,
                width: 140,
                justifyContent: "center",
                borderRadius: 70,
              }}
              source={require("../../icons/Register-new-Member.png")}
            />
          </TouchableOpacity>
          <Text style={{ marginTop: 10, fontSize: 18, fontWeight: "bold" }}>
            Register new Member
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
    backgroundColor: "white",
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
    elevation: 2,
  },
});
