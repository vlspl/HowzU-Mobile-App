import React, { Component } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Alert,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Container } from "native-base";
import { ScrollView } from "react-native-gesture-handler";
import CustomeHeader from "../appComponents/CustomeHeader";
import axios from "axios";
import Constants from "../utils/Constants";
import Loader from "../appComponents/loader";
import Toast from "react-native-tiny-toast";
import PaginationLoading from "../appComponents/PaginationLoading";

// import { NavigationEvents } from 'react-navigation';

export default class MedicationPermission extends Component {
  constructor(props) {
    super(props);
    //setting default state
    this.state = {
      isLoading: false,
      pageNo: 1,
      searchString: "",
      paginationLoading: false,
      isNetConnected: true,
      searchLoading: false,
      refreshing: false,
    };
  }

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // console.log(
    //   ' ALL TEST list componentWillReceiveProps==============================',
    //   nextProp
    // );
    this.setState({}, () => {});
  };

  handleSelectionMultiple = (id) => {
    // console.log('TestID==============================', id);

    var selectedIds = [...this.state.selectedIds]; // clone state
    if (selectedIds.includes(id))
      selectedIds = selectedIds.filter((_id) => _id !== id);
    else selectedIds.push(id);
    this.setState({ selectedIds });
  };

  removeDuplicate = (datalist) => {
    return datalist.filter(function (a) {
      return !this[a.TestId] && (this[a.TestId] = true);
    }, Object.create(null));
  };

  componentDidMount() {
    // console.log(
    //   'componentDidMount FOCUSSSSSSSS=====TestLIST=============================='
    // );
    this.setState({}, () => {});
  }

  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 5;
  };

  callpagination = async () => {
    this.setState(
      {
        paginationLoading: true,
        pageNo: this.state.pageNo + 1,
      },
      () => {
        this.getSuggestedTest();
      }
    );
  };

  onChangeTextClick = async (val) => {
    // console.log("======", val);

    this.setState(
      {
        searchString: val,
        AllTestList: [],
        pageNo: 1,
        searchLoading: true,
      },
      () => {
        this.getSuggestedTest(true);
      }
    );
  };

  onRefresh = async () => {
    this.setState(
      {
        refreshing: true,
        AllTestList: [],
        searchString: "",
        pageNo: 1,
      },
      () => {
        this.getSuggestedTest();
      }
    );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 0.5,
          //width: "95%",
          backgroundColor: "gray",
          marginLeft: 20,
          marginRight: 15,
        }}
      />
    );
  };

  //handling onPress action

  OpenCalenderPage = () => {
    this.props.navigation.navigate("MedicationCalendrHome");
  };

  render() {
    const { data, isLoading } = this.state;

    return (
      <Container>
        <Loader loading={this.state.isLoading} />

        <CustomeHeader title="Medication" navigation={this.props.navigation} />

        <View style={{ flex: 1, flexDirection: "column" }}>
          <Text style={{ fontSize: 17, margin: 15, color: "black" }}>
            Complete the following steps to make sure you get your reminders.
          </Text>

          <View
            style={{
              flexDirection: "column",
              borderColor: "lightgray",
              borderWidth: 1,
              margin: 15,
              borderRadius: 8,
            }}
          >
            <Text style={{ fontSize: 16, margin: 15, color: "blue" }}>
              Step 1:Complete the following steps to make sure you get your
              reminders.
            </Text>
            <View
              style={{
                height: 0.4,
                backgroundColor: "lightgray",
                marginLeft: 15,
                marginRight: 15,
                marginTop: 0,
              }}
            ></View>

            <Text style={{ fontSize: 15, margin: 15, color: "gray" }}>
              Complete the following steps to make sure you get your
              reminders.Complete the following steps to make sure you get your
              reminders.
            </Text>

            <TouchableOpacity
              style={{
                height: 40,
                borderRadius: 20,
                margin: 30,
                backgroundColor: "black",
                justifyContent: "center",
              }}
              onPress={this.OpenCalenderPage()}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Take this action
              </Text>
            </TouchableOpacity>
          </View>
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
    marginLeft: 15,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 2,
    borderRadius: 5,
    backgroundColor: "white",
    //elevation: 2,
  },

  Separator: {
    height: 0.5,
    backgroundColor: "gray",
    marginLeft: 0,
    marginRight: 0,
    marginTop: 10,
  },
});
