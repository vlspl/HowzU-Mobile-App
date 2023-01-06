import React, { Component } from "react";

import {
  FlatList,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Alert,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  BackHandler,
  Platform
} from "react-native";

import Constants from "../utils/Constants";
import Loader from "../appComponents/loader";

import { Container } from "native-base";

import CustomeHeader from "../appComponents/CustomeHeader";
import Toast from "react-native-tiny-toast";
import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";

export default class BMIResult extends Component {
  constructor() {
    super();
    this.state = {
      selectedItemIndex: 1,
      activebtn: "Feet",
      bmi: "",
      bmigender: "",
      bmiweight: "",
      bmiheight: "",
      BmiResult: "",
      isLoading: false
    };
  }

  calculate = (height, weight) => {
    console.log(height, weight, "@@@@");
    //calculation
    // var result =
    //   (parseFloat(weight) * 10000) / (parseFloat(height) * parseFloat(height));
    // result = parseFloat(result.toFixed(2));
    var result =
      (parseFloat(weight) / (parseFloat(height) * parseFloat(height))) * 10000;
    result = parseFloat(result.toFixed(2));
    // console.log("Result @@@==============", result.toString());

    //display result
    //this.setState({ bmi: result })
    if (result < 18.5) {
      //this.setState({ BmiResult:'Underweight'});
      this.setState(
        {
          BmiResult: "Underweight",
          bmi: result
        },
        () => {
          // this.Updatebmicall();
        }
      );
    } else if (result >= 18.5 && result < 25) {
      // this.setState({BmiResult:'Normal weight'});
      this.setState(
        {
          BmiResult: "Normal weight",
          bmi: result
        },
        () => {
          // this.Updatebmicall();
        }
      );
    } else if (result >= 25 && result < 30) {
      // this.setState({BmiResult:'Overweight'});
      this.setState(
        {
          BmiResult: "Overweight",
          bmi: result
        },
        () => {
          // this.Updatebmicall();
        }
      );
    } else if (result >= 30) {
      // this.setState({BmiResult:'Obese'});

      this.setState(
        {
          BmiResult: "Obese",
          bmi: result
        },
        () => {
          // this.Updatebmicall();
        }
      );
    } else {
      //alert('Incorrect Input!');
      //this.setState({BmiResult:''})
      this.setState(
        {
          BmiResult: "",
          bmi: result
        },
        () => {
          this.Updatebmicall();
        }
      );
    }
  };

  componentDidMount = () => {
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.hardwarebBackAction
    );
    this.fetchData();

