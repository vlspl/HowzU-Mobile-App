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

import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import ActionButton from "react-native-action-button";

import TestListRow from "../../appComponents/TestListRow";
import MyHealthCard from "../../appComponents/MyHealthCard";
const Rijndael = require("rijndael-js");
//const bufferFrom = require('buffer-from')
global.Buffer = global.Buffer || require("buffer").Buffer;
const padder = require("pkcs7-padding");

export default class FamilyHistoryScreen extends Component {
  constructor(props) {
    super(props);
    //setting default state
    this.state = {
      isLoading: false,
      isfoodallergy: false,
      testname: "",
      disease: [],
      type: "",
      screentitle: "",
      Allergey: []
    };
  }

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    this.setState(
      {
        // isLoading: true,
        disease: [],
        type: nextProp.route.params.type,
        screentitle: nextProp.route.params.title
      },
      () => {
        this.getSaveData();
      }
    );
  };

  componentDidMount() {
    this.setState(
      {
        disease: [],
        type: this.props.route.params.type,
        screentitle: this.props.route.params.title,
        isLoading: true
      },
      () => {
        this.getSaveData();
      }
    );
  }
  getSaveData = async () => {
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

          separatedArray = [];

          tmp.name = itm.name;
          tmp.familyMemberName = itm.familyMemberNm;
          tmp.relation = itm.relation;
          tmp.id = itm.userprofile_dtls_id;
          tmp.data = namesepartion;
          responseData.push(tmp);
        });

        this.setState({
          Allergey: responseData
        });
      } else {
        this.setState({
          Allergey: []
        });
      }
    } catch (err) {
      console.log(err, "/////////");
    }
  };
  backbtnPress = () => {
    this.props.navigation.goBack();
    // this.props.navigation.navigate('PatientDashboard', {
    //   refresh: 'refresh',
    // });
  };
  handleAdd = () => {
    // console.log("add presed");
    const values = [...this.state.FoodAllergey];
    values.push({
      itemname: this.state.testname
    });
    this.setState({ FoodAllergey: values, isfoodallergy: false });
  };
  handleRemove = async (i, id) => {
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
  handleAllRemove = async (i) => {
    try {
      let response = await axios.post(Constants.ADD_ALLERGIES, {
        userprofileDtlsId: i,
        Name: "",
        type: "",
        relation: "",
        familyMemberName: "",
        col8: "",
        col9: "",
        col10: "",
        actionStatus: "D"
      });
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
    return (
      <Container>
        <Loader loading={this.state.isLoading} />

        <CustomeHeader
          title={this.state.screentitle}
          headerId={2}
          onPressback={this.backbtnPress}
          navigation={this.props.navigation}
        />
        <View
          style={{
            flex: 1,
            justifyContent: "center"
          }}
        >
          {this.state.Allergey.length == 0 ? (
            <NoDataAvailable
              onPressRefresh={this.onRefresh}
              source={require("../../../icons/nodatafamily.png")}
            ></NoDataAvailable>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center"
              }}
            >
              <ScrollView
                alwaysBounceVertical={true}
                showsHorizontalScrollIndicator={false}
              >
                {this.state.Allergey.map((itm, id) => {
                  return (
                    <>
                      <View
                        style={{
                          flex: 1,
                          backgroundColor: "white",

                          borderWidth: 1,
                          borderColor: "lightgray",
                          shadowOffset: { width: 0, height: 3 },
                          shadowColor: "#000000",
                          shadowOpacity: 0.3,
                          borderRadius: 5,
                          elevation: 5,

                          justifyContent: "center",
                          margin: 5,
                          marginTop: 20
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            margin: 10
                          }}
                        >
                          <View style={{ flex: 1 }}>
                            <View style={styles.container}>
                              <View style={styles.photo}>
                                <Image
                                  source={require("../../../icons/familymedical.png")}
                                  style={{
                                    height: 50,
                                    width: 50,
                                    marginLeft: 0
                                  }}
                                ></Image>
                              </View>
                              <View style={styles.container_text}>
                                <View style={styles.DRnamesubview}>
                                  <Text
                                    style={[
                                      styles.title,
                                      {
                                        marginLeft: 5,
                                        fontWeight: "normal"
                                      }
                                    ]}
                                    numberOfLines={1}
                                  >
                                    {itm.familyMemberName}
                                  </Text>
                                </View>
                                <View
                                  style={[
                                    { flexDirection: "row", marginLeft: 0 }
                                  ]}
                                >
                                  <Text
                                    style={{
                                      marginLeft: 5,
                                      marginRight: 10,
                                      marginBottom: 5,
                                      color: "#A9A9A9",
                                      fontSize: 14
                                      // marginTop: -10
                                    }}
                                  >
                                    {itm.relation}
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
                                      this.handleAllRemove(itm.id);
                                    }}
                                  >
                                    <Image
                                      source={require("../../../icons/delete.png")}
                                      style={{ height: 30, width: 30 }}
                                    ></Image>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </View>
                          </View>

                          <View
                            style={{
                              flex: 1,
                              flexWrap: "wrap",
                              alignItems: "flex-start",
                              flexDirection: "row",
                              flexGrow: 1
                            }}
                            key={id}
                          >
                            {itm.data.map((nm) => (
                              <View
                                style={{
                                  borderRadius: 5,

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
                                    fontSize: 14,
                                    marginLeft: 5,
                                    margin: 8,
                                    // marginLeft: 16,
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
                                      height: 12,
                                      width: 13,
                                      marginLeft: 4,
                                      margin: 10,
                                      // marginTop: 10,
                                      alignSelf: "baseline"
                                    }}
                                  />
                                </TouchableOpacity>
                              </View>
                            ))}
                          </View>
                        </View>
                      </View>
                    </>
                  );
                })}
              </ScrollView>
            </View>
          )}

          <ActionButton
            style={{
              marginRight: 50,
              alignItems: "center"
              // bottom: -15
            }}
            buttonColor="#275BB4"
            onPress={() => this.props.navigation.navigate("Allergy")}
          />
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
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
    // justifyContent: "center",
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
  },
  title: {
    fontSize: 16,
    color: "#000",
    flexDirection: "column",
    backgroundColor: "white",
    fontWeight: "bold"
    // marginBottom: 10
  },
  modalView: {
    flex: 0.4,
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
