import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
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
import RNDateTimePicker from "@react-native-community/datetimepicker";
import DateTimePicker from "react-native-modal-datetime-picker";
import Graphdateinput from "../appComponents/Graphdateinput";
import NoDataAvailable from "../appComponents/NoDataAvailable";
import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import CustomeHeader from "../appComponents/CustomeHeader";
import moment from "moment";
import Modal from "react-native-modal";
import ActionButton from "react-native-action-button";

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

export default class MedicationHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activebtn: "doctor",
      userrole: "",
      isLoading: false,

      medicationInfo: [],
      selectedDate: "",
      selectedDoseDate: "",
      isModalVisible: false,
      doseInfo: [],
      onPressPopup: "",
      dosetime: "",
      isnotif: false,
      isShowDataPicker: false,
      istaken: false,
      notificationdata: [],
      delindex: "",
      meduserName: "",
      FamilyMemberList: [],
      selectedtName: "",
      selectedId: "",
      userid: "",
      isModalVisible: false,
      isDateTimePickerVisible: false,
      todate: "",
      fromdate: ""
    };
  }

  componentDidMount = async () => {
    console.log(
      "Component Did MOunt ****************Medication Calendar Home****************",
      this.props.route.params
    );
    this.setState(
      {
        // fromdate: moment(new Date(), " YYYY-MM-DDTHH: mm: ss").format(
        //   "MM/DD/YYYY"
        // ),
        fromdate: new Date(),
        medicationInfo: [],
        isLoading: true,
        todate: new Date()
        // todate: moment(new Date(), "YYYY-MM-DDTHH: mm: ss")
        //   .format("MM/DD/YYYY")
        //   .toString()
      },
      () => {
        this.FetchMedicationData();
        this.getFamilyMemberList();
      }
    );
  };

  async FetchMedicationData() {
    let name = await AsyncStorage.getItem(Constants.USER_NAME);
    let selectedtName = name + "(Myself)";

    let ForWhome =
      this.state.selectedtName == "" ? selectedtName : this.state.selectedtName;
    this.setState({ selectedtName: ForWhome });
    let temparray = [];
    try {
      let response = await axios.post(Constants.GET_MEDICATION_HISORY, {
        // FromDate: moment(this.state.fromdate).format("MM/DD/YYYY"),
        // EndDate: moment(this.state.todate).format("MM/DD/YYYY"),
        ForWhome: ForWhome,
        pageNumber: 0,
        pageSize: 0,
        Searching: ""
      });
      this.setState({
        isLoading: false
      });
      if (response.data.Status) {
        response.data.medicineDetails.map((item) => {
          const value = item;
          let dosesper = item.TakenDose / item.TotalDose;

          value.MedEdate = moment(item.MedSdate, "MM/DD/YYYY").add(
            item.MedDoseDuration,
            "days"
          );
          value.per = Number(dosesper * 100).toFixed(2);
          temparray.push(value);
        });
        this.setState({
          medicationInfo: temparray,
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
      activebtn: "doctor",
      userrole: "",
      isLoading: false,
      realm: null,
      medicationInfo: [],
      selectedDate: "",
      selectedDoseDate: "",
      isModalVisible: false,
      doseInfo: [],
      onPressPopup: "",
      dosetime: "",
      isnotif: false,
      isShowDataPicker: false,
      istaken: false,
      notificationdata: []
    });
  };
  UNSAFE_componentWillReceiveProps = (nextProp) => {
    console.log(
      " Unsafe componentWillReceiveProps==============================",
      nextProp.route.params.data
    );

    this.setState(
      {
        // selectedDate: moment(new Date(), " YYYY-MM-DDTHH: mm: ss").format(
        //   "YYYY-MM-DD"
        // ),
        medicationInfo: [],
        isLoading: true,
        todate: new Date(),
        fromdate: new Date()
      },
      () => {
        this.FetchMedicationData();
        this.getFamilyMemberList();
      }
    );
  };

  removeDuplicate = (datalist) => {
    return datalist.filter(function (a) {
      return !this[a.UserId] && (this[a.UserId] = true);
    }, Object.create(null));
  };
  AddMedication = () => {
    //Alert.alert(item.key,item.title);
    // console.log('AddMedication=================');
    // this.props.navigation.navigate("MedicationTabName");

    this.props.navigation.navigate("MedicatnForSelforOther");
  };
  async getFamilyMemberList() {
    try {
      let forslef = {};

      let userid = await AsyncStorage.getItem(Constants.USER_ID);
      let name = await AsyncStorage.getItem(Constants.USER_NAME);
      // console.log(userid, name, "/////@@#$@");
      let responseData = this.state.FamilyMemberList;

      forslef.Name = name + "(Myself)";
      forslef.UserId = userid;

      responseData.push(forslef);
      const response = await axios.get(Constants.FAMILY_MEMBERLIST);
      let ApprovalPendinglist = await axios.post(Constants.PENDING_REQUEST, {
        pageNumber: this.state.pageNo,
        pageSize: Constants.PER_PAGE_RECORD,
        Searching: this.state.searchString
      });

      this.setState({ isLoading: false });
      if (response.data.Status) {
        //Toast.show(response.data.Msg)

        response.data.PatientList.map((item) => {
          // item.isShow=false;
          let temp = {};
          temp.Name = item.Name;
          temp.UserId = item.UserId;
          responseData.push(temp);
        });

        if (ApprovalPendinglist.data.Status) {
          //   let responseData = this.state.PendingRequestList;

          ApprovalPendinglist.data.PatientList.map((item) => {
            //item.isShow=false;
            let temp = {};
            temp.Name = item.Name;
            responseData.push(temp);
            // responseData.push(item);
          });
        }

        this.setState({
          FamilyMemberList: this.removeDuplicate(responseData),
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false,
          userid: userid
        });
      } else {
        this.setState({
          FamilyMemberList: this.removeDuplicate(responseData),
          userid: userid,
          isLoading: false
        });
        // Toast.show(response.data.Msg);
      }
    } catch (error) {
      console.log(error, "///////");
      Toast.show("Something Went Wrong, Please Try Again Later");
      this.setState({
        isLoading: false
      });
      this.setState({ isLoading: false });
    }
  }

  selectRelation = (index) => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
    let info = this.state.FamilyMemberList[index];
    if (info.Name == "Add New") {
      this.props.navigation.navigate("AddNewFamilyMember", {
        refresh: "",
        from: "medication"
      });
    } else {
      this.FetchMedicationData();
      this.setState({ selectedtName: info.Name, selectedId: info.UserId });
    }
  };
  backbtnPress = () => {
    this.props.navigation.goBack();
  };
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };
  DismissModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };
  onSelectFromDate = (date) => {
    this.setState({ fromdate: date, isDateTimePickerVisible: false }, () => {
      if (this.state.todate == "") {
      } else {
        responseMain = [];

        this.setState(
          {
            isLoading: true,
            medicationInfo: [],
            isDateTimePickerVisible: false
          },
          () => {
            this.FetchMedicationData();
          }
        );
      }
    });
  };
  onChangeSelectFromDate = (event, selectedDate) => {
    if (event.type == "set") {
      const currentDate = selectedDate || date;
      // setShow(Platform.OS === 'ios');
      let formatdate = moment(currentDate).format("DD/MM/YYYY");

      this.setState(
        {
          fromdate: selectedDate,
          isShowDataPicker: false,
          isDateTimePickerVisible: false
        },
        () => {
          if (this.state.todate == "") {
          } else {
            this.setState(
              {
                isLoading: true,
                medicationInfo: [],
                isShowDataPicker: false
              },
              () => {
                this.FetchMedicationData();
              }
            );
          }
        }
      );
    } else {
      this.setState({
        // BirthDate: formatdate,
        isShowDataPicker: false,
        isDateTimePickerVisible: false
      });
    }
  };
  onChangeSelectToDate = (event, selectedDate) => {
    if (event.type == "set") {
      const currentDate = selectedDate || date;
      // setShow(Platform.OS === 'ios');
      let formatdate = moment(currentDate).format("DD/MM/YYYY");

      this.setState(
        {
          todate: selectedDate,
          isShowDataPicker: false,
          isDateTimePickerVisible: false
        },
        () => {
          if (this.state.fromdate == "") {
          } else {
            this.setState(
              {
                isLoading: true,
                medicationInfo: [],
                isShowDataPicker: false
              },
              () => {
                this.FetchMedicationData();
              }
            );
          }
        }
      );
    } else {
      this.setState({
        // BirthDate: formatdate,
        isShowDataPicker: false,
        isDateTimePickerVisible: false
      });
    }
  };
  onChangeSelectToDate = (event, selectedDate) => {
    if (event.type == "set") {
      const currentDate = selectedDate || date;
      // setShow(Platform.OS === 'ios');
      let formatdate = moment(currentDate).format("DD/MM/YYYY");

      this.setState(
        {
          todate: selectedDate,
          isShowDataPicker: false,
          isDateTimePickerVisible: false
        },
        () => {
          if (this.state.fromdate == "") {
          } else {
            this.setState(
              {
                isLoading: true,
                medicationInfo: [],
                isShowDataPicker: false
              },
              () => {
                this.FetchMedicationData();
              }
            );
          }
        }
      );
    } else {
      this.setState({
        // BirthDate: formatdate,
        isShowDataPicker: false,
        isDateTimePickerVisible: false
      });
    }
  };
  onSelectToDate = (date) => {
    //let info = this.state.ApprovedRequestList[index];
    // if (this.state.fromdate == ''){
    this.setState({ todate: date, isShowDataPicker: false }, () => {
      if (this.state.fromdate == "") {
      } else {
        responseMain = [];
        this.setState(
          {
            isLoading: true,
            medicationInfo: [],
            isShowDataPicker: false
          },
          () => {
            this.FetchMedicationData();
          }
        );
      }
    });
  };
  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false, isShowDataPicker: false });
  };
  OnpressDose = (medid, medname) => {
    this.props.navigation.navigate("MedDetailHis", {
      forwhome: this.state.selectedtName,
      id: medid,
      medname: medname
    });
  };
  render() {
    const { StatusBarManager } = NativeModules;
    return (
      <Container>
        <Loader loading={this.state.isLoading} />
        <StatusBarPlaceHolder />
        <CustomeHeader
          title="Medication History"
          headerId={2}
          navigation={this.props.navigation}
          onPressback={this.backbtnPress}
        />
        <Modal isVisible={this.state.isModalVisible}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignContent: "center"
            }}
          >
            <View
              style={{
                height: "50%",
                width: "100%",
                backgroundColor: "white",
                flexDirection: "column",
                borderRadius: 5
              }}
            >
              <Text
                style={{
                  marginTop: 10,
                  marginLeft: 10,
                  fontSize: 24,
                  color: "black",
                  textAlign: "center"
                }}
              >
                Select Name
              </Text>
              <View
                style={{
                  height: 0.5,
                  backgroundColor: "gray",
                  marginRight: 5,
                  marginTop: 8
                }}
              ></View>
              <ScrollView
                alwaysBounceVertical={true}
                showsHorizontalScrollIndicator={false}
                style={{
                  backgroundColor: "white",
                  marginTop: 0,
                  paddingHorizontal: 0
                }}
              >
                {this.state.FamilyMemberList.map((item, index) => {
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
              <Button title="Cancel" onPress={this.DismissModal} />
            </View>
          </View>
        </Modal>

        <View
          style={{
            flex: 0.2,
            backgroundColor: "skyblue"
          }}
        >
          {/* <View style={{ paddingLeft: 10, marginTop: 20 }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignContent: "center"
                }}
              >
                {Platform.OS == "ios" ? (
                  <Graphdateinput
                    placeholder="Start Date"
                    onDateChange={this.onSelectFromDate}
                    date={this.state.fromdate}
                    onPress={() =>
                      this.setState({
                        isDateTimePickerVisible:
                          !this.state.isDateTimePickerVisible
                      })
                    }
                    onCancel={this.hideDateTimePicker}
                    isVisible={this.state.isDateTimePickerVisible}
                    maximumDate={null}
                  ></Graphdateinput>
                ) : (
                  <Graphdateinput
                    placeholder="Start Date"
                    onDateChange={this.onChangeSelectFromDate}
                    date={this.state.fromdate}
                    onPress={() =>
                      this.setState({
                        isDateTimePickerVisible:
                          !this.state.isDateTimePickerVisible
                      })
                    }
                    maximumDate={null}
                    onCancel={this.hideDateTimePicker}
                    isVisible={this.state.isDateTimePickerVisible}
                  ></Graphdateinput>
                )}

                <Text
                  style={{
                    textAlign: "center",
                    alignSelf: "center",
                    margin: 10
                  }}
                >
                  To
                </Text>
                {Platform.OS == "ios" ? (
                  <Graphdateinput
                    placeholder="End Date"
                    onDateChange={this.onSelectToDate}
                    date={this.state.todate}
                    isVisible={this.state.isShowDataPicker}
                    onPress={() => {
                      this.setState({
                        isShowDataPicker: !this.state.isShowDataPicker
                      });
                    }}
                    onCancel={this.hideDateTimePicker}
                    // maximumDate={null}
                  ></Graphdateinput>
                ) : (
                  <Graphdateinput
                    placeholder="End Date"
                    onDateChange={this.onChangeSelectToDate}
                    date={this.state.todate}
                    isVisible={this.state.isShowDataPicker}
                    onPress={() => {
                      this.setState({
                        isShowDataPicker: !this.state.isShowDataPicker
                      });
                    }}
                    onCancel={this.hideDateTimePicker}
                    // maximumDate={null}
                  ></Graphdateinput>
                )}
              </View>
            </View> */}

          <View
            style={{
              flex: 1,
              // height: 80,
              backgroundColor: "transparent",
              flexDirection: "row",
              marginTop: 15,
              marginLeft: 15,
              marginRight: 15,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={{ fontSize: 18, marginRight: 15 }}>To Whome</Text>
            <View
              style={{
                height: 50,
                backgroundColor: "white",
                flexDirection: "row",
                // marginTop: 30,
                // marginLeft: 0,
                // marginRight: 0,
                borderColor: "lightgray",
                borderWidth: 1,
                borderRadius: 5,
                width: 200
              }}
            >
              <Image
                source={require("../../icons/Family-Member-b.png")}
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
                  {this.state.selectedtName != "" ? (
                    <Text
                      style={{
                        textAlign: "left",
                        marginLeft: 10,
                        backgroundColor: "white",
                        fontSize: 18,
                        color:
                          // this.state.selectedtcolor != ""
                          //   ? this.state.selectedtcolor
                          //   :
                          "gray"
                      }}
                    >
                      {this.state.selectedtName}
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
                      Select Name
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={this.toggleModal}>
                <Image
                  source={require("../../icons/drop-arrow.png")}
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
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            backgroundColor: "white"
            // marginTop: 20
          }}
        >
          {this.state.medicationInfo.length <= 0 && !this.state.isLoading ? (
            <>
              <NoDataAvailable
                onPressRefresh={this.onRefresh}
                source={require("../../icons/medHis.jpeg")}
              />
              <ActionButton
                style={{
                  marginRight: 50,
                  marginBottom: 0,
                  alignItems: "center",
                  bottom: 10
                  // margin: 10,
                }}
                buttonColor="#275BB4"
                onPress={this.AddMedication}
              />
            </>
          ) : null}
          <ScrollView>
            {this.state.medicationInfo.map((item, index) => {
              return (
                <View
                  style={{
                    flexDirection: "column",
                    marginBottom: 15,
                    marginLeft: 15,
                    marginRight: 15,
                    borderWidth: 1,
                    borderColor: "lightgray",
                    borderRadius: 5,
                    marginTop: 10,
                    // backgroundColor: "red",
                    flex: 1
                  }}
                  key={index}
                >
                  <TouchableOpacity
                    onPress={() => {
                      this.OnpressDose(item.RemidermId, item.Medicinename);
                    }}
                  >
                    <View
                      style={{
                        // flexDirection: "row",
                        // marginLeft: 18,
                        // marginBottom: 8,
                        backgroundColor: "white",
                        // margin: 2,
                        marginTop: 10,
                        flex: 1
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          marginLeft: 18,
                          // marginBottom: 8,
                          backgroundColor: "white"
                        }}
                      >
                        <Image
                          source={require("../../icons/capsule1.png")}
                          style={{ height: 20, width: 20 }}
                        />

                        <View style={{ flexDirection: "row", flex: 1 }}>
                          <Text
                            style={{
                              fontSize: 15,
                              color: "#000",
                              fontWeight: "bold"
                            }}
                          >
                            {item.Medicinename}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            flex: 1,
                            justifyContent: "flex-end",
                            alignItems: "center"
                          }}
                        >
                          <View
                            style={{
                              // flexDirection: "row",
                              // flex: 1,
                              justifyContent: "center",
                              textAlign: "center",
                              borderWidth: 1,
                              marginRight: 10,
                              width: "45%",
                              height: "90%",
                              borderColor: "gray",
                              borderRadius: 25,
                              margin: 2
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 15,
                                color: "#000",
                                fontWeight: "bold",
                                textAlign: "center"
                              }}
                            >
                              {item.per}
                            </Text>
                          </View>
                        </View>

                        {/*  */}
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          marginLeft: 18,
                          marginBottom: 8,
                          // marginTop: -10,
                          backgroundColor: "white"
                          // margin: 2
                        }}
                      >
                        <Image
                          source={require("../../icons/date-of-birth.png")}
                          style={{ height: 18, width: 18 }}
                        />

                        <View style={{ flexDirection: "row", flex: 1 }}>
                          <Text
                            style={{
                              fontSize: 15,
                              color: "gray",
                              marginLeft: 5
                            }}
                          >
                            {moment(item.MedSdate, "MM/DD/YYYY").format(
                              "DD/MM/YYYY"
                            ) +
                              " To " +
                              moment(item.MedEdate).format("DD/MM/YYYY")}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>
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
