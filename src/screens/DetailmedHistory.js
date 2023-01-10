import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Platform,
  NativeModules,
  ScrollView,
  Button
} from "react-native";
import { Container, Header } from "native-base";
import Constants from "../utils/Constants";
import Loader from "../appComponents/loader";
import Toast from "react-native-tiny-toast";
import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import CustomeHeader from "../appComponents/CustomeHeader";
import moment from "moment";

const screenWidth = Math.round(Dimensions.get("window").width);
const { StatusBarManager } = NativeModules;

function StatusBarPlaceHolder() {
  return (
    <View
      style={{
        width: "100%",
        height: Platform.OS === "ios" ? StatusBarManager.HEIGHT : 0,
        backgroundColor: "#275BB4"
      }}
    >
      <StatusBar barStyle="light-content" />
    </View>
  );
}

export default class DetailmedHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      medicationInfo: [],
      selectedtName: "",
      selectedId: "",
      selectedMedicinename: ""
    };
  }

  componentDidMount = () => {
    let self = this;
    this.setState(
      {
        medicationInfo: [],
        isLoading: true,
        selectedtName: this.props.route.params.forwhome,
        selectedId: this.props.route.params.id,
        selectedMedicinename: this.props.route.params.medname
      },
      () => {
        this.FetchMedicationData();
      }
    );
  };

  async FetchMedicationData() {
    let temparray = [];
    try {
      let response = await axios.post(
        Constants.GET_IN_DETAIL_MEDICATION_HISORY,
        {
          MasterId: this.state.selectedId
        }
      );
      this.setState({
        isLoading: false
      });
      if (response.data.Status) {
        response.data.ReportList.map((item) => {
          const value = item;

          temparray.push(value);
        });
        let removeduplicate = this.removeDuplicate(temparray);
        removeduplicate.sort(function (a, b) {
          return a.counter - b.counter;
        });
        this.setState({
          medicationInfo: removeduplicate, //this.removeDuplicate(temparray),
          isLoading: false
        });
      } else {
        this.setState({
          medicationInfo: [],
          isLoading: false
        });
      }
    } catch (err) {
      this.setState({
        // medicationInfo: temparray,
        isLoading: false
      });
      console.log(err, "medication erro");
    }
  }
  componentWillUnmount = () => {
    this.setState({
      isLoading: false,

      medicationInfo: []
    });
  };
  UNSAFE_componentWillReceiveProps = (nextProp) => {
    this.setState(
      {
        medicationInfo: [],
        isLoading: true,
        selectedtName: nextProp.route.params.forwhome,
        selectedId: nextProp.route.params.id,
        selectedMedicinename: nextProp.route.params.medname
      },
      () => {
        this.FetchMedicationData();
      }
    );
  };

  removeDuplicate = (datalist) => {
    return datalist.filter(function (a) {
      return !this[a.counter] && (this[a.counter] = true);
    }, Object.create(null));
  };

  backbtnPress = () => {
    this.props.navigation.goBack();
  };

  s;
  render() {
    const { StatusBarManager } = NativeModules;

    return (
      <Container>
        <Loader loading={this.state.isLoading} />
        <StatusBarPlaceHolder />
        <CustomeHeader
          title={this.state.selectedtName}
          headerId={2}
          navigation={this.props.navigation}
          onPressback={this.backbtnPress}
        />
        <ScrollView
          alwaysBounceVertical={true}
          showsHorizontalScrollIndicator={false}
          style={{
            backgroundColor: "white",
            marginTop: 0,
            paddingHorizontal: 0
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "#fff",
              marginBottom: 15,

              marginLeft: 5,
              marginRight: 5
            }}
          >
            <View
              style={{
                borderRadius: 5,
                flex: 1,

                marginTop: 10,
                marginLeft: 10,
                marginRight: 10,
                borderRadius: 1,
                borderWidth: 1,
                borderColor: "lightgray"
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 16,
                  margin: 8,
                  marginLeft: 18,
                  textAlign: "center",

                  fontWeight: "bold",

                  borderRadius: 1,
                  color: "gray"
                }}
              >
                {this.state.selectedMedicinename}
              </Text>
            </View>
          </View>

          {this.state.medicationInfo.map((item, index) => {
            return (
              <View
                style={{
                  flexDirection: "column",
                  marginBottom: 15,
                  marginLeft: 15,
                  marginRight: 15,
                  // borderWidth: 1,
                  // borderColor: "lightgray",
                  borderRadius: 5,
                  flex: 1,
                  backgroundColor: "#fff"
                }}
                key={index}
              >
                <View
                  style={{
                    flexDirection: "row",
                    // borderColor: "lightgray",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#3062ae"
                    // backgroundColor: "red"
                    // flex: 1
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 16,
                      margin: 8,
                      textAlign: "center",

                      fontWeight: "bold"
                    }}
                  >
                    {moment(item.DoseDate).format("DD/MM/YYYY")}
                  </Text>

                  <View
                    style={{
                      flex: 1,
                      height: 2,
                      backgroundColor: "#fff"
                    }}
                  />
                  <View>
                    <Text
                      style={{
                        marginLeft: 10,
                        marginRight: 10,
                        // height: 30,
                        // marginTop: 20,
                        textAlign: "center",
                        fontSize: 16,
                        color: "#fff"
                      }}
                      numberOfLines={10}
                    >
                      {item.MedicationStatus}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    borderColor: "lightgray",
                    flexDirection: "row",

                    flex: 1
                  }}
                >
                  {item.SubReportList.map((dose, ind) => {
                    return (
                      <>
                        <View
                          style={{
                            borderColor: "lightgray",

                            flex: 1
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              borderColor: "lightgray"
                            }}
                          >
                            <Text
                              style={{
                                color: "gray",
                                fontSize: 16,
                                margin: 8,
                                textAlign: "center",
                                marginLeft: 20,
                                // marginRight: 10,
                                fontWeight: "bold"
                              }}
                            >
                              {"Dose"}
                              {1 + ind}
                            </Text>
                          </View>
                          {dose.mStatus != undefined && dose.mStatus != "" && (
                            <View
                              style={{
                                // flex: 1,
                                justifyContent: "center",
                                alignSelf: "center",
                                alignItems: "center",
                                // margin: 8
                                marginLeft: 4
                                // marginRight: 10
                              }}
                            >
                              <Image
                                source={
                                  dose.mStatus == "S"
                                    ? require("../../icons/closered.png")
                                    : require("../../icons/checkgreenmedication.png")
                                }
                                style={{
                                  height: 20,
                                  width: 20,
                                  marginRight: 30,
                                  marginLeft: 4,
                                  justifyContent: "center",
                                  alignSelf: "center",
                                  alignItems: "center"
                                }}
                              ></Image>
                              <Text
                                style={{
                                  marginLeft: 10,
                                  marginRight: 10,

                                  fontSize: 16,
                                  color: "gray"
                                }}
                                numberOfLines={10}
                              >
                                {dose.MedicationStatus}
                              </Text>
                            </View>
                          )}
                        </View>
                      </>
                    );
                  })}
                </View>
                {/* <View
                  style={{
                    flexDirection: "row",
                    marginBottom: 15,
                    marginLeft: 15,
                    marginRight: 15,
                    marginTop: 20,
                    borderRadius: 5,
                    flex: 1,
                    backgroundColor: "#3062ae"
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      // borderColor: "lightgray",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#3062ae"
                      // backgroundColor: "red"
                      // flex: 1
                    }}
                  >
                    <Text
                      style={{
                        marginLeft: 10,
                        marginRight: 10,
                        // height: 30,
                        // marginTop: 20,
                        textAlign: "center",
                        fontSize: 16,
                        color: "#fff"
                      }}
                      numberOfLines={10}
                    >
                      {item.MedicationStatus}
                    </Text>
                  </View>
                </View> */}
              </View>
            );
          })}
        </ScrollView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: "center",
    flex: 1,
    paddingTop: 0,
    backgroundColor: "white",
    flexDirection: "column"
  },

  container_text: {
    flex: 1,
    flexDirection: "column",
    marginTop: 0,
    marginLeft: 5,
    justifyContent: "center",
    backgroundColor: "white"
  },

  Separator: {
    height: 0.5,
    backgroundColor: "gray",
    marginLeft: 0,
    marginRight: 0,
    marginTop: 10
  }
});