    //  console.log("call BMI RESULT componentDidMount==============");
  };

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    this.fetchData();
  };

  hardwarebBackAction = () => {
    this.props.navigation.navigate("PatientDashboard", {
      refresh: "refresh"
    });
    return true;
  };
  componentWillUnmount = () => {
    this.backHandler.remove();
  };
  saveData = async () => {
    this.Updatebmicall();
  };
  fetchData = async () => {
    try {
      const value = await AsyncStorage.getItem(Constants.BMIDETAIL_KEY);
      if (value !== null) {
        const bmiDetail = JSON.parse(value);
        if (bmiDetail.heightUnit == "feet" && bmiDetail.weightUnit == "POUND") {
          let height = bmiDetail.height.split(".");
          let heightinm =
            height[0] * (30.48).toFixed(2) + height[1] * (2.54).toFixed(2);
          //working after making hte changes
          this.setState(
            {
              // bmiheight: (bmiDetail.height * 30.48).toFixed(2),
              // bmiheight:
              //   height[0] * (30.48).toFixed(2) + height[1] * (2.54).toFixed(2),
              bmiheight: heightinm,
              bmiweight: (bmiDetail.weight / 2.205).toFixed(2)
              // bmiweight: (bmiDetail.weight * 0.45).toFixed(2),
            },
            () => {
              this.calculate(this.state.bmiheight, this.state.bmiweight);
            }
          );
        } else if (
          bmiDetail.heightUnit == "cm" &&
          bmiDetail.weightUnit == "POUND"
        ) {
          this.setState(
            {
              bmiheight: bmiDetail.height,
              bmiweight: (bmiDetail.weight / 2.205).toFixed(2)
              // bmiweight: bmiDetail.weight * 0.45,
            },
            () => {
              this.calculate(this.state.bmiheight, this.state.bmiweight);
            }
          );
        } else if (
          bmiDetail.heightUnit == "feet" &&
          bmiDetail.weightUnit == "KG"
        ) {
          //working after making hte chnages
          let height = bmiDetail.height.split(".");
          // console.log(height, "///after spliting");

          this.setState(
            {
              // bmiheight: (bmiDetail.height * 30.48).toFixed(0),
              bmiheight:
                height[0] * (30.48).toFixed(2) + height[1] * (2.54).toFixed(2),
              bmiweight: bmiDetail.weight
            },
            () => {
              this.calculate(this.state.bmiheight, this.state.bmiweight);
            }
          );
        } else if (
          bmiDetail.heightUnit == "cm" &&
          bmiDetail.weightUnit == "KG"
        ) {
          // working fine no need to change
          this.setState(
            {
              bmiheight: bmiDetail.height,
              bmiweight: bmiDetail.weight
            },
            () => {
              this.calculate(this.state.bmiheight, this.state.bmiweight);
            }
          );
        }
        // this.setState({ bmiweight:value.weight})
        // this.setState({ bmiweight:value.height})
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  Updatebmicall = async () => {
    console.log("==========bmiresult", this.state.BmiResult);
    console.log("===========bmiheight", this.state.bmiheight);
    console.log("===========bmiweight", this.state.bmiweight);
    console.log("===========BmiResult", this.state.BmiResult);
    console.log("===========bmi", this.state.bmi);

    console.log(this.state.BmiResult);
    this.setState({ isLoading: true });

    try {
      let response = await axios.post(Constants.ADD_BMIRESULT, {
        Height: this.state.bmiheight,
        Weight: this.state.bmiweight,
        Result: this.state.BmiResult,
        BMIValue: this.state.bmi
      });
      console.log("data==============", response.data);
      this.setState({ isLoading: false });
      if (response.data.Status) {
        // this.state.AllMyPatients = [...this.state.AllMyPatients,...response.data.DoctorList];
        Toast.show(response.data.Msg);
        this.props.navigation.navigate("PatientDashboard", {
          refresh: "refresh"
        });
      } else {
        Toast.show(response.data.Msg);
      }
    } catch (errors) {
      ///Toast.show(errors)
      Toast.show("Something Went Wrong, Please Try Again Later");

      console.log(errors);
    }
  };

  updateSelectedItem(index) {
    this.setState({ selectedItemIndex: index });
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 0.5,
          //width: "92%",
          backgroundColor: "gray",
          marginLeft: 15,
          marginRight: 15
        }}
      />
    );
  };

  //handling onPress action
  getListViewItem = (item) => {
    Alert.alert(item.key, item.title);
  };

  backbtnPress = () => {
    this.props.navigation.navigate("PatientDashboard", {
      refresh: "refresh"
    });
  };
  render() {
    const windowWidth = 100;
    const { navigate } = this.props.navigation;
    const screenWidth = Math.round(Dimensions.get("window").width);
    // console.log("screenWidth====", screenWidth);
    return (
      <Container>
        <CustomeHeader
          title="BMI Result"
          headerId={2}
          onPressback={this.backbtnPress}
          navigation={this.props.navigation}
        />
        <Loader loading={this.state.isLoading} />

        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white"
          }}
        >
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text style={styles.header4}>Your BMI</Text>
            <ImageBackground
              style={{
                height: screenWidth - 35,
                width: screenWidth - 35,
                marginTop: 20,
                resizeMode: "contain",
                margin: 10
              }}
              source={require("../../icons/result.png")}
            >
              <Text style={styles.header}>{this.state.bmi}</Text>
              <Text style={styles.header1}>{this.state.bmi + "kg/m2"}</Text>

              <View
                style={{
                  // flexDirection: 'column',
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: screenWidth >= 365 && screenWidth < 400 ? 15 : 5
                }}
              >
                <Text style={styles.header2}> Weight</Text>
              </View>
              {this.state.BmiResult == "Normal weight" ? (
                <Text
                  style={{
                    alignItems: "center",
                    alignSelf: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    color: "#32CD32",
                    marginTop: 5
                    // marginTop: screenWidth >= 365 ? 15 : 5,
                  }}
                >
                  {this.state.BmiResult}
                </Text>
              ) : null}
              {this.state.BmiResult == "Underweight" ? (
                <Text
                  style={{
                    alignItems: "center",
                    alignSelf: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    color: "orange",
                    marginTop: screenWidth >= 411 ? 0 : 5
                    // marginTop: screenWidth >= 365 ? 15 : 5,
                  }}
                >
                  {this.state.BmiResult}
                </Text>
              ) : null}
              {this.state.BmiResult == "Overweight" ? (
                <Text
                  style={{
                    alignItems: "center",
                    alignSelf: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    color: "orange",
                    marginTop: screenWidth >= 411 ? 0 : 5
                    // marginTop: 5,
                    // marginTop: screenWidth >= 365 ? 15 : 5,
                  }}
                >
                  {this.state.BmiResult}
                </Text>
              ) : null}
              {this.state.BmiResult == "Obese" ? (
                <Text
                  style={{
                    alignItems: "center",
                    alignSelf: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    color: "red",
                    marginTop: screenWidth >= 411 ? 0 : 5
                    // marginTop: 5,
                    //  / marginTop: screenWidth >= 365 ? 15 : 5,
                  }}
                >
                  {this.state.BmiResult}
                </Text>
              ) : null}
            </ImageBackground>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center"
              }}
            ></View>
          </View>
        </View>
        <View
          style={{
            height: 60,
            marginBottom: 0,
            backgroundColor: "white",
            flexDirection: "row-reverse",
            justifyContent: "space-between"
            // marginTop: 20,
          }}
        >
          <TouchableOpacity
            style={{
              height: 60,
              marginBottom: 10,
              backgroundColor: "white",
              flexDirection: "row-reverse",
              marginRight: 10
            }}
            onPress={() => this.saveData()}
            underlayColor="#fff"
          >
            <Text style={[styles.loginText, { marginRight: 20 }]}> Save </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: 60,
              marginBottom: 10,
              backgroundColor: "white",
              flexDirection: "row-reverse",
              marginLeft: 10
            }}
            underlayColor="#fff"
            onPress={() =>
              this.props.navigation.navigate("PatientDashboard", {
                refresh: "refresh"
              })
            }
            // onPress={() => this.props.navigation.goBack(null)}
          >
            <Text style={[styles.loginText, { marginLeft: 20 }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  containermain: {
    flex: 1,
    marginTop: 0,
    backgroundColor: "white"
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
    backgroundColor: "white"
    //elevation: 2,
  },
  title: {
    fontSize: 16,
    color: "#000",
    flexDirection: "column",
    backgroundColor: "white",
    fontWeight: "bold",
    marginBottom: 10
  },
  mainheader: {
    //flex:1,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginTop: 15
  },
  header: {
    //flex:1,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    fontSize: 65,
    fontWeight: "bold",
    color: "#32CD32",
    marginTop: Platform.OS === "ios" ? 70 : 50,
    marginRight: 20
  },
  header1: {
    //flex:1,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#32CD32"
  },
  header2: {
    // flex: 1,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginTop: Dimensions.get("window").width >= 400 ? 90 : 50
  },
  header3: {
    //flex:1,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    fontSize: 22,
    color: "#32CD32",
    marginTop: 8
  },
  header4: {
    //flex:1,
    alignItems: "flex-start",
    alignSelf: "center",
    justifyContent: "flex-start",
    fontSize: 30,
    marginTop: 15,
    fontWeight: "bold",
    color: "#000"
  },
  imageWrapper: {
    height: 330,
    width: 330,
    overflow: "hidden",
    marginTop: 25,
    justifyContent: "center"
  },
  theImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover"
  },
  loginScreenButton: {
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10
  },
  loginText: {
    color: "#2e62ae",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold"
  }
});
