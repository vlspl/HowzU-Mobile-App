import React from "react";

import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  RefreshControl
} from "react-native";
import Constants from "../utils/Constants";

import axios from "axios";
import moment from "moment";
const Rijndael = require("rijndael-js");
import Loader from "./loader";
global.Buffer = global.Buffer || require("buffer").Buffer;
import Toast from "react-native-tiny-toast";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

export default class TechDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reportstatus: [],
      patientcount: [],
      pendingcount: "",
      onhold: "",
      complete: "",
      patientno: "",
      suggestedno: "",
      sharedno: "",
      sharedreportlist: [],
      suggestedtestlist: [],
      orgid: 0,
      userSettingDetails: [],
      userDetails: [],
      org_nm: ""
    };
  }

  componentDidMount = () => {
    this.setState({ isLoading: true, userDetails: [] }, () => {
      this.GetDashboardAPicall();
      this.getProfileDetail();
    });
  };

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    this.setState({ isLoading: true, userDetails: [] }, () => {
      this.GetDashboardAPicall();
      this.getProfileDetail();
    });
  };

  Decrypt = (encryptStr) => {
    const cipher = new Rijndael("1234567890abcder", "cbc");
    const plaintext = Buffer.from(
      cipher.decrypt(new Buffer(encryptStr, "base64"), 128, "1234567890abcder")
    );

    return plaintext.toString();
  };
  async getProfileDetail() {
    try {
      const response = await axios.get(Constants.GET_USERPROFILE);
      this.setState({ isLoading: false });
      let name = "";
      if (response.data.Status) {
        let responseData = [];
        let seetingitms = [];
        let tmp = {};
        // console.log(responseData, '@ getting profile pic  ResponaseData');
        response.data.MyDetails.map((item) => {
          responseData.push(item);
          name = item.Org_Name;
          seetingitms.push(tmp);
        });
        this.setState(
          {
            userSettingDetails: seetingitms,
            userDetails: responseData,
            org_nm: name,
            isLoading: false
          },
          () => { }
        );
      } else {
        // console.log(response.data.Msg, "else ");
        // Toast.show(response.data.Msg);
      }
    } catch (error) {
      // Toast.show("Network Error,Please check youre internet connection");
      Toast.show("Something Went Wrong, Please Try Again Later");

      this.setState({ isLoading: false });
      // console.log(error);
    }
    // console.log("../../wesle smfnffm..././././././.", this.state.activebtn);
  }
  async GetDashboardAPicall() {
    try {
      const response = await axios.get(Constants.GET_TECH_DASH_COUNT);
      this.setState({ isLoading: false });

      if (response.data.Status) {
        let responseData = [];

        this.setState(
          {
            onhold: response.data.RegisterUserCount,
            complete: response.data.TestDoneCount,
            isLoading: false
          },
          () => { }
        );
      } else {
        // console.log(response.data.Msg, "else ");
        Toast.show(response.data.Msg);
      }
    } catch (error) {
      // Toast.show("Network Error,Please check youre internet connection");
      Toast.show("Something Went Wrong, Please Try Again Later");

      this.setState({ isLoading: false });
      // console.log(error);
    }
  }
  onRefresh = async () => {
    this.setState({ refreshing: true, pageNo: 1, AllMyPatients: [] }, () => {
      this.GetDashboardAPicall();
    });
  };

  render() {
    const screenWidth = Math.round(Dimensions.get("window").width);
    return (
      <View style={styles.MainContainer}>
        <Loader loading={this.state.isLoading} />

        <Image
          source={require("../../icons/staff.png")}
          style={{
            height: "30%",
            margin: 10,
            width: "100%",
            resizeMode: "center"
          }}
        ></Image>
        <ScrollView
          alwaysBounceVertical={true}
          showsHorizontalScrollIndicator={false}
          style={{ backgroundColor: "white", marginTop: 0 }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >
          {this.state.userDetails.map((itm) => {
            return (
              <Text
                style={{
                  alignSelf: "center",
                  fontSize: 26,
                  // paddingTop: 5,
                  fontWeight: "bold",
                  color: "#550552"
                }}
              >
                {itm.Org_Name}
              </Text>
            );
          })}

          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("Techregistered");
            }}
          >
            <View style={styles.MyhealthcardView}>
              <Text
                style={{
                  alignSelf: "center",
                  fontSize: 30,
                  paddingTop: 0,
                  color: "white",
                  fontWeight: "bold"
                }}
              >
                {this.state.onhold}
              </Text>
              <Text
                style={{
                  alignSelf: "center",
                  fontSize: 20,
                  // paddingTop: 5,
                  fontWeight: "bold",
                  color: "white",
                  marginBottom: 1
                }}
              >
                User Registered
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("Techreport");
            }}
          >
            <View style={styles.MyhealthcardView}>
              <Text
                style={{
                  alignSelf: "center",
                  fontSize: 30,
                  paddingTop: 0,
                  color: "white",
                  fontWeight: "bold"
                }}
              >
                {this.state.complete}
              </Text>
              <Text
                style={{
                  alignSelf: "center",
                  fontSize: 20,
                  // paddingTop: 5,
                  fontWeight: "bold",
                  color: "white",
                  marginBottom: 1
                }}
              >
                Test Done
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.MyhealthcardView,
              {
                backgroundColor: "#1B2B34",
                marginTop: verticalScale(15),
                borderRadius: 10,
                height: verticalScale(50),
                width: 320,

                justifyContent: "center",
                shadowOffset: { width: 2, height: 3 },
                shadowColor: "gray",
                shadowOpacity: 0.9,
                elevation: 5,
                margin: 6
              }
            ]}
            onPress={() =>
              this.props.navigation.navigate("Scanner", {
                orgid: this.state.orgid
              })
            }
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
              {"Scan QR Code  " + ""}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  MyhealthcardView: {
    // flex: 1,
    // flexDirection: "row",
    padding: 6,
    margin: 8,
    backgroundColor: "#3062ae",
    width: 320,
    height: 80,
    borderWidth: 1,
    borderColor: "lightgray",
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "lightgray",
    shadowOpacity: 0.8,
    borderRadius: 5,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20
  },
  MainContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    // paddingTop: 0,
    backgroundColor: "white"
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
