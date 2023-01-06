import React from "react";
import { TouchableOpacity, View, Image, Text, TextInput } from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import RNDateTimePickerForAndroid from "@react-native-community/datetimepicker";

const GrapgDateInputCard = (props) => {
  return (
    <View
      style={{
        height: 50,
        backgroundColor: "white",
        flexDirection: "row",
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        borderColor: "lightgray",
        borderWidth: 1,
        borderRadius: 5,
        alignItems: "center",
        // width: 150,
        flex: 1
      }}
    >
      <TouchableOpacity onPress={props.onPress}>
        <Image
          source={require("../../icons/date-of-birth.png")}
          style={{
            height: 20,
            width: 20,
            justifyContent: "center",
            alignSelf: "center"
          }}
        />
      </TouchableOpacity>
      {props.isVisible && Platform.OS == "ios" ? (
        <DateTimePicker
          isVisible={props.isVisible}
          onConfirm={props.onDateChange}
          onCancel={props.onCancel}
          maximumDate={props.maxDate}
          // maximumDate={new Date()}
        />
      ) : null}
      {props.isVisible && Platform.OS == "android" ? (
        <RNDateTimePickerForAndroid
          testID="dateTimePicker"
          value={new Date()}
          is24Hour={false}
          display="spinner"
          onChange={props.onDateChange}
          maximumDate={props.maxDate}
          // maximumDate={new Date()}
        />
      ) : null}
      <View
        style={{
          height: 34,
          width: 1,
          marginTop: 10,
          marginBottom: 8,
          marginLeft: 10,
          backgroundColor: "lightgray",
          alignItems: "center"
        }}
      ></View>

      <View
        style={{
          // flex: 1,
          justifyContent: "flex-start",
          marginLeft: 12

          // width: 150,
        }}
      >
        <TouchableOpacity onPress={props.onPress}>
          <Text
            style={{
              marginLeft: 0,
              color: props.date == "" ? "gray" : "black",
              alignSelf: "stretch"
            }}
          >
            {props.date == ""
              ? props.placeholder
              : moment(props.date).format("DD/MM/YYYY")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GrapgDateInputCard;
