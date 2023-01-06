import React, { Component } from "react";
import axios from "axios";
import Constants from "../utils/Constants";

import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ImageBackground,
  Dimensions
} from "react-native";
// import base64 from 'react-native-base64';
// import ImageLoad from 'react-native-image-placeholder';
import Loader from "../appComponents/loader";
import NoDataAvailable from "../appComponents/NoDataAvailable";
import PaginationLoading from "../appComponents/PaginationLoading";
import PendingRequestCard from "../appComponents/PendingRequestCard";
import FamilyMembercard from "../appComponents/FamilyMembercard";
import ActionButton from "react-native-action-button";

import Toast from "react-native-tiny-toast";
import { Header, Container, Body, Left, Right, Icon, Input } from "native-base";

const CustomeHeader = (props) => {
  // console.log(props.from.from, 'Custome header ');
  const screenWidth = Math.round(Dimensions.get("window").width);

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
            onPress={
              () => props.navigation.navigate("PatientDashboard")
              // props.from.from
              //   ? props.navigation.navigate('Drawer')
              //   : props.navigation.goBack()
            }
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
            <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
              {props.title}
            </Text>
          </View>
        </Body>
        <Right></Right>
      </ImageBackground>
    </Header>
  );
};
export default class FamilyMemberList extends Component {
  constructor(props) {
    super(props);
    //setting default state
    this.state = {
      isLoading: false,
      pageNo: 1,
      searchString: "",
      AllMyDoctors: [],
      selectedIds: [],
      PendingRequestList: [],
      ApprovedRequestList: [],
      AccessMembertList: [],
      paginationLoading: false,
      isNetConnected: true,
      searchLoading: false,
      refreshing: false,
      requestId: 0,
      status: ""
    };
  }

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // console.log(
    //   ' Appointment componentWillReceiveProps==============================',
    //   nextProp
    // );
    //this.setState({selectedtestId: nextProp.route.params.testids });

