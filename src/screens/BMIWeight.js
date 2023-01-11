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
import Toast from "react-native-tiny-toast";

import DynamicallySelectedPicker from "react-native-dynamically-selected-picker";

import { Container, Form } from "native-base";

import CustomeHeader from "../appComponents/CustomeHeader";
import Constants from "../utils/Constants";
import AsyncStorage from "@react-native-community/async-storage";

var wightkg = [
  //

  { label: "1" },
  { label: "2" },
  { label: "3" },
  { label: "4" },
  { label: "5" },
  { label: "6" },
  { label: "7" },
  { label: "8" },
  { label: "9" },
  { label: "10" },
  { label: "11" },
  { label: "12" },
  { label: "13" },
  { label: "14" },
  { label: "15" },
  { label: "16" },
  { label: "17" },
  { label: "18" },
  { label: "19" },
  { label: "20" },
  { label: "21" },
  { label: "22" },
  { label: "23" },
  { label: "24" },
  { label: "25" },
  { label: "26" },
  { label: "27" },
  { label: "28" },
  { label: "29" },
  { label: "30" },
  { label: "31" },
  { label: "32" },
  { label: "33" },
  { label: "34" },
  { label: "35" },
  { label: "36" },
  { label: "37" },
  { label: "38" },
  { label: "39" },
  { label: "40" },
  { label: "41" },
  { label: "42" },
  { label: "43" },
  { label: "44" },
  { label: "45" },
  { label: "46" },
  { label: "47" },
  { label: "48" },
  { label: "49" },
  { label: "50" },
  { label: "51" },
  { label: "52" },
  { label: "53" },
  { label: "54" },
  { label: "55" },
  { label: "56" },
  { label: "57" },
  { label: "58" },
  { label: "59" },
  { label: "60" },
  { label: "61" },
  { label: "62" },
  { label: "63" },
  { label: "64" },
  { label: "65" },
  { label: "66" },
  { label: "67" },
  { label: "68" },
  { label: "69" },
  { label: "70" },
  { label: "71" },
  { label: "72" },
  { label: "73" },
  { label: "74" },
  { label: "75" },
  { label: "76" },
  { label: "77" },
  { label: "78" },
  { label: "79" },
  { label: "80" },
  { label: "81" },
  { label: "82" },
  { label: "83" },
  { label: "84" },
  { label: "85" },
  { label: "86" },
  { label: "87" },
  { label: "88" },
  { label: "89" },
  { label: "90" },
  { label: "91" },
  { label: "92" },
  { label: "93" },
  { label: "94" },
  { label: "95" },
  { label: "96" },
  { label: "97" },
  { label: "98" },
  { label: "99" },
  { label: "100" },
  { label: "101" },
  { label: "102" },
  { label: "103" },
  { label: "104" },
  { label: "105" },
  { label: "106" },
  { label: "107" },
  { label: "108" },
  { label: "109" },
  { label: "110" },
  { label: "111" },
  { label: "112" },
  { label: "113" },
  { label: "114" },
  { label: "115" },
  { label: "116" },
  { label: "117" },
  { label: "118" },
  { label: "119" },
  { label: "120" },
];
var wightpound = [
  { label: "1" },
  { label: "2" },
  { label: "3" },
  { label: "4" },
  { label: "5" },
  { label: "6" },
  { label: "7" },
  { label: "8" },
  { label: "9" },
  { label: "10" },
  { label: "11" },
  { label: "12" },
  { label: "13" },
  { label: "14" },
  { label: "15" },
  { label: "16" },
  { label: "17" },
  { label: "18" },
  { label: "19" },
  { label: "20" },
  { label: "21" },
  { label: "22" },
  { label: "23" },
  { label: "24" },
  { label: "25" },
  { label: "26" },
  { label: "27" },
  { label: "28" },
  { label: "29" },
  { label: "30" },
  { label: "31" },
  { label: "32" },
  { label: "33" },
  { label: "34" },
  { label: "35" },
  { label: "36" },
  { label: "37" },
  { label: "38" },
  { label: "39" },
  { label: "40" },
  { label: "41" },
  { label: "42" },
  { label: "43" },
  { label: "44" },
  { label: "45" },
  { label: "46" },
  { label: "47" },
  { label: "48" },
  { label: "49" },
  { label: "50" },
  { label: "51" },
  { label: "52" },
  { label: "53" },
  { label: "54" },
  { label: "55" },
  { label: "56" },
  { label: "57" },
  { label: "58" },
  { label: "59" },
  { label: "60" },
  { label: "61" },
  { label: "62" },
  { label: "63" },
  { label: "64" },
  { label: "65" },
  { label: "66" },
  { label: "67" },
  { label: "68" },
  { label: "69" },
  { label: "70" },
  { label: "71" },
  { label: "72" },
  { label: "73" },
  { label: "74" },
  { label: "75" },
  { label: "76" },
  { label: "77" },
  { label: "78" },
  { label: "79" },
  { label: "80" },
  { label: "81" },
  { label: "82" },
  { label: "83" },
  { label: "84" },
  { label: "85" },
  { label: "86" },
  { label: "87" },
  { label: "88" },
  { label: "89" },
  { label: "90" },
  { label: "91" },
  { label: "92" },
  { label: "93" },
  { label: "94" },
  { label: "95" },
  { label: "96" },
  { label: "97" },
  { label: "98" },
  { label: "99" },
  { label: "100" },
  { label: "101" },
  { label: "102" },
  { label: "103" },
  { label: "104" },
  { label: "105" },
  { label: "106" },
  { label: "107" },
  { label: "108" },
  { label: "109" },
  { label: "110" },
  { label: "111" },
  { label: "112" },
  { label: "113" },
  { label: "114" },
  { label: "115" },
  { label: "116" },
  { label: "117" },
  { label: "118" },
  { label: "119" },
  { label: "120" },
  { label: "121" },
  { label: "122" },
  { label: "123" },
  { label: "124" },
  { label: "125" },
  { label: "126" },
  { label: "127" },
  { label: "128" },
  { label: "129" },
  { label: "130" },
  { label: "131" },
  { label: "132" },
  { label: "133" },
  { label: "134" },
  { label: "135" },
  { label: "136" },
  { label: "137" },
  { label: "138" },
  { label: "139" },
  { label: "140" },
  { label: "141" },
  { label: "141" },
  { label: "143" },
  { label: "144" },
  { label: "145" },
  { label: "146" },
  { label: "147" },
  { label: "148" },
  { label: "149" },
  { label: "150" },
  { label: "151" },
  { label: "152" },
  { label: "153" },
  { label: "154" },
  { label: "155" },
  { label: "156" },
  { label: "157" },
  { label: "158" },
  { label: "159" },
  { label: "160" },
  { label: "161" },
  { label: "162" },
  { label: "163" },
  { label: "164" },
  { label: "165" },
  { label: "167" },
  { label: "168" },
  { label: "169" },
  { label: "170" },
  { label: "171" },
  { label: "172" },
  { label: "173" },
  { label: "174" },
  { label: "175" },
  { label: "176" },
  { label: "177" },
  { label: "178" },
  { label: "179" },
  { label: "180" },
];

