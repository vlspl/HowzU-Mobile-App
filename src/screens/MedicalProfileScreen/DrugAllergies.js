import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  Modal as RNModal,
  StyleSheet
} from "react-native";

import { Container } from "native-base";
import CustomeHeader from "../../appComponents/CustomeHeader";
import axios from "axios";
import Constants from "../../utils/Constants";
import Loader from "../../appComponents/loader";
import NoDataAvailable from "../../appComponents/NoDataAvailable";
import Toast from "react-native-tiny-toast";
const screenWidth = Math.round(Dimensions.get("window").width);

import { scale, verticalScale, moderateScale } from "react-native-size-matters";

import TestListRow from "../../appComponents/TestListRow";

export default class DrugAllergyScreen extends Component {
  constructor(props) {
    super(props);
    //setting default state
    this.state = {
      isLoading: false,
      isfoodallergy: false,
      testname: "",
      FoodAllergey: [],
      type: "",
      screentitle: "",
      getallergyList: [],
      selectedIds: [],
      isAdd: false,
      removeselected: [],
      newselectedIDS: []
    };
  }

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    this.setState(
      {
        isLoading: true,
        FoodAllergey: [],
        getallergyList: [],
        type: nextProp.route.params.type,
        screentitle: nextProp.route.params.title
      },
      () => {
        // this.getAllergiesData();
        this.getSaveData();
      }
    );
  };
  getAllergiesData = async () => {
    var selectedIds = [...this.state.selectedIds];
    try {
      let response = await axios.post(Constants.GET_ALLERGIES, {
        type: this.state.type
      });

      console.log(response.data, "getAllergey in get FoodAllergey/////");
      this.setState({ isLoading: false });
      if (response.data.Status) {
        let responseData = this.state.getallergyList;
        response.data.ObjProfileDetail.map((item) => {
          if (item.UserDetailsID != 0) {
            console.log("//////////", item.UserDetailsID);
            selectedIds.push(item.name);
          }
          responseData.push(item);
        });
        console.log(responseData, "/////");
        this.setState({
          getallergyList: responseData,
          selectedIds: selectedIds,
          isfoodallergy: true
        });
      } else {
        this.setState({
          getallergyList: [],
          selectedIds: selectedIds
        });
      }
    } catch (err) {
      console.log(err, "/////////");
    }
  };

  componentDidMount() {
    this.setState(
      {
        FoodAllergey: [],
        getallergyList: [],
        isLoading: true,
        type: this.props.route.params.type,
        screentitle: this.props.route.params.title
      },
      () => {
        // this.getAllergiesData();
        this.getSaveData();
      }
    );
  }

  handleSelectionMultiple = (id) => {
    var selectedIds = [...this.state.selectedIds]; // clone state
    var removeselected = [...this.state.removeselected]; // clone state
    var newselectedIDS = [...this.state.newselectedIDS];
    console.log(
      selectedIds.includes(id),
      "selectedIds.includes(id)",
      "TestID==============================",
      id,
      " this.setState({ removeselected });",
      removeselected
    );
    if (selectedIds.includes(id.name)) {
      selectedIds = selectedIds.filter((_id) => _id !== id.name);
      console.log(selectedIds, "////");
      let tmp = {};
      tmp.removid = id.UserDetailsID;
      tmp.name = id.name;
      removeselected.push(tmp);
      if (newselectedIDS.includes(id.name)) {
        console.log(newselectedIDS, "////");
        newselectedIDS = newselectedIDS.filter((_id) => _id !== id.name);
      }
    } else {
      selectedIds.push(id.name);
      newselectedIDS.push(id.name);
    }
    this.setState({ selectedIds });
    this.setState({ removeselected });
    this.setState({ newselectedIDS });
  };
  saveAllergiestoDB = async (typeofinsertion, userid) => {
    console.log(typeofinsertion, "////.//./.tylrelfd sinsm", userid);
    this.setState({ isLoading: true });

    let obj = {};

    try {
      let response = await axios.post(Constants.ADD_ALLERGIES, {
        userprofileDtlsId: userid,
        Name: this.state.newselectedIDS.toString(),
        type: this.state.type,
        relation: "",
        familyMemberName: "",
        col8: "",
        col9: "",
        col10: "",
        actionStatus: typeofinsertion
      });

      console.log(response.data, "//////");
      this.setState({ isLoading: false });
      if (response.data.Status) {
        this.setState({ newselectedIDS: [] });
        this.getSaveData();
      } else {
        this.setState({ isLoading: false });
        this.getSaveData();
      }
    } catch (err) {
      this.setState({ isLoading: false });
      console.log(err, "/////////");
    }
  };
  getSaveData = async () => {
    console.log(this.state.selectedIds, "/////////////");
    try {
      let response = await axios.post(Constants.GET_ALLERGIES_DETAILS, {
        type: this.state.type
      });
      this.setState({ isLoading: false });
      if (response.data.Status) {
        let responseData = [];

        response.data.ObjProfileDetail.map((itm) => {
          let tmp = {};
          let namesepartion = itm.name.split(",");

          tmp.name = itm.name;

          tmp.id = itm.userprofile_dtls_id;
          tmp.data = namesepartion;
          responseData.push(tmp);
        });

        this.setState({
          FoodAllergey: responseData
        });
      } else {
        this.setState({
          FoodAllergey: []
        });
      }
      // this.getAllergiesData();
    } catch (err) {
      console.log(err, "get saved data /////////");
    }
  };
  handleAdd = () => {
    // console.log("add presed", this.state.selectedIds);
    const values = [...this.state.selectedIds];
    const remove = [...this.state.removeselected];
    console.log(
      "removeselected======vslues presed",
      this.state.removeselected,
      "valuesold",
      this.state.newselectedIDS
    );
    if (remove.length > 0) {
      this.setState({ isLoading: true });
      remove.map((itm) => {
        this.handleRemove(itm.name, itm.removid);
      });
    }
    if (this.state.newselectedIDS.length > 0) {
      this.saveAllergiestoDB("I", 0);
    }

    // this.saveAllergiestoDB("I", 0);
    this.setState({ isfoodallergy: false });
  };
  handleRemove = async (i, id) => {
    console.log("/////????", i, "name", id, "del tid ");

    try {
      let response = await axios.post(Constants.ADD_ALLERGIES, {
        type: this.state.type,
        userprofileDtlsId: id,

        Name: i,
        type: this.state.type,
        relation: "",
        familyMemberName: "",
        col8: "",
        col9: "",
        col10: "",
        actionStatus: "D"
      });

      console.log(response.data, "//////");
      this.setState({ isLoading: false });
      if (response.data.Status) {
        this.getSaveData();
      } else {
        this.getSaveData();
      }
    } catch (err) {
      console.log(err, "/////////");
    }
  };
  render() {
    const screenWidth = Math.round(Dimensions.get("window").width);
    console.log(this.state.selectedIds, "/////selectedids");
    return (
      <Container>
        <Loader loading={this.state.isLoading} />

        <CustomeHeader
          title={this.state.screentitle}
          headerId={1}
          navigation={this.props.navigation}
        />
        <RNModal visible={this.state.isfoodallergy} style={{ flex: 1 }}>
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
                      {this.state.screentitle}
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
                      onPress={() => this.setState({ isfoodallergy: false })}
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
              <View style={{ flex: 1 }}>
                {/* Main content  */}

                <ScrollView
                  alwaysBounceVertical={true}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ flexGrow: 1, marginBottom: 10 }}
                >
                  {this.state.getallergyList.map((item, index) => (
                    <TestListRow
                      testname={item.name}
                      checkboximg={
                        this.state.selectedIds.includes(item.name)
                          ? require("../../../icons/checkbox.png")
                          : require("../../../icons/checkbox_1.png")
                      }
                      onPress={() => this.handleSelectionMultiple(item)}
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
                  marginBottom: 2,
                  // backgroundColor: "white",
                  flexDirection: "row",
                  justifyContent: "center",
                  // alignItems: "flex-end",
                  marginRight: 40,
                  marginTop: 15,
                  alignItems: "center"
                }}
              >
                <TouchableOpacity
                  style={{
                    height: 30,
                    marginLeft: 10
                  }}
                  onPress={() => this.setState({ isfoodallergy: false })}
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
        </RNModal>

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
                flex: 1,
                backgroundColor: "white",

                borderWidth: 1,
                borderColor: "white",
                shadowOffset: { width: 0, height: 3 },
                shadowColor: "#000000",
                shadowOpacity: 0.3,
                borderRadius: 5,
                elevation: 5,

                justifyContent: "center",
                marginHorizontal: 20,
                marginVertical: 20,
                marginTop: 20
              }}
            >
              <View style={{ flex: 1 }}>
                <View style={styles.container}>
                  <View style={styles.photo}>
                    {this.state.screentitle == "Food Allergy" && (
                      <Image
                        source={require("../../../icons/foodallergies.png")}
                        style={{ height: 30, width: 30, marginLeft: 10 }}
                      ></Image>
                    )}
                    {this.state.screentitle == "Drug Allergy" && (
                      <Image
                        source={require("../../../icons/drugallergy.png")}
                        style={{ height: 30, width: 30, marginLeft: 10 }}
                      ></Image>
                    )}
                    {this.state.screentitle == "Medical Condition" && (
                      <Image
                        source={require("../../../icons/medicalcondition.png")}
                        style={{ height: 30, width: 30, marginLeft: 10 }}
                      ></Image>
                    )}
                  </View>
                  <View style={styles.container_text}>
                    <View style={styles.DRnamesubview}>
                      <Text
                        style={[
                          styles.title,
                          {
                            marginLeft: 5,
                            fontWeight: "normal"
                            // fontSize: 17
                          }
                        ]}
                        // numberOfLines={1}
                        // ellipsizeMode="clip"
                      >
                        {this.state.screentitle}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      alignItems: "flex-end",
                      flex: 1
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        width: "100%"
                      }}
                    >
                      <TouchableOpacity
                        style={styles.SuggestTesttouch}
                        onPress={() => {
                          console.log(
                            this.state.selectedIds,
                            "selectedIds///selectedIds///////"
                          );
                          this.setState(
                            {
                              // isfoodallergy: true,
                              selectedIds: [],
                              isLoading: true,
                              getallergyList: [],
                              newselectedIDS: []
                            },
                            () => {
                              this.getAllergiesData();
                            }
                          );
                        }}
                      >
                        <Image
                          source={require("../../../icons/add.png")}
                          style={{ height: 40, width: 40 }}
                        ></Image>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>

              <View style={{ flex: 1, margin: 10 }}>
                {this.state.FoodAllergey.map((itm, id) => {
                  return (
                    <View
                      style={{
                        flexWrap: "wrap",
                        flexDirection: "row",
                        alignItems: "flex-start",
                        flexGrow: 1,
                        flex: 1
                      }}
                      key={id}
                    >
                      {itm.data.map((nm) => (
                        <View
                          style={{
                            borderRadius: 5,
                            // flex: 1,
                            // width: "100%",
                            marginTop: 10,
                            marginLeft: 10,
                            flexDirection: "row",
                            borderColor: "#2761B3",
                            marginRight: 10,
                            flexWrap: "wrap",
                            borderWidth: 0.5
                          }}
                        >
                          <Text
                            style={{
                              color: "gray",
                              fontSize: 16,
                              margin: 8,
                              // marginLeft: 18,
                              textAlign: "center",
                              flexWrap: "wrap",
                              fontWeight: "bold"
                            }}
                          >
                            {nm}
                          </Text>
                          <TouchableOpacity
                            style={styles.delitm}
                            onPress={() => this.handleRemove(nm, itm.id)}
                          >
                            <Image
                              source={require("../../../icons/CLOSE2.png")}
                              style={{
                                height: 15,
                                width: 15,
                                marginLeft: 10,
                                marginRight: 5,
                                marginTop: 10,
                                marginBottom: 10,
                                alignSelf: "flex-end"
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  );
                })}
              </View>
            </View>
          </ScrollView>
        </View>
      </Container>
    );
  }
}

console.log(screenWidth, "/////screen widht");
const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    color: "#000",
    flexDirection: "column",
    backgroundColor: "white",
    fontWeight: "bold",
    marginBottom: 10
    // width: "150%"
  },
  modalView: {
    flex: 0.8, //0.7,
    height: "100%",
    // height: screenWidth <= 360 ? "95%" : "80%",
    // flex: screenWidth <= 360 ? 1 : 0.8,
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
    margin: 10,
    marginTop: 20,
    marginBottom: 10
  },
  closeBtn: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginVertical: 18,
    marginRight: 3.5,
    alignItems: "flex-end"
  },
  delitm: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  header2: {
    flex: 1,

    fontSize: 18,
    fontWeight: "bold",

    marginTop: 30,
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  container: {
    flexDirection: "row",
    padding: 1,
    marginLeft: 5,
    marginRight: 5
  },
  container_text: {
    flex: 1,
    flexDirection: "column",
    marginTop: 10,
    marginLeft: 5,
    justifyContent: "center",
    backgroundColor: "white"
  },
  photo: {
    height: 50,
    width: 50,
    marginLeft: 5,
    marginTop: 15
  },

  SuggestTesttouch: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginEnd: 5
  },

  DRnamesubview: {
    flex: 1,
    flexDirection: "row",
    marginTop: 8
  }
});
