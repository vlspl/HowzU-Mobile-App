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
import HydSteps from "../../appComponents/HydSteps";
import CustomeHeader from "../../appComponents/CustomeHeader";

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

function getIndex(label, arr) {
  return arr.findIndex((obj) => obj.label === label);
}

export default class WeightHydScreen extends Component {
  constructor(props) {
    super(props);
    //setting default state
    this.state = {
      selectedItemIndex: 0,
      selectedIndex: 0,
      activebtnn: "KG",
      selectedValue: 70,
      selectedgender: "Female",
      bmiweight: "",
    };
  }

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
    this.getData();
  };
  hardwarebBackAction = () => {
    this.props.navigation.goBack();
    return true;
  };
  componentWillUnmount = () => {
    // this.backHandler.remove();
  };

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    this.getData();
  };

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem("Hydration");
      if (value !== null) {
        const bmiDetail = JSON.parse(value);
        this.setState({
          selectedIndex: getIndex(bmiDetail.weight, wightkg),
          selectedItemIndex: Number(bmiDetail.weight),
          activebtnn: "KG",
          selectedgender: bmiDetail.gender,
        });
      }

      this.updateSelectedItem(Number(bmiDetail.weight));
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
        await AsyncStorage.mergeItem("Hydration", JSON.stringify(items));

        this.props.navigation.navigate("WakeUpHydScreen", {
          refresh: "refresh",
          gender: this.state.selectedgender,
        });
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
          title="Hydration Reminder"
          headerId={1}
          navigation={this.props.navigation}
        />
        <HydSteps number={2} btn={this.state.bmiweight} />
        <View style={{ flex: 1, backgroundColor: "white" }}>
          <View style={{ flex: 1, flexDirection: "column" }}>
            <Text style={styles.mainheader}>Your Weight</Text>

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
                    height: "110%",
                    width: "100%",
                  }}
                  source={
                    this.state.selectedgender == "female" ||
                      this.state.selectedgender == "Female"
                      ? require("../../../icons/Your-Weight-female.png")
                      : require("../../../icons/Your-Weight-male.png")
                  }
                // source={require("../../../icons/Your-Weight-female.png")}
                />
              </View>
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

                    this.setState({
                      bmiweight: item.label,
                      selectedIndex: index,
                    });
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
                  source={require("../../../icons/next.png")}
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
                onPress={() =>
                  this.props.navigation.navigate("HydGenderScreen")
                }
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
                  source={require("../../../icons/prev.png")}
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
