import React, { Component } from "react";
import axios from "axios";
import Constants from "../utils/Constants";

import {
  Button,
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
  BackHandler,
} from "react-native";
import { Container } from "native-base";
import CustomeHeader from "../appComponents/CustomeHeader";
import base64 from "react-native-base64";
import ImageLoad from "react-native-image-placeholder";
import Loader from "../appComponents/loader";
import NoDataAvailable from "../appComponents/NoDataAvailable";
import PaginationLoading from "../appComponents/PaginationLoading";
import ExistingMemberCard from "../appComponents/ExistingMemberCard";
import FamilyMembercard from "../appComponents/FamilyMembercard";
import Modal from "react-native-modal";
import Rediobutton from "../appComponents/Rediobutton";
import { CommonActions } from "@react-navigation/native";
import Toast from "react-native-tiny-toast";

export default class ExistingMemberList extends Component {
  constructor(props) {
    super(props);

    //setting default state
    this.state = {
      isLoading: false,
      pageNo: 1,
      searchString: "",
      selectedIds: [],
      familyMemberList: [],
      paginationLoading: false,
      isNetConnected: true,
      searchLoading: false,
      refreshing: false,
      isModalVisible: false,
      relation: "Relation",
      relationId: 0,
      relationList: [],
      FamilyMemberId: 0,
      typingTimeout: 0,
      isLoadingSecond: false,
      typing: true,
    };
  }

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // console.log(
    //   " Appointment componentWillReceiveProps==============================",
    //   nextProp
    // );
    //this.setState({selectedtestId: nextProp.route.params.testids });

