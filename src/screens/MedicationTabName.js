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
  TouchableWithoutFeedback
} from "react-native";
import { Container, Header } from "native-base";
import AsyncStorage from "@react-native-community/async-storage";
import Constants from "../utils/Constants";
import Toast from "react-native-tiny-toast";
const screenWidth = Math.round(Dimensions.get("window").width);
const { StatusBarManager } = NativeModules;
import axios from "axios";
import TestListRow from "../appComponents/TestListRow";
import { Thumbnail, List, ListItem, Separator } from "native-base";

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

export default class MedicationTabName extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activebtn: "doctor",
      userrole: "",
      isloading: false,
      tabName: "",
      isErr: false,
      AllTabList: [],
      typingTimeout: 0,
      isLoadingSecond: false,
      typing: true,
      pageNo: 1,
      searchLoading: false,
      refreshing: false,
      forwhome: "",
      selectedtcolor: ""
    };
  }

  retrieveData() {
    AsyncStorage.getItem(Constants.USER_ROLE).then((value) => {
      let valuelowrcase = value.toLowerCase();
      this.setState({
        userrole: valuelowrcase,
        activebtn: valuelowrcase == "doctor" ? "doctor" : "patient",
        isloading: true
      });
      //  this.setState({activebtn:valuelowrcase == 'doctor'?'doctor':'patient'})
      //   this.setState({
      //     isloading: true
      //   });
    });
  }

  OpenDrawer = () => {
    this.props.navigation.goBack();
  };

  hardwarebBackAction = () => {
    this.props.navigation.goBack();
    return true;
  };
  componentWillUnmount = () => {
    // this.backHandler.remove();
  };
  UNSAFE_componentWillReceiveProps = (nextProp) => {
    console.log(
      " MedTakeFor componentWillReceiveProps==============================",
      nextProp
    );
    this.setState(
      {
        forwhome: nextProp.route.params.forWhome,
        selectedtcolor: nextProp.route.params.color
      },
      () => { }
    );
  };

  componentDidMount = async () => {
    console.log(
      " MedTakeFor componentWillReceiveProps==============================",
      this.props.route.params
    );
    this.setState(
      {
        forwhome: this.props.route.params.forWhome,
        selectedtcolor: this.props.route.params.color
      },
      () => { }
    );
  };

  AddMedication = (item) => {
    //Alert.alert(item.key,item.title);
    this.props.navigation.navigate("MedicationCalendrHome");
  };

  saveData = async () => {
    if (this.state.tabName == "") {
      Toast.show("Please enter tablet name");
    } else {
      try {
        this.props.navigation.navigate("MedicatnTakeFor", {
          forwhome: this.state.forwhome,
          tabName: this.state.tabName,
          color: this.state.selectedtcolor
        });
      } catch (e) {
        //alert('Failed to save the data to the storage')
      }
    }
  };

  getTabNames = async () => {
    try {
      //https://dailymed.nlm.nih.gov/dailymed/services/v2/drugnames?page=1&pagesize=100
      let response = await axios.get(
        `https://dailymed.nlm.nih.gov/dailymed/services/v2/drugnames?drug_name=${this.state.tabName}`
      );

      let data = response.data.data.filter((itm) => {
        return itm.drug_name == this.state.tabName;
      });
      // console.log(response.data.data, "tabs///////");
      this.setState({ isLoading: false });
      this.setState({ isModalVisible: true });
      if (response.data.data.length > 0) {
        let responseData = this.state.AllTabList;
        this.setState({ isModalVisible: true });
        response.data.data.map((item) => {
          // console.log("@@#@#@#", item);
          responseData.push(item);
        });

        this.setState({
          AllTabList: responseData,
          isLoading: false,

          searchLoading: false,
          refreshing: false
        });
      } else {
        // Toast.show(response.data.Msg);
        this.setState({
          isLoading: false,

          searchLoading: false,
          refreshing: false
        });
      }
    } catch (errors) {
      console.log(errors, "errp");
      this.setState({
        isLoading: false,
        paginationLoading: false,
        searchLoading: false,
        searchLoading: false,
        refreshing: false,
        isModalVisible: false
      });
    }
  };

  DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  );

  onTextChanged(text) {
    if (text == "") {
      this.setState({ tabName: text, isErr: false });
    }

    if (!isNaN(text)) {
      this.setState({ isErr: true });
    } else {
      this.setState({ isLoadingSecond: true });
      if (this.state.typingTimeout) {
        clearTimeout(this.state.typingTimeout);
      }

      this.setState({
        tabName: text,
        typing: false,
        isErr: false,
        typingTimeout: setTimeout(() => {
          this.setState(
            {
              AllTabList: [],
              pageNo: 1,
              searchLoading: true,
              refreshing: true
            },
            () => {
              this.getTabNames();
            }
          );
        }, 1000)
      });
      // this.setState({ tabName: text, isErr: false });
      // this.onChangeTextClick(text);
    }
  }
  render() {
    const { StatusBarManager } = NativeModules;
    const STATUSBAR_HEIGHT =
      Platform.OS === "ios" ? 20 : StatusBarManager.HEIGHT;
    // console.log("statusheight===", this.state.AllTabList);

    ///const { navigate } = this.props.navigation;
    const screenWidth = Math.round(Dimensions.get("window").width);

    return (
      <Container>
        <StatusBarPlaceHolder />

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
                  // justifyContent: "center",
                  // alignSelf: "center"
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
                source={require("../../icons/medicine.png")}
                // source={require("../../icons/capsuleredyellow.png")}
                // source={require("../../icons/all-pages-icon.png")}
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
                Enter Tablet Name
              </Text>
            </View>
          </View>
        </ImageBackground>

        <View
          style={{
            flex: 1,
            flexDirection: "column",
            backgroundColor: "white"
          }}
        >
          <this.DismissKeyboard>
            <View style={{ flex: 1, flexDirection: "column" }}>
              <TextInput
                style={{
                  textAlign: "center",
                  paddingLeft: 15,
                  fontSize: 18,
                  backgroundColor: "white",
                  marginTop: 28
                }}
                value={this.state.tabName}
                underlineColorAndroid="transparent"
                placeholder="Enter tablet name"
                onChangeText={(text) => this.onTextChanged(text)}
                // onChangeText={(val) => this.onChangeTextClick(val)}
                allowFontScaling={false}
              />
              <View
                style={{
                  height: 0.5,
                  backgroundColor: "gray",
                  marginLeft: 15,
                  marginRight: 15,
                  marginTop: 15
                }}
              ></View>
              {this.state.isErr && (
                <Text
                  style={{
                    textAlign: "center",
                    paddingLeft: 15,
                    fontSize: 12,
                    backgroundColor: "white",
                    marginTop: 45,
                    color: "red"
                  }}
                >
                  Please enter character{" "}
                </Text>
              )}
              <ScrollView
                alwaysBounceVertical={true}
                showsHorizontalScrollIndicator={false}
                style={{
                  backgroundColor: "white",
                  marginTop: 0,
                  paddingHorizontal: 0
                }}
              >
                {this.state.AllTabList.map((item, index) => {
                  return (
                    <ListItem
                      key={index}
                      onPress={() => this.setState({ tabName: item.drug_name })}
                    >
                      <Text>{item.drug_name}</Text>
                    </ListItem>
                  );
                })}
              </ScrollView>
            </View>
          </this.DismissKeyboard>

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
  }
});
