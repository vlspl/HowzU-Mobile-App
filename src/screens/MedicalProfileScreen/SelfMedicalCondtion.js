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

import TestListRow from "../../appComponents/TestListRow";
import MyHealthCard from "../../appComponents/MyHealthCard";
const Rijndael = require("rijndael-js");
//const bufferFrom = require('buffer-from')
global.Buffer = global.Buffer || require("buffer").Buffer;
const padder = require("pkcs7-padding");
// import { TabView, SceneMap } from "react-native-tab-view";

export default class SelfMedicalConditionScreen extends Component {
  constructor(props) {
    super(props);
    //setting default state
    this.state = {
      isLoading: false,
      isfoodallergy: false,
      testname: "",
      FoodAllergey: []
    };
  }

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    this.setState(
      {
        // isLoading: true,
        userDetails: [],
        activebtn: nextProp.route.params.role
      },
      () => {}
    );
  };

  componentDidMount() {
    this.setState(
      {
        userDetails: [],
        // isLoading: true,
        activebtn: this.props.route.params.role
      },
      () => {}
    );
  }

  handleAdd = () => {
    // console.log("add presed");
    const values = [...this.state.FoodAllergey];
    values.push({
      itemname: this.state.testname
    });
    this.setState({ FoodAllergey: values, isfoodallergy: false });
  };
  handleRemove = (i) => {
    const values = [...this.state.FoodAllergey];
    values.splice(i, 1);
    this.setState({ FoodAllergey: values });
  };
  render() {
    const screenWidth = Math.round(Dimensions.get("window").width);
    console.log(this.state.FoodAllergey);
    return (
      <Container>
        <Loader loading={this.state.isLoading} />

        <CustomeHeader
          title="Food/ Other Allergies"
          headerId={1}
          navigation={this.props.navigation}
        />
        <RNModal
          visible={this.state.isfoodallergy}
          transparent
          style={{ flex: 1, margin: 0 }}
        >
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
                        { marginLeft: 20, fontWeight: "normal", fontSize: 20 }
                      ]}
                    >
                      Food Allergies
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
              <View>
                {/* Main content  */}
                <View
                  style={{
                    height: 0.5,
                    marginLeft: 15,
                    marginRight: 10,
                    marginTop: 8,
                    backgroundColor: "#d8d8d8",
                    padding: 0.5
                  }}
                ></View>
                <ScrollView
                  alwaysBounceVertical={true}
                  showsHorizontalScrollIndicator={false}
                  style={{ backgroundColor: "white", marginTop: 0 }}
                >
                  <View
                    style={[
                      {
                        flex: 1,
                        margin: 5
                      }
                    ]}
                  >
                    <TestListRow
                      testname={"Egg"}
                      checkboximg={
                        this.state.testname == "Egg"
                          ? require("../../../icons/checkbox.png")
                          : require("../../../icons/checkbox_1.png")
                      }
                      onPress={() => this.setState({ testname: "Egg" })}
                    ></TestListRow>
                  </View>
                </ScrollView>
                <View
                  style={{
                    height: 0.5,
                    marginLeft: 15,
                    marginRight: 10,
                    marginTop: 8,
                    backgroundColor: "#d8d8d8",
                    padding: 0.5
                  }}
                ></View>
                <View
                  style={{
                    flex: 1,

                    marginBottom: 20,
                    // backgroundColor: "white",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "stretch",
                    marginRight: 40,
                    marginTop: 15
                  }}
                >
                  <TouchableOpacity
                    style={{
                      height: 30
                      // marginBottom: 20,
                    }}
                    onPress={() => this.setState({ isfoodallergy: false })}
                  >
                    <Text style={styles.title}> CANCEL </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      height: 30
                      // marginBottom: 20,
                    }}
                    onPress={() => this.handleAdd()}
                  >
                    <Text style={[styles.title, { color: "#2761B3" }]}>
                      {" "}
                      OK{" "}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </RNModal>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: "#F9F1E0"
            // backgroundColor: "lightgray"
          }}
        >
          {/* {this.state.userDetails.length == 0 ? (
            <NoDataAvailable onPressRefresh={this.onRefresh}></NoDataAvailable>
          ) : this.state.activebtn != "" ? (
            <> */}

          <ScrollView
            alwaysBounceVertical={true}
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 10 }}
          >
            <Content>
              <View
                style={{
                  flex: 1,

                  backgroundColor: "white",
                  // width: scale(220),
                  // height: scale(95),
                  borderWidth: 1,
                  borderColor: "#FFFFF0",
                  shadowOffset: { width: 2, height: 2 },
                  shadowColor: "lightgray",
                  shadowOpacity: 0.8,
                  borderRadius: 5,
                  elevation: 5,
                  // alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 10,
                  marginRight: 10
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Left>
                    <Image
                      source={require("../../../icons/foodallergies.png")}
                      style={{ height: 30, width: 30, margin: 10 }}
                    ></Image>
                  </Left>
                  <Body>
                    <Text
                      style={{
                        fontSize: 16,
                        color: "gray",
                        marginLeft: 15
                      }}
                    >
                      Food Allergy
                    </Text>
                  </Body>
                  <Right>
                    <TouchableOpacity
                      onPress={() => this.setState({ isfoodallergy: true })}
                    >
                      <Image
                        source={require("../../../icons/add.png")}
                        style={{ height: 35, width: 35, margin: 10 }}
                      ></Image>
                    </TouchableOpacity>
                  </Right>
                </View>

                <View style={{ flex: 1, flexDirection: "row", margin: 10 }}>
                  {this.state.FoodAllergey.map((itm, id) => {
                    return (
                      <View
                        style={{
                          borderRadius: 5,
                          // flex: 1,
                          backgroundColor: "blue",
                          marginTop: 10,
                          marginLeft: 10
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            color: "gray",
                            margin: 10
                          }}
                        >
                          {itm.itemname}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </Content>
          </ScrollView>

          {/* </>
          ) : null} */}
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
