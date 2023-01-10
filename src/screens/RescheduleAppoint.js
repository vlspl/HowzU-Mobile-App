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
  TextInput,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  BackHandler
} from "react-native";
import { Container } from "native-base";
import axios from "axios";
import Constants from "../utils/Constants";
import Loader from "../appComponents/loader";
import NoDataAvailable from "../appComponents/NoDataAvailable";
import RescheduleAppointCard from "../appComponents/RescheduleAppointCard";
import CustomeHeader from "../appComponents/CustomeHeader";
import PaginationLoading from "../appComponents/PaginationLoading";
import moment from "moment";

export default class RescheduleAppoint extends Component {
  constructor(props) {
    super(props);
    //setting default state
    this.state = {
      isLoading: false,
      pageNo: 1,
      searchString: "",
      AllRescheduleAppoints: [],
      paginationLoading: false,
      isNetConnected: true,
      searchLoading: false,
      refreshing: false,
      typingTimeout: 0,
      isLoadingSecond: false,
      typing: true
    };
  }

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // console.log(
    //   " Appointment componentWillReceiveProps==============================",
    //   nextProp
    // );
    //this.setState({selectedtestId: nextProp.route.params.testids });

    this.setState(
      { pageNo: 1, isLoading: true, AllRescheduleAppoints: [] },
      () => {
        this.getRescheduleAppointments("");
      }
    );
  };

  componentDidMount = async () => {
    // this.backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.hardwarebBackAction
    // );
    // console.log("componentDidMount==============================");
    this.setState({ isLoading: true, AllRescheduleAppoints: [] }, () => {
      this.getRescheduleAppointments("");
    });
  };

  hardwarebBackAction = () => {
    this.props.navigation.goBack();
    return true;
  };
  componentWillUnmount = () => {
    // this.backHandler.remove();
  };
  OpenBookAppointment = (index) => {
    let labinfo = this.state.AllRescheduleAppoints[index];
    // console.log(
    //   "Open book appointment ====================================",
    //   index,
    //   labinfo
    // );
    this.props.navigation.navigate("RescheduleBookAppointment", {
      labinfo: labinfo,
      from: "manually"
    });
  };

  getRescheduleAppointments = async (empty) => {
    if (empty) {
      // console.log("**************")
      this.setState({ AllRescheduleAppoints: [] });
    }
    try {
      let response = await axios.post(Constants.GET_PENDINGLIST, {
        pageNumber: this.state.pageNo,
        pageSize: Constants.PER_PAGE_RECORD,
        Searching: this.state.searchString
      });
      this.setState({ loading: false });

      if (response.data.Status) {
        let responseData = this.state.AllRescheduleAppoints;

        response.data.AppointmentList.map((item) => {
          responseData.push(item);
        });

        this.setState({
          AllRescheduleAppoints: responseData,
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false
        });
        // this.setState({ isLoading: false })
        // this.setState({ paginationLoading: false })
        // this.setState({ searchLoading: false })
        // this.setState({ refreshing: false })
      } else {
        //Toast.show(response.data.Msg)
        this.setState({
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false
        });
        // this.setState({ paginationLoading: false })
        // this.setState({ searchLoading: false })
        // this.setState({ refreshing: false })
      }
    } catch (errors) {
      ///Toast.show(errors)
      Toast.show("Something Went Wrong, Please Try Again Later");

      this.setState({
        isLoading: false,
        paginationLoading: false,
        searchLoading: false,
        refreshing: false
      });
      // this.setState({ paginationLoading: false })
      // this.setState({ searchLoading: false })
      // this.setState({ refreshing: false })
      console.log(errors);
    }
  };

  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 5;
  };

  callpagination = async () => {
    // await this.setState({ paginationLoading: true })
    // await this.setState({ pageNo: this.state.pageNo + 1 })
    // this.getRescheduleAppointments()
    this.setState(
      {
        paginationLoading: true,
        pageNo: this.state.pageNo + 1
      },
      () => {
        this.getRescheduleAppointments();
      }
    );
  };

  onChangeTextClick = async (val) => {
    this.setState({ isLoadingSecond: true });
    // await this.setState({ searchString: val })
    //  await this.setState({ AllRescheduleAppoints: [] })
    // await this.setState({ pageNo: 1 })
    // await this.setState({ searchLoading: true })
    // await this.getRescheduleAppointments(true)
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }
    this.setState({
      searchString: val,
      typing: false,
      typingTimeout: setTimeout(() => {
        this.setState(
          {
            searchString: val,
            AllRescheduleAppoints: [],
            pageNo: 1,
            searchLoading: true
          },
          () => {
            this.getRescheduleAppointments(true);
          }
        );
      }, 1000)
    });
  };

  onRefresh = async () => {
    // await this.setState({ refreshing: true })
    // this.setState({ AllRescheduleAppoints: [] })
    // await this.getRescheduleAppointments()

    this.setState(
      {
        refreshing: true,
        AllRescheduleAppoints: [],
        pageNo: 1
      },
      () => {
        this.getRescheduleAppointments();
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
          marginRight: 15
        }}
      />
    );
  };

  render() {
    return (
      <Container>
        <CustomeHeader title="Reschedule" navigation={this.props.navigation} />
        <Loader loading={this.state.isLoading} />

        <View
          style={{ flex: 1, flexDirection: "column", backgroundColor: "red" }}
        >
          <View
            style={{
              height: 60,
              backgroundColor: "white",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View
              style={{
                flex: 0.9,
                backgroundColor: "white",
                borderRadius: 20,
                height: 40,
                flexDirection: "row",
                shadowOffset: { width: 0, height: 2 },
                shadowColor: "gray",
                elevation: 5,
                shadowOpacity: 0.7
              }}
            >
              <Image
                source={require("../../icons/search.png")}
                style={{ height: 20, width: 20, marginLeft: 10, marginTop: 10 }}
              />
              <TextInput
                style={{
                  textAlign: "left",
                  flex: 1,
                  paddingLeft: 5,
                  fontSize: 15
                }}
                onChangeText={(val) => this.onChangeTextClick(val)}
                value={this.state.searchString}
                underlineColorAndroid="transparent"
                placeholder="Search by Test or Lab name .."
                allowFontScaling={false}
              />
            </View>
          </View>

          <View style={styles.containermain}>
            <View style={{ flex: 1 }}>
              <ScrollView
                onScroll={({ nativeEvent }) => {
                  if (this.isCloseToBottom(nativeEvent)) {
                    this.callpagination();
                  }
                }}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                  //colors="red"
                  />
                }
              >
                {this.state.AllRescheduleAppoints.map((item, index) => (
                  <View key={index}>
                    <RescheduleAppointCard
                      testbookat={
                        "Your test is booked at:" +
                        moment(item.TestDate, "DD/MM/YY").format(" DD MMM YY")
                      }
                      lablogo={require("../../icons/lab-1.png")}
                      labname={item.LabName}
                      appointmenttype={item.AppointmentType}
                      testname={item.TestName}
                      date={item.TimeSlot}
                      bookingstatus={item.BookStatus}
                      onPress={() => this.OpenBookAppointment(index)}
                    ></RescheduleAppointCard>
                  </View>
                ))}

                <View>
                  {this.state.paginationLoading ? <PaginationLoading /> : null}
                </View>
                <View style={{ flex: 1, height: 100 }}>
                  {this.state.searchLoading ? (
                    <Loader loading={this.state.isLoading} />
                  ) : null}
                </View>
              </ScrollView>
              {this.state.AllRescheduleAppoints.length <= 0 &&
                !this.state.isLoading &&
                !this.state.searchLoading &&
                !this.state.refreshing ? (
                <NoDataAvailable
                  onPressRefresh={this.onRefresh}
                  source={require("../../icons/resheduledappointmentnodata.png")}
                />
              ) : null}
            </View>
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
