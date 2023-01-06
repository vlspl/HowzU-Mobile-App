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
  BackHandler,
  RefreshControl
} from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import ImageLoad from "react-native-image-placeholder";
import LifeDisorderCard from "../appComponents/LifeDisorderCard";
import MyHealthCard from "../appComponents/MyHealthCard";
import RecentTestCard from "../appComponents/RecentTestCard";
import RecomendedTestCard from "../appComponents/RecomendedTestCard";
import LifeDisorderImgcard from "../appComponents/LifeDisorderImgcard";

import Constants from "../utils/Constants";
import AsyncStorage from "@react-native-community/async-storage";
import Loader from "../appComponents/loader";
import NoDataAvailable from "../appComponents/NoDataAvailable";
import moment from "moment";

import axios from "axios";
import Carousel, { Pagination } from "react-native-snap-carousel";
const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

export default class PatientdashboardComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activebtn: "FEET",
      lifestyledisorder: [],
      myhealthlist: [],
      recenttestlist: [],
      Upcommingtestlist: [],
      recomendedtestlist: [],
      isLoading: false,
      pageNo: 1,
      iscurrent: true,
      searchString: "",
      paginationLoading: false,
      isNetConnected: true,
      searchLoading: false,
      refreshing: false,
      didcount: 0,
      appointmentpressed: false,
      activeIndex: 0,
      carouselItems: []
    };
  }

  onPressMyDoctor = () => {
    this.props.navigation.navigate("MyDoctors", { refresh: true });
  };

  onPressMyReport = () => {
    // this.props.remove();
    this.props.navigation.navigate("MyReports", { refresh: true });
  };
  onPressCompareMyReport = () => {
    console.log("CompareReportsList");
    // this.props.remove();
    this.props.navigation.navigate("CompareReportsList", { refresh: true });
  };

  onPressAppointment = () => {
    this.props.navigation.navigate("Appointments", { refresh: true });
  };

  handleMyHealth = (index) => {
    let info = this.state.myhealthlist[index];
    // console.log(
    //   " handleMyHealth index====================================",
    //   index,
    //   info
    // );
    if (info.Name == "Oxygen") {
      this.props.navigation.navigate("Oxygengraph", { info: info });
    } else if (info.Name == "BMI") {
      this.props.navigation.navigate("Myhealthgraph", { info: info });
    } else if (info.Name == "Blood Pressure") {
      this.props.navigation.navigate("MyBloodPressureGraphscreen", {
        info: info
      });
    } else if (info.Name == "Temperature") {
      this.props.navigation.navigate("TempratureGraph", { info: info });
    }
  };

  handleRecentTest = (index) => {
    let info = this.state.recenttestlist[index];
    // console.log(
    //   " handleRecentTest index====================================",
    //   index,
    //   info
    // );
    let bookingid = info.BookingId;

    this.props.navigation.navigate("MyReportGraphscreen", {
      ReportId: info.ReportId,
      labinfo: info
    });
  };

  handleUpcommingTest = (index) => {
    let info = this.state.Upcommingtestlist[index];
    // console.log(
    //   ' handleUpcommingTest index====================================',
    //   index,
    //   info
    // );
    let bookingid = info.BookingId;
    // this.props.remove();
    this.props.navigation.navigate("CheckStatus", { bookingid: bookingid });
  };

  handleSelectionMultiple = (index) => {
    // console.log('TestID==============================');
    var dict = {}; // create an empty array

    dict = this.state.recomendedtestlist[index];
    // console.log(dict,'------////-----//');
    let testprices = dict["TestPrice"];
    var sum = 0;
    var pricearr = testprices.split(",");
    pricearr.forEach(function (obj) {
      sum += Number(obj);
    });

    // console.log('Total Price ==============================', dict);

    ///dict.set("Total", sum);
    dict["Total"] = sum;
    // console.log('Total Price ==============================', dict);

    //console.log('index====================================',index,dict)
    // this.props.remove();
    this.props.navigation.navigate("BookAppointment", {
      labinfo: dict,
      from: "suggested"
    });
  };

  handleLifeStyleDisorder = (index) => {
    // console.log(
    //   '&*&*&*&*&**Life Disorder TestID=============================='
    // );

    let info = this.state.lifestyledisorder[index];

    // console.log(
    //   // ' disorder index====================================',
    //   index,
    //   info
    // );

    // this.props.remove();
    this.props.navigation.navigate("LifeDisorderTestList", { disorder: info });
  };

  async getSuggestedTest() {
    try {
      let response = await axios.post(Constants.GET_SUGGESTED_TEST, {
        pageNumber: this.state.pageNo,
        pageSize: Constants.PER_PAGE_RECORD,
        Searching: this.state.searchString
      });
      // console.log(
      //   // 'Reommended Test list component  Suggested test data==============',
      //   response.data
      // );
      this.setState({ isLoading: false });

      if (response.data.Status) {
        // let responseData = this.state.recomendedtestlist;
        let responseData = [];
        response.data.SuggestTestList.map((item) => {
          responseData.push(item);
        });

        this.setState({
          recomendedtestlist: responseData,
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false
        });
      } else {
        // Toast.show(response.data.Msg);
        this.setState({
          recomendedtestlist: [],
          isLoading: false,
          paginationLoading: false,
          searchLoading: false,
          refreshing: false
        });
      }
    } catch (errors) {
      ///Toast.show(errors)

      this.setState({
        isLoading: false,
        paginationLoading: false,
        searchLoading: false,
        refreshing: false
      });
      console.log(errors);
    }
  }

  componentDidMount = () => {
    // console.log(' Did mount Patent Dash COmponet gets called', this.props);
    // this.props.remove();
    this.setState({
      isLoading: true,
      lifestyledisorder: [],
      recenttestlist: [],
      Upcommingtestlist: [],
      recomendedtestlist: [],
      myhealthlist: []
    });

    this.GetDashboardAPicall();
    this.getSuggestedTest();
  };

  componentWillUnmount() {
    // console.log(
    //   this.props,
    //   ' &&&&& componentWillUnmount****************PATIENTDASH'
    // );
    this.setState({
      isLoading: false,
      lifestyledisorder: [],
      recenttestlist: [],
      Upcommingtestlist: [],
      recomendedtestlist: [],
      myhealthlist: []
    });

    this.GetDashboardAPicall();
    this.getSuggestedTest();
  }

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // console.log(
    //   '****** Patient  Dash  Compnent  UNSAFE_componentWillReceiveProps ============================== ',
    //   nextProp
    // );
    // nextProp.remove();
    this.setState({
      isLoading: true,
      lifestyledisorder: [],
      recenttestlist: [],
      Upcommingtestlist: [],
      recomendedtestlist: [],
      myhealthlist: []
    });
    this.GetDashboardAPicall();
    this.getSuggestedTest();
    // this.backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.backAction
    // );
  };

  async GetDashboardAPicall() {
    let gallimg = Constants.GET_SLIDER_IMG;
    // console.log('Patent Dash Componet gets called');
    let GET_LIFEDISORDER = Constants.GET_LIFEDISORDER;
    let GET_MYHEALTH = Constants.GET_MYHEALTH;
    let GET_RECENT_TEST = Constants.GET_RECENT_TEST;
    let GET_UPCOMMING_TEST = Constants.GET_UPCOMMING_TEST;
    //let GET_SUGGESTED_TEST = Constants.GET_SUGGESTED_TEST

    //let three = Constants.Get

    const requestOne = axios.get(GET_LIFEDISORDER);
    const requestTwo = axios.get(GET_MYHEALTH);
    const requestThree = axios.get(GET_RECENT_TEST);
    const requestFourth = axios.get(GET_UPCOMMING_TEST);
    const img = axios.post(gallimg);

    axios
      .all([requestOne, requestTwo, requestThree, requestFourth, img])
      .then(
        axios.spread((...responses) => {
          // console.log(responses[4], 'responses');
          const responseOne = responses[0];
          const responseTwo = responses[1];
          const responesThree = responses[2];
          const responesFourth = responses[3];
          const imgres = responses[4];

          // console.log("1 st GET_LIFEDISORDER =================", imgres.data);
          // console.log('2 st GET_MYHEALTH =================', responseTwo.data);
          // console.log(
          //   '3 st GET_RECENT_TEST =================',
          //   responesThree.data
          // );
          console.log("4 st GET_imgres =================", imgres.data);
          // console.log('5 st GET_SUGGESTED_TEST =================',responesFifth.data)
          this.setState({
            isLoading: false,
            searchLoading: false,
            refreshing: false
          });
          this.setState({ isLoading: false });

          if (imgres.data.Status) {
            // let responseData = this.state.lifestyledisorder;
            //new changes
            let responseData = [];

            imgres.data.MyDetails.map((item) => {
              let temp = {};
              temp.img = Constants.SILDER_IMG_URL + item.ImagePath;
              temp.title = item.ImageTitle; //https://visionarylifescience.com//Images/medical%20reminder.png
              responseData.push(temp);
            });

            this.setState({ carouselItems: responseData });
          } else {
            this.setState({ isLoading: false });
            // console.log('1 st response=================', responseOne.data.Msg);
          }

          if (responseOne.data.Status) {
            // let responseData = this.state.lifestyledisorder;
            //new changes
            let responseData = [];

            responseOne.data.LifeStyleDisorderList.map((item) => {
              responseData.push(item);
            });

            this.setState({ lifestyledisorder: responseData });
          } else {
            this.setState({ isLoading: false });
            // console.log('1 st response=================', responseOne.data.Msg);
          }

          if (responseTwo.data.Status) {
            // let responseData = this.state.myhealthlist;
            //new changes
            let responseData = [];

            responseTwo.data.HealthList.map((item) => {
              responseData.push(item);
            });

            this.setState({ myhealthlist: responseData });
          } else {
            // console.log('2 st response=================', responsetwo.data.Msg);
          }

          if (responesThree.data.Status) {
            // let responseData = this.state.recenttestlist;

            //new
            let responseData = [];

            responesThree.data.AppointmentList.map((item) => {
              responseData.push(item);
            });

            this.setState({ recenttestlist: responseData });
          } else {
            // console.log(
            //   '3 st response@@@=================',
            //   responesThree.data.Msg
            // );
          }

          if (responesFourth.data.Status) {
            // let responseData = this.state.Upcommingtestlist;

            //new
            // console.log(responesFourth.data ,'//////upcoming ');
            let responseData = [];

            responesFourth.data.AppointmentList.map((item) => {
              responseData.push(item);
            });

            this.setState({ Upcommingtestlist: responseData });
          } else {
            this.setState({ isLoading: false });
            // console.log(
            //   '4 st response=================',
            //   responesFourth.data.Msg,
            //   '@@@@',
            //   this.state.Upcommingtestlist
            // );
          }
        })
      )
      .catch((errors) => {
        console.log(errors.reponse);
        this.setState({ isLoading: false });
        // react on errors.
      });
  }

  onRefresh = async () => {
    this.setState({ refreshing: true, pageNo: 1, AllMyPatients: [] }, () => {
      this.GetDashboardAPicall();
      this.getSuggestedTest();
    });
  };

  sliderimgNavigation = async (title) => {
    console.log(title, ":::::?????>>>LLLLLL");
    if (title == "hydration reminder" || title == "Hydration.png") {
      // this.HydrationNavigtion();
      try {
        const response = await axios.get(Constants.GET_HYDRATION_DETAILS);

        if (response.data.Status) {
          console.log("retrving data");

          this.props.navigation.navigate("HydrationScreen", {
            refresh: true
          });
        } else {
          this.props.navigation.navigate("HydGenderScreen", { refresh: true });
        }
      } catch (error) {}
    } else if (title == "medical reminder") {
      this.props.navigation.navigate("MedicationCalendrHome", {
        refresh: true
      });
    } else if (title == "add report") {
      this.props.navigation.navigate("ReportManualPunch", { refresh: "" });
    } else if (title == "BMI") {
      this.props.navigation.navigate("BMIGender");
    } else if (title == "blood pressure") {
      this.props.navigation.navigate("BloodPressure", {
        refresh: ""
      });
    } else if (title == "temperature") {
      this.props.navigation.navigate("Temprature", {
        refresh: ""
      });
    } else if (title == "oxygen") {
      this.props.navigation.navigate("Oxygen", {
        refresh: ""
      });
    }
  };
  _renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => this.sliderimgNavigation(item.title)}>
        <View
          style={{
            height: Dimensions.get("window").width / 1.5,
            marginLeft: 5,
            marginTop: -0,
            width: Dimensions.get("window").width + 10
          }}
          key={index}
        >
          {/* <Image
          style={{
            width: Dimensions.get("screen").width,
            height: "61%",
            justifyContent: "center",
          }}
          source={{ uri: item.img }}
        /> */}
          <ImageLoad
            source={{
              uri: item.img
            }}
            style={{
              width: Dimensions.get("screen").width,
              height: "61%",
              // marginLeft: 10,

              shadowOffset: { width: 2, height: 2 },
              shadowColor: "gray",
              shadowOpacity: 0.7
              // borderRadius: 50,
            }}
            placeholderSource={require("../../icons/Placeholder.png")}
            placeholderStyle={{
              width: Dimensions.get("screen").width,
              height: "61%",
              // marginLeft: 10,
              shadowOffset: { width: 2, height: 2 },
              shadowColor: "gray",
              shadowOpacity: 0.7

              // borderRadius: 30,
            }}
            // borderRadius={30}
          />
        </View>
      </TouchableOpacity>
    );
  };
  render() {
    // this.setState({appointmentpressed:false});
    // console.log(this.state.isLoading, 'in patient dash');
    return (
      <View style={styles.MainContainer}>
        <Loader loading={this.state.isLoading} />

        <ScrollView
          alwaysBounceVertical={true}
          showsHorizontalScrollIndicator={false}
          style={{ backgroundColor: "white", marginTop: 0 }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >
          <Carousel
            layout={"default"}
            ref={(ref) => (this.carousel = ref)}
            data={this.state.carouselItems}
            sliderWidth={width - 5}
            itemWidth={width}
            renderItem={this._renderItem}
            onSnapToItem={(index) => {
              this.setState({ activeIndex: index });
            }}
            autoplay={true}
            loop={true}
          />

          <Pagination
            dotsLength={this.state.carouselItems.length}
            activeDotIndex={this.state.activeIndex}
            containerStyle={{
              backgroundColor: "transparent",
              paddingTop: 0,
              paddingBottom: 10,
              marginTop: -100,
              flex: 1
            }}
            dotStyle={{
              width: 10,
              height: 10,
              borderRadius: 5,
              marginHorizontal: 1,
              backgroundColor: "blue",
              padding: 1
            }}
            inactiveDotStyle={{
              width: 10,
              height: 10,
              borderRadius: 5,
              marginHorizontal: 1,
              backgroundColor: "gray",
              padding: 1
            }}
            inactiveDotOpacity={0.5}
            inactiveDotScale={0.6}
          />
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{ backgroundColor: "white" }}
          >
            {this.state.isLoading == false && (
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  backgroundColor: "white",
                  marginLeft: 5
                }}
              >
                <LifeDisorderCard
                  title="My Doctors"
                  // img={require("../../icons/DashDoctors.png")}
                  img={require("../../icons/mydoctor.png")}
                  onPress={this.onPressMyDoctor}
                ></LifeDisorderCard>
                <LifeDisorderCard
                  title="My Reports"
                  // img={require("../../icons/My-Reports.png")}
                  img={require("../../icons/myreport.png")}
                  onPress={this.onPressMyReport}
                ></LifeDisorderCard>
                <LifeDisorderCard
                  title="Trend Analysis"
                  // img={require("../../icons/finalcolor.png")}
                  // img={require("../../icons/trendanyalatics.png")}
                  img={require("../../icons/trend-anyalatics1newsize.png")}
                  onPress={this.onPressCompareMyReport}
                ></LifeDisorderCard>
                <LifeDisorderCard
                  title="Appointments"
                  // img={require("../../icons/Appointments.png")}
                  img={require("../../icons/newappointdash.png")}
                  onPress={this.onPressAppointment}
                ></LifeDisorderCard>
              </View>
            )}
          </ScrollView>
          <View
            style={{
              flex: 1,
              //height: 15,
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
                fontSize: 14,
                fontWeight: "bold",
                marginLeft: 15
              }}
            >
              Lifestyle Disorders
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              backgroundColor: "transparent",
              marginLeft: 5
            }}
          >
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{ backgroundColor: "transparent" }}
              onScroll={({ nativeEvent }) => {}}
            >
              {this.state.lifestyledisorder.length > 0 &&
                this.state.lifestyledisorder.map((item, index) => (
                  <View key={index}>
                    <LifeDisorderImgcard
                      title={item.Name}
                      lifedisorderImg={item.Image}
                      onPress={() => this.handleLifeStyleDisorder(index)}
                    ></LifeDisorderImgcard>
                  </View>
                ))}
            </ScrollView>
          </View>
          {this.state.lifestyledisorder.length <= 0 &&
          !this.state.isLoading &&
          !this.state.searchLoading &&
          !this.state.refreshing ? (
            <Text style={{ flex: 1, margin: 20, color: "gray" }}>
              No Data available in Lifestyle Disorder!
            </Text>
          ) : null}

          <View
            style={{
              flex: 1,
              // height: 15,
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
                fontSize: 14,
                fontWeight: "bold",
                marginLeft: 15
              }}
            >
              My Health
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
                marginLeft: 5
              }}
            >
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{ backgroundColor: "transparent" }}
                onScroll={({ nativeEvent }) => {}}
              >
                {this.state.myhealthlist.map((item, index) => (
                  <View key={index}>
                    <MyHealthCard
                      index={index}
                      title={item.Name}
                      value={item.Value + item.Unit}
                      result={item.Result}
                      date={moment(item.Date, "MMM DD YYYY").format(
                        " DD MMM YY"
                      )}
                      onPress={() => this.handleMyHealth(index)}
                    ></MyHealthCard>
                  </View>
                ))}
              </ScrollView>
              {this.state.myhealthlist.length == 0 &&
              !this.state.isLoading &&
              !this.state.searchLoading &&
              !this.state.refreshing ? (
                <View style={{ flexDirection: "column" }}>
                  <Text style={{ flex: 1, margin: 10, color: "gray" }}>
                    No Data Available in My Health!
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate("HealthDiary", {
                        refresh: true
                      });
                    }}
                  >
                    <Text
                      style={{
                        flex: 1,
                        margin: 10,
                        color: "blue",
                        textDecorationLine: "underline"
                      }}
                    >
                      Add Data in Health Diary
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          </ScrollView>

          {/* new cowin  */}
          <View
            style={{
              flex: 1,
              // height: 15,
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
                fontSize: 14,
                fontWeight: "bold",
                marginLeft: 15
              }}
            >
              CoWIN
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
                marginLeft: 5
              }}
            >
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{ backgroundColor: "transparent" }}
                onScroll={({ nativeEvent }) => {}}
              >
                <View style={styles.MyhealthcardView}>
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() =>
                      this.props.navigation.navigate("Vaccination")
                    }
                  >
                    <View style={{ flex: 1, flexDirection: "row" }}>
                      <View style={{ flex: 0.6, backgroundColor: "white" }}>
                        <Text
                          style={{
                            textAlign: "left",
                            backgroundColor: "white",
                            fontSize: 16,
                            marginLeft: 1,
                            flex: 1,
                            marginTop: 15
                          }}
                        >
                          Vaccination
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: 0.2,
                          backgroundColor: "white",
                          marginTop: 10
                        }}
                      >
                        <Image
                          style={{ height: 50, width: 40 }}
                          // source={require("../../icons/cowin.png")}
                          // source={require("../../icons/syringe.png")}
                          source={require("../../icons/injectionremovebpreview1.png")}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.MyhealthcardView}>
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={
                      () =>
                        this.props.navigation.navigate(
                          "VaccinationCertificate",
                          { from: "" }
                        )
                      // this.props.navigation.navigate("LoginwithOTP", {
                      //   from: "cowin-certifcate",
                      // })
                    }
                  >
                    <View style={{ flex: 1, flexDirection: "row" }}>
                      <View style={{ flex: 0.55, backgroundColor: "white" }}>
                        <Text
                          style={{
                            textAlign: "left",
                            backgroundColor: "white",
                            fontSize: 16,
                            marginLeft: 1,
                            flex: 1,
                            marginTop: 15
                          }}
                          numberOfLines={2}
                        >
                          Vaccination Certificate
                        </Text>
                      </View>

                      <View style={{ flex: 0.2, backgroundColor: "white" }}>
                        <Image
                          style={{ height: 60, width: 80, marginTop: 5 }}
                          // source={require("../../icons/certificatecowin.png")}
                          // source={require("../../icons/certificate.png")}
                          source={require("../../icons/certificategold.png")}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </ScrollView>

          <View
            style={{
              flex: 1,
              //  height: 15,
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
                fontSize: 14,
                fontWeight: "bold",
                marginLeft: 15
              }}
            >
              Recent Tests
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
                marginLeft: 5
              }}
            >
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{ backgroundColor: "transparent" }}
                onScroll={({ nativeEvent }) => {}}
              >
                {this.state.recenttestlist.map((item, index) => (
                  <View key={index}>
                    <RecentTestCard
                      index={index}
                      testname={item.TestName}
                      labname={item.LabName}
                      teststatus={item.BookStatus} //BookingDate
                      date={moment(item.BookingDate, "MMM DD YYYY").format(
                        " DD MMM YY"
                      )}
                      // lablogo={require("../../icons/booktest.jpg")}
                      lablogo={require("../../icons/appointment.png")}
                      onPress={() => this.handleRecentTest(index)}
                    ></RecentTestCard>
                  </View>
                ))}
              </ScrollView>
              {this.state.recenttestlist.length == 0 &&
              !this.state.isLoading &&
              !this.state.searchLoading &&
              !this.state.refreshing ? (
                <Text style={{ flex: 1, margin: 10, color: "gray" }}>
                  No Data Available in Recent test!
                </Text>
              ) : null}
            </View>
          </ScrollView>

          <View
            style={{
              flex: 1,
              // height: 15,
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
                fontSize: 14,
                fontWeight: "bold",
                marginLeft: 15
              }}
            >
              Upcoming Tests
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
                marginLeft: 5
              }}
            >
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{ backgroundColor: "transparent" }}
                onScroll={({ nativeEvent }) => {}}
              >
                {this.state.Upcommingtestlist.map((item, index) => (
                  <View key={index}>
                    <RecentTestCard
                      index={this.props.index}
                      testname={
                        item.TestName == ""
                          ? "Prescription Uploaded"
                          : item.TestName
                      }
                      labname={item.LabName}
                      teststatus={item.BookStatus}
                      date={moment(item.TestDate, "DD/MM/YYYY").format(
                        "DD MMM YY"
                      )}
                      lablogo={require("../../icons/booktest.jpg")}
                      // lablogo={require('../../icons/Heart.png')}
                      onPress={() => this.handleUpcommingTest(index)}
                    ></RecentTestCard>
                  </View>
                ))}
              </ScrollView>

              {this.state.Upcommingtestlist.length == 0 &&
              !this.state.isLoading &&
              !this.state.searchLoading &&
              !this.state.refreshing ? (
                <Text style={{ flex: 1, margin: 10, color: "gray" }}>
                  No Data available in Upcoming test!
                </Text>
              ) : null}
            </View>
          </ScrollView>

          <View
            style={{
              flex: 1,
              // height: 15,
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
                fontSize: 14,
                fontWeight: "bold",
                marginLeft: 15
              }}
            >
              Suggested Tests
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
                marginLeft: 5
              }}
            >
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{ backgroundColor: "transparent" }}
                onScroll={({ nativeEvent }) => {}}
              >
                {this.state.recomendedtestlist.map((item, index) => (
                  <View key={index}>
                    <RecomendedTestCard
                      testname={item.TestName}
                      docName={item.DoctorName}
                      date={moment(item.RecommendedDate).format(" DD MMM YY")}
                      // date={item.RecommendedDate}
                      onPress={() => this.handleSelectionMultiple(index)}
                    ></RecomendedTestCard>
                  </View>
                ))}
              </ScrollView>

              {this.state.recomendedtestlist.length <= 0 &&
              !this.state.isLoading &&
              !this.state.searchLoading &&
              !this.state.refreshing ? (
                <Text style={{ flex: 1, margin: 10, color: "gray" }}>
                  No Data available in Suggested test!
                </Text>
              ) : null}
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
    );
  }
}

const styles = StyleSheet.create({
  MyhealthcardView: {
    flex: 1,
    flexDirection: "row",
    padding: 5,
    margin: 5,
    backgroundColor: "white",
    width: 190,
    height: 80,
    borderWidth: 1,
    borderColor: "#FFFFF0",
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "lightgray",
    shadowOpacity: 0.8,
    borderRadius: 5,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center"
  },
  MainContainer: {
    justifyContent: "center",
    flex: 1,
    paddingTop: 0,
    backgroundColor: "gray"
    //zIndex:0,
    //position: 'absolute'
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