function getIndex(label, arr) {
  return arr.findIndex((obj) => obj.label === label);
}

export default class BMIWeight extends Component {
  constructor(props) {
    super(props);
    //setting default state
    this.state = {
      selectedItemIndex: 0,
      selectedIndex: 0,
      activebtnn: "KG",
      selectedValue: 70,
      selectedgender: "",
      bmiweight: "",
    };
  }

  updateSelectedItem(index) {
    // console.log(
    //   'updateSelectedItem index ==============================',
    //   index
    // );

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
          marginRight: 15,
        }}
      />
    );
  };

  //handling onPress action
  getListViewItem = (item) => {
    Alert.alert(item.key, item.title);
  };

  componentDidMount = async () => {
    // console.log(" BMIWeight componentDidMount==============================");
    this.getData();
    // this.backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.hardwarebBackAction
    // );
  };
  hardwarebBackAction = () => {
    this.props.navigation.goBack();
    return true;
  };
  componentWillUnmount = () => {
    // this.backHandler.remove();
  };

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // console.log(
    //   " BMIWeight componentWillReceiveProps==============================",
    //   nextProp
    // );
    //this.setState({selectedtestId: nextProp.route.params.testids });
    this.getData();
  };

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem(Constants.BMIDETAIL_KEY);
      if (value !== null) {
        // We have data!!
        // console.log(JSON.parse(value));
        const bmiDetail = JSON.parse(value);
        /// this.state.selectedgender = bmiDetail.gender
        if (bmiDetail.weightUnit == "POUND") {
          //  console.log('index=========',getIndex(bmiDetail.weight,wightkg));
          //  this.setState({
          //    selectedIndex: getIndex(bmiDetail.weight,wightkg),
          //    selectedItemIndex: Number(bmiDetail.weight),
          //    activebtnn:'KG',
          //    selectedgender:bmiDetail.gender,
          //  });

          // console.log("index=========", getIndex(bmiDetail.weight, wightpound));
          this.setState({
            selectedIndex: getIndex(bmiDetail.weight, wightpound),

            selectedItemIndex: Number(bmiDetail.weight),
            activebtnn: "POUND",
            selectedgender: bmiDetail.gender,
          });
        } else {
          // console.log('index=========',getIndex(bmiDetail.weight,wightpound));
          // this.setState({
          //   selectedIndex: getIndex(bmiDetail.weight,wightpound),

          //   selectedItemIndex:Number(bmiDetail.weight),
          //   activebtnn:'POUND',
          //   selectedgender:bmiDetail.gender,
          // });

          // console.log("index=========", getIndex(bmiDetail.weight, wightkg));
          this.setState({
            selectedIndex: getIndex(bmiDetail.weight, wightkg),
            selectedItemIndex: Number(bmiDetail.weight),
            activebtnn: "KG",
            selectedgender: bmiDetail.gender,
          });
        }

        this.updateSelectedItem(Number(bmiDetail.weight));

        ///console.log(bmiDetail.gender);
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  saveData = async () => {
    var items = {};
    if (this.state.bmiweight == "") {
      Toast.show("Please select Weight");
    } else {
      try {
        items["weightUnit"] = this.state.activebtnn;
        items["weight"] = this.state.bmiweight;

        //await AsyncStorage.setItem(Constants.BMIDETAIL_KEY,JSON.stringify(item))
        await AsyncStorage.mergeItem(
          Constants.BMIDETAIL_KEY,
          JSON.stringify(items)
        );
        this.props.navigation.navigate("BMIFeet", { refresh: "refresh" });
      } catch (e) {
        //alert('Failed to save the data to the storage')
      }
    }
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
            <Text style={styles.mainheader}> Please Select Your Weight</Text>
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
                {this.state.activebtnn == "KG" ? (
                  <TouchableOpacity
                    style={{
                      height: 40,
                      width: "50%",
                      backgroundColor: "#1d303f",
                      borderRadius: 20,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => this.setState({ activebtnn: "KG" })}
                  >
                    <Text style={{ color: "white" }}>KG</Text>
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
                    onPress={() => this.setState({ activebtnn: "KG" })}
                  >
                    <Text style={{ color: "#1d303f" }}>KG</Text>
                  </TouchableOpacity>
                )}
                {this.state.activebtnn == "POUND" ? (
                  <TouchableOpacity
                    style={{
                      height: 40,
                      width: "50%",
                      backgroundColor: "#1d303f",
                      borderRadius: 20,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => this.setState({ activebtn: "POUND" })}
                  >
                    <Text style={{ color: "white" }}>POUNDS</Text>
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
                    onPress={() => this.setState({ activebtnn: "POUND" })}
                  >
                    <Text style={{ color: "#1d303f" }}>POUNDS</Text>
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
                {this.state.selectedgender == "male" ? (
                  <Image
                    style={{
                      resizeMode: "contain",
                      height: "100%",
                      width: "100%",
                    }}
                    source={require("../../icons/men.png")}
                  />
                ) : (
                  <Image
                    style={{
                      resizeMode: "contain",
                      height: "100%",
                      width: "100%",
                    }}
                    source={require("../../icons/female_bmi.png")}
                  />
                )}
              </View>
              {this.state.activebtnn == "KG" ? (
                <View
                  style={{
                    flex: 0.5,
                    backgroundColor: "white",
                    padding: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 19,
                      color: "black",
                      textAlign: "center",
                      backgroundColor: "white",
                      padding: 10,
                    }}
                  >
                    Weight(Kg)
                  </Text>
                  <DynamicallySelectedPicker
                    items={wightkg}
                    onScroll={({ index, item }) => {
                      this.updateSelectedItem(item.label);

                      this.setState({ bmiweight: item.label });
                    }}
                    selectedItemBorderColor={"lightgray"}
                    allItemsColor={"#2761B3"}
                    fontSize={33}
                    transparentItemRows={2}
                    initialSelectedIndex={this.state.selectedIndex}
                    height={180}
                    width={windowWidth}
                  />
                </View>
              ) : (
                <View
                  style={{
                    flex: 0.5,
                    backgroundColor: "white",
                    padding: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 19,
                      color: "black",
                      textAlign: "center",
                      backgroundColor: "white",
                      padding: 10,
                    }}
                  >
                    Weight(Pound)
                  </Text>
                  <DynamicallySelectedPicker
                    items={wightpound}
                    onScroll={({ index, item }) => {
                      this.updateSelectedItem(item.label);
                      this.setState({ bmiweight: item.label });
                    }}
                    selectedItemBorderColor={"lightgray"}
                    allItemsColor={"#2761B3"}
                    fontSize={33}
                    transparentItemRows={2}
                    initialSelectedIndex={this.state.selectedIndex}
                    height={180}
                    width={windowWidth}
                  />
                </View>
              )}
            </View>

            <View
              style={{
                height: 60,
                marginBottom: 0,
                backgroundColor: "white",
                flexDirection: "row-reverse",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                style={{
                  height: 60,
                  marginBottom: 0,
                  backgroundColor: "white",
                  flexDirection: "row-reverse",
                }}
                //style={styles.loginScreenButton}
                onPress={() => this.saveData()}
                underlayColor="#fff"
              >
                <Text style={styles.loginText}> Next </Text>

                <Image
                  style={{
                    resizeMode: "contain",
                    height: 25,
                    width: 25,
                  }}
                  source={require("../../icons/next.png")}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  height: 60,
                  marginBottom: 0,
                  backgroundColor: "white",
                  flexDirection: "row-reverse",
                }}
                //style={styles.loginScreenButton}
                onPress={() => this.props.navigation.navigate("BMIGender")}
                underlayColor="#fff"
              >
                <Text style={styles.loginText}> Back </Text>

                <Image
                  style={{
                    resizeMode: "contain",
                    height: 25,
                    width: 25,
                    marginLeft: 20,
                  }}
                  source={require("../../icons/prev.png")}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
    ///fontWeight: 'bold',
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
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 20,
  },
});
