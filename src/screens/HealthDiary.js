import React from "react";

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
} from "react-native";

import Diarycard from "../appComponents/Diarycard";

import LifeDisorderCard from "../appComponents/LifeDisorderCard";
import Loader from "../appComponents/loader";
import CustomeHeader from "../appComponents/CustomeHeader";

export default class HealthDiary extends React.Component {
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
      paginationLoading: false,
      didcount: 0,
      appointmentpressed: false,
    };

    /// this.onPressLifestyle = this.onPressLifestyle.bind(this);
  }

  componentDidMount = () => {
    // this.setState({
    //   isLoading: true,
    //   lifestyledisorder: [],
    //   recenttestlist: [],
    //   Upcommingtestlist: [],
    //   recomendedtestlist: [],
    //   myhealthlist: [],
    // });
  };

  render() {
    return (
      <View style={styles.MainContainer}>
        <Loader loading={this.state.isLoading} />
        <CustomeHeader
          title="My Health Diary"
          headerId={1}
          navigation={this.props.navigation}
        />

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
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{ backgroundColor: "white" }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
              }}
            >
              <Diarycard
                title="Add Blood Pressure"
                img={require("../../icons/heartred.png")}
                onPress={() =>
                  this.props.navigation.navigate("BloodPressure", {
                    refresh: true,
                  })
                }
              ></Diarycard>
              <Diarycard
                title="BMI Calculator"
                img={require("../../icons/bmi-calculater-b.png")}
                onPress={() =>
                  this.props.navigation.navigate("BMIGender", {
                    refresh: true,
                  })
                }
              ></Diarycard>
            </View>
          </ScrollView>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{ backgroundColor: "white" }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                backgroundColor: "white",
                marginLeft: 5,
              }}
            >
              <Diarycard
                title="Add Temperature"
                img={require("../../icons/tempbluenew.png")}
                onPress={() =>
                  this.props.navigation.navigate("Temprature", {
                    refresh: true,
                  })
                }
              ></Diarycard>
              <Diarycard
                title="Add Oxygen"
                img={require("../../icons/oxygennew-blue.png")}
                onPress={() =>
                  this.props.navigation.navigate("Oxygen", {
                    refresh: true,
                  })
                }
              ></Diarycard>
            </View>
          </ScrollView>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: "center",
    flex: 1,
    paddingTop: 0,
    backgroundColor: "white",
  },

  container_text: {
    flex: 1,
    flexDirection: "column",
    marginTop: 0,
    marginLeft: 5,
    justifyContent: "center",
    backgroundColor: "white",
  },

  Separator: {
    height: 0.5,
    backgroundColor: "gray",
    marginLeft: 0,
    marginRight: 0,
    marginTop: 10,
  },
});
