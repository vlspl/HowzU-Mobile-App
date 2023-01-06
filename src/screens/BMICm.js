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
} from "react-native";

import DynamicallySelectedPicker from "react-native-dynamically-selected-picker";

import { Container } from "native-base";

import CustomeHeader from "../appComponents/CustomeHeader";
import axios from "axios";
import Constants from "../utils/Constants";

var result;
export default class BMICm extends Component {
  state = {
    selectedItemIndex: 121.92,
    activebtn: "Cm",
    height: "",
    weight: "",
    bmi: "",
    BmiResult: "",
    resultofbmi: "Healthy",
  };

  constructor(props) {
    super(props);
    const user_weight = this.props.route.params.value;

    // console.log("=======", user_weight);
  }
  updateSelectedItem(index) {
    this.setState({ selectedItemIndex: index });
  }
  handleHeight = (text) => {
    this.setState({ height: text });
  };
  handleWeight = (text) => {
    this.setState({ weight: this.props.route.params.value });

    // console.log("=====weightResultt==", this.props.route.params.value);
  };
  calculate = (height, weight) => {
    //calculation
    result =
      (parseFloat(this.props.route.params.value) * 10000) /
      (parseFloat(this.state.selectedItemIndex) *
        parseFloat(this.state.selectedItemIndex));
    result = result.toFixed(2);

    // console.log("====result==", result);
    //display result
    this.setState({ bmi: result });
    if (result < 18.5) {
      this.setState({ BmiResult: "Underweight" });
    } else if (result >= 18.5 && result < 25) {
      this.setState({ BmiResult: "Normal weight" });
    } else if (result >= 25 && result < 30) {
      this.setState({ BmiResult: "Overweight" });
    } else if (result >= 30) {
      this.setState({ BmiResult: "Obese" });
    } else {
      alert("Incorrect Input!");
      this.setState({ BmiResult: "" });
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

  handleClick() {
    this.calculate(this.state.selectedItemIndex, this.props.route.params.value);
    this.props.navigation.navigate("BMIResult", { value: result });
    //this.sendBMIResult();
  }

  render() {
    const windowWidth = 100;
    const { navigate } = this.props.navigation;

    return (
      <Container>
        <CustomeHeader
          title="BMI Calculator"
          headerId={1}
          navigation={this.props.navigation}
        />

        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
          }}
        >
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={styles.mainheader}> Please Select Your Height</Text>
            {/* <Text style={styles.mainheader}>User Name: {this.props.route.params.value}</Text> */}
            <View
              style={{
                height: 40,
                width: 200,
                backgroundColor: "white",
                flexDirection: "row",
                alignItems: "center",
                borderRadius: 20,
                borderWidth: 1,
                marginTop: 15,
              }}
            >
              {this.state.activebtn == "CM" ? (
                <TouchableOpacity
                  style={{
                    height: 40,
                    width: "50%",
                    backgroundColor: "#1d303f",
                    borderRadius: 20,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => this.setState({ activebtn: "CM" })}
                >
                  <Text style={{ color: "white" }}>CM</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    backgroundColor: "white",
                    height: "100%",
                    width: "50%",
                    borderRadius: 50,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => this.setState({ activebtn: "CM" })}
                >
                  <Text>CM</Text>
                </TouchableOpacity>
              )}
              {this.state.activebtn == "Feet" ? (
                <TouchableOpacity
                  style={{
                    height: 40,
                    width: "50%",
                    backgroundColor: "#1d303f",
                    borderRadius: 20,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => this.setState({ activebtn: "Feet" })}
                >
                  <Text style={{ color: "white" }}>Feet</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    backgroundColor: "white",
                    height: "100%",
                    width: "50%",
                    borderRadius: 50,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => navigate("BMIPound")}
                >
                  <Text>Feet</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              backgroundColor: "white",
              marginTop: 20,
            }}
          >
            <Image
              style={{
                resizeMode: "center",
                height: 400,
                width: 130,
              }}
              source={require("../../icons/men.png")}
            />
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 100,
              }}
            >
              <Text style={styles.title}> Height(feet) </Text>
              <DynamicallySelectedPicker
                items={[
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
                  { label: "7.0" },
                  { label: "7.1" },
                  { label: "7.2" },
                  { label: "7.3" },
                  { label: "7.4" },
                  { label: "7.5" },
                  { label: "7.6" },
                  { label: "7.7" },
                  { label: "7.8" },
                  { label: "7.9" },
                  { label: "8.0" },
                  { label: "END" },
                ]}
                onScroll={({ index, item }) => {
                  this.updateSelectedItem(item.label * 30.48);
                  // console.log('kg', JSON.stringify(item.label * 30.48));

                  this.calculate(
                    this.state.selectedItemIndex,
                    this.props.route.params.value
                  );
                }}
                selectedItemBorderColor={"#FAFAFA"}
                allItemsColor={"#2761B3"}
                fontSize={30}
                transparentItemRows={2}
                initialSelectedIndex={10}
                height={180}
                width={windowWidth}
              />
            </View>
          </View>

          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "flex-end",
              flexDirection: "row",
              marginRight: 10,
            }}
          >
            <Image
              style={{
                resizeMode: "center",
                height: 15,
                width: 15,
              }}
              source={require("../../icons/next.png")}
            />

            <TouchableOpacity
              //style={styles.loginScreenButton}
              onPress={() => this.handleClick()}
              underlayColor="#fff"
            >
              <Text style={styles.loginText}> Next </Text>
            </TouchableOpacity>
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
    fontSize: 22,
    fontWeight: "bold",
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
