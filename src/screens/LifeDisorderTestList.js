import React, { Component } from "react";
//import CustomListview from './Screen/DoctorList'

import {
  FlatList,
  StyleSheet,
  Text,
  View,
  BackHandler,
  SafeAreaView,
  Alert,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from "react-native";
import { Container } from "native-base";
import { ScrollView } from "react-native-gesture-handler";
import CustomeHeader from "../appComponents/CustomeHeader";
import axios from "axios";
import Constants from "../utils/Constants";
import Loader from "../appComponents/loader";
import NoDataAvailable from "../appComponents/NoDataAvailable";
import TestListRow from "../appComponents/TestListRow";
import Toast from "react-native-tiny-toast";
var testidstr = "";

export default class LifeDisorderTestList extends Component {
  constructor(props) {
    super(props);
    //setting default state
    this.state = {
      isLoading: false,
      lifestyledisorder: [],
      disorderid: "",
      disordername: ""
    };
  }

  removeDuplicate = (datalist) => {
    return datalist.filter(function (a) {
      return (
        !this[a.BookingId] &&
        (this[a.BookingId] = true) &&
        !this[a.BookingId] &&
        (this[a.BookingId] = true)
      );
    }, Object.create(null));
  };

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // console.log(
    //   "******* lifestyledisordercomponentWillReceiveProps==============================",
    //   nextProp.route.params.disorder
    // );
    testidstr = "";
    this.setState(
      {
        disorderid: nextProp.route.params.disorder.Id,
        disordername: nextProp.route.params.disorder.Name,
        isLoading: true,
        lifestyledisorder: []
      },
      () => {
        this.getTestList("");
      }
    );

    //  this.setState({disorderid: nextProp.route.params.disorder.Id });
    //   this.setState({disordername: nextProp.route.params.disorder.Name });
    //     this.setState({isLoading: true });
    //     this.setState({ lifestyledisorder: [] })

    //      this.getTestList('');
  };

  componentDidMount = () => {
    // console.log(
    //   "*******&&&&&lifestyledisorder componentDidMount==============================",
    //   this.props.route.params.disorder
    // );
    // this.backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.hardwarebBackAction
    // );
    // this.setState({disorderid: this.props.route.params.disorder.Id });
    // this.setState({disordername: this.props.route.params.disorder.Name });

    // this.setState({isLoading: true });
    // this.getTestList('');

    testidstr = "";
    this.setState(
      {
        disorderid: this.props.route.params.disorder.Id,
        disordername: this.props.route.params.disorder.Name,
        isLoading: true,
        lifestyledisorder: []
      },
      () => {
        this.getTestList("");
      }
    );
  };

  onRefresh = async () => {
    // console.log("Life Disorder Test List On refersh");
    // await this.setState({ refreshing: true })
    // this.setState({ allPatientList: [] })
    // await this.getAllPatient()
    testidstr = "";
    this.setState(
      {
        refreshing: true,
        lifestyledisorder: [],
        pageNo: 1
      },
      () => {
        this.getTestList("");
      }
    );
  };

  getTestList = async (empty) => {
    // console.log("get Test List lifedisorder teslist ", testidstr);
    try {
      const response = await axios.get(
        Constants.GET_LIFEDISORDER_TEST + this.state.disorderid
      );
      // console.log(response.data);
      this.setState({ isLoading: false });

      if (response.data.Status) {
        // let responseData = this.state.lifestyledisorder;
        let responseData = [];
        testidstr = "";
        response.data.LifeStyleDisorderList.map((item) => {
          //  console.log(item, "Items#########");
          testidstr = item.TestId + "," + testidstr;
          // testidstr = item.TestId;
          responseData.push(item);
        });

        // console.log(
        //   testidstr,
        //   "================Life Disorder Screen",
        //   responseData
        // );
        this.setState({ lifestyledisorder: responseData, refreshing: false });
      } else {
        // Toast.show(response.data.Status);
      }
      // Toast.show(response)
    } catch (error) {
      this.setState({ isLoading: false, refreshing: false });
      Toast.show("Something went wrong,try again later");

      // console.error(error);
    }
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 0.5,
          //width: "95%",
          backgroundColor: "gray",
          marginLeft: 20,
          marginRight: 15
        }}
      />
    );
  };

  OpenDrawer = () => {
    this.props.navigation.openDrawer();
  };
  //handling onPress action
  OpenCheckProcees = (item) => {
    // console.log(
    //   testidstr,
    //   "************Items for booking LifeDisorder Screen",
    //   item
    // );
    //Alert.alert(item.key,item.title);
    //this.props.navigation.navigate("LabListScreen")
    this.props.navigation.navigate("LabListScreen", {
      testids: testidstr.replace(/(^,)|(,$)/g, ""),
      refresh: true
    });
  };

  hardwarebBackAction = () => {
    this.props.navigation.goBack();
    return true;
  };
  componentWillUnmount = () => {
    // this.backHandler.remove();
  };
  render() {
    const { data, isLoading } = this.state;

    return (
      <Container>
        <Loader loading={this.state.isLoading} />
        <CustomeHeader
          title="Test List"
          headerId={1}
          navigation={this.props.navigation}
        />
        <View style={styles.containermain}>
          <View
            style={{
              height: 40,
              justifyContent: "center",
              alignContent: "center",
              backgroundColor: "#f4f4f4"
            }}
          >
            <Text style={{ textAlign: "center", fontSize: 18 }}>
              {this.state.disordername}
            </Text>
          </View>

          <ScrollView
            onScroll={({ nativeEvent }) => {}}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }
          >
            {this.state.lifestyledisorder.map((item) => (
              <TestListRow
                testname={item.TestName}
                profile={item.TestCode}
                checkboximg={require("../../icons/checkbox.png")}
              ></TestListRow>
            ))}
          </ScrollView>
          {this.state.lifestyledisorder.length <= 0 &&
          !this.state.isLoading &&
          !this.state.searchLoading &&
          !this.state.refreshing ? (
            <NoDataAvailable onPressRefresh={this.onRefresh} />
          ) : null}
        </View>
        {this.state.lifestyledisorder.length > 0 && (
          <TouchableOpacity
            style={{
              height: 50,
              backgroundColor: "#275BB4",
              marginBottom: 0,
              justifyContent: "center"
            }}
            onPress={this.OpenCheckProcees.bind()}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: 20,
                textAlign: "center"
              }}
            >
              Proceed
            </Text>
          </TouchableOpacity>
        )}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  containermain: {
    flex: 1,
    marginTop: 0,
    backgroundColor: "white",
    flexDirection: "column"
  },
  container: {
    flex: 1,
    flexDirection: "row",
    padding: 3,
    marginLeft: 15,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 2,
    borderRadius: 5,
    backgroundColor: "white"
    //elevation: 2,
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    flexDirection: "row",
    // backgroundColor: 'gray',
    marginRight: 10,
    fontWeight: "bold"
  },
  container_text: {
    flex: 1,
    flexDirection: "column",
    marginTop: 0,
    padding: 5,
    justifyContent: "center",
    backgroundColor: "white"
  },
  description: {
    fontSize: 12,
    //marginTop: 4,
    padding: 2,
    color: "gray",
    marginLeft: 2,
    flex: 1
    /// backgroundColor: 'gray',
  },
  suggestbtnTitle: {
    // flex:1,
    fontSize: 9,
    marginRight: 0,
    paddingRight: 0,
    color: "white",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold"
  },
  photo: {
    height: 68,
    width: 68,
    shadowOffset: { width: 3, height: 3 },
    shadowColor: "gray",
    shadowOpacity: 0.7,
    elevation: 5,
    borderWidth: 0,
    borderRadius: 34
  },
  email: {
    fontSize: 12,
    //fontStyle: 'italic',
    marginTop: 3,
    color: "gray",
    marginLeft: 4
    // alignSelf: 'flex-end',

    // backgroundColor: 'gray',
  },
  image: {
    height: 22,
    width: 22,
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-end",
    marginRight: 5

    // justifyContent: 'center'
  },
  touchable: {
    alignItems: "center",
    justifyContent: "center"
  },

  SuggestTesttouch: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  titlesubview: {
    flex: 1,
    flexDirection: "row"
    //alignSelf: 'flex-end',
    // backgroundColor: 'green',
  },

  DRnamesubview: {
    flex: 1,
    flexDirection: "row",
    //alignSelf: 'flex-end',
    backgroundColor: "white"
  },
  sharebtnview: {
    flex: 0.3,
    flexDirection: "row",
    //alignSelf: 'flex-end',
    height: 22,
    //width: 150,
    //marginTop : 0,
    // paddingTop: 0,
    backgroundColor: "#003484",
    borderRadius: 11
  },

  Mobilesubview: {
    flex: 1,
    flexDirection: "row",
    marginTop: 5
    // alignSelf: 'flex-end',
    // backgroundColor:'yellow'
  },
  Icons: {
    height: 15,
    width: 15,
    marginTop: 2
  },

  emailsubview: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-end",
    justifyContent: "space-between",
    alignContent: "flex-end",
    marginTop: 4
    // backgroundColor:'yellow'
  },

  DoctorProfile: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-end",
    alignContent: "flex-end",
    textAlign: "right",
    color: "gray",
    fontSize: 11
  },

  Separator: {
    height: 0.5,
    backgroundColor: "gray",
    marginLeft: 0,
    marginRight: 0,
    marginTop: 10
  }
});
