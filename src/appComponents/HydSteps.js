import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import {
  scale as vtscale,
  verticalScale,
  moderateScale as mdscale,
} from "react-native-size-matters";
import AsyncStorage from "@react-native-community/async-storage";

const HydSteps = ({ number, btn }) => {
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [wakeup, setWakeup] = useState("");
  const [bedtime, setBedtime] = useState("");

  //style compponents
  const styles = StyleSheet.create({
    parentView: {
      flexDirection: "row",
      height: vtscale(60),
      // marginHorizontal: mdscale(16),
      alignItems: "center",
      justifyContent: "center",
      marginBottom: mdscale(30),
      marginTop: mdscale(10),
    },

    chekTextViews: {
      width: mdscale(60),
      height: vtscale(20),

      marginHorizontal: mdscale(5),
      alignItems: "center",
      justifyContent: "center",
    },

    checkbox: {
      height: vtscale(25),
      width: mdscale(22),
      borderRadius: 12,
      marginRight: mdscale(15),
    },

    text: {
      fontSize: mdscale(16),
      marginLeft: mdscale(1),
      //marginHorizontal: mdscale(15),
      color: "#2e62ae",
      fontWeight: "bold",
    },

    circleImages: {
      height: vtscale(50),
      width: mdscale(50),
      resizeMode: "contain",
      // borderRadius: 25,
      // borderBottomLeftRadius: 10,
      // borderBottomRightRadius: 9,
      // borderTopRightRadius: 10,
      // borderTopLeftRadius: 9,
      // overflow: "hidden",
      // backfaceVisibility: "hidden",
      // opacity: 1.0,
    },
  });
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    let value;

    try {
      value = await AsyncStorage.getItem("Hydration");
      // console.log(value.weight != undefined, ":::://");
      if (value !== null) {
        // We have data!!
        // console.log(JSON.parse(value));
        const Detail = JSON.parse(value);

        setGender(Detail.gender != undefined ? Detail.gender : "");
        setWeight(Detail.weight != undefined ? Detail.weight : "");
        setWakeup(
          Detail.wakehour != undefined
            ? Detail.wakehour + ":" + Detail.wakesecond
            : ""
        );
        setBedtime(
          Detail.bedHour != undefined
            ? Detail.bedHour + ":" + Detail.bedsecond
            : ""
        );
      }
    } catch (error) {}
  };

  return (
    <View style={styles.parentView}>
      <View style={styles.chekTextViews}>
        <View
          style={{
            borderColor: "#C1C9D2",
            marginBottom: mdscale(4),
            width: mdscale(100),
            borderRadius: 2,
            // marginTop: vtscale(10),
            alignSelf: "flex-start",
          }}
        />

        <View
          style={{
            flexDirection: "row",
            alignSelf: "flex-start",
            alignItems: "center",
          }}
        >
          <Image
            source={
              number == 1
                ? require("../../icons/male-female-active.png")
                : gender != "" && gender != undefined
                ? require("../../icons/male-female-active.png")
                : require("../../icons/male-female-not-active.png")
            }
            style={[
              styles.circleImages,
              // { width: vtscale(50), height: mdscale(60), marginTop: -10 },
            ]}
          />
          <View
            style={{
              borderWidth: 1.5,
              borderColor: "#C1C9D2",
              marginBottom: mdscale(4),
              width: mdscale(44),
              borderRadius: 2,
              // marginTop: vtscale(10),
              // marginTop: -vtscale(4),
            }}
          />
        </View>
        <Text style={styles.text}>{number == 1 ? btn : gender}</Text>
      </View>

      <View style={styles.chekTextViews}>
        <View
          style={{
            // borderWidth: 1.5,
            borderColor: "#C1C9D2",
            marginBottom: mdscale(4),
            width: mdscale(100),
            alignSelf: "flex-start",
            borderRadius: 2,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignSelf: "flex-start",
            alignItems: "center",
          }}
        >
          <Image
            source={
              number == 2
                ? require("../../icons/kg-active.png")
                : weight != "" && weight != undefined
                ? require("../../icons/kg-active.png")
                : require("../../icons/kg-not-active.png")
            }
            style={styles.circleImages}
          />
          <View
            style={{
              borderWidth: 1.5,
              borderColor: "#C1C9D2",
              marginBottom: mdscale(4),
              width: mdscale(44),
              borderRadius: 2,
              // marginTop: vtscale(10),
            }}
          />
        </View>
        <Text style={styles.text}>{number == 2 ? btn : weight}</Text>
      </View>

      <View style={styles.chekTextViews}>
        <View
          style={{
            // borderWidth: 1.5,
            borderColor: "#C1C9D2",
            marginBottom: mdscale(4),
            width: mdscale(100),
            borderRadius: 2,
            alignSelf: "flex-start",
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignSelf: "flex-start",
            alignItems: "center",
          }}
        >
          <Image
            source={
              number == 3
                ? require("../../icons/time-active.png")
                : wakeup != "" && wakeup != undefined
                ? require("../../icons/time-active.png")
                : require("../../icons/time-not-active.png")
            }
            style={styles.circleImages}
          />
          <View
            style={{
              borderWidth: 1.5,
              borderColor: "#C1C9D2",
              marginBottom: mdscale(4),
              width: mdscale(44),
              borderRadius: 2,
              // marginTop: vtscale(10),
            }}
          />
        </View>
        <Text style={styles.text}>{number == 3 ? btn : wakeup}</Text>
      </View>

      <View style={styles.chekTextViews}>
        <View
          style={{
            // borderWidth: 1.5,
            borderColor: "#C1C9D2",
            marginBottom: mdscale(4),
            width: mdscale(100),
            borderRadius: 2,
            alignSelf: "flex-start",
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignSelf: "flex-start",
            alignItems: "center",
          }}
        >
          <Image
            source={
              number == 4
                ? require("../../icons/bed-time-active.png")
                : bedtime != "" && bedtime != undefined
                ? require("../../icons/bed-time-active.png")
                : require("../../icons/bed-time-not-active.png")
            }
            style={styles.circleImages}
          />
        </View>
        <Text style={styles.text}>{number == 4 ? btn : bedtime}</Text>
      </View>
    </View>
  );
};

export default HydSteps;
