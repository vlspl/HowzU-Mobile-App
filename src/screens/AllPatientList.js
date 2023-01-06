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
  TextInput,
  ActivityIndicator,
  RefreshControl,
  BackHandler
} from "react-native";
import { Container } from "native-base";
import { ScrollView } from "react-native-gesture-handler";
import CustomeHeader from "../appComponents/CustomeHeader";
import axios from "axios";
import Constants from "../utils/Constants";
import Loader from "../appComponents/loader";
import NoDataAvailable from "../appComponents/NoDataAvailable";
import AllPatientRow from "../appComponents/AllPatientRow";
import PaginationLoading from "../appComponents/PaginationLoading";
import Toast from "react-native-tiny-toast";
const Rijndael = require("rijndael-js");
global.Buffer = global.Buffer || require("buffer").Buffer;
import { CommonActions } from "@react-navigation/native";

export default class AllPatientList extends Component {
  constructor(props) {
    super(props);
    //setting default state
    this.state = {
      isLoading: false,
      selectedIds: [],
      allPatientList: [],
      pageNo: 1,
      searchString: "",
      paginationLoading: false,
      isNetConnected: true,
      searchLoading: false,
      refreshing: false
    };
  }

  // removeDuplicate =(datalist) => {
  //   return datalist.filter(function (a) {
  //       return ((!this[a.BookingId] && (this[a.BookingId] = true))&&(!this[a.BookingId] && (this[a.BookingId] = true)));
  //     }, Object.create(null));

  //   }

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // console.log(
    //   " ALL Patient list componentWillReceiveProps==============================",
    //   nextProp
    // );

