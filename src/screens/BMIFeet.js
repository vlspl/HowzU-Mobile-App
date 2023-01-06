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

import DynamicallySelectedPicker from "react-native-dynamically-selected-picker";
import Toast from "react-native-tiny-toast";

import { Container } from "native-base";

import CustomeHeader from "../appComponents/CustomeHeader";
import axios from "axios";
import Constants from "../utils/Constants";
import AsyncStorage from "@react-native-community/async-storage";

//var result;
var heightfeet = [
  { label: "3.0" },
  { label: "3.1" },
  { label: "3.2" },
  { label: "3.3" },
  { label: "3.4" },
  { label: "3.5" },
  { label: "3.6" },
  { label: "3.7" },
  { label: "3.8" },
  { label: "3.9" },
  { label: "3.10" },
  { label: "3.11" },
  { label: "4.0" },
  { label: "4.1" },
  { label: "4.2" },
  { label: "4.3" },
  { label: "4.4" },
  { label: "4.5" },
  { label: "4.6" },
  { label: "4.7" },
  { label: "4.8" },
  { label: "4.9" },
  { label: "4.10" },
  { label: "4.11" },
  { label: "5.0" },
  { label: "5.1" },
  { label: "5.2" },
  { label: "5.3" },
  { label: "5.4" },
  { label: "5.5" },
  { label: "5.6" },
  { label: "5.7" },
  { label: "5.8" },
  { label: "5.9" },
  { label: "5.10" },
  { label: "5.11" },
  { label: "6.0" },
  { label: "6.1" },
  { label: "6.2" },
  { label: "6.3" },
  { label: "6.4" },
  { label: "6.5" },
  { label: "6.6" },
  { label: "6.7" },
  { label: "6.8" },
  { label: "6.9" },
  { label: "6.10" },
  { label: "6.11" },
  { label: "7.0" },
];
var heightcm = [
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

  { label: "191" },
  { label: "192" },
  { label: "193" },
  { label: "194" },
  { label: "195" },
  { label: "196" },
  { label: "197" },
  { label: "198" },
  { label: "199" },
  { label: "200" },
  { label: "201" },
  { label: "202" },
  { label: "203" },
  { label: "204" },
  { label: "205" },
  { label: "206" },
  { label: "207" },
  { label: "208" },
  { label: "209" },
  { label: "210" },

  { label: "211" },
  { label: "212" },
  { label: "213" },
  { label: "214" },
  { label: "215" },
  { label: "216" },
  { label: "217" },
  { label: "218" },
  { label: "219" },
  { label: "220" },
  { label: "221" },
  { label: "222" },
  { label: "223" },
  { label: "224" },
  { label: "225" },
  { label: "226" },
  { label: "227" },
  { label: "228" },
  { label: "229" },
  { label: "230" },

  { label: "231" },
  { label: "232" },
  { label: "233" },
  { label: "234" },
  { label: "235" },
  { label: "236" },
  { label: "237" },
  { label: "238" },
  { label: "239" },
  { label: "240" },
  { label: "241" },
  { label: "242" },
  { label: "243" },
  { label: "244" },
  { label: "245" },
  { label: "246" },
  { label: "247" },
  { label: "248" },
  { label: "249" },

  { label: "259" },

  { label: "251" },
  { label: "252" },
  { label: "253" },
  { label: "254" },
  { label: "255" },
  { label: "256" },
  { label: "257" },
  { label: "258" },
  { label: "259" },
  { label: "260" },
  { label: "261" },
  { label: "262" },
  { label: "263" },
  { label: "264" },
  { label: "265" },
  { label: "266" },
  { label: "267" },
  { label: "268" },
  { label: "269" },
];

function getIndex(label, arr) {
  return arr.findIndex((obj) => obj.label === label);
}
export default class BMIFeet extends Component {
  constructor(props) {
    super(props);
    //setting default state
    this.state = {
      selectedItemIndex: 0,
      activebtn: "cm",
      height: "",
      weight: "",
      bmi: "",
      BmiResult: "",
      resultofbmi: "Healthy",
      bmigender: "",
      bmiweight: "",
      bmiheight: "",
      selectedIndex: 0,
    };

    // console.log("constructort==============================");
  }