    this.setState(
      {
        pageNo: 1,
        // isLoading: true,
        familyMemberList: [],
        relationList: [],
        searchString: "",
      },
      () => {
        this.getFamilyRelationList();
        //this.searchFamilyMemberlist();
      }
    );
  };

  componentDidMount = async () => {
    //console.log("componentDidMount==============================");
    this.setState(
      {
        pageNo: 1,
        // isLoading: true,
        familyMemberList: [],
        relationList: [],
        searchString: "",
      },
      () => {
        this.getFamilyRelationList();
        // this.searchFamilyMemberlist();
      }
    );
    // this.backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.hardwarebBackAction
    // );
  };

  hardwarebBackAction = () => {
    this.props.navigation.goBack();
    return true;
  };
  componentWillUnmount = () => {
    // this.backHandler.remove();
  };
  async getFamilyRelationList() {
    try {
      const response = await axios.get(Constants.FAMILY_RELATION);
      // console.log(response.data);
      this.setState({ isLoading: false });
      if (response.data.Status) {
        //Toast.show(response.data.Msg)
        // let responseData = this.state.relationList;
        let responseData = [];
        response.data.List.map((item) => {
          // item.isShow=false;
          responseData.push(item);
        });

        this.setState({
          relationList: responseData,
          isLoading: false,
          refreshing: false,
        });
      } else {
        Toast.show(response.data.Msg);
      }
    } catch (error) {
      Toast.show("Something Went Wrong, Please Try Again Later");

      this.setState({ isLoading: false });
      // console.error(error);
    }
  }

  removeDuplicate = (datalist) => {
    return datalist.filter(function (a) {
      return !this[a.UserId] && (this[a.UserId] = true);
    }, Object.create(null));
  };

  searchFamilyMemberlist = async (empty) => {
    // console.log(this.state.pageNo);
    // console.log(Constants.PER_PAGE_RECORD);
    // console.log(this.state.searchString);

    // if (empty) {
    //   // console.log("**************")
    //   this.setState({ familyMemberList: [] });
    // }
    // console.log(this.state.ser)
    try {
      let response = await axios.post(Constants.FAMILY_MEMBERSEARCH, {
        pageNumber: this.state.pageNo,
        pageSize: Constants.PER_PAGE_RECORD,
        Searching: this.state.searchString,
      });
      // console.log("data==============", response.data);
      this.setState({ isLoading: false });

      if (response.data.Status) {
        this.state.familyMemberList = [
          ...this.state.familyMemberList,
          ...response.data.PatientList,
        ];
        let responseData = this.state.familyMemberList;
        // let responseData = [];

        response.data.PatientList.map((item) => {
          /// item.isShow=false;
          responseData.push(item);
        });

        this.setState({
          familyMemberList: this.removeDuplicate(responseData),
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false,
        });
      } else {
        //Toast.show(response.data.Msg)
        this.setState({
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false,
        });
      }
    } catch (errors) {
      ///Toast.show(errors)
      Toast.show("Something Went Wrong, Please Try Again Later");

      this.setState({
        isLoading: false,
        paginationLoading: false,
        searchLoading: false,
        refreshing: false,
      });

      // console.log(errors);
    }
  };

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
        this.searchFamilyMemberlist();
      }
    );
  };

  // onChangeTextClick = async (val) => {
  //   console.log('======', val);
  //   this.setState(
  //     {
  //       searchString: val,
  //       familyMemberList: [],
  //       pageNo: 1,
  //       searchLoading: true,
  //     },
  //     () => {
  //       this.searchFamilyMemberlist(true);
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
            familyMemberList: [],
            pageNo: 1,
            searchLoading: true,
          },
          () => {
            this.searchFamilyMemberlist();
          }
        );
      }, 1000),
    });
  };
  onRefresh = async () => {
    this.setState(
      {
        refreshing: true,
        familyMemberList: [],
      },
      () => {
        this.searchFamilyMemberlist();
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

  toggleModal = (index) => {
    //this.setState({isModalVisible: !this.state.isModalVisible});
    let info = this.state.familyMemberList[index];
    // console.log("index====================================", index, info);
    this.setState({
      FamilyMemberId: info.UserId,
      isModalVisible: !this.state.isModalVisible,
    });
  };

  DismissModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  selectRelation = (index) => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
    let info = this.state.relationList[index];
    // console.log("index====================================", index, info);
    // this.setState({relation:info.Name,relationId:info.Id,isLoading:true});
    this.setState({ relationId: info.Id, isLoading: true }, () => {
      this.updateRequestAddMember();
    });
  };

  updateRequestAddMember = async () => {
    // console.log("this.state.relationId====", this.state.relationId);
    // console.log("this.state.FamilyMemberId=====", this.state.FamilyMemberId);

    try {
      let response = await axios.post(Constants.REQUEST_ADDMEMBER, {
        FamilyMemberId: this.state.FamilyMemberId,
        Relation: this.state.relationId,
      });
      // console.log("data==============", response.data);
      this.setState({ isLoading: false });

      if (response.data.Status) {
        // console.log(response.data.Msg);
        Toast.show(response.data.Msg);
        this.props.navigation.dispatch(
          CommonActions.reset({
            index: 1,
            key: null,
            routes: [
              {
                name: "Drawer",
              },
              {
                name: "FamilyMemberList",
                params: {
                  refresh: "refresh",
                },
              },
            ],
          })
        );
        // this.props.navigation.navigate('FamilyMemberList', {
        //   refresh: 'refresh',
        // });
      } else {
        Toast.show(response.data.Msg);
        this.setState({
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false,
        });
      }
    } catch (errors) {
      ///Toast.show(errors)
      Toast.show("Something Went Wrong, Please Try Again Later");

      this.setState({
        isLoading: false,
        paginationLoading: false,
        searchLoading: false,
        refreshing: false,
      });

      // console.log(errors);
    }
  };

  //handling onPress action
  OpenCheckStatus = (item) => {
    //Alert.alert(item.key,item.title);
    this.props.navigation.navigate("CheckStatus");
  };

  static navigationOptions = {
    title: "Home",
    headerStyle: {
      backgroundColor: "#003484",
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold",
    },
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

  render() {
    return (
      <Container>
        <Loader loading={this.state.isLoading} />
        <CustomeHeader
          title="Existing Member"
          headerId={1}
          navigation={this.props.navigation}
          onPress={this.AddDoc}
        />
        <View
          style={{
            height: 60,
            backgroundColor: "white",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
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
              elevation: 5,
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
                fontSize: 15,
              }}
              onChangeText={(val) => this.onChangeTextClick(val)}
              value={this.state.searchString}
              underlineColorAndroid="transparent"
              placeholder="Search Family Member.."
              allowFontScaling={false}
            />
          </View>
        </View>
        <Modal isVisible={this.state.isModalVisible}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                height: "50%",
                width: "80%",
                backgroundColor: "white",
                flexDirection: "column",
                borderRadius: 5,
              }}
            >
              <Text
                style={{
                  marginTop: 10,
                  marginLeft: 10,
                  fontSize: 24,
                  color: "black",
                  textAlign: "center",
                }}
              >
                Relation
              </Text>
              <View
                style={{
                  height: 0.5,
                  backgroundColor: "gray",
                  marginRight: 5,
                  marginTop: 8,
                }}
              ></View>
              <ScrollView
                alwaysBounceVertical={true}
                showsHorizontalScrollIndicator={false}
                style={{
                  backgroundColor: "white",
                  marginTop: 0,
                  paddingHorizontal: 0,
                }}
              >
                {this.state.relationList.map((item, index) => {
                  return (
                    <TouchableOpacity
                      style={{ height: 40, flexDirection: "column" }}
                      onPress={() => this.selectRelation(index)}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          margin: 5,
                          backgroundColor: "white",
                          fontSize: 18,
                          color: "gray",
                        }}
                      >
                        {item.Name}
                      </Text>
                      <View
                        style={{
                          height: 0.4,
                          backgroundColor: "gray",
                          marginRight: 25,
                          marginLeft: 25,
                          marginTop: 5,
                        }}
                      ></View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              <Button title="Cancel" onPress={this.DismissModal} />
            </View>
          </View>
        </Modal>
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
            {this.state.familyMemberList.map((item, index) => {
              return (
                <ExistingMemberCard
                  ProfilePic={item.ProfilePic}
                  name={item.PatientName}
                  onPress={() => this.toggleModal(index)}
                ></ExistingMemberCard>
              );
            })}

            <View>
              {this.state.paginationLoading ? <PaginationLoading /> : null}
            </View>
            <View style={{ flex: 1 }}>
              {this.state.searchLoading ? (
                <Loader loading={this.state.searchLoading} />
              ) : null}
            </View>
          </ScrollView>
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
    justifyContent: "center",
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
    backgroundColor: "white",
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
    fontWeight: "bold",
  },
  container_text: {
    flex: 1,
    flexDirection: "column",
    marginTop: 0,
    marginLeft: 10,
    justifyContent: "center",
    backgroundColor: "white",
  },
  description: {
    fontSize: 15,
    color: "#595858",
    marginBottom: 25,
    marginLeft: 5,
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
    fontWeight: "bold",
  },
  endTextName: {
    // flex:1,

    marginTop: 4,
    marginRight: 10,
    marginBottom: 5,
    color: "#003484",
    fontSize: 11.5,
    fontWeight: "bold",
  },
  endTextName1: {
    // flex:1,

    marginTop: 10,
    marginRight: 5,
    marginLeft: 5,
    marginBottom: 5,
    color: "grey",
    fontSize: 12,
  },
  Icons: {
    height: 20,
    width: 20,
  },
  Icons1: {
    height: 20,
    width: 20,
    marginRight: 10,
  },
  Icons2: {
    height: 15,
    width: 15,
    marginTop: 5,
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
    color: "#003484",
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
    borderRadius: 34,
  },
  placeholder: {
    height: 60,
    width: 60,
    shadowOffset: { width: 3, height: 3 },
    shadowColor: "white",
    shadowOpacity: 0.7,
    borderWidth: 0,
    borderRadius: 34,
    elevation: 5,
  },
  email: {
    fontSize: 13,
    //fontStyle: 'italic',
    marginTop: 6,
    color: "#595858",
    marginLeft: 4,
    // alignSelf: 'flex-end',

    // backgroundColor: 'gray',
  },
  image: {
    height: 22,
    width: 22,
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-end",
    marginRight: 5,

    // justifyContent: 'center'
  },
  touchable: {
    alignItems: "center",
    justifyContent: "center",
  },

  SuggestTesttouch: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginEnd: 5,
  },
  SuggestTesttouch1: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  titlesubview: {
    flex: 1,
    flexDirection: "row",
    //alignSelf: 'flex-end',
    // backgroundColor: 'green',
  },

  DRnamesubview: {
    flex: 1,
    flexDirection: "row",
    //alignSelf: 'flex-end',
    backgroundColor: "white",
  },
  sharebtnview: {
    flex: 0.15,
    flexDirection: "row",
    alignSelf: "flex-start",
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
    borderRadius: 11,
  },

  Mobilesubview: {
    flex: 1,
    flexDirection: "row",

    // alignSelf: 'flex-end',
  },

  IconsHeader: {
    height: 20,
    width: 20,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  Iconcall: {
    height: 15,
    width: 15,
    marginTop: 1,
    marginLeft: 10,
  },
  Iconsemail: {
    height: 15,
    width: 15,
    marginTop: 6,
  },
  eyeicon: {
    height: 15,
    width: 15,
    marginTop: 0,
    paddingLeft: 2,
  },
  emailsubview: {
    flex: 1,
    flexDirection: "row",
    // alignSelf: 'flex-end',
    //justifyContent: 'space-between',
    // alignContent: 'flex-end',
    //marginTop:4,
    backgroundColor: "white",
  },
  DoctorProfile: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-end",
    alignContent: "flex-end",
    textAlign: "right",
    color: "black",
    fontSize: 11,
  },
  Separator: {
    height: 0.5,
    backgroundColor: "gray",
    marginLeft: 0,
    marginRight: 0,
    marginTop: 5,
  },
});
