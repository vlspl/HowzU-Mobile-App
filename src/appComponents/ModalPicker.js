import React, { Component, useState } from 'react';
import { Container, Header, Content, Form, Item, Input, Label } from 'native-base'
// import Colors from '../utils/Colors';
// import AppStyle from '../styles/AppStyles';
import { ScrollView, View, Text, Platform, TouchableOpacity, TextInput, ImageBackground, Image, StyleSheet, Animated } from 'react-native';
// import { scale, verticalScale, moderateScale } from '../utils/screenSize';
import Modal from 'react-native-modal';
import CustomeSpace from './CustomeSpace';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from "moment";
// import Ripple from 'react-native-material-ripple';
import { TouchableOpacity } from "react-native";

import DateTimePickerModal from "react-native-modal-datetime-picker";
const ModalPicker = (props) => {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios' ? true : false,);
    setDate(currentDate);
    // props.onSelectDate(selectedDate)
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };
  return (
    <TouchableOpacity onPress={showDatepicker} style={{ flex: 1, height: verticalScale(35), borderBottomColor: Colors.WHITE_SILVER, borderBottomWidth: 1, justifyContent: "flex-end", marginBottom: verticalScale(2), }}>
      <View style={[AppStyle.rowCntrSpcBtwn]}>
        <Text style={[AppStyle.fontsize12, { paddingBottom: verticalScale(1) }]}>{props.val != "" ? moment(props.val).format("DD/MM/YYYY") : ""}</Text>
        <Image source={require("../assets/images/date.png")} style={[AppStyle.heightWidth12px]} />
      </View>
      {
        props.val != "" ?
          <Text style={[AppStyle.fontsize12, AppStyle.fontBold, { position: "absolute", top: verticalScale(3) }]}>{props.placeholder}{props.valid ? <Text style={{ color: Colors.ErrorColorRed }}> *</Text> : null}</Text> :
          <Text style={[AppStyle.fontsize12, AppStyle.fontBold, { position: "absolute", bottom: verticalScale(1) }]}>{props.placeholder}{props.valid ? <Text style={{ color: Colors.ErrorColorRed }}> *</Text> : null}</Text>
      }

      {show && (
        <DateTimePickerModal
          isVisible={show}
          mode="date"
          onConfirm={(date) => {
            setShow(false)
            props.onSelectDate(date)
          }
          }
          onCancel={() => setShow(false)}
        />


      )}
    </TouchableOpacity>
  )
}

export default ModalPicker