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
  ActivityIndicator,
  TextInput,
  ScrollView,
  RefreshControl,
  NativeModules,
  BackHandler
} from "react-native";
import { Container } from "native-base";
import CustomeHeader from "../appComponents/CustomeHeader";
import base64 from "react-native-base64";
import ImageLoad from "react-native-image-placeholder";
import Loader from "../appComponents/loader";
import NoDataAvailable from "../appComponents/NoDataAvailable";
import PaginationLoading from "../appComponents/PaginationLoading";
import MyDoctorListComp from "../appComponents/MyDoctorListComp";
import ActionButton from "react-native-action-button";
import { CommonActions } from "@react-navigation/native";
const Rijndael = require("rijndael-js");
import Toast from "react-native-tiny-toast";
import call from "react-native-phone-call";
//const bufferFrom = require('buffer-from')
global.Buffer = global.Buffer || require("buffer").Buffer;

const padder = require("pkcs7-padding");

class MyDoctors extends Component {
  constructor(props) {
    super(props);

    //setting default state
    this.state = {
      isLoading: false,
      pageNo: 1,
      searchString: "",
      selectedIds: [],
      AllMyDoctors: [],
      paginationLoading: false,
      isNetConnected: true,
      searchLoading: false,
      refreshing: false,
      typing: true,
      isLoadingSecond: false,
      typingTimeout: 0
    };
  }

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // console.log(
    //   "UNSAFE_componentWillReceiveProps =============================="
    // );
    this.setState(
      { pageNo: 1, isLoading: true, AllMyDoctors: [], searchString: "" },
      () => {
        this.getDoctorlist("");
      }
    );
    // this.backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.hardwarebBackAction
    // );
  };

  componentDidMount = async () => {
    // console.log(
    //   'componentDidMount==============================',
    //   this.props.navigation.isFocused()
    // );
    this.setState(
      { isLoading: true, AllMyDoctors: [], searchString: "" },
      () => {
        this.getDoctorlist("");
      }
    );
    // this.backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.hardwarebBackAction
    // );
  };

  hardwarebBackAction = () => {
    // console.log(
    //   this.props.navigation,
    //   " ---",
    //   this.props.navigation.route,
    //   "Back Action from my docot "
    // );

    this.props.navigation.dispatch(
      CommonActions.navigate({
        name: "PatientDashboard",
        params: { from: "MyDoctor" }
      })
    );
    return true;
    // this.props.navigation.goBack();
    // if (this.props.route.name == 'MyDocotor') {
    //   this.props.navigation.goBack();
    // } else {
    // this.props.navigation.dispatch('PatientDashboard', { from: 'MyDoctor' });
    // }
    // this.props.navigation.navigate('PatientDashboard');
    // return false;
  };

  removeDuplicate = (datalist) => {
    return datalist.filter(function (a) {
      return !this[a.DoctorId] && (this[a.DoctorId] = true);
    }, Object.create(null));
  };
  // removeDuplicate = (datalist) => {
  //   let result = [];
  //   datalist.forEach((ele) => {
  //     if (ele.DoctorId != 0 && !result[ele.DoctorId != 0]) {
  //       result.push(ele);
  //     } else {
  //       result.push(ele);
  //     }
  //   });
  //   return result;
  // };

  getDoctorlist = async (empty) => {
    console.log(this.state.pageNo);
    console.log(Constants.PER_PAGE_RECORD);
    console.log(this.state.searchString);

    try {
      let response = await axios.post(Constants.GET_DOCTOR_LIST, {
        pageNumber: this.state.pageNo,
        pageSize: Constants.PER_PAGE_RECORD,
        Searching: this.state.searchString
      });
      console.log("My Doctors  data==============", response.data);
      this.setState({ loading: false });

      if (response.data.Status) {
        let responseData = [...this.state.AllMyDoctors];
        let newdocres = [];
        // let responseData=[];
        response.data.DoctorList.map((item) => {
          // if (item.DoctorId != 0) {
          responseData.push(item);
          // } else {
          //   console.log(item);
          //   newdocres.push(item);
          // }
        });

        this.setState({
          AllMyDoctors: this.removeDuplicate(responseData),
          // AllMyDoctors: responseData,
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false
          // searchString: '',
        });
      } else {
        //Toast.show(response.data.Msg)
        this.setState({
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false
          // searchString: '',
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

  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 5;
  };

  callpagination = async () => {
    this.setState(
      { paginationLoading: true, pageNo: this.state.pageNo + 1 },
      () => {
        this.getDoctorlist();
      }
    );
  };

  // onChangeTextClick = async (val) => {
  //   console.log('======', val);
  //   this.setState(
  //     { searchString: val, AllMyDoctors: [], pageNo: 1, searchLoading: true },
  //     () => {
  //       this.getDoctorlist(true);
  //     }
  //   );
  // };

  onChangeTextClick = (val) => {
    this.setState({ isLoadingSecond: true });
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
            AllMyDoctors: [],
            pageNo: 1,
            searchLoading: true
          },
          () => {
            this.getDoctorlist();
          }
        );
      }, 1000)
    });
  };
  onRefresh = async () => {
    // console.log("Doct rs refreshing the data");
    this.setState(
      { refreshing: true, AllMyDoctors: [], pageNo: 1, searchLoading: true },
      () => {
        this.getDoctorlist();
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
  OpenAllDoc = (item) => {
    //Alert.alert(item.key,item.title);
    // this.props.navigation.navigate("AllDoctorsList");
    this.props.navigation.navigate("ChooseAddDoc");
  };

  //handling onPress actions
  OpenCheckStatus = (item) => {
    //Alert.alert(item.key,item.title);
    this.props.navigation.navigate("CheckStatus");
  };

  handleSelectionMultiple = (id) => {
    console.log("TestID==============================", id);

    var selectedIds = [...this.state.selectedIds]; // clone state
    if (selectedIds.includes(id))
      selectedIds = selectedIds.filter((_id) => _id !== id);
    else selectedIds.push(id);
    this.setState({ selectedIds });
  };

  showOrhide = (item, isShow) => {
    // console.log(
    //   "showOrhide========",
    //   item,
    //   this.state.AllMyDoctors.findIndex((obj) => obj.DoctorId == item.DoctorId)
    // );
    this.state.AllMyDoctors.find(
      (obj) => obj.DoctorId == item.DoctorId
    ).isShow = !item.isShow;
    this.setState({ AllMyDoctors: this.state.AllMyDoctors });
  };

  OpenShareReportList = (index) => {
    let info = this.state.AllMyDoctors[index];
    // console.log(
    //   "Report shared DOc index====================================",
    //   index,
    //   info
    // );
    //this.props.navigation.navigate("ReportSharedToDoc");
    this.props.navigation.navigate("ReportSharedToDoc", {
      doctorid: info.DoctorId,
      docinfo: info
    });
  };

  onPressDeleteMember = (index) => {
    // let info = this.state.ApprovedRequestList[index];
    let info = this.state.AllMyDoctors[index];
    let drname = info.DoctorName.split(" ");
    console.log(drname[0] != "Dr.", drname[0] != "Dr", "split name");
    let doctorname;
    if (drname[0] != "Dr" && drname[0] != "Dr." && drname[0] != "Dr.") {
      console.log("if if ");
      doctorname = "Dr " + info.DoctorName;
    } else {
      doctorname = info.DoctorName;
    }
    //  console.log(doctorname, "delete the doctor");

    Alert.alert(
      "Are you sure you want to Delete " + doctorname + "?",
      "",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => this.deleteDocfromPatientList(index) }
      ],
      { cancelable: false }
    );
  };

  deleteDocfromPatientList = async (index) => {
    this.setState({ isLoading: true });
    // console.log("Delte Doc from my List");
    let info = this.state.AllMyDoctors[index];
    // console.log(
    //   "Dee cov",
    //   info
    //   // Constants.DELETE_DOCFROM_PATIENTLISST + "MyDoctorId =" + info.MyDoctorId
    // );
    let drname = info.DoctorName.split(" ");
    console.log(drname[0], "dr ame ");
    try {
      let response = await axios.get(
        Constants.DELETE_DOCFROM_PATIENTLISST + "MyDoctorId=" + info.MyDoctorId
      );
      // console.log("My Doctors  data==============", response.data);
      this.setState({ loading: false });

      if (response.data.Status) {
        Toast.show(response.data.Msg);
        this.setState(
          { refreshing: true, AllMyDoctors: [], isLoading: true, pageNo: 1 },
          () => {
            this.getDoctorlist();
          }
        );
        // this.setState({ isLoading: true });
        // this.setState({});
      } else {
        Toast.show(response.data.Msg);
        this.setState({ isLoading: false });
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

  Decrypt = (encryptStr) => {
    // console.log(encryptStr, "encryted ////");
    if (encryptStr) {
      const cipher = new Rijndael("1234567890abcder", "cbc");
      const plaintext = Buffer.from(
        cipher.decrypt(
          new Buffer(encryptStr, "base64"),
          128,
          "1234567890abcder"
        )
      );
      const decrypted = padder.unpad(plaintext, 32);
      const clearText = decrypted.toString("utf8");

      // console.log(
      //   "Decrypt  ====================================",
      //   plaintext.toString()
      // );
      return clearText.toString();
    } else {
      return "";
    }
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

  backbtnPress = () => {
    this.props.navigation.goBack();
    // this.props.navigation.navigate('PatientDashboard', {
    //   refresh: 'refresh',
    // });
  };
  makeCalltoDoc = (contact) => {
    console.log(contact, "make call to doc ");
    if (contact.length != 10) {
      alert("Incorrect contact number");
      return;
    }

    const args = {
      number: contact,
      prompt: true
    };
    // Make a call
    call(args).catch(console.error);
  };
  render() {
    const { data, isLoading } = this.state;

    return (
      <Container>
        {/* <CustomeHeader
          title="My Doctors"
          headerId={1}
          navigation={this.props.navigation}
        /> */}

        {/* changed to below */}

        <CustomeHeader
          title="My Doctors"
          headerId={2}
          navigation={this.props.navigation}
          onPressback={this.backbtnPress}
        />
        <Loader loading={this.state.isLoading} />
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
                paddingLeft: 5,
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
            {this.state.AllMyDoctors.map((item, index) => (
              <View style={{ flex: 1, bottom: 10 }} key={index}>
                <MyDoctorListComp
                  DoctorName={item.DoctorName}
                  mobile={this.Decrypt(item.Mobile)}
                  email={this.Decrypt(item.EmailId)}
                  item={item}
                  specilization={item.Specialization}
                  address={item.Address}
                  ProfilePic={item.ProfilePic}
                  checkbox={
                    this.state.selectedIds.includes(item.DoctorId)
                      ? require("../../icons/tick-1.png")
                      : null
                  }
                  makecall={(mobile) => this.makeCalltoDoc(mobile)}
                  deleteDoc={() => this.onPressDeleteMember(index)}
                  // deleteDoc={() => this.deleteDocfromPatientList(index)}
                  // onPress={() => this.handleSelectionMultiple(item.DoctorId)}
                  showOrhide={(index, isShow) => this.showOrhide(index, isShow)}
                  onPressShare={() => this.OpenShareReportList(index)}
                ></MyDoctorListComp>
              </View>
            ))}
            <View>
              {this.state.paginationLoading ? <PaginationLoading /> : null}
            </View>
            <View style={{ flex: 1 }}>
              {this.state.searchLoading ? (
                <Loader loading={this.state.isLoading} />
              ) : null}
            </View>
          </ScrollView>
          {this.state.AllMyDoctors.length <= 0 &&
          !this.state.isLoading &&
          !this.state.searchLoading &&
          !this.state.refreshing ? (
            <NoDataAvailable
              onPressRefresh={this.onRefresh}
              source={require("../../icons/nodatamydoc.png")}
              // source={require("../../icons/newnodataoc.png")}
            />
          ) : // <View
          //   style={{
          //     height: "100%",
          //     width: "100%",
          //     backgroundColor: "white",
          //     alignItems: "center",
          //     justifyContent: "center"
          //     // margin: 10
          //   }}
          // >
          //   <Image
          //     // source={require("../../icons/nodatafoundDoc.jpeg")}
          //     // source={require("../../icons/nodatamydoc.jpeg")}
          //     // source={require("../../icons/nodatadoc.jpeg")} //mydocnodata
          //     //  mydocnodata
          //     // source={require("../../icons/nodatamydoc.png")}
          //     style={{
          //       height: "70%",
          //       width: "94%"
          //     }}
          //   />
          //   <TouchableOpacity onPress={this.onRefresh}>
          //     {/* <Text style={{ color: 'green' ,backgroundColor:'white'}}>click to refresh</Text> */}
          //   </TouchableOpacity>
          // </View>
          null}
        </View>
        <ActionButton
          style={{
            marginRight: 55,
            alignItems: "center"
            // bottom: -15
          }}
          buttonColor="#275BB4"
          onPress={this.OpenAllDoc}
        />
      </Container>
    );
  }
}
export default MyDoctors;
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
    marginLeft: 15,
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
