import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
  NativeSyntheticEvent,
  Platform
} from "react-native";
import RNOtpVerify from "react-native-otp-verify";
import axios from "axios";
// import SmsRetriever from "react-native-sms-retriever";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

import { isAndroid, logErrorWithMessage } from "../utils/helperFunctions";
import TimerText from "./TimerText";

const RESEND_OTP_TIME_LIMIT = 50; // 30 secs
const AUTO_SUBMIT_OTP_TIME_LIMIT = 3; // 4 secs

let resendOtpTimerInterval;
let autoSubmitOtpTimerInterval;

const OtpVerification = function (props) {
  const { otpRequestData, attempts } = props;

  const [attemptsRemaining, setAttemptsRemaining] = useState(attempts);
  const [otpArray, setOtpArray] = useState(["", "", "", ""]);
  const [submittingOtp, setSubmittingOtp] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // in secs, if value is greater than 0 then button will be disabled
  const [resendButtonDisabledTime, setResendButtonDisabledTime] = useState(
    RESEND_OTP_TIME_LIMIT
  );

  // 0 < autoSubmitOtpTime < 4 to show auto submitting OTP text
  const [autoSubmitOtpTime, setAutoSubmitOtpTime] = useState(
    AUTO_SUBMIT_OTP_TIME_LIMIT
  );

  // TextInput refs to focus programmatically while entering OTP
  const firstTextInputRef = useRef(null);
  const secondTextInputRef = useRef(null);
  const thirdTextInputRef = useRef(null);
  const fourthTextInputRef = useRef(null);

  // a reference to autoSubmitOtpTimerIntervalCallback to always get updated value of autoSubmitOtpTime
  const autoSubmitOtpTimerIntervalCallbackReference = useRef();

  //   const _onPhoneNumberPressed = async () => {
  //     try {
  //       const phoneNumber = await SmsRetriever.requestPhoneNumber();
  //       console.log(phoneNumber, "phone number");
  //     } catch (error) {
  //       console.log(JSON.stringify(error));
  //     }
  //   };

  // Get the SMS message (second gif)
  //   const _onSmsListenerPressed = async () => {
  //     try {
  //       const registered = await SmsRetriever.startSmsRetriever();
  //       console.log(registered, "red");
  //       if (registered) {
  //         SmsRetriever.addSmsListener((event) => {
  //           console.log(event, "=====event.message");
  //           SmsRetriever.removeSmsListener();
  //         });
  //       }
  //     } catch (error) {
  //       console.log(JSON.stringify(error));
  //     }
  //   };

  useEffect(() => {
    if (Platform.OS === "android") {
      RNOtpVerify.getHash().then(console.log);
    }
    //
    // autoSubmitOtpTime value will be set after otp is detected,
    // in that case we have to start auto submit timer
    autoSubmitOtpTimerIntervalCallbackReference.current =
      autoSubmitOtpTimerIntervalCallback;
  });

  useEffect(() => {
    startResendOtpTimer();

    return () => {
      if (resendOtpTimerInterval) {
        clearInterval(resendOtpTimerInterval);
      }
    };
  }, [resendButtonDisabledTime]);

  useEffect(() => {
    if (Platform.OS == "ios") {
      console.log("Sorry auto read not possible on ios ");
    } else {
      RNOtpVerify.getOtp()
        .then((p) =>
          RNOtpVerify.addListener((message) => {
            try {
              if (message) {
                const messageArray = message.split("\n");
                console.log(
                  messageArray[0],
                  // messageArray[1],
                  // messageArray[2],
                  "//////messageArray "
                );
                if (messageArray[0]) {
                  const otp = messageArray[0].split(" ")[1]; //the wrod is
                  const otp1 = messageArray[0].split(" ")[0];
                  console.log(otp, "otp", otp1);
                  // if (otp1.length === 4) {
                  if (otp.length === 4) {
                    // everyery it's otp bcz the fisrt was # but right noew from backed wih #otp is not reciving so changing it from frontend
                    setOtpArray(otp.split(""));
                    props.callBack(otp.split(""));
                    // to auto submit otp in 4 secs
                    setAutoSubmitOtpTime(AUTO_SUBMIT_OTP_TIME_LIMIT);
                    startAutoSubmitOtpTimer();
                  }
                }
              }
            } catch (error) {
              logErrorWithMessage(
                error.message,
                "RNOtpVerify.getOtp - read message, OtpVerification"
              );
            }
          })
        )
        .catch((error) => {
          logErrorWithMessage(
            error.message,
            "RNOtpVerify.getOtp, OtpVerification"
          );
        });

      // remove listener on unmount
      return () => {
        RNOtpVerify.removeListener();
      };
    }
  }, []);

  const startResendOtpTimer = () => {
    if (resendOtpTimerInterval) {
      clearInterval(resendOtpTimerInterval);
    }
    resendOtpTimerInterval = setInterval(() => {
      if (resendButtonDisabledTime <= 0) {
        clearInterval(resendOtpTimerInterval);
      } else {
        setResendButtonDisabledTime(resendButtonDisabledTime - 1);
      }
    }, 1000);
  };

  // this callback is being invoked from startAutoSubmitOtpTimer which itself is being invoked from useEffect
  // since useEffect use closure to cache variables data, we will not be able to get updated autoSubmitOtpTime value
  // as a solution we are using useRef by keeping its value always updated inside useEffect(componentDidUpdate)
  const autoSubmitOtpTimerIntervalCallback = () => {
    if (autoSubmitOtpTime <= 0) {
      clearInterval(autoSubmitOtpTimerInterval);

      // submit OTP
      onSubmitButtonPress();
    }
    setAutoSubmitOtpTime(autoSubmitOtpTime - 1);
  };

  const startAutoSubmitOtpTimer = () => {
    if (autoSubmitOtpTimerInterval) {
      clearInterval(autoSubmitOtpTimerInterval);
    }
    autoSubmitOtpTimerInterval = setInterval(() => {
      autoSubmitOtpTimerIntervalCallbackReference.current();
    }, 1000);
  };

  const refCallback = (textInputRef) => (node) => {
    textInputRef.current = node;
  };

  const onResendOtpButtonPress = () => {
    console.log("Resend BUtton pressed");
    props.onResendOtpButtonPress();
    // onPressSendOTPcall();
    // clear last OTP
    if (firstTextInputRef) {
      setOtpArray(["", "", "", ""]);
      firstTextInputRef.current.focus();
    }

    setResendButtonDisabledTime(RESEND_OTP_TIME_LIMIT);
    startResendOtpTimer();

    // resend OTP Api call
    // todo
    console.log("todo: Resend OTP");
  };

  const onSubmitButtonPress = () => {
    console.log("Submitting  the otp to parent comp from chold");
    // API call
    // todo
    props.onSubmitButtonPress();
    console.log("todo: Submit OTP");
  };

  // this event won't be fired when text changes from '' to '' i.e. backspace is pressed
  // using onOtpKeyPress for this purpose
  const onOtpChange = (index) => {
    return (value) => {
      if (isNaN(Number(value))) {
        // do nothing when a non digit is pressed
        return;
      }
      const otpArrayCopy = otpArray.concat();
      otpArrayCopy[index] = value;
      setOtpArray(otpArrayCopy);
      console.log(otpArrayCopy, "/////");
      props.callBack(otpArrayCopy);
      // auto focus to next InputText if value is not blank
      if (value !== "") {
        if (index === 0) {
          secondTextInputRef.current.focus();
        } else if (index === 1) {
          thirdTextInputRef.current.focus();
        } else if (index === 2) {
          fourthTextInputRef.current.focus();
        }
      }
    };
  };

  // only backspace key press event is fired on Android
  // to have consistency, using this event just to detect backspace key press and
  // onOtpChange for other digits press
  const onOtpKeyPress = (index) => {
    return ({ nativeEvent: { key: value } }) => {
      // auto focus to previous InputText if value is blank and existing value is also blank
      if (value === "Backspace" && otpArray[index] === "") {
        if (index === 1) {
          firstTextInputRef.current.focus();
        } else if (index === 2) {
          secondTextInputRef.current.focus();
        } else if (index === 3) {
          thirdTextInputRef.current.focus();
        }

        /**
         * clear the focused text box as well only on Android because on mweb onOtpChange will be also called
         * doing this thing for us
         * todo check this behaviour on ios
         */
        if (isAndroid && index > 0) {
          const otpArrayCopy = otpArray.concat();
          otpArrayCopy[index - 1] = ""; // clear the previous box which will be in focus
          setOtpArray(otpArrayCopy);
          props.callBack(otpArrayCopy);
        }
      }
    };
  };

  console.log(submittingOtp, "submitting otp");
  return (
    <View
      style={{
        height: scale(80),
        backgroundColor: "transparent",
        flexDirection: "column",
        marginTop: 10,
        marginLeft: 5,
        marginRight: 5
      }}
    >
      {/* <View style={styles.container}> */}
      <View style={{ flexDirection: "row", margin: 10 }}>
        <Text style={{ fontSize: 15 }}>
          Enter OTP sent to your{" "}
          {otpRequestData.email_id ? "email" : "mobile number"}{" "}
        </Text>
      </View>
      <View
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            // marginRight: 12,
            marginTop: 10,
            marginLeft: 0,
            marginRight: 0
          }
        ]}
      >
        {[
          firstTextInputRef,
          secondTextInputRef,
          thirdTextInputRef,
          fourthTextInputRef
        ].map((textInputRef, index) => (
          <View
            style={{
              flexDirection: "row",
              borderColor: "#d4d4d4",
              borderWidth: 1,
              borderRadius: 4,
              padding: 8,
              flex: 1,
              marginRight: 12,
              backgroundColor: "white"
            }}
          >
            <TextInput
              value={otpArray[index]}
              onKeyPress={onOtpKeyPress(index)}
              onChangeText={onOtpChange(index)}
              keyboardType={"numeric"}
              maxLength={1}
              style={[styles.otpText, { textAlign: "center" }]}
              autoFocus={index === 0 ? true : undefined}
              key={index}
              ref={refCallback(textInputRef)}
            />
          </View>
        ))}
      </View>
      {errorMessage ? (
        <Text
          style={[
            {
              color: "#f06159",
              marginTop: 12,
              textAlign: "center"
            }
          ]}
        >
          {errorMessage}
        </Text>
      ) : null}
      {resendButtonDisabledTime > 0 ? (
        <TimerText text={"Resend OTP in"} time={resendButtonDisabledTime} />
      ) : (
        <TouchableOpacity
          disabled={submittingOtp}
          onPress={onResendOtpButtonPress}
        >
          <Text
            style={{
              marginLeft: 10,
              marginRight: 10,
              height: 30,
              marginTop: 30,
              textAlign: "center",
              fontSize: 18,
              color: "#00397e"
            }}
          >
            Resend OTP
          </Text>
        </TouchableOpacity>
      )}
      <View style={{}} />
      {submittingOtp && <ActivityIndicator />}
      {autoSubmitOtpTime > 0 &&
      autoSubmitOtpTime < AUTO_SUBMIT_OTP_TIME_LIMIT ? (
        <TimerText text={"Submitting OTP in"} time={autoSubmitOtpTime} />
      ) : null}

      <TouchableOpacity
        style={{
          backgroundColor: "#1B2B34",
          elevation: 5,
          marginTop: 50,
          borderRadius: 10,
          height: 50,
          justifyContent: "center",
          shadowOffset: { width: 2, height: 3 },
          shadowColor: "gray",
          shadowOpacity: 0.9
        }}
        onPress={onSubmitButtonPress}
        // onPress={this.onPressVerify}
        disabled={submittingOtp}
      >
        <Text
          style={{
            textAlign: "center",
            alignSelf: "center",
            fontSize: 18,
            color: "white",
            fontWeight: "bold"
          }}
        >
          VERIFY OTP
        </Text>
      </TouchableOpacity>
      {/* </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    // flex: 1
    marginLeft: 0,
    marginRight: 0
  },
  submitButtonText: {
    color: "#fff"
  },
  otpResendButton: {
    alignItems: "center",
    width: "100%",
    marginTop: 16
  },
  otpResendButtonText: {
    color: "#fe7d32",
    textTransform: "none",
    textDecorationLine: "underline"
  },
  otpText: {
    fontWeight: "bold",
    color: "#3543bf",
    fontSize: 18,
    width: "100%"
  }
});

OtpVerification.defaultProps = {
  attempts: 5,
  otpRequestData: {
    username: "sonali@1",
    email_id: false,
    phone_no: true
  }
};

OtpVerification.propTypes = {
  otpRequestData: PropTypes.object.isRequired,
  attempts: PropTypes.number.isRequired
};

export default OtpVerification;
