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

var TimeinMin = [
  //
  { label: "00" },
  { label: "01" },
  { label: "02" },
  { label: "03" },
  { label: "04" },
  { label: "05" },
  { label: "06" },
  { label: "07" },
  { label: "08" },
  { label: "09" },
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
];
var TimeinHour = [
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
];
var AMPM = [{ label: "AM" }, { label: "PM" }];
function getIndex(label, arr) {
  return arr.findIndex((obj) => obj.label === label);
}

export default class WakeUpHydScreen extends Component {
  constructor(props) {
    super(props);
    //setting default state
    this.state = {
      selectedItemIndex: 0,
      selectedIndex: 0,
      activebtnn: "KG",
      selectedValue: 70,
      selectedgender: "Female",
      hour: "00",
      second: "00",
      WakeuptimeAMPM: "AM",
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
    this.setState({ selectedgender: this.props.route.params.gender });
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
    this.setState({ selectedgender: nextProp.route.params.gender });

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

      ///console.log(bmiDetail.gender);
    } catch (error) {
      // Error retrieving data
    }
  };

  saveData = async () => {
    console.log(this.state.hour);
    var items = {};
    if (this.state.hour == "00") {
      Toast.show("Please select Time");
    } else {
      try {
        items["wakehour"] = this.state.hour;
        items["wakesecond"] = this.state.second;
        items["wakeAMPM"] = this.state.WakeuptimeAMPM;
        items["wakeuptime"] =
          this.state.hour +
          ":" +
          this.state.second +
          " " +
          this.state.WakeuptimeAMPM;

        //await AsyncStorage.setItem(Constants.BMIDETAIL_KEY,JSON.stringify(item))
        await AsyncStorage.mergeItem("Hydration", JSON.stringify(items));

        this.props.navigation.navigate("BedTimeHydScreen", {
          refresh: "refresh",
          gender: this.state.selectedgender,
        });
      } catch (e) {
        //alert('Failed to save the data to the storage')
      }
    }
  };

  render() {
    console.log(
      this.state.selectedgender,
      "wake up time ",
      this.state.selectedItemIndex
    );
    const { navigate } = this.props.navigation;

    const windowWidth = 100;

    return (
      <Container>
        <CustomeHeader
          title="Hydration Reminder"
          headerId={1}
          navigation={this.props.navigation}
        />
        <HydSteps number={3} btn={this.state.hour + ":" + this.state.second} />

        <View style={{ flex: 1, backgroundColor: "white" }}>
          <View style={{ flex: 1, flexDirection: "column" }}>
            <Text style={styles.mainheader}>Wake-Up Time</Text>

            <View
              style={{
                flex: 1,
                flexDirection: "row",
                // backgroundColor: "white",
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
                    width: "120%",
                  }}
                  source={
                    this.state.selectedgender == "Female"
                      ? require("../../../icons/Wake-up-time-female.png")
                      : require("../../../icons/Wake-up-time-male.png")
                  }
                  // source={require("../../../icons/Wake-up-time-female.png")}
                />
              </View>

              <View
                style={{
                  flex: 0.4,

                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <DynamicallySelectedPicker
                  items={TimeinHour}
                  onScroll={({ index, item }) => {
                    this.updateSelectedItem(item.label);

                    this.setState({ hour: item.label });
                  }}
                  selectedItemBorderColor={"lightgray"}
                  allItemsColor={"#2761B3"}
                  fontSize={21}
                  transparentItemRows={2}
                  initialSelectedIndex={this.state.selectedIndex}
                  height={150}
                  width={50}
                />
                <DynamicallySelectedPicker
                  items={TimeinMin}
                  onScroll={({ index, item }) => {
                    this.updateSelectedItem(item.label);

                    this.setState({ second: item.label });
                  }}
                  selectedItemBorderColor={"lightgray"}
                  allItemsColor={"#2761B3"}
                  fontSize={21}
                  transparentItemRows={2}
                  initialSelectedIndex={this.state.selectedIndex}
                  height={150}
                  width={50}
                />
                <DynamicallySelectedPicker
                  items={AMPM}
                  onScroll={({ index, item }) => {
                    this.updateSelectedItem(item.label);

                    this.setState({
                      WakeuptimeAMPM: item.label,
                      selectedIndex: index,
                    });
                  }}
                  selectedItemBorderColor={"lightgray"}
                  allItemsColor={"#2761B3"}
                  fontSize={18}
                  transparentItemRows={2}
                  initialSelectedIndex={this.state.selectedIndex}
                  height={150}
                  width={50}
                />
              </View>
            </View>

            <View
              style={{
                height: 60,
                marginBottom: 0,
                // backgroundColor: "white",
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
                onPress={() => this.props.navigation.goBack()}
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
