import React from "react";
import { StyleSheet, Text } from "react-native";

const TimerText = (props) => {
  const { text, time } = props;

  return (
    <Text style={[styles.resendOtpTimerText]}>
      {text}
      <Text style={styles.resendOtpTimerText}>{" " + time}s</Text>
    </Text>
  );
};

const styles = StyleSheet.create({
  resendOtpTimerText: {
    fontSize: 12,
    justifyContent: "center",
    marginTop: 10
  }
});

export default TimerText;
