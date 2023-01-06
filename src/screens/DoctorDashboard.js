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
  BackHandler
} from "react-native";
import { Container } from "native-base";

//import LifeDisorderCard from '../appComponents/LifeDisorderCard';
//import MyHealthCard from '../appComponents/MyHealthCard';
import PatientstatusCard from "../appComponents/PatientstatusCard";

import DocDashTabs from "../appComponents/DocDashTabs";
import DocDashSuggestTest from "../appComponents/DocDashSuggestTest";
import DocDashSharedReport from "../appComponents/DocDashSharedReport";
import CustomFooter from "../appComponents/CustomFooter";

export default class DoctorDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  OpenDrawer = () => {
    this.props.navigation.openDrawer();
  };

  componentDidMount() {
    // this.backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.hardwarebBackAction
    // );
  }
  hardwarebBackAction = () => {
    this.props.navigation.goBack();
    return true;
  };
  componentWillUnmount = () => {
    // this.backHandler.remove();
  };
  render() {
    const screenWidth = Math.round(Dimensions.get("window").width);

    return (
      <Container>
        <View style={styles.MainContainer}>
          <ImageBackground
            source={require("../../icons/home-bg.png")}
            style={{ width: screenWidth, height: 200 }}
            resizeMode="stretch"
          >
            <View
              style={{
                height: 90,
                backgroundColor: "transparent",
                flexDirection: "row"
              }}
            >
              <TouchableOpacity
                style={{ marginLeft: 8, height: 50, width: 50 }}
                onPress={this.OpenDrawer}
              >
                <Image
                  source={require("../../icons/menu.png")}
                  style={{
                    marginLeft: 5,
                    height: 32,
                    width: 32,
                    marginTop: 45
                  }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
              <Image
                source={require("../../icons/logo-icon.png")}
                style={{ marginLeft: 25, height: 40, width: 40, marginTop: 40 }}
              />
              <Text
                style={{
                  textAlign: "center",
                  backgroundColor: "transparent",
                  fontSize: 22,
                  width: 80,
                  marginTop: 45,
                  marginLeft: 10,
                  height: 30,
                  color: "white"
                }}
              >
                Home
              </Text>
            </View>
          </ImageBackground>

          <ScrollView
            alwaysBounceVertical={true}
            showsHorizontalScrollIndicator={false}
            style={{ backgroundColor: "white", marginTop: 0 }}
          >
            <View
              style={{
                flex: 3,
                flexDirection: "row",
                backgroundColor: "white",
                marginLeft: 5,
                marginRight: 0,
                padding: 0,
                height: screenWidth / 3,
                width: screenWidth - 10
              }}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: "white",
                  width: screenWidth / 3,
                  height: screenWidth / 3,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    height: screenWidth / 3 - 20,
                    width: screenWidth / 3 - 20,
                    backgroundColor: "white",
                    borderWidth: 1,
                    borderColor: "lightgray",
                    shadowOffset: { width: 2, height: 2 },
                    shadowColor: "lightgray",
                    shadowOpacity: 0.9,
                    borderRadius: 10,
                    margin: 10,
                    elevation: 5
                  }}
                >
                  <TouchableOpacity style={{ flex: 1 }}>
                    <View
                      style={{
                        flex: 0.95,
                        backgroundColor: "white",
                        justifyContent: "center",
                        borderTopRightRadius: 10,
                        borderTopLeftRadius: 10
                      }}
                    >
                      <Text
                        style={{
                          backgroundColor: "white",
                          alignSelf: "center",
                          fontSize: 40,
                          color: "#ffc200"
                        }}
                      >
                        11
                      </Text>
                      <Text
                        style={{
                          backgroundColor: "white",
                          alignSelf: "center",
                          fontSize: 14,
                          paddingTop: 5
                        }}
                      >
                        Pending
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 0.05,
                        backgroundColor: "#ffc200",
                        borderBottomLeftRadius: 10,
                        borderBottomRightRadius: 10,
                        marginBottom: 0
                      }}
                    ></View>
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: "white",
                  width: screenWidth / 3,
                  height: screenWidth / 3,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    height: screenWidth / 3 - 20,
                    width: screenWidth / 3 - 20,
                    backgroundColor: "white",
                    borderWidth: 1,
                    borderColor: "lightgray",
                    shadowOffset: { width: 2, height: 2 },
                    shadowColor: "lightgray",
                    shadowOpacity: 0.9,
                    borderRadius: 10,
                    margin: 10,
                    elevation: 5
                  }}
                >
                  <TouchableOpacity style={{ flex: 1 }}>
                    <View
                      style={{
                        flex: 0.95,
                        backgroundColor: "white",
                        justifyContent: "center",
                        borderTopRightRadius: 10,
                        borderTopLeftRadius: 10
                      }}
                    >
                      <Text
                        style={{
                          backgroundColor: "white",
                          alignSelf: "center",
                          fontSize: 40,
                          color: "#ce0000"
                        }}
                      >
                        04
                      </Text>
                      <Text
                        style={{
                          backgroundColor: "white",
                          alignSelf: "center",
                          fontSize: 14,
                          paddingTop: 5
                        }}
                      >
                        On Hold
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 0.05,
                        backgroundColor: "#ce0000",
                        borderBottomLeftRadius: 10,
                        borderBottomRightRadius: 10,
                        marginBottom: 0
                      }}
                    ></View>
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  flex: 1,
                  backgroundColor: "white",
                  width: screenWidth / 3,
                  height: screenWidth / 3,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    height: screenWidth / 3 - 20,
                    width: screenWidth / 3 - 20,
                    backgroundColor: "white",
                    borderWidth: 1,
                    borderColor: "lightgray",
                    shadowOffset: { width: 2, height: 2 },
                    shadowColor: "lightgray",
                    shadowOpacity: 0.9,
                    borderRadius: 10,
                    margin: 10,
                    elevation: 5
                  }}
                >
                  <TouchableOpacity style={{ flex: 1 }}>
                    <View
                      style={{
                        flex: 0.95,
                        backgroundColor: "white",
                        justifyContent: "center",
                        borderTopRightRadius: 10,
                        borderTopLeftRadius: 10
                      }}
                    >
                      <Text
                        style={{
                          backgroundColor: "white",
                          alignSelf: "center",
                          fontSize: 40,
                          color: "#00dd15"
                        }}
                      >
                        06
                      </Text>
                      <Text
                        style={{
                          backgroundColor: "white",
                          alignSelf: "center",
                          fontSize: 14,
                          paddingTop: 5
                        }}
                      >
                        Complete
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 0.05,
                        backgroundColor: "#00dd15",
                        borderBottomLeftRadius: 10,
                        borderBottomRightRadius: 10,
                        marginBottom: 0
                      }}
                    ></View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: "lightgray",
                alignContent: "center",
                justifyContent: "center",
                marginLeft: 10,
                marginRight: 15
              }}
            ></View>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{ backgroundColor: "transparent" }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  backgroundColor: "transparent",
                  marginLeft: 5
                }}
              >
                <DocDashTabs
                  title="My Patient"
                  img={require("../../icons/Shared-Report.png")}
                ></DocDashTabs>
                <DocDashTabs
                  title="Suggested test"
                  img={require("../../icons/Suggested-Test.png")}
                ></DocDashTabs>
                <DocDashTabs
                  title="Shared Report"
                  img={require("../../icons/Shared-Report.png")}
                ></DocDashTabs>
              </View>
            </ScrollView>

            <View
              style={{
                flex: 1,
                height: 20,
                backgroundColor: "transparent",
                alignContent: "center",
                justifyContent: "center",
                marginTop: 8
              }}
            >
              <Text
                style={{
                  textAlign: "left",
                  backgroundColor: "transparent",
                  fontSize: 15,
                  fontWeight: "bold",
                  marginLeft: 15,
                  color: "#1c1c1c"
                }}
              >
                Shared Report
              </Text>
            </View>

            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{ backgroundColor: "transparent" }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  backgroundColor: "transparent",
                  marginLeft: 10
                }}
              >
                <DocDashSharedReport
                  patientname="Robert David "
                  mobile="+919293939333"
                  email="test@gmail.com"
                  date="29 Aug 2020 11:11:11"
                ></DocDashSharedReport>

                <DocDashSharedReport
                  patientname="Robert David "
                  mobile="919293939333"
                  email="test@gmail.com"
                  date="29 Aug 2020 11:11:11"
                ></DocDashSharedReport>
              </View>
            </ScrollView>

            <View
              style={{
                flex: 1,
                height: 20,
                backgroundColor: "transparent",
                alignContent: "center",
                justifyContent: "center",
                marginTop: 8
              }}
            >
              <Text
                style={{
                  textAlign: "left",
                  backgroundColor: "transparent",
                  fontSize: 15,
                  fontWeight: "bold",
                  marginLeft: 22
                }}
              >
                Suggested test
              </Text>
            </View>

            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{ backgroundColor: "transparent" }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  backgroundColor: "transparent",
                  marginLeft: 15
                }}
              >
                <DocDashSuggestTest
                  testname="Robert David "
                  labname="sahyadri Pathology lab"
                  teststatus="Complete"
                  date="29 Aug 2020"
                  date1="29 Aug 2020 11:11:11"
                  lablogo={require("../../icons/Heart.png")}
                ></DocDashSuggestTest>

                <DocDashSuggestTest
                  testname="Robert David"
                  labname="sahyadri Pathology lab"
                  teststatus="Complete"
                  date="29 Aug 2020"
                  lablogo={require("../../icons/Heart.png")}
                ></DocDashSuggestTest>
              </View>
            </ScrollView>

            <View
              style={{
                flex: 1,
                height: 25,
                backgroundColor: "transparent",
                alignContent: "center",
                justifyContent: "center",
                marginTop: 10
              }}
            ></View>
          </ScrollView>
        </View>
        <CustomFooter footerId="1" />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: "center",
    flex: 1,
    paddingTop: 0,
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