  componentDidMount = () => {
    //this.checkUserSignedIn();
    // console.log("BMIfeet--------componant did mount");
    this.fetchData();
    // this.backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.hardwarebBackAction
    // );
  };

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // console.log(
    //   " BMIfeet componentWillReceiveProps==============================",
    //   nextProp
    // );
    //this.setState({selectedtestId: nextProp.route.params.testids });
    this.fetchData();
  };

  fetchData = async () => {
    try {
      const value = await AsyncStorage.getItem(Constants.BMIDETAIL_KEY);
      ///console.log(JSON.parse(value));

      if (value !== null) {
        // We have data!!
        // console.log(JSON.parse(value));
        const bmiDetail = JSON.parse(value);

        // console.log(bmiDetail.gender);
        if (bmiDetail.heightUnit == "cm") {
          // console.log(getIndex(bmiDetail.height, heightcm));
          this.setState({
            selectedIndex: getIndex(bmiDetail.height, heightcm),
            selectedItemIndex: Number(bmiDetail.height),
            activebtn: "cm",
            bmigender: bmiDetail.gender,
          });
        } else {
          // console.log(getIndex(bmiDetail.height, heightfeet));
          this.setState({
            selectedIndex: getIndex(bmiDetail.height, heightfeet),
            selectedItemIndex: Number(bmiDetail.height),
            activebtn: "feet",
            bmigender: bmiDetail.gender,
          });
        }
        this.updateSelectedItem(Number(bmiDetail.height));
      }
    } catch (error) {
      // Toast.show("Something Went Wrong, Please Try Again Later");
      // Error retrieving data
    }
  };

  updateSelectedItem(index) {
    this.setState({ selectedItemIndex: index });
  }

  saveData = async () => {
    var items = {};
    if (this.state.bmiheight == "") {
      Toast.show("Please select Height");
    } else {
      try {
        items["heightUnit"] = this.state.activebtn;
        items["height"] = this.state.bmiheight;

        //await AsyncStorage.setItem(Constants.BMIDETAIL_KEY,JSON.stringify(item))
        await AsyncStorage.mergeItem(
          Constants.BMIDETAIL_KEY,
          JSON.stringify(items)
        );
        console.log(
          "this.state.feet ////????==================",
          this.state.bmiheight
        );
        this.props.navigation.navigate("BMIResult", { refresh: "refresh" });
      } catch (e) {
        Toast.show("Something Went Wrong, Please Try Again Later");

        //alert('Failed to save the data to the storage')
      }
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

  //handling onPress action
  getListViewItem = (item) => {
    Alert.alert(item.key, item.title);
  };

  // handleClick () {
  //    //this.calculate(this.state.selectedItemIndex, this.props.route.params.value)
  //    this.saveData()

  // }

  onpressnext = () => {
    this.saveData();
  };

  hardwarebBackAction = () => {
    this.props.navigation.goBack();
    return true;
  };
  componentWillUnmount = () => {
    // this.backHandler.remove();
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
            <Text style={styles.mainheader}> Please Select Your Height</Text>
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
                {this.state.activebtn == "feet" ? (
                  <TouchableOpacity
                    style={{
                      height: 40,
                      width: "50%",
                      backgroundColor: "#1d303f",
                      borderRadius: 20,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => this.setState({ activebtn: "feet" })}
                  >
                    <Text style={{ color: "white" }}>FEET</Text>
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
                    onPress={() => this.setState({ activebtn: "feet" })}
                  >
                    <Text style={{ color: "#1d303f" }}>FEET</Text>
                  </TouchableOpacity>
                )}
                {this.state.activebtn == "cm" ? (
                  <TouchableOpacity
                    style={{
                      height: 40,
                      width: "50%",
                      backgroundColor: "#1d303f",
                      borderRadius: 20,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => this.setState({ activebtn: "cm" })}
                  >
                    <Text style={{ color: "white" }}>CM</Text>
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
                    onPress={() => this.setState({ activebtn: "cm" })}
                  >
                    <Text style={{ color: "#1d303f" }}>CM</Text>
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
                {this.state.bmigender == "male" ? (
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
              {this.state.activebtn == "feet" ? (
                <View
                  style={{
                    flex: 0.5,
                    backgroundColor: "white",
                    padding: 20,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      color: "black",
                      textAlign: "center",
                      backgroundColor: "white",
                      padding: 10,
                    }}
                  >
                    Height(Feet)
                  </Text>
                  <DynamicallySelectedPicker
                    items={heightfeet}
                    onScroll={({ index, item }) => {
                      this.updateSelectedItem(item.label);
                      //  console.log('feet', JSON.stringify(item.label));
                      this.setState({ bmiheight: item.label });
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
                    padding: 20,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      color: "black",
                      textAlign: "center",
                      backgroundColor: "white",
                      padding: 10,
                    }}
                  >
                    Height(Cm)
                  </Text>
                  <DynamicallySelectedPicker
                    items={heightcm}
                    onScroll={({ index, item }) => {
                      this.updateSelectedItem(item.label);
                      // console.log('cm', JSON.stringify(item.label));
                      this.setState({ bmiheight: item.label });
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
                onPress={() => this.props.navigation.navigate("BMIWeight")}
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
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 20,
  },
  submitButton: {
    backgroundColor: "#ff6666",
    padding: 10,
    margin: 15,
    height: 40,
  },
  submitButtonText: {
    textAlign: "center",
    color: "white",
    // fontWeight:"bold",
    fontSize: 18,
  },
});
