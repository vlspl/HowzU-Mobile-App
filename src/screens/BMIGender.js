import React, { Component } from "react";

import {
  FlatList,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Alert,
  Image,
  TouchableOpacity,
  BackHandler,
} from "react-native";

import { Container, Form } from "native-base";

import CustomeHeader from "../appComponents/CustomeHeader";
import Constants from "../utils/Constants";
import AsyncStorage from "@react-native-community/async-storage";
import HydSteps from "../appComponents/HydSteps";
export default class BMIGender extends Component {
  constructor(props) {
    super(props);
    //setting default state
    this.state = {
      selectedItemIndex: 1,
      activebtn: "male",
    };
  }

  componentDidMount = () => {
    this.fetchData();
    // this.backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.hardwarebBackAction
    // );

    // console.log('call BMIGender componentDidMount==============');
  };

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // console.log(
    //   ' BMIGender componentWillReceiveProps==============================',
    //   nextProp
    // );
    //this.setState({selectedtestId: nextProp.route.params.testids });
    this.fetchData();
  };
  // hardwarebBackAction = () => {
  //   this.props.navigation.goBack();
  //   return true;
  // };
  componentWillUnmount = () => {
    // this.backHandler.remove();
  };

  fetchData = async () => {
    // console.log('call fetch data ==============');

    try {
      const value = await AsyncStorage.getItem(Constants.BMIDETAIL_KEY);
      if (value !== null) {
        // We have data!!
        // console.log(JSON.parse(value));
        const bmiDetail = JSON.parse(value);
        /// this.state.selectedgender = bmiDetail.gender
        this.props.navigation.navigate("BMIWeight", { refresh: "refresh" });
      } else {
      }
    } catch (error) {
      // Toast.show("Something Went Wrong, Please Try Again Later");
      // Error retrieving data
    }
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 0.5,
          //width: "92%",
          backgroundColor: "gray",
          marginLeft: 15,
          marginRight: 15,
        }}
      />
    );
  };

  saveData = async () => {
    /// alert(response.data.Status);
    //this.setState({ activebtn: gender })
    var items = {};
    try {
      items["gender"] = this.state.activebtn;
      await AsyncStorage.setItem(
        Constants.BMIDETAIL_KEY,
        JSON.stringify(items)
      );
      // console.log("BMI SAVe GENDER==================", JSON.stringify(items));
      this.props.navigation.navigate("BMIWeight", { refresh: "refresh" });
    } catch (e) {
      // console.log(e);
      //alert('Failed to save the data to the storage')
    }
  };

  onpressnext = () => {
    // console.log("onpressnext call----");

    this.saveData();
  };

  //handling onPress action
  getListViewItem = (item) => {
    Alert.alert(item.key, item.title);
  };

  render() {
    const { navigate } = this.props.navigation;

    const windowWidth = 100;

    return (
      <Container>
        <CustomeHeader
          title="BMI Calculator"
          headerId={1}
          navigation={this.props.navigation}
        />

        <View style={{ flex: 1, backgroundColor: "white" }}>
          <View style={{ flex: 1, flexDirection: "column" }}>
            <Text style={styles.mainheader}> Please Select Your Gender</Text>
            <View
              style={{
                height: 40,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <View
                style={{
                  height: 40,
                  width: "70%",
                  backgroundColor: "#f4f4f4",
                  flexDirection: "row",
                  alignItems: "center",
                  borderRadius: 20,
                  borderWidth: 0.5,
                  marginTop: 0,
                }}
              >
                {this.state.activebtn == "male" ? (
                  <TouchableOpacity
                    style={{
                      height: 40,
                      width: "50%",
                      backgroundColor: "#1d303f",
                      borderRadius: 20,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => this.setState({ activebtn: "male" })}
                  >
                    <Text style={{ color: "white" }}>MALE</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#f4f4f4",
                      height: "100%",
                      width: "50%",
                      borderRadius: 50,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => this.setState({ activebtn: "male" })}
                  >
                    <Text style={{ color: "#1d303f" }}>MALE</Text>
                  </TouchableOpacity>
                )}
                {this.state.activebtn == "female" ? (
                  <TouchableOpacity
                    style={{
                      height: 40,
                      width: "50%",
                      backgroundColor: "#1d303f",
                      borderRadius: 20,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => this.setState({ activebtn: "female" })}
                  >
                    <Text style={{ color: "white" }}>FEMALE</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#f4f4f4",
                      height: "100%",
                      width: "50%",
                      borderRadius: 50,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    //onPress={() => navigate('BMIWeight')}
                    onPress={() => this.setState({ activebtn: "female" })}
                  >
                    <Text style={{ color: "#1d303f" }}>FEMALE</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                backgroundColor: "white",
                marginTop: 40,
                marginBottom: 40,
              }}
            >
              <View
                style={{ flex: 0.5, backgroundColor: "white", padding: 20 }}
              >
                <Image
                  style={{
                    resizeMode: "contain",
                    height: "100%",
                    width: "100%",
                  }}
                  source={require("../../icons/men.png")}
                />
              </View>
              <View
                style={{
                  backgroundColor: "gray",
                  width: 1,
                  marginTop: 20,
                  marginBottom: 20,
                }}
              ></View>
              <View
                style={{ flex: 0.5, backgroundColor: "white", padding: 20 }}
              >
                <Image
                  style={{
                    resizeMode: "contain",
                    height: "100%",
                    width: "100%",
                  }}
                  source={require("../../icons/female_bmi.png")}
                />
              </View>
            </View>

            <TouchableOpacity
              style={{
                height: 60,
                marginBottom: 0,
                backgroundColor: "white",
                flexDirection: "row-reverse",
              }}
              //style={styles.loginScreenButton}
              onPress={this.onpressnext}
              underlayColor="#fff"
            >
              <Text style={styles.loginText}> Next </Text>

              <Image
                style={{
                  resizeMode: "contain",
                  height: 25,
                  width: 25,
                  //marginleft:20,
                }}
                source={require("../../icons/next.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* <View style={{marginTop: 50}}>
  <Text>Selected item index {this.state.selectedItemIndex}</Text>
</View> */}
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  containermain: {
    flex: 1,
    marginTop: 0,
    backgroundColor: "white",
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
    backgroundColor: "white",
    //elevation: 2,
  },
  title: {
    fontSize: 16,
    color: "#000",
    flexDirection: "column",
    backgroundColor: "white",
    fontWeight: "bold",
    marginBottom: 10,
  },
  mainheader: {
    //flex:1,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    fontSize: 20,
    //fontWeight: 'bold',
    color: "#000",
    marginTop: 15,
  },
  header: {
    //flex:1,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    fontSize: 100,
    fontWeight: "bold",
    color: "#32CD32",
    marginTop: 40,
    marginRight: 20,
  },
  header1: {
    //flex:1,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#32CD32",
  },
  header2: {
    //flex:1,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginTop: 30,
  },
  header3: {
    //flex:1,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    fontSize: 30,
    color: "#32CD32",
  },
  header4: {
    //flex:1,
    alignItems: "flex-start",
    alignSelf: "center",
    justifyContent: "flex-start",
    fontSize: 35,
    marginTop: 15,
    fontWeight: "bold",
    color: "#000",
  },
  imageWrapper: {
    height: 330,
    width: 330,
    overflow: "hidden",
    marginTop: 25,
  },
  theImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  loginScreenButton: {
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#2e62ae",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
  },
  loginText: {
    color: "#2e62ae",
    textAlign: "right",
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 20,
    //padding:20
  },
});