    this.setState(
      {
        selectedIds: [],
        isLoading: true,
        pageNo: 1
      },
      () => {
        this.getAllPatient("");
      }
    );
  };

  handleSelectionMultiple = (id) => {
    // console.log("TestID==============================", id);

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

  componentDidMount() {
    // console.log("componentDidMount ==============================");
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.hardwarebBackAction
    );
    this.setState(
      {
        selectedIds: [],
        isLoading: true
      },
      () => {
        this.getAllPatient();
      }
    );
  }

  addPatienttoMyList = async () => {
    this.setState({ isLoading: true });
    // console.log("selectedIds ======", this.state.selectedIds);

    try {
      let response = await axios.post(Constants.ADD_PATIENTS, {
        PatientId: this.state.selectedIds.toString()
      });
      // console.log("data==============", response.data);
      this.setState({ isLoading: false });

      if (response.data.Status) {
        Toast.show(response.data.Msg);
        this.props.navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              {
                name: "Drawer"
              },
              {
                name: "MyPatients",
                params: { refresh: "refresh" }
              }
            ]
          })
        );
        // this.props.navigation.navigate("MyPatients", { refresh: true });
      } else {
        Toast.show(response.data.Msg);
      }
    } catch (errors) {
      Toast.show("Something Went Wrong, Please Try Again Later");

      //Toast.show(errors)
      this.setState({ isLoading: false });

      console.log(errors);
    }
  };

  getAllPatient = async (empty) => {
    // if (empty) {
    //   // console.log("**************")
    //   this.setState({ allPatientList: [] });
    // }
    try {
      let response = await axios.post(Constants.ALL_PATIENTLIST, {
        pageNumber: this.state.pageNo,
        pageSize: Constants.PER_PAGE_RECORD,
        Searching: this.state.searchString
      });
      // console.log(".../.../All patient list data==============", response.data);
      this.setState({ loading: false });

      if (response.data.Status) {
        let responseData = this.state.allPatientList;
        // let responseData = [];
        response.data.PatientList.map((item) => {
          responseData.push(item);
        });

        this.setState({
          allPatientList: this.removeDuplicate(responseData),
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
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

  Decrypt = (encryptStr) => {
    const cipher = new Rijndael("1234567890abcder", "cbc");
    const plaintext = Buffer.from(
      cipher.decrypt(new Buffer(encryptStr, "base64"), 128, "1234567890abcder")
    );
    // console.log(
    //   'Decrypt  ====================================',
    //   plaintext.toString()
    // );

    return plaintext.toString();
  };

  hardwarebBackAction = () => {
    this.props.navigation.goBack();
    return true;
  };
  componentWillUnmount = () => {
    this.backHandler.remove();
  };
  callpagination = async () => {
    // await this.setState({ paginationLoading: true })
    // await this.setState({ pageNo: this.state.pageNo + 1 })
    // this.getAllPatient()
    this.setState(
      {
        paginationLoading: true,
        pageNo: this.state.pageNo + 1
      },
      () => {
        this.getAllPatient();
      }
    );
  };

  onChangeTextClick = async (val) => {
    // console.log("======", val);
    // await this.setState({ searchString: val })
    //  await this.setState({ allPatientList: [] })
    // await this.setState({ pageNo: 1 })
    // await this.setState({ searchLoading: true })
    // await this.getAllPatient(true)

    this.setState(
      {
        searchString: val,
        allPatientList: [],
        pageNo: 1,
        searchLoading: true
      },
      () => {
        this.getAllPatient(true);
      }
    );
  };

  onRefresh = async () => {
    // await this.setState({ refreshing: true })
    // this.setState({ allPatientList: [] })
    // await this.getAllPatient()

    this.setState(
      {
        refreshing: true,
        allPatientList: [],
        pageNo: 1
      },
      () => {
        this.getAllPatient();
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

  //handling onPress action
  AddPatient = () => {
    // console.log(
    //   "Add btn press ==============================",
    //   this.state.selectedIds
    // );

    if (this.state.selectedIds.length == 0) {
      Toast.show("Please Select Patient");
    } else {
      this.addPatienttoMyList();
    }
  };

  render() {
    return (
      <Container>
        <Loader loading={this.state.isLoading} />

        <CustomeHeader
          title="Patient List"
          headerId={1}
          rightTitle="+ Add"
          navigation={this.props.navigation}
          onPressRight={this.AddPatient}
        />

        <View style={{ flex: 1, flexDirection: "column" }}>
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
                backgroundColor: "#F5F5F5",
                borderRadius: 20,
                height: 40,
                flexDirection: "row",
                shadowOffset: { width: 0, height: 2 },
                shadowColor: "gray",
                shadowOpacity: 0.7,
                elevation: 5
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
                  paddingLeft: 10,
                  fontSize: 15
                }}
                onChangeText={(val) => this.onChangeTextClick(val)}
                value={this.state.searchString}
                underlineColorAndroid="transparent"
                placeholder="Search.."
                allowFontScaling={false}
              />
            </View>
          </View>

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
                  //colors='red'
                />
              }
            >
              {this.state.allPatientList.map((item, index) => {
                return (
                  <AllPatientRow
                    patientname={item.PatientName}
                    mobile={this.Decrypt(item.Mobile)}
                    ProfilePic={item.ProfilePic}
                    checkbox={
                      this.state.selectedIds.includes(item.UserId)
                        ? require("../../icons/tick-1.png")
                        : null
                    }
                    onPress={() => this.handleSelectionMultiple(item.UserId)}
                  ></AllPatientRow>
                );
                //</View>
              })}

              <View>
                {this.state.paginationLoading ? <PaginationLoading /> : null}
              </View>
              <View style={{ flex: 1, height: 100 }}>
                {this.state.searchLoading ? (
                  <Loader loading={this.state.isLoading} />
                ) : null}
              </View>
            </ScrollView>
            {this.state.allPatientList.length <= 0 &&
            !this.state.isLoading &&
            !this.state.searchLoading &&
            !this.state.refreshing ? (
              <NoDataAvailable onPressRefresh={this.onRefresh} />
            ) : null}
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
    marginLeft: 15,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 2,
    borderRadius: 5,
    backgroundColor: "white"
    //elevation: 2,
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    flexDirection: "row",
    // backgroundColor: 'gray',
    marginRight: 10,
    fontWeight: "bold"
  },
  container_text: {
    flex: 1,
    flexDirection: "column",
    marginTop: 0,
    padding: 5,
    justifyContent: "center",
    backgroundColor: "white"
  },
  description: {
    fontSize: 12,
    //marginTop: 4,
    padding: 2,
    color: "gray",
    marginLeft: 2,
    flex: 1
    /// backgroundColor: 'gray',
  },
  suggestbtnTitle: {
    // flex:1,
    fontSize: 9,
    marginRight: 0,
    paddingRight: 0,
    color: "white",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold"
  },
  photo: {
    height: 68,
    width: 68,
    shadowOffset: { width: 3, height: 3 },
    shadowColor: "gray",
    shadowOpacity: 0.7,
    elevation: 5,
    borderWidth: 0,
    borderRadius: 34
  },
  email: {
    fontSize: 12,
    //fontStyle: 'italic',
    marginTop: 3,
    color: "gray",
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
    alignItems: "center",
    justifyContent: "center"
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
    flex: 0.3,
    flexDirection: "row",
    //alignSelf: 'flex-end',
    height: 22,
    //width: 150,
    //marginTop : 0,
    // paddingTop: 0,
    backgroundColor: "#003484",
    borderRadius: 11
  },

  Mobilesubview: {
    flex: 1,
    flexDirection: "row",
    marginTop: 5
    // alignSelf: 'flex-end',
    // backgroundColor:'yellow'
  },
  Icons: {
    height: 15,
    width: 15,
    marginTop: 2
  },

  emailsubview: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-end",
    justifyContent: "space-between",
    alignContent: "flex-end",
    marginTop: 4
    // backgroundColor:'yellow'
  },

  DoctorProfile: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-end",
    alignContent: "flex-end",
    textAlign: "right",
    color: "gray",
    fontSize: 11
  },

  Separator: {
    height: 0.5,
    backgroundColor: "gray",
    marginLeft: 0,
    marginRight: 0,
    marginTop: 10
  }
});
