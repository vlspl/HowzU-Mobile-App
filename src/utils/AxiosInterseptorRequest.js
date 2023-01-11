import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import Constants from "./Constants";

async function getMyObject() {
  try {
    const jsonValue = await AsyncStorage.getItem(Constants.TOKEN_KEY);
    return jsonValue != null ? jsonValue : null;
  } catch (e) { }
}

export default axios.interceptors.request.use(async (req) => {
  // console.log(req.url, ".....");
  let userData = await getMyObject();
  if (
    // req.url == Constants.LOGIN ||
    // req.url == Constants.REGISTER ||
    // req.url == Constants.VERIFY_OTP ||
    // req.url == Constants.FORGOT_PASSWORD ||
    // req.url == Constants.RESEND_OTP
    req.url == Constants.GET_SIGNIN ||
    req.url == Constants.GET_SIGNUP ||
    req.url == Constants.GET_OTPVERIFY ||
    req.url == Constants.GET_SETPASSWORD ||
    req.url == Constants.FORGOTPASS_SENDOTP ||
    req.url == Constants.GET_SENDOTP
  ) {
  } else {
    // console.log('::::::::::', 'Bearer ' + userData);
    req.headers.Authorization = "Bearer " + userData;
    //  console.log("::::::::::","Bearer "+req)
  }
  return req;
});
