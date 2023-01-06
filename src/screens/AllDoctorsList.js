import React, { Component } from "react";
import axios from "axios";
import Constants from "../utils/Constants";

import {
  StyleSheet,
  View,
  Image,
  TextInput,
  ScrollView,
  RefreshControl,
  BackHandler
} from "react-native";
import { Container } from "native-base";
import CustomeHeader from "../appComponents/CustomeHeader";
import Loader from "../appComponents/loader";
import NoDataAvailable from "../appComponents/NoDataAvailable";

import PaginationLoading from "../appComponents/PaginationLoading";
import AllDocListComp from "../appComponents/AllDocListComp";
import Toast from "react-native-tiny-toast";

const Rijndael = require("rijndael-js");
//const bufferFrom = require('buffer-from')
global.Buffer = global.Buffer || require("buffer").Buffer;
const padder = require("pkcs7-padding");

export default class AllDoctorList extends Component {
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
      isLoadingSecond: false,
      typingTimeout: 0
    };

    // console.log('constructort==============================');
  }

  componentDidMount = async () => {
    // console.log("componentDidMount==============================");
    this.setState({ isLoading: true });
    this.getDoctorlist("");
  };
  // hardwarebBackAction = () => {
  //   this.backHandler.remove();
  //   this.props.navigation.goBack();
  //   return true;
  // };
  componentWillUnmount = () => {
    // this.backHandler.remove();
  };

  handleSelectionMultiple = (id) => {
    console.log("^^^TestID==============================", id);

    var selectedIds = [...this.state.selectedIds]; // clone state
    if (selectedIds.includes(id)) {
      console.log(selectedIds);
      selectedIds = selectedIds.filter((_id) => _id !== id);
    } else selectedIds.push(id);
    this.setState({ selectedIds });
  };

  removeDuplicate = (datalist) => {
    return datalist.filter(function (a) {
      return !this[a.DoctorId] && (this[a.DoctorId] = true);
    }, Object.create(null));
  };

  getDoctorlist = async (empty) => {
    // console.log(this.state.pageNo);
    // console.log(Constants.PER_PAGE_RECORD);
    // console.log(this.state.searchString);

    try {
      let response = await axios.post(Constants.GET_ALLDOCTOR_LIST, {
        pageNumber: this.state.pageNo,
        pageSize: Constants.PER_PAGE_RECORD,
        Searching: this.state.searchString
      });
      // console.log("data==============", response.data);
      this.setState({ loading: false });

      if (response.data.Status) {
        this.state.AllMyDoctors = [
          ...this.state.AllMyDoctors,
          ...response.data.DoctorList
        ];

        let responseData = this.state.AllMyDoctors;

        response.data.DoctorList.map((item) => {
          item.isShow = false;
          responseData.push(item);
        });

        this.setState({
          AllMyDoctors: this.removeDuplicate(responseData),
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false
        });
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
      Toast.show("Something went wrong,try again later");

      this.setState({
        isLoading: false,
        paginationLoading: false,
        searchLoading: false,
        refreshing: false
      });

      //  console.log(errors);
    }
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
        this.getDoctorlist();
      }
    );
  };

  onChangeTextClick = async (val) => {
    this.setState({ isLoadingSecond: true });
    // console.log("======", val);
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
            this.getDoctorlist(true);
          }
        );
      }, 1000)
    });

    //  this.setState({ searchString: val })
    //   this.setState({ AllMyDoctors: [] })
    //  this.setState({ pageNo: 1 })
    //  this.setState({ searchLoading: true })
    //  this.getDoctorlist(true)
  };

  onRefresh = async () => {
    this.setState(
      {
        refreshing: true,
        AllMyDoctors: []
      },
      () => {
        this.getDoctorlist();
      }
    );
    // await this.setState({ refreshing: true })
    // this.setState({ AllMyDoctors: [] })
    // await this.getDoctorlist()
  };

  Decrypt = (encryptStr) => {
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

  AddDoc = () => {
    // console.log(
    //   "Add btn press ==============================",
    //   this.state.selectedIds
    // );

    if (this.state.selectedIds.length == 0) {
      Toast.show("Please select doctor to add");
    } else {
      this.addDoctoMyList();
    }
  };

  addDoctoMyList = async () => {
    this.setState({ isLoading: true });
    // console.log("selectedIds ======", this.state.selectedIds);

    try {
      let response = await axios.post(Constants.ADD_DOCTORLIST, {
        DoctorId: this.state.selectedIds.toString()
      });
      // console.log("data==============", response.data);
      this.setState({ isLoading: false });

      if (response.data.Status) {
        Toast.show("Doctor added to your list");
        // Toast.show(response.data.Msg);
        this.props.navigation.navigate("MyDoctors", { refresh: true });
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

  showOrhide = (item) => {
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

  render() {
    return (
      <Container>
        <Loader loading={this.state.isLoading} />

        <CustomeHeader
          title="Add My Doctors"
          headerId={1}
          rightTitle="+ Add"
          navigation={this.props.navigation}
          onPressRight={this.AddDoc}
        />
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
            {this.state.AllMyDoctors.map((item) => (
              <View>
                <AllDocListComp
                  ProfilePic={item.ProfilePic}
                  docname={item.DoctorName}
                  item={item}
                  mobile={this.Decrypt(item.Mobile)}
                  specilization={item.Specialization}
                  address={item.Address}
                  checkbox={
                    this.state.selectedIds.includes(item.DoctorId)
                      ? require("../../icons/tick-1.png")
                      : null
                  }
                  onPress={() => this.handleSelectionMultiple(item.DoctorId)}
                  showOrhide={(index, isShow) => this.showOrhide(index, isShow)}
                ></AllDocListComp>
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
          {this.state.AllMyDoctors.length <= 0 &&
          !this.state.isLoading &&
          !this.state.searchLoading &&
          !this.state.refreshing ? (
            <NoDataAvailable onPressRefresh={this.onRefresh} />
          ) : null}
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
