import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  Modal as RNModal,
  StyleSheet,
  Button
} from "react-native";

import {
  Container,
  Tab,
  Tabs,
  TabHeading,
  Icon,
  List,
  ListItem,
  Content,
  Left,
  Right,
  Body,
  Card,
  CardItem
} from "native-base";
import CustomeHeader from "../../appComponents/CustomeHeader";
import axios from "axios";
import Constants from "../../utils/Constants";
import Loader from "../../appComponents/loader";
import NoDataAvailable from "../../appComponents/NoDataAvailable";
import Toast from "react-native-tiny-toast";
import Modal from "react-native-modal";
import AsyncStorage from "@react-native-community/async-storage";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import TestListRow from "../../appComponents/TestListRow";
import InputWithReqField from "../../appComponents/InputwithReqField";

const padder = require("pkcs7-padding");

export default class AllergiesScreen extends Component {
  constructor(props) {
    super(props);
    //setting default state
    this.state = {
      isLoading: false,
      isfoodallergy: false,
      testname: "",
      AllergeyList: [],
      FamilyMemberList: [],
      relationList: [],
      relation: "Relation",
      relationId: "",
      isModalVisible: false,
      name: "Name",
      medicalcon: "Medical Condition",
      isNameModal: false,
      isMedCondtionModal: false,
      selectedIds: [],
      ApprovedRequestList: [],
      isnew: false,
      dummynm: ""
    };
  }
  removeDuplicate = (datalist) => {
    return datalist.filter(function (a) {
      return !this[a.UserId] && (this[a.UserId] = true);
    }, Object.create(null));
  };

  handleSelectionMultiple = (id) => {
    var selectedIds = [...this.state.selectedIds]; // clone state
    console.log(
      selectedIds.includes(id),
      "selectedIds.includes(id)",
      "TestID==============================",
      id
    );
    if (selectedIds.includes(id)) {
      selectedIds = selectedIds.filter((_id) => _id !== id);
    } else {
      selectedIds.push(id);
    }
    this.setState({ selectedIds });
  };
  toggleModal = () => {
    console.log("toggle modal");
    this.setState({ isLoading: true }, () => {
      this.getFamilyRelationList();
    });
  };

  DismissModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };
  selectRelation = (index) => {
    console.log("index====================================");

    let info = this.state.relationList[index];

    this.setState({ isModalVisible: !this.state.isModalVisible });

    this.setState({ relation: info.Name, relationId: info.Id });
  };

  componentDidMount() {
    this.setState(
      {
        AllergeyList: [],
        FamilyMemberList: [],
        relationList: [],
        ApprovedRequestList: []
        // isLoading: true
        // activebtn: this.props.route.params.role
      },
      () => {
        // this.getAllergiesData();
        // this.getFamilyRelationList();
        // this.getFamilyMemberList();
      }
    );
  }
  UNSAFE_componentWillReceiveProps = (nextProp) => {
    this.setState(
      {
        AllergeyList: [],
        FamilyMemberList: [],
        relationList: [],
        ApprovedRequestList: []
        // isLoading: true
      },
      () => {
        // this.getAllergiesData();
        // this.getFamilyRelationList();
        // this.getFamilyMemberList();
      }
    );
  };

  getAllergiesData = async () => {
    try {
      let response = await axios.post(Constants.GET_ALLERGIES, {
        type: "Medical Condition"
      });

      this.setState({ isLoading: false });
      if (response.data.Status) {
        let responseData = this.state.AllergeyList;
        response.data.ObjProfileDetail.map((item) => {
          responseData.push(item);
        });
        console.log(responseData, "/////");
        this.setState({
          AllergeyList: responseData,
          isMedCondtionModal: true
        });
      } else {
        this.setState({
          AllergeyList: [],
          isMedCondtionModal: false
        });
      }
    } catch (err) {
      console.log(err, "/////////");
    }
  };

  async getFamilyRelationList() {
    try {
      const response = await axios.get(Constants.FAMILY_RELATION);
      // console.log(response.data);
      this.setState({ isLoading: false });
      if (response.data.Status) {
        let responseData = [];
        response.data.List.map((item) => {
          responseData.push(item);
        });

        this.setState({
          relationList: responseData,
          isLoading: false,
          refreshing: false,
          isModalVisible: true
        });
      } else {
        // Toast.show(response.data.Msg);
        this.setState({
          relationList: responseData,
          isLoading: false,
          refreshing: false,
          isModalVisible: false
        });
      }
    } catch (error) {
      Toast.show("Something Went Wrong, Please Try Again Later");

      this.setState({ isLoading: false });
      // console.error(error);
    }
  }

  async getFamilyMemberList() {
    console.log("////getFamilyMemberList");
    try {
      let forslef = {};
      let forAddnew = {};
      let userid = await AsyncStorage.getItem(Constants.USER_ID);
      let name = await AsyncStorage.getItem(Constants.USER_NAME);

      forslef.Name = name + " (Myself)";
      forslef.UserId = userid;
      forAddnew.Name = "Add New";
      forAddnew.UserId = "addnew";

      let responseData = this.state.ApprovedRequestList;
      responseData.push(forslef);
      const response = await axios.get(Constants.FAMILY_MEMBERLIST);
      let ApprovalPendinglist = await axios.post(Constants.PENDING_REQUEST, {
        pageNumber: this.state.pageNo,
        pageSize: Constants.PER_PAGE_RECORD,
        Searching: this.state.searchString
      });

      console.log(
        "FAMILY_MEMBERLIST",
        response.data,
        ApprovalPendinglist.data,
        "ApprovalPendinglist"
      );
      this.setState({ isLoading: false });
      if (response.data.Status || ApprovalPendinglist.data.Status) {
        //Toast.show(response.data.Msg)

        response.data.PatientList.map((item) => {
          let temp = {};
          temp.Name = item.Name;
          temp.UserId = item.UserId;
          responseData.push(temp);
        });

        if (ApprovalPendinglist.data.Status) {
          ApprovalPendinglist.data.PatientList.map((item) => {
            let temp = {};
            temp.Name = item.Name;
            responseData.push(temp);
          });
        }
        responseData.push(forAddnew);
        console.log(responseData, "///????????res ");
        this.setState({
          // ApprovedRequestList: this.removeDuplicate(responseData),
          FamilyMemberList: this.removeDuplicate(responseData),
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false,
          userid: userid,
          isNameModal: true
        });
      } else {
        responseData.push(forAddnew);

        this.setState({
          FamilyMemberList: this.removeDuplicate(responseData),
          userid: userid,
          isLoading: false,
          isNameModal: false
        });
        // Toast.show(response.data.Msg);
      }
    } catch (error) {
      console.log(error, "which err");
      Toast.show("Something Went Wrong, Please Try Again Later");
      this.setState({
        isLoading: false
      });
      this.setState({ isLoading: false });
    }
  }

  handleAdd = () => {
    const values = [...this.state.selectedIds];
    console.log(values, "$%%$^#$%^#$^%$^#%^%$");
    if (values.length == 0) {
      this.setState({
        isMedCondtionModal: false
      });
    } else
      this.setState({
        medicalcon: values.join(","),
        isMedCondtionModal: false
      });
    // this.saveAllergiestoDB("I", 0);
  };

  selectedName = (index) => {
    let info = this.state.FamilyMemberList[index];
    if (info.Name == "Add New") {
      console.log("Add in the else ///-------selectedName");

      this.setState({ isnew: true });
    } else {
      this.setState({ isNameModal: !this.state.isNameModal });

      this.setState({ name: info.Name });
    }
  };
  Submit = () => {
    console.log(
      ".././/././././././Submit",
      this.state.name,
      this.state.relation
    );
    if (this.state.name == "Name") {
      Toast.show("Please enter  name");
    } else if (!isNaN(this.state.name)) {
      Toast.show("Please enter only alphabets in Name");
    } else if (this.state.relation == "Relation") {
      Toast.show("Please Select Relation");
    } else if (this.state.medicalcon == "Medical Condition") {
      Toast.show("Please Select Medical Condition");
    } else {
      this.setState({
        isLoading: true
      });
      this.SubmitApicall();
    }
  };
  SubmitApicall = async () => {
    console.log(".././/././././././");
    try {
      let response = await axios.post(Constants.ADD_ALLERGIES, {
        userprofileDtlsId: 0,
        Name: this.state.selectedIds.toString(),
        type: "Family History",
        relation: this.state.relation,
        familyMemberName: this.state.name,
        col8: "",
        col9: "",
        col10: "",
        actionStatus: "I"
      });

      console.log(response.data, "//////");
      this.setState({ isLoading: false });
      if (response.data.Status) {
        this.props.navigation.navigate("FamilyHis", {
          type: "Family History",
          title: "Family History"
        });
      } else {
        // this.getSaveData();
      }
    } catch (err) {
      console.log(err, "/////////");
    }
  };
  render() {
    const screenWidth = Math.round(Dimensions.get("window").width);
    console.log(this.state.FamilyMemberList);
    return (
      <Container>
        <Loader loading={this.state.isLoading} />

        <CustomeHeader
          title="Family History"
          headerId={1}
          navigation={this.props.navigation}
        />

        <RNModal visible={this.state.isMedCondtionModal} style={{ flex: 1 }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "flex-end"
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    paddingHorizontal: 0,
                    marginTop: 0,
                    height: 60,
                    justifyContent: "flex-start",
                    alignItems: "center"
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      alignSelf: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Text
                      style={[
                        styles.title,
                        {
                          marginLeft: 18,
                          fontWeight: "normal",
                          textAlign: "center"
                        }
                      ]}
                    >
                      Select Disease
                    </Text>
                  </View>

                  {/* Modal top Close Button */}
                  <View
                    style={{
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
                      marginTop: -5,
                      alignSelf: "center"
                    }}
                  >
                    <TouchableOpacity
                      style={styles.closeBtn}
                      onPress={() =>
                        this.setState({ isMedCondtionModal: false })
                      }
                    >
                      <Image
                        source={require("../../../icons/CLOSE2.png")}
                        style={{
                          height: 15,
                          width: 15,
                          margin: 15,
                          marginTop: 0,
                          alignSelf: "baseline"
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View
                style={{
                  height: 0.5,
                  marginLeft: 15,
                  marginRight: 10,
                  marginTop: 5,
                  backgroundColor: "#d8d8d8",
                  padding: 0.5
                }}
              ></View>
              <View style={{ flex: 1, margin: 10 }}>
                <ScrollView
                  alwaysBounceVertical={true}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ flexGrow: 1, marginBottom: 10 }}
                >
                  {this.state.AllergeyList.map((item, index) => (
                    <TestListRow
                      testname={item.name}
                      checkboximg={
                        this.state.selectedIds.includes(item.name)
                          ? require("../../../icons/checkbox.png")
                          : require("../../../icons/checkbox_1.png")
                      }
                      onPress={() => this.handleSelectionMultiple(item.name)}
                    ></TestListRow>
                  ))}
                </ScrollView>
                <View
                  style={{
                    height: 0.5,
                    marginLeft: 15,
                    marginRight: 10,
                    marginTop: 0,
                    backgroundColor: "#d8d8d8",
                    padding: 0.5
                  }}
                ></View>
              </View>
              <View
                style={{
                  // flex: 1,
                  marginBottom: 20,
                  flexDirection: "row",
                  justifyContent: "center",
                  marginRight: 40,
                  marginTop: 15
                }}
              >
                <TouchableOpacity
                  style={{
                    height: 30,
                    marginLeft: 10
                  }}
                  onPress={() =>
                    this.setState({
                      isMedCondtionModal: false
                    })
                  }
                >
                  <Text style={styles.title}> CANCEL </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    height: 30,
                    marginLeft: 20,
                    marginRight: 0.5
                  }}
                  onPress={() => this.handleAdd()}
                >
                  <Text style={[styles.title, { color: "#2761B3" }]}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* </View> */}
        </RNModal>

        <RNModal visible={this.state.isModalVisible} style={{ flex: 1 }}>
          <View style={styles.centeredView}>
            <View style={[styles.modalView, { flex: 0.8 }]}>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "flex-end"
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    paddingHorizontal: 0,
                    marginTop: 0,
                    height: 60,
                    justifyContent: "flex-start",
                    alignItems: "center"
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      alignSelf: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Text
                      style={[
                        styles.title,
                        {
                          marginLeft: 18,
                          fontWeight: "normal",
                          textAlign: "center"
                        }
                      ]}
                    >
                      Relation
                    </Text>
                  </View>
                  <View
                    style={{
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
                      marginTop: -5,
                      alignSelf: "center"
                    }}
                  >
                    <TouchableOpacity
                      style={styles.closeBtn}
                      onPress={() => this.setState({ isModalVisible: false })}
                    >
                      <Image
                        source={require("../../../icons/CLOSE2.png")}
                        style={{
                          height: 15,
                          width: 15,
                          margin: 15,
                          marginTop: 0,
                          alignSelf: "baseline"
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View
                style={{
                  height: 0.5,
                  backgroundColor: "gray",
                  marginRight: 5,
                  marginTop: 8
                }}
              ></View>

              <View style={{ flex: 1, margin: 10 }}>
                <ScrollView
                  alwaysBounceVertical={true}
                  showsHorizontalScrollIndicator={false}
                  style={{
                    backgroundColor: "white",
                    marginTop: 0,
                    paddingHorizontal: 0
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
                            color: "gray"
                          }}
                        >
                          {item.Name}
                        </Text>
                        <View
                          style={{
                            height: 0.4,
                            backgroundColor: "lightgray",
                            marginRight: 30,
                            marginLeft: 30,
                            marginTop: 5,
                            padding: 0.5
                          }}
                        ></View>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
                <View
                  style={{
                    height: 0.5,
                    marginLeft: 15,
                    marginRight: 10,
                    marginTop: 0,
                    backgroundColor: "#d8d8d8",
                    padding: 0.5
                  }}
                ></View>
                <View style={[styles.centeredView, { alignItems: "center" }]}>
                  <View
                    style={{
                      flex: 1,
                      marginBottom: 20,
                      // backgroundColor: "white",
                      flexDirection: "row",
                      justifyContent: "flex-end",

                      // marginRight: 40,
                      marginTop: 5
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        height: 30,
                        marginLeft: 10,
                        justifyContent: "center",
                        alignItems: "center"
                        // marginBottom: 20,
                      }}
                      onPress={() => this.setState({ isModalVisible: false })}
                    >
                      <Text style={[styles.title]}> CANCEL </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </RNModal>

        <RNModal visible={this.state.isNameModal} style={{ flex: 1 }}>
          <View style={styles.centeredView}>
            <View style={[styles.modalView]}>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "flex-end"
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    paddingHorizontal: 0,
                    marginTop: 0,
                    height: 60,
                    justifyContent: "flex-start",
                    alignItems: "center"
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      alignSelf: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Text
                      style={[
                        styles.title,
                        {
                          marginLeft: 18,
                          fontWeight: "normal",
                          textAlign: "center"
                        }
                      ]}
                    >
                      Select Name
                    </Text>
                  </View>
                  <View
                    style={{
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
                      marginTop: -5,
                      alignSelf: "center"
                    }}
                  >
                    <TouchableOpacity
                      style={styles.closeBtn}
                      onPress={() => this.setState({ isnew: true })}
                    >
                      <Image
                        source={require("../../../icons/add.png")}
                        style={{
                          height: 35,
                          width: 35,
                          margin: 5,
                          marginTop: 0,
                          alignSelf: "baseline"
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View
                style={{
                  height: 0.5,
                  backgroundColor: "gray",
                  marginRight: 5,
                  marginTop: 8
                }}
              ></View>
              <View style={{ flex: 1, margin: 10 }}>
                <KeyboardAwareScrollView enableOnAndroid={true}>
                  {this.state.isnew == false ? (
                    <>
                      {this.state.FamilyMemberList.map((item, index) => {
                        return (
                          <TouchableOpacity
                            style={{ height: 40, flexDirection: "column" }}
                            onPress={() => this.selectedName(index)}
                          >
                            <Text
                              style={{
                                textAlign: "center",
                                margin: 5,
                                backgroundColor: "white",
                                fontSize: 18,
                                color: "gray"
                              }}
                            >
                              {item.Name}
                            </Text>
                            <View
                              style={{
                                height: 0.4,
                                backgroundColor: "lightgray",
                                marginRight: 30,
                                marginLeft: 30,
                                marginTop: 5,
                                padding: 0.5
                              }}
                            ></View>
                          </TouchableOpacity>
                        );
                      })}
                    </>
                  ) : (
                    <>
                      {this.state.isnew && (
                        <>
                          <InputWithReqField
                            inputfield="Enter  Name"
                            placeholder="Enter Name  "
                            icon={require("../../../icons/full-name.png")}
                            onchangeTxt={(text) =>
                              this.setState({ dummynm: text })
                            }
                          />
                        </>
                      )}
                    </>
                  )}
                  {/* </ScrollView> */}
                </KeyboardAwareScrollView>
                <View
                  style={{
                    height: 0.5,
                    marginLeft: 15,
                    marginRight: 10,
                    marginTop: 0,
                    backgroundColor: "#d8d8d8",
                    padding: 0.5
                  }}
                ></View>
                {this.state.isnew ? (
                  <View
                    style={{
                      flex: 1,
                      marginBottom: 20,

                      flexDirection: "row",
                      justifyContent: "center",
                      marginRight: 40,
                      marginTop: 15
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        height: 30,
                        marginLeft: 10
                      }}
                      onPress={() =>
                        this.setState({
                          isnew: false
                        })
                      }
                    >
                      <Text style={[styles.title]}> BACK </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        height: 30,
                        marginLeft: 20,
                        marginRight: 0.5
                      }}
                      // style={styles.closeBtn}
                      onPress={() => {
                        console.log(
                          this.state.dummynm.length,
                          "Enter  Name Enter  Name/////"
                        );
                        this.setState({
                          isNameModal: !this.state.isNameModal,
                          name:
                            this.state.dummynm.length > 0
                              ? this.state.dummynm
                              : "Name"
                        });
                      }}
                    >
                      <Text style={[styles.title, { color: "#2761B3" }]}>
                        ADD
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={[styles.centeredView, { alignItems: "center" }]}>
                    <View
                      style={{
                        flex: 1,
                        marginBottom: 20,
                        // backgroundColor: "white",
                        flexDirection: "row",
                        justifyContent: "center",

                        // marginRight: 40,
                        marginTop: 5
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          height: 30,
                          marginLeft: 10,
                          justifyContent: "center",
                          alignItems: "center"
                          // marginBottom: 20,
                        }}
                        onPress={() =>
                          this.setState({
                            isNameModal: !this.state.isNameModal
                          })
                        }
                      >
                        <Text style={[styles.title]}> CANCEL </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </View>
        </RNModal>

        {/* main screen start here  */}

        <View
          style={{
            flex: 1,
            justifyContent: "center"
          }}
        >
          <ScrollView
            alwaysBounceVertical={true}
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 10 }}
          >
            <View
              style={{
                height: 80,
                backgroundColor: "transparent",
                flexDirection: "column",
                marginTop: 10,
                marginLeft: 5,
                marginRight: 5
              }}
            >
              <Text style={{ height: 18, fontSize: 15 }}>
                Relation <Text style={{ color: "red" }}>*</Text>
              </Text>
              <View
                style={{
                  height: 50,
                  backgroundColor: "white",
                  flexDirection: "row",
                  marginTop: 10,
                  marginLeft: 0,
                  marginRight: 0,
                  borderColor: "lightgray",
                  borderWidth: 1,
                  borderRadius: 5
                }}
              >
                <Image
                  source={require("../../../icons/relationblue.png")}
                  style={{
                    height: 20,
                    width: 20,
                    marginLeft: 8,
                    justifyContent: "center",
                    alignSelf: "center"
                  }}
                />
                <View
                  style={{
                    height: 34,
                    width: 1,
                    marginTop: 10,
                    marginBottom: 8,
                    marginLeft: 10,
                    backgroundColor: "lightgray",
                    justifyContent: "center",
                    alignContent: "center"
                  }}
                ></View>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "white",
                    justifyContent: "center",
                    alignContent: "center"
                  }}
                >
                  <TouchableOpacity onPress={this.toggleModal}>
                    {this.state.relation == "Relation" ? (
                      <Text
                        style={{
                          textAlign: "left",
                          marginLeft: 10,
                          backgroundColor: "white",
                          fontSize: 15,
                          color: "gray"
                        }}
                      >
                        {this.state.relation}
                      </Text>
                    ) : (
                      <Text
                        style={{
                          textAlign: "left",
                          marginLeft: 10,
                          backgroundColor: "white",
                          fontSize: 15,
                          color: "black"
                        }}
                      >
                        {this.state.relation}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={this.toggleModal}>
                  <Image
                    source={require("../../../icons/drop-arrow.png")}
                    style={{
                      height: 15,
                      width: 15,
                      marginRight: 10,
                      marginTop: 15,
                      justifyContent: "center",
                      alignSelf: "center"
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* for the name  */}
            <View
              style={{
                height: 80,
                backgroundColor: "transparent",
                flexDirection: "column",
                marginTop: 10,
                marginLeft: 5,
                marginRight: 5
              }}
            >
              <Text style={{ height: 18, fontSize: 15 }}>
                Name <Text style={{ color: "red" }}>*</Text>
              </Text>
              <View
                style={{
                  height: 50,
                  backgroundColor: "white",
                  flexDirection: "row",
                  marginTop: 10,
                  marginLeft: 0,
                  marginRight: 0,
                  borderColor: "lightgray",
                  borderWidth: 1,
                  borderRadius: 5
                }}
              >
                <Image
                  source={require("../../../icons/full-name.png")}
                  style={{
                    height: 20,
                    width: 20,
                    marginLeft: 8,
                    justifyContent: "center",
                    alignSelf: "center"
                  }}
                />
                <View
                  style={{
                    height: 34,
                    width: 1,
                    marginTop: 10,
                    marginBottom: 8,
                    marginLeft: 10,
                    backgroundColor: "lightgray",
                    justifyContent: "center",
                    alignContent: "center"
                  }}
                ></View>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "white",
                    justifyContent: "center",
                    alignContent: "center"
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      this.setState(
                        {
                          // isNameModal: !this.state.isNameModal,
                          isnew: false,
                          isLoading: true
                        },
                        () => {
                          this.getFamilyMemberList();
                        }
                      );
                    }}
                  >
                    {this.state.name == "Name" ? (
                      <Text
                        style={{
                          textAlign: "left",
                          marginLeft: 10,
                          backgroundColor: "white",
                          fontSize: 15,
                          color: "gray"
                        }}
                      >
                        {this.state.name}
                      </Text>
                    ) : (
                      <Text
                        style={{
                          textAlign: "left",
                          marginLeft: 10,
                          backgroundColor: "white",
                          fontSize: 15,
                          color: "black"
                        }}
                      >
                        {this.state.name}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      isNameModal: !this.state.isNameModal,
                      isnew: false
                    });
                  }}
                >
                  <Image
                    source={require("../../../icons/drop-arrow.png")}
                    style={{
                      height: 15,
                      width: 15,
                      marginRight: 10,
                      marginTop: 15,
                      justifyContent: "center",
                      alignSelf: "center"
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* for the dises  */}

            <View
              style={{
                height: 80,
                backgroundColor: "transparent",
                flexDirection: "column",
                marginTop: 10,
                marginLeft: 5,
                marginRight: 5
              }}
            >
              <Text style={{ height: 18, fontSize: 15 }}>
                Medical Condition <Text style={{ color: "red" }}>*</Text>
              </Text>
              <View
                style={{
                  height: 50,
                  backgroundColor: "white",
                  flexDirection: "row",
                  marginTop: 10,
                  marginLeft: 0,
                  marginRight: 0,
                  borderColor: "lightgray",
                  borderWidth: 1,
                  borderRadius: 5
                }}
              >
                <Image
                  source={require("../../../icons/ill.png")}
                  style={{
                    height: 20,
                    width: 20,
                    marginLeft: 8,
                    justifyContent: "center",
                    alignSelf: "center"
                  }}
                />
                <View
                  style={{
                    height: 34,
                    width: 1,
                    marginTop: 10,
                    marginBottom: 8,
                    marginLeft: 10,
                    backgroundColor: "lightgray",
                    justifyContent: "center",
                    alignContent: "center"
                  }}
                ></View>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "white",
                    justifyContent: "center",
                    alignContent: "center"
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      this.setState(
                        {
                          isLoading: true
                          // isMedCondtionModal: !this.state.isMedCondtionModal
                        },
                        () => {
                          this.getAllergiesData();
                        }
                      );
                    }}
                  >
                    {this.state.medicalcon == "Medical Condition" ? (
                      <Text
                        style={{
                          textAlign: "left",
                          marginLeft: 10,
                          backgroundColor: "white",
                          fontSize: 15,
                          color: "gray"
                        }}
                      >
                        {this.state.medicalcon}
                      </Text>
                    ) : (
                      <Text
                        style={{
                          textAlign: "left",
                          marginLeft: 10,
                          backgroundColor: "white",
                          fontSize: 15,
                          color: "black"
                        }}
                      >
                        {this.state.medicalcon}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    this.setState(
                      {
                        isLoading: true
                        // isMedCondtionModal: !this.state.isMedCondtionModal
                      },
                      () => {
                        this.getAllergiesData();
                      }
                    );
                  }}
                >
                  <Image
                    source={require("../../../icons/drop-arrow.png")}
                    style={{
                      height: 15,
                      width: 15,
                      marginRight: 10,
                      marginTop: 15,
                      justifyContent: "center",
                      alignSelf: "center"
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/*  */}
            <TouchableOpacity
              style={{
                backgroundColor: "#1B2B34",
                margin: 20,
                borderRadius: 10,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
                shadowOffset: { width: 2, height: 3 },
                shadowColor: "gray",
                shadowOpacity: 0.9,
                elevation: 5,
                width: "90%"
              }}
              onPress={this.Submit}
            >
              <Text
                style={{
                  textAlign: "center",
                  alignSelf: "center",
                  fontSize: 18,
                  color: "white",
                  fontWeight: "bold"
                }}
              >
                Submit
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    color: "#000",
    flexDirection: "column",
    backgroundColor: "white",
    fontWeight: "bold",
    marginBottom: 10
  },
  modalView: {
    flex: 0.8,
    height: "100%",
    paddingTop: 0,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    margin: 20
  },
  closeBtn: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginVertical: 18,
    marginRight: 3.5,
    alignItems: "flex-end"
  },
  header2: {
    flex: 1,

    fontSize: 18,
    fontWeight: "bold",

    marginTop: 30,
    justifyContent: "flex-start",
    alignItems: "flex-start"
  }
});
