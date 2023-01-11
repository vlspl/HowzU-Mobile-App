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

import CustomeHeader from "../../appComponents/CustomeHeader";
import HydSteps from "../../appComponents/HydSteps";
import AsyncStorage from "@react-native-community/async-storage";
export default class HydGenderScreen extends Component {
  constructor(props) {
    super(props);
    //setting default state
    this.state = {
      selectedItemIndex: 1,
      activebtn: "Female",
    };
  }

  componentDidMount = () => {
    this.clearOldData();
  };

  clearOldData = async () => {
    await AsyncStorage.removeItem("Hydration");
  };
  UNSAFE_componentWillReceiveProps = (nextProp) => {
    this.clearOldData();
  };

  componentWillUnmount = () => {
    // this.backHandler.remove();
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
    var items = {};
    try {
      items["gender"] = this.state.activebtn;
      await AsyncStorage.setItem("Hydration", JSON.stringify(items));
      this.props.navigation.navigate("WeightHydScreen", { refresh: true });
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
          title="Hydration Reminder"
          headerId={1}
          navigation={this.props.navigation}
        />
        <HydSteps number={1} btn={this.state.activebtn} />
        <View style={{ flex: 1, backgroundColor: "white" }}>
          <View style={{ flex: 1, flexDirection: "column" }}>
            <Text style={styles.mainheader}> Your Gender</Text>

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
                style={{
                  flex: 0.5,
                  backgroundColor: "white",
                  padding: 20,
                  flexDirection: "column",
                }}
              >
                <TouchableOpacity
                  onPress={() => this.setState({ activebtn: "Male" })}
                >
                  <Image
                    style={{
                      resizeMode: "contain",
                      height: "100%",
                      width: "100%",
                    }}
                    source={
                      this.state.activebtn == "Male"
                        ? require("../../../icons/hyd-male.png")
                        : require("../../../icons/male-not-active.png")
                    }
                  // source={require("../../../icons/boy-in-circle.png")}
                  />

                  <Text
                    style={{
                      color:
                        this.state.activebtn == "Male" ? "#2e62ae" : "#1d303f",
                      marginLeft: 50,
                      marginTop: -40,
                      fontSize: 20,
                      fontWeight:
                        this.state.activebtn == "Male" ? "bold" : "normal",
                    }}
                  >
                    Male
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  width: 1,
                  marginTop: 20,
                  marginBottom: 20,
                }}
              ></View>
              <View
                style={{
                  flex: 0.5,
                  backgroundColor: "white",
                  padding: 20,
                  flexDirection: "column",
                }}
              >
                <TouchableOpacity
                  onPress={() => this.setState({ activebtn: "Female" })}
                >
                  <Image
                    style={{
                      resizeMode: "contain",
                      height: "100%",
                      width: "100%",
                    }}
                    source={
                      this.state.activebtn == "Female"
                        ? require("../../../icons/hyd-female.png")
                        : require("../../../icons/female-not-active.png")
                    }
                  // source={require("../../../icons/girl-in-circle.png")}
                  />
                  <Text
                    style={{
                      color:
                        this.state.activebtn == "Female"
                          ? "#2e62ae"
                          : "#1d303f",
                      marginLeft: 50,
                      marginTop: -40,
                      fontSize: 20,
                      marginRight: 20,
                      fontWeight:
                        this.state.activebtn == "Female" ? "bold" : "normal",
                    }}
                  >
                    Female
                  </Text>
                </TouchableOpacity>
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
                source={require("../../../icons/next.png")}
              />
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
