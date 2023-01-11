import React from "react";

import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Platform,
  NativeModules,
  BackHandler,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Button
} from "react-native";
import { Container, Header } from "native-base";
import AsyncStorage from "@react-native-community/async-storage";
import Constants from "../utils/Constants";
import Toast from "react-native-tiny-toast";
const screenWidth = Math.round(Dimensions.get("window").width);
const { StatusBarManager } = NativeModules;
import axios from "axios";
import Loader from "../appComponents/loader";
import TestListRow from "../appComponents/TestListRow";
import Rediobutton from "../appComponents/Rediobutton";
import Modal from "react-native-modal";
const numColumns = 4;
const dwidth = Dimensions.get("window").width;
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
const formatData = (data, numColumns) => {
  const numberOfFullRows = Math.floor(data.length / numColumns);

  let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
  while (
    numberOfElementsLastRow !== numColumns &&
    numberOfElementsLastRow !== 0
  ) {
    data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
    numberOfElementsLastRow++;
  }
  return data;
};
export default class MedicationForSelforOtherScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activebtn: "doctor",
      userrole: "",
      isLoading: false,
      tabName: "",
      isErr: false,
      AllTabList: [],
      typingTimeout: 0,
      isLoadingSecond: false,
      typing: true,
      pageNo: 1,
      searchLoading: false,
      refreshing: false,
      PendingRequestList: [],
      ApprovedRequestList: [],
      FamilyMemberList: [],
      selectedtName: "",
      selectedId: "",
      userid: "",
      isnew: false,
      isModalVisible: false,
      colors: [
        { Name: "#228b22", color: "forestgreen" },
        { Name: "#a52a2a", color: "brown" },
        { Name: "#d2691e", color: "chocolate" },
        { Name: "#dc143c", color: "crimson" },

        { Name: "#9370db", color: "mediumpurple" },
        { Name: "#6a5acd", color: "slateblue" },
        { Name: "#6495ed", color: "cornflowerblue" },
        { Name: "#00008b", color: "darkblue" },

        { Name: "#ff69b4", color: "hotpink" },
        { Name: "#4b0082", color: "indigo" },
        { Name: "#ba55d3", color: "mediumorchid" },
        { Name: "#c71585", color: "mediumvioletred" },

        { Name: "#ffa07a", color: "lightsalmon" },
        { Name: "#db7093", color: "palevioletred" },
        { Name: "#ff0000", color: "red" },
        { Name: "#8b4513", color: "saddlebrown" }
      ],

      isColor: false,
      selectedtcolor: ""
    };
  }
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  DismissModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };
  toggleColorModal = () => {
    this.setState({ isColor: !this.state.isColor });
  };

  DismissColorModal = () => {
    this.setState({ isColor: !this.state.isColor });
  };
  OpenDrawer = () => {
    this.props.navigation.goBack();
  };

  removeDuplicate = (datalist) => {
    return datalist.filter(function (a) {
      return !this[a.UserId] && (this[a.UserId] = true);
    }, Object.create(null));
  };
  hardwarebBackAction = () => {
    this.props.navigation.goBack();
    return true;
  };
  componentWillUnmount = () => {
    // this.backHandler.remove();
  };
  componentDidMount = () => {
    this.setState(
      {
        isLoading: true
      },
      () => {
        this.getFamilyMemberList();
      }
    );

    // this.getApprovalPendinglist();
  };
  UNSAFE_componentWillReceiveProps = (nextProp) => {
    this.setState(
      {
        isLoading: true
      },
      () => {
        this.getFamilyMemberList();
      }
    );
  };
  saveData = async () => {
    if (this.state.selectedtName == "") {
      Toast.show("Please select name");
    } else if (this.state.selectedtcolor == "") {
      Toast.show("Please select color");
    } else {
      try {
        this.props.navigation.navigate("MedicationTabName", {
          forWhome: this.state.selectedtName,
          color: this.state.selectedtcolor
        });
      } catch (e) {
        //alert('Failed to save the data to the storage')
      }
    }
  };

  DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  );

  async getFamilyMemberList() {
    try {
      let forslef = {};
      let forAddnew = {};
      let userid = await AsyncStorage.getItem(Constants.USER_ID);
      let name = await AsyncStorage.getItem(Constants.USER_NAME);
      let responseData = this.state.ApprovedRequestList;

      forslef.Name = name + "(Myself)";
      forslef.UserId = userid;
      forAddnew.Name = "Add New";

      forAddnew.UserId = "addnew";
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
        responseData.push(forAddnew);

        this.setState({
          ApprovedRequestList: this.removeDuplicate(responseData),
          FamilyMemberList: this.removeDuplicate(responseData),
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false,
          userid: userid
        });
      } else {
        responseData.push(forAddnew);

        this.setState({
          FamilyMemberList: this.removeDuplicate(responseData),
          userid: userid,
          isLoading: false
        });
        // Toast.show(response.data.Msg);
      }
    } catch (error) {
      console.log(error, "//////////");
      Toast.show("Something Went Wrong, Please Try Again Later");
      this.setState({
        isLoading: false
      });
      this.setState({ isLoading: false });
    }
  }

  handleSelectionMultiple = (testid, testname) => {
    this.setState(
      {
        selectedId: testid,
        selectedtName: testname,
        isnew: false
      },
      () => { }
    );
  };
  selectRelation = (index) => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
    let info = this.state.FamilyMemberList[index];
    if (info.Name == "Add New") {
      this.props.navigation.navigate("AddNewFamilyMember", {
        refresh: "",
        from: "medication"
      });
    } else this.setState({ selectedtName: info.Name, selectedId: info.UserId });
  };
  selectFamilymemColor = (index) => {
    this.setState({ isColor: !this.state.isColor });
    let info = this.state.colors[index];

    this.setState({ selectedtcolor: info.color });
  };

  renderItem = ({ item, index }) => {
    // if (item.empty === true) {
    //   return <View style={[styles.item, { backgroundColor: item.color }]} />;
    // }
    return (
      <TouchableOpacity
        // style={{ height: 100 }}
        onPress={() => this.selectFamilymemColor(index)}
      >
        <View
          style={[
            {
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: item.color,
              margin: 10,
              borderWidth: 5,
              borderColor:
                this.state.selectedtcolor == item.color ? "black" : item.color
            }
          ]}
        ></View>
      </TouchableOpacity>
    );
  };
  render() {
    const { StatusBarManager } = NativeModules;
    const STATUSBAR_HEIGHT =
      Platform.OS === "ios" ? 20 : StatusBarManager.HEIGHT;
    ///const { navigate } = this.props.navigation;
    const screenWidth = Math.round(Dimensions.get("window").width);

    return (
      <Container>
        <StatusBarPlaceHolder />
        <Loader loading={this.state.isLoading} />

        <ImageBackground
          source={require("../../icons/medicationHeader.png")}
          style={{ width: screenWidth, height: 220, marginTop: 0 }}
          resizeMode="stretch"
        >
          <View style={{ flex: 1, flexDirection: "column" }}>
            <View
              style={{
                height: 50,
                backgroundColor: "transparent",
                flexDirection: "row",
                marginTop: 1
              }}
            >
              <TouchableOpacity
                style={{ marginLeft: 8, height: 35, width: 35, marginTop: 5 }}
                onPress={this.OpenDrawer}
              >
                <Image
                  source={require("../../icons/back.png")}
                  style={{ marginLeft: 5, height: 28, width: 28 }}
                  resizeMode="cover"
                />
              </TouchableOpacity>

              <Text
                style={{
                  textAlign: "left",
                  fontSize: 22,
                  flex: 1,
                  marginLeft: 25,
                  //height: 30,
                  color: "white",
                  marginTop: 5
                  // justifyContent: "center"
                }}
              >
                Medication
              </Text>
            </View>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "transparent"
              }}
            >
              <Image
                source={require("../../icons/firstdosetme.png")}
                style={{ height: 80, width: 80 }}
                resizeMode="cover"
              />
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: "normal",
                  textAlign: "center",
                  color: "white",
                  marginTop: 10
                }}
              >
                Set Medication Reminder For
              </Text>
            </View>
          </View>
        </ImageBackground>
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

        <Modal isVisible={this.state.isColor}>
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
                Select Color
              </Text>
              <View
                style={{
                  height: 0.5,
                  backgroundColor: "gray",
                  marginRight: 5,
                  marginTop: 8
                }}
              ></View>

              <FlatList
                // data={this.state.colors}
                data={formatData(this.state.colors, numColumns)}
                renderItem={this.renderItem}
                numColumns={numColumns}
              />
              {/* <ScrollView
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
                    flexDirection: "row",
                    width: 100
                  }}
                > */}

              {/* {this.state.colors.map((item, index) => {
                    return (
                      <TouchableOpacity
                        style={{ height: 100 }}
                        onPress={() => this.selectFamilymemColor(index)}
                      >
                        <Text
                          style={{
                            textAlign: "center",
                            margin: 5,
                            backgroundColor: "white",
                            fontSize: 18,
                            color: "gray",
                            backgroundColor: item.Name
                          }}
                        >
                          {item.color}
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
                  })} */}
              {/* </View>
              </ScrollView> */}
              <Button title="Cancel" onPress={this.DismissColorModal} />
            </View>
          </View>
        </Modal>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            backgroundColor: "white"
          }}
        >
          <View style={{ flex: 1, margin: 20 }}>
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
              <Text style={{ fontSize: 18 }}>Select Name</Text>
              <View
                style={{
                  height: 50,
                  backgroundColor: "white",
                  flexDirection: "row",
                  marginTop: 30,
                  marginLeft: 0,
                  marginRight: 0,
                  borderColor: "lightgray",
                  borderWidth: 1,
                  borderRadius: 5
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

            <View
              style={{
                height: 80,
                backgroundColor: "transparent",
                flexDirection: "column",
                marginTop: 50,
                marginLeft: 5,
                marginRight: 5
              }}
            >
              <Text style={{ fontSize: 18 }}>Select Color</Text>
              <View
                style={{
                  height: 50,
                  backgroundColor: "white",
                  flexDirection: "row",
                  marginTop: 30,
                  marginLeft: 0,
                  marginRight: 0,
                  borderColor: "lightgray",
                  borderWidth: 1,
                  borderRadius: 5
                }}
              >
                <Image
                  source={require("../../icons/paint-bucket.png")}
                  style={{
                    height: 30,
                    width: 30,
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
                  <TouchableOpacity onPress={this.toggleColorModal}>
                    {this.state.selectedtcolor != "" ? (
                      // <Text
                      //   style={{
                      //     textAlign: "left",
                      //     marginLeft: 10,
                      //     backgroundColor: "white",
                      //     fontSize: 18,
                      //     color: this.state.selectedtcolor // "gray"
                      //   }}
                      // >
                      //   {this.state.selectedtcolor}
                      // </Text>
                      <View
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 10,
                          backgroundColor: this.state.selectedtcolor,
                          justifyContent: "center",
                          alignContent: "center",
                          marginLeft: 20
                        }}
                      ></View>
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
                        Select Color
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={this.DismissColorModal}>
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
          {/* <View
          style={{
            flex: 1,
            flexDirection: "column",
            backgroundColor: "white"
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "normal",
              textAlign: "center",

              marginTop: 10
            }}
          >
            Select Name
          </Text>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ScrollView
              alwaysBounceVertical={true}
              showsHorizontalScrollIndicator={false}
              style={{
                backgroundColor: "white",
                marginTop: 20,
                paddingHorizontal: 0
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "transparent",
                  marginTop: 15,
                  height: 30,
                  flexDirection: "row",
                  margin: 10
                  // marginLeft: 100
                }}
                onPress={() =>
                  this.handleSelectionMultiple(this.state.userid, "Self")
                }
              >
                <Image
                  source={
                    this.state.selectedId == this.state.userid
                      ? require("../../icons/radio-on.png")
                      : require("../../icons/radio-off.png")
                  }
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: "transparent",
                    marginTop: 5,
                    resizeMode: "contain"
                  }}
                />
                <Text
                  style={{
                    textAlign: "center",
                    margin: 5,
                    backgroundColor: "white",
                    fontSize: 18,
                    color: "gray"
                  }}
                >
                  Self
                </Text>
                <View
                  style={{
                    height: 0.4,
                    // backgroundColor: "gray",
                    marginRight: 25,
                    marginLeft: 25,
                    marginTop: 5
                  }}
                ></View>
              </TouchableOpacity>

              {this.state.FamilyMemberList.map((item, index) => {
                return (
                  <>
                    <TouchableOpacity
                      style={{
                        backgroundColor: "transparent",
                        marginTop: 5,
                        height: 30,
                        flexDirection: "row",
                        margin: 10
                        // marginLeft: 100
                      }}
                      onPress={() =>
                        this.handleSelectionMultiple(item.UserId, item.Name)
                      }
                    >
                      <Image
                        source={
                          this.state.selectedId == item.UserId
                            ? require("../../icons/radio-on.png")
                            : require("../../icons/radio-off.png")
                        }
                        style={{
                          width: 20,
                          height: 20,
                          backgroundColor: "transparent",
                          marginTop: 5,
                          resizeMode: "contain"
                        }}
                      />
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
                          // backgroundColor: "gray",
                          marginRight: 25,
                          marginLeft: 25,
                          marginTop: 5
                        }}
                      ></View>
                    </TouchableOpacity>
                  </>
                );
              })}
              <TouchableOpacity
                style={{
                  backgroundColor: "transparent",
                  marginTop: 5,
                  height: 30,
                  flexDirection: "row",
                  margin: 10
                  // marginLeft: 100
                }}
                onPress={() => {
                  this.setState({
                    isnew: true,
                    selectedId: "",
                    selectedtName: ""
                  });

                  this.props.navigation.navigate("AddNewFamilyMember", {
                    refresh: "",
                    from: "medication"
                  });
                }}
              >
                <Image
                  source={
                    this.state.isnew
                      ? require("../../icons/radio-on.png")
                      : require("../../icons/radio-off.png")
                  }
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: "transparent",
                    marginTop: 5,
                    resizeMode: "contain"
                  }}
                />
                <Text
                  style={{
                    textAlign: "center",
                    margin: 5,
                    backgroundColor: "white",
                    fontSize: 18,
                    color: "gray"
                  }}
                >
                  Add New
                </Text>
                <View
                  style={{
                    height: 0.4,
                    // backgroundColor: "gray",
                    marginRight: 25,
                    marginLeft: 25,
                    marginTop: 5
                  }}
                ></View>
              </TouchableOpacity>
            </ScrollView>
          </View>*/}
          <View
            style={{
              height: 60,
              marginBottom: 0,
              backgroundColor: "white",
              flexDirection: "row-reverse",
              justifyContent: "space-between"
            }}
          >
            <TouchableOpacity
              style={{
                height: 60,
                marginBottom: 0,
                backgroundColor: "white",
                flexDirection: "row-reverse"
              }}
              onPress={() => this.saveData()}
              underlayColor="#fff"
            >
              <Image
                style={{
                  resizeMode: "contain",
                  height: 25,
                  width: 25,
                  marginRight: 20
                }}
                source={require("../../icons/next.png")}
              />
              <Text style={styles.loginText}> Next </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                height: 60,
                marginBottom: 0,
                backgroundColor: "white",
                flexDirection: "row-reverse"
              }}
              //style={styles.loginScreenButton}
              onPress={() => this.props.navigation.goBack()}
              underlayColor="#fff"
            >
              <Text style={styles.loginText}> Back </Text>

              <Image
                style={{
                  resizeMode: "contain",
                  height: 25,
                  width: 25,
                  marginLeft: 20
                }}
                source={require("../../icons/prev.png")}
              />
            </TouchableOpacity>
          </View>
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
  scrollView: {
    flex: 1,
    backgroundColor: "pink",
    marginHorizontal: 20
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
  },
  loginText: {
    color: "#2e62ae",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10
  },
  item: {
    // backgroundColor: "#4D243D",
    // alignItems: "flex-start",
    // justifyContent: "flex-start",

    margin: 1,
    width: 60,
    height: 60,
    borderRadius: 30
  },
  itemInvisible: {
    backgroundColor: "transparent"
  },
  itemText: {
    color: "#fff"
  }
});