    this.setState(
      {
        pageNo: 1,
        isLoading: true,
        PendingRequestList: [],
        ApprovedRequestList: []
      },
      () => {
        this.getFamilyMemberList();
        this.getAccessMemberList();
        this.getApprovalPendinglist();
      }
    );
  };

  hardwarebBackAction = () => {
    this.props.route.params
      ? props.navigation.navigate("Drawer")
      : props.navigation.goBack();

    return true;
  };
  componentWillUnmount = () => {
    // this.backHandler.remove();
  };
  componentDidMount = async () => {
    // this.backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.hardwarebBackAction
    // );
    // console.log(
    //   '*****component DidMount Family Memeber List==============================',
    //   this.props.route.params
    // );
    this.setState(
      {
        pageNo: 1,
        isLoading: true,
        PendingRequestList: [],
        ApprovedRequestList: []
      },
      () => {
        this.getFamilyMemberList();
        this.getAccessMemberList();
        this.getApprovalPendinglist();
      }
    );
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
      return !this[a.UserId] && (this[a.UserId] = true);
    }, Object.create(null));
  };

  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 5;
  };

  callpagination = async () => {
    this.setState(
      {
        paginationLoading: true,
        pageNo: this.state.pageNo + 1
      },
      () => {
        this.getFamilyMemberList();
        this.getApprovalPendinglist();
      }
    );
  };

  onChangeTextClick = async (val) => {
    // console.log('======', val);
    this.setState(
      {
        searchString: val,
        PendingRequestList: [],
        ApprovedRequestList: [],
        pageNo: 1,
        searchLoading: true
      },
      () => {
        this.getDoctorlist(true);
      }
    );
  };

  onRefresh = async () => {
    this.setState(
      {
        refreshing: true,
        PendingRequestList: [],
        ApprovedRequestList: []
      },
      () => {
        this.getFamilyMemberList();
        this.getApprovalPendinglist();
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

  async getFamilyMemberList() {
    try {
      const response = await axios.get(Constants.FAMILY_MEMBERLIST);

      this.setState({ isLoading: false });
      if (response.data.Status) {
        //Toast.show(response.data.Msg)
        let responseData = this.state.ApprovedRequestList;

        response.data.PatientList.map((item) => {
          // item.isShow=false;
          responseData.push(item);
        });

        this.setState({
          ApprovedRequestList: this.removeDuplicate(responseData),
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false
        });
      } else {
        // Toast.show(response.data.Msg);
      }
    } catch (error) {
      Toast.show("Something Went Wrong, Please Try Again Later");

      this.setState({ isLoading: false });
      console.error(error);
    }
  }

  async getAccessMemberList() {
    try {
      const response = await axios.get(Constants.ACCESS_MEMBER);
      // console.log('AccessMember =====================', response.data);
      this.setState({ isLoading: false });
      if (response.data.Status) {
        //Toast.show(response.data.Msg)
        // console.log(responseData, 'Response data');
        let responseData = this.state.AccessMembertList;
        response.data.PatientList.map((item) => {
          console.log(item, "access mener ");
          // item.isShow=false;
          responseData.push(item);
        });

        // console.log(this.state.AccessMembertList, '******* Member Access');

        this.setState({
          AccessMembertList: this.removeDuplicate(responseData),
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false
        });
      } else {
        // Toast.show(response.data.Msg);
      }
    } catch (error) {
      Toast.show("Something Went Wrong, Please Try Again Later");

      this.setState({ isLoading: false });
      console.error(error);
    }
  }

  getApprovalPendinglist = async () => {
    // console.log(this.state.pageNo);
    // console.log(Constants.PER_PAGE_RECORD);
    // console.log(this.state.searchString);

    try {
      let response = await axios.post(Constants.PENDING_REQUEST, {
        pageNumber: this.state.pageNo,
        pageSize: Constants.PER_PAGE_RECORD,
        Searching: this.state.searchString
      });
      // console.log('data==============', response.data);
      /// this.setState({loading: false });

      if (response.data.Status) {
        let responseData = this.state.PendingRequestList;

        response.data.PatientList.map((item) => {
          //item.isShow=false;
          responseData.push(item);
        });

        this.setState({
          PendingRequestList: this.removeDuplicate(responseData),
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false
        });
        // console.log(
        //   "data PendingRequestList ==============",
        //   this.state.PendingRequestList
        // );
      } else {
        // Toast.show(response.data.Msg);
        this.setState({
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false
        });
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

      console.log(errors);
    }
  };

  addMember = (item) => {
    //Alert.alert(item.key,item.title);
    this.props.navigation.navigate("ChooseAddMember");
  };

  static navigationOptions = {
    title: "Home",
    headerStyle: {
      backgroundColor: "#003484"
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold"
    }
  };

  onPressDeleteMember = (index) => {
    let info = this.state.ApprovedRequestList[index];
    // console.log("index====================================", index, info);
    this.setState({ requestId: info.RequestId }, () => {
      //this.updateRequestStatus();
      Alert.alert(
        "Are you sure you want to Remove this Member",
        "",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "OK", onPress: () => this.deleteMemberCall() }
        ],
        { cancelable: false }
      );
    });
  };

  //Delete meber from granted access
  onPressDeleteAccessMember = (index) => {
    let info = this.state.AccessMembertList[index];
    console.log("index====================================", index, info);
    this.setState({ requestId: info.RequestId }, () => {
      //this.updateRequestStatus();
      Alert.alert(
        "Are you sure you want to Remove this Member",
        "",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "OK", onPress: () => this.deleteAccessMemberCall() }
        ],
        { cancelable: false }
      );
    });
  };

  onPressApprovePending = (index) => {
    let info = this.state.ApprovedRequestList[index];
    // console.log('index====================================', index, info);
    this.props.navigation.navigate("NewMemberOtpVerification", {
      FamilyMemberId: info.UserId,
      from: ""
      // mobile:this.state.Mobile,
    });
  };

  onPressSelectMember = (index) => {
    // console.log(this.state.ApprovedRequestList,'on press family memeber');
    let info = this.state.ApprovedRequestList[index];
    // console.log('Family meber press index====================================', index, info);
    this.props.navigation.navigate("FamilyMemberReports", {
      UserId: info.UserId
    });
  };

  onPressApprove = (index) => {
    let info = this.state.PendingRequestList[index];
    // console.log('index====================================', index, info);
    this.setState({ status: "Accepted", requestId: info.RequestId }, () => {
      //this.updateRequestStatus();
      Alert.alert(
        "Are you sure you want to Accept",
        "",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "OK", onPress: () => this.updateRequestStatus() }
        ],
        { cancelable: false }
      );
    });
  };
  // New changes

  onPressSelecGrantedAccesstMember = (index) => {
    // console.log(this.state.AccessMembertList,'on press family memeber');
    let info = this.state.AccessMembertList[index];
    // console.log('Family meber press index====================================', index, info);
    this.props.navigation.navigate("FamilyMemberReports", {
      UserId: info.UserId
    });
  };

  onPressReject = (index) => {
    let info = this.state.PendingRequestList[index];
    // console.log('index====================================', index, info);
    this.setState({ status: "Rejected", requestId: info.RequestId }, () => {
      ///this.updateRequestStatus();
      Alert.alert(
        "Are you sure you want to Reject",
        "",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "OK", onPress: () => this.updateRequestStatus() }
        ],
        { cancelable: false }
      );
    });
  };

  async deleteMemberCall() {
    // console.log('requestId====', this.state.requestId);
    this.setState({ isLoading: true });
    try {
      const response = await axios.get(
        Constants.DELETE_MEMBER + "RequestId=" + this.state.requestId
      );
      // console.log('response=======', response.data);
      this.setState({ isLoading: false });
      if (response.data.Status) {
        //Toast.show(response.data.Msg)

        // console.log(response.data.Msg);
        Toast.show(response.data.Msg);
        this.setState(
          { pageNo: 1, isLoading: true, ApprovedRequestList: [] },
          () => {
            this.getFamilyMemberList();
          }
        );
      } else {
        this.setState({
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false
        });
      }
    } catch (error) {
      Toast.show("Something Went Wrong, Please Try Again Later");

      this.setState({
        isLoading: false,
        paginationLoading: false,
        searchLoading: false,
        refreshing: false
      });

      console.log(errors);
    }
  }

  async deleteAccessMemberCall() {
    // console.log(
    //   'delete grated access user  requestId==== ',
    //   this.state.requestId
    // );
    this.setState({ isLoading: true });
    try {
      // console.log(
      //   Constants.REVOKE_MEMBER + 'RequestId=' + this.state.requestId,
      //   'granted delet'
      // );
      const response = await axios.get(
        Constants.REVOKE_MEMBER + "RequestId=" + this.state.requestId
      );

      // console.log('response delete member call =======', response.data);
      this.setState({ isLoading: false });
      if (response.data.Status) {
        Toast.show(response.data.Msg);
        this.setState(
          { pageNo: 1, isLoading: true, AccessMembertList: [] },
          () => {
            this.getAccessMemberList();
          }
        );
      } else {
        this.setState({
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false
        });
      }
    } catch (error) {
      this.setState({
        isLoading: false,
        paginationLoading: false,
        searchLoading: false,
        refreshing: false
      });
      Toast.show("Something Went Wrong, Please Try Again Later");

      console.log(error, "Errors @@@");
    }
  }

  updateRequestStatus = async () => {
    console.log("this.state.requestId====", this.state.requestId);
    console.log("this.state.status=====", this.state.status);
    this.setState({ isLoading: true });

    try {
      let response = await axios.post(Constants.UPDATE_REQUESTSTATUS, {
        RequestId: this.state.requestId,
        Status: this.state.status
      });
      // console.log('data==============', response.data);
      this.setState({ isLoading: false });

      if (response.data.Status) {
        console.log(response.data.Msg);
        Toast.show(response.data.Msg);
        this.setState(
          {
            pageNo: 1,
            isLoading: true,
            PendingRequestList: [],
            ApprovedRequestList: []
          },
          () => {
            this.getFamilyMemberList();
            this.getAccessMemberList();
            this.getApprovalPendinglist();
          }
        );
      } else {
        //Toast.show(response.data.Msg)
        this.setState({
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false
        });
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

      console.log(errors);
    }
  };

  render() {
    return (
      <Container>
        <Loader loading={this.state.isLoading} />
        <CustomeHeader
          title="Family Members"
          from={this.props.route.params}
          navigation={this.props.navigation}
          // onPress={this.AddDoc}
        />
        <View
          style={{ flex: 1, flexDirection: "column", backgroundColor: "white" }}
        >
          <View style={styles.containermain}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              onScroll={({ nativeEvent }) => {
                if (this.isCloseToBottom(nativeEvent)) {
                  this.callpagination();
                }
              }}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh}
                />
              }
            >
              {this.state.PendingRequestList.length > 0 ? (
                <View style={{ flex: 1, flexDirection: "column" }}>
                  <Text
                    style={{
                      margin: 10,
                      marginLeft: 15,
                      fontSize: 15,
                      fontWeight: "bold"
                    }}
                  >
                    Pending Request
                  </Text>
                  <View
                    style={{
                      height: 0.5,
                      backgroundColor: "gray",
                      marginRight: 5,
                      marginTop: 5,
                      marginLeft: 15
                    }}
                  ></View>
                  {this.state.PendingRequestList.map((item, index) => {
                    return (
                      <View key={index}>
                        <PendingRequestCard
                          ProfilePic={item.ProfilePic}
                          name={item.Name}
                          relation={item.Relation}
                          onPressApprove={() => this.onPressApprove(index)}
                          onPressReject={() => this.onPressReject(index)}
                        ></PendingRequestCard>
                      </View>
                    );
                  })}
                </View>
              ) : null}

              {this.state.ApprovedRequestList.length > 0 ? (
                <View style={{ flex: 1, flexDirection: "column" }}>
                  <Text
                    style={{
                      margin: 10,
                      marginLeft: 15,
                      fontSize: 15,
                      fontWeight: "bold"
                    }}
                  >
                    Family Members
                  </Text>
                  <View
                    style={{
                      height: 0.5,
                      backgroundColor: "gray",
                      marginRight: 5,
                      marginTop: 5,
                      marginLeft: 15
                    }}
                  ></View>
                  {this.state.ApprovedRequestList.map((item, index) => {
                    return (
                      <View key={index}>
                        <FamilyMembercard
                          ProfilePic={item.ProfilePic}
                          name={item.Name}
                          relation={item.Relation}
                          RequestStatus={item.RequestStatus}
                          onPress={() => this.onPressApprovePending(index)}
                          onPressClose={() => this.onPressDeleteMember(index)}
                          onPressRow={
                            item.RequestStatus == "Accepted"
                              ? () => this.onPressSelectMember(index)
                              : null
                          }
                        ></FamilyMembercard>
                      </View>
                    );
                  })}
                </View>
              ) : null}
              {this.state.AccessMembertList.length > 0 ? (
                <View style={{ flex: 1, flexDirection: "column" }}>
                  <Text
                    style={{
                      margin: 10,
                      marginLeft: 15,
                      fontSize: 15,
                      fontWeight: "bold"
                    }}
                  >
                    Granted Access to
                  </Text>
                  <View
                    style={{
                      height: 0.5,
                      backgroundColor: "gray",
                      marginRight: 5,
                      marginTop: 5,
                      marginLeft: 15
                    }}
                  ></View>
                  {this.state.AccessMembertList.map((item, index) => {
                    return (
                      <View key={index}>
                        <FamilyMembercard
                          ProfilePic={item.ProfilePic}
                          name={item.Name}
                          relation={item.Relation}
                          RequestStatus={item.RequestStatus}
                          //onPress={() => this.onPressApprovePending(index)}
                          onPressClose={() =>
                            this.onPressDeleteAccessMember(index)
                          }
                          // onPressRow={
                          //   item.RequestStatus == "Accepted"
                          //     ? () =>
                          //         this.onPressSelecGrantedAccesstMember(index)
                          //     : null
                          // }
                        ></FamilyMembercard>
                      </View>
                    );
                  })}
                </View>
              ) : null}

              <View>
                {this.state.paginationLoading ? <PaginationLoading /> : null}
              </View>
            </ScrollView>
            {this.state.ApprovedRequestList.length <= 0 &&
            this.state.AccessMembertList.length <= 0 &&
            this.state.PendingRequestList.length <= 0 &&
            !this.state.isLoading &&
            !this.state.searchLoading &&
            !this.state.refreshing ? (
              <NoDataAvailable
                onPressRefresh={this.onRefresh}
                source={require("../../icons/family.png")}
              />
            ) : null}
          </View>
        </View>

        <ActionButton
          style={{
            marginRight: 50,
            marginBottom: 0,
            alignItems: "center",
            bottom: 10
            // margin: 10,
          }}
          buttonColor="#275BB4"
          onPress={this.addMember}
        />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  containermain: {
    flex: 1,
    marginTop: 0,
    backgroundColor: "white",
    justifyContent: "center"
  },
  container: {
    flex: 1,
    flexDirection: "row",
    padding: 1,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 5,
    backgroundColor: "white"
    //elevation: 2,
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    flexDirection: "row",
    marginLeft: 10,
    // backgroundColor: 'gray',
    marginRight: 10,
    fontWeight: "bold"
  },
  container_text: {
    flex: 1,
    flexDirection: "column",
    marginTop: 0,
    marginLeft: 10,
    justifyContent: "center",
    backgroundColor: "white"
  },
  description: {
    fontSize: 15,
    color: "#595858",
    marginBottom: 25,
    marginLeft: 5
    /// backgroundColor: 'gray',
  },
  suggestbtnTitle: {
    // flex:1,
    fontSize: 9,
    marginLeft: 5,
    paddingRight: 0,
    color: "white",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold"
  },
  endTextName: {
    // flex:1,

    marginTop: 4,
    marginRight: 10,
    marginBottom: 5,
    color: "#003484",
    fontSize: 11.5,
    fontWeight: "bold"
  },
  endTextName1: {
    // flex:1,

    marginTop: 10,
    marginRight: 5,
    marginLeft: 5,
    marginBottom: 5,
    color: "grey",
    fontSize: 12
  },
  Icons: {
    height: 20,
    width: 20
  },
  Icons1: {
    height: 20,
    width: 20,
    marginRight: 10
  },
  Icons2: {
    height: 15,
    width: 15,
    marginTop: 5
  },
  header: {
    // flex:1,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 4,
    marginBottom: 5,
    fontSize: 22,
    fontWeight: "bold",
    color: "#003484"
  },

  photo: {
    height: 60,
    width: 60,
    shadowOffset: { width: 3, height: 3 },
    shadowColor: "gray",
    shadowOpacity: 0.7,
    marginLeft: 5,
    elevation: 5,
    borderWidth: 0,
    borderRadius: 34
  },
  placeholder: {
    height: 60,
    width: 60,
    shadowOffset: { width: 3, height: 3 },
    shadowColor: "white",
    shadowOpacity: 0.7,
    borderWidth: 0,
    borderRadius: 34,
    elevation: 5
  },
  email: {
    fontSize: 13,
    //fontStyle: 'italic',
    marginTop: 6,
    color: "#595858",
    marginLeft: 4
    // alignSelf: 'flex-end',

    // backgroundColor: 'gray',
  },
  image: {
    height: 22,
    width: 22,
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-end",
    marginRight: 5

    // justifyContent: 'center'
  },
  touchable: {
    alignItems: "center",
    justifyContent: "center"
  },

  SuggestTesttouch: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginEnd: 5
  },
  SuggestTesttouch1: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end"
  },

  titlesubview: {
    flex: 1,
    flexDirection: "row"
    //alignSelf: 'flex-end',
    // backgroundColor: 'green',
  },

  DRnamesubview: {
    flex: 1,
    flexDirection: "row",
    //alignSelf: 'flex-end',
    backgroundColor: "white"
  },
  sharebtnview: {
    flex: 0.15,
    flexDirection: "row",
    alignSelf: "flex-start"
    //height: 32,
    /// width: 30,
    //marginTop : 0,
    // paddingTop: 0,
    // backgroundColor: '#003484',
    // borderRadius: 11
  },

  Reportview: {
    //flex: 0.40,
    flexDirection: "row",
    alignSelf: "flex-end",
    height: 22,
    width: 100,
    marginLeft: 10,
    // paddingTop: 0,
    backgroundColor: "#003484",
    borderRadius: 11
  },

  Mobilesubview: {
    flex: 1,
    flexDirection: "row"

    // alignSelf: 'flex-end',
  },

  IconsHeader: {
    height: 20,
    width: 20,
    justifyContent: "flex-start",
    alignItems: "center"
  },
  Iconcall: {
    height: 15,
    width: 15,
    marginTop: 1,
    marginLeft: 10
  },
  Iconsemail: {
    height: 15,
    width: 15,
    marginTop: 6
  },
  eyeicon: {
    height: 15,
    width: 15,
    marginTop: 0,
    paddingLeft: 2
  },
  emailsubview: {
    flex: 1,
    flexDirection: "row",
    // alignSelf: 'flex-end',
    //justifyContent: 'space-between',
    // alignContent: 'flex-end',
    //marginTop:4,
    backgroundColor: "white"
  },
  DoctorProfile: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-end",
    alignContent: "flex-end",
    textAlign: "right",
    color: "black",
    fontSize: 11
  },
  Separator: {
    height: 0.5,
    backgroundColor: "gray",
    marginLeft: 0,
    marginRight: 0,
    marginTop: 5
  }
});
