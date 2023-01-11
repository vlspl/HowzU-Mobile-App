import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  PermissionsAndroid,
  Platform,
  ImageBackground,
  ScrollView
} from "react-native";
import { Container } from "native-base";
import CustomeHeader from "../appComponents/CustomeHeader";
import axios from "axios";
import Constants from "../utils/Constants";
import Loader from "../appComponents/loader";

import NoDataAvailable from "../appComponents/NoDataAvailable";
import Toast from "react-native-tiny-toast";
import Modal from "react-native-modal";
const Rijndael = require("rijndael-js");
global.Buffer = global.Buffer || require("buffer").Buffer;
const padder = require("pkcs7-padding");
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ImagePicker from "react-native-image-crop-picker";
import { launchImageLibrary } from "react-native-image-picker";

export default class UserEditProfile extends Component {
  constructor(props) {
    super(props);
    //setting default state
    this.state = {
      isLoading: false,
      selectedIds: [],
      userDetails: [],
      pageNo: 1,
      searchString: "",
      paginationLoading: false,
      isNetConnected: true,
      searchLoading: false,
      refreshing: false,
      activebtn: "",
      address: "",
      city: "",
      pincode: "",
      prescriptionName: "",
      prescriptionPic: [],
      progess: 0,
      prescriptionUri: null,
      isUploading: false,
      size: 0,
      progresss: 0,
      imagePath: "",
      isModalVisible: false,
      Aadharnumber: "",
      HealthId: "",
      mainrole: "",
      Degree: "",
      Specialization: "",
      Clinic: "",
      email: ""
    };
  }

  UNSAFE_componentWillReceiveProps = (nextProp) => {
    // this.retrieveData();

    console.log(
      " UserProfile componentWillReceiveProps==============================",
      nextProp
    );
    if (nextProp.route.params.role == "doctor") {
      this.setState(
        {
          userDetails: [],
          isLoading: true,
          activebtn: nextProp.route.params.role
        },
        () => {
          this.getDoctorProfileDetail();
        }
      );
    } else {
      this.setState(
        {
          isLoading: true,
          userDetails: [],
          activebtn: nextProp.route.params.role
        },
        () => {
          this.getProfileDetail();
        }
      );
    }
  };

  componentDidMount() {
    // this.retrieveData();
    if (this.props.route.params.role == "doctor") {
      // console.log(
      //   "componentDidMount Patient=====Profile=============================="
      // );
      this.setState(
        {
          userDetails: [],
          isLoading: true,
          activebtn: this.props.route.params.role
        },
        () => {
          this.getDoctorProfileDetail();
        }
      );
    } else {
      this.setState(
        {
          userDetails: [],
          isLoading: true,
          activebtn: this.props.route.params.role
        },
        () => {
          this.getProfileDetail();
        }
      );
    }
  }

  chooseFile = async () => {
    var options = {
      title: "Select Image",

      storageOptions: {
        skipBackup: true,
        path: "images",
        saveToPhotos: true,
        privateDirectory: true,
        includeBase64: true
      }
    };
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Howzu App needs  permission"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.setState({ isModalVisible: false }, () => {
          setTimeout(() => {
            launchImageLibrary(options, (response) => {
              if (response.didCancel) {
                console.log("User cancelled image picker");
              } else if (response.error) {
                console.log("ImagePicker Error: ", response.error);
              } else {
                if (response.assets[0].fileSize > 5000000) {
                  Toast.show("Please select image size upto 5MB");
                } else {
                  let prescriptionPic = [];
                  prescriptionPic.push({
                    uri: response.assets[0]
                      ? response.assets[0].uri
                      : response.uri,
                    type: response.assets[0]
                      ? response.assets[0].type
                      : response.type,
                    name: response.assets[0]
                      ? response.assets[0].fileName
                      : response.fileName
                  });

                  this.setState(
                    {
                      isLoading: true,
                      prescriptionPic: prescriptionPic,
                      prescriptionUri: response.assets[0]
                        ? response.assets[0].uri
                        : response.uri,
                      prescriptionName: prescriptionPic[0].name
                    },
                    () => {
                      this.uploadPrescription();
                    }
                  );
                }
              }
            });
          }, 500);
        });
      } else {
      }
    } else {
      this.setState({ isModalVisible: false }, () => {
        setTimeout(() => {
          launchImageLibrary(options, (response) => {
            if (response.didCancel) {
              console.log("User cancelled image picker");
            } else if (response.error) {
              console.log("ImagePicker Error: ", response.error);
            } else {
              let prescriptionPic = [];
              prescriptionPic.push({
                uri: response.assets[0] ? response.assets[0].uri : response.uri,
                type: response.assets[0]
                  ? response.assets[0].type
                  : response.type,
                name: response.assets[0]
                  ? response.assets[0].fileName
                  : response.fileName
              });
              this.setState(
                {
                  isLoading: true,
                  prescriptionPic: prescriptionPic,
                  prescriptionUri: response.assets[0]
                    ? response.assets[0].uri
                    : response.uri,
                  prescriptionName: prescriptionPic[0].name
                },
                () => {
                  this.uploadPrescription();
                }
              );
            }
          });
        }, 500);
      });
    }
  };

  takePhotoFromCamera = () => {
    this.setState({ isModalVisible: false }, () => {
      setTimeout(() => {
        ImagePicker.openCamera({
          compressImageMaxWidth: 500,
          compressImageMaxHeight: 500,
          cropping: true,
          multiple: false,
          mediaType: "photo",
          size: 5000000,
          compressImageQuality: 1
        })
          .then((response) => {
            // console.log(response, "from camera");
            if (response.size > 5000000) {
              Toast.show("Please select image size upto 5MB");
            } else {
              let prescriptionPic = [];
              prescriptionPic.push({
                uri: response.path,
                type: response.mime,
                // name: response.fileName,
                name: response.path.slice(response.path.lastIndexOf("/") + 1)
              });
              this.setState(
                {
                  prescriptionPic: prescriptionPic,
                  prescriptionUri: response.uri,
                  prescriptionName: prescriptionPic[0].name
                },
                () => {
                  this.uploadPrescription();
                }
              );
            }
            // let prescriptionPic = [];
            // prescriptionPic.push({
            //   uri: response.path,
            //   type: response.mime,
            //   // name: response.fileName,
            //   name: response.path.slice(response.path.lastIndexOf("/") + 1),
            // });
          })
          .catch((err) => {
            Toast.show("Something Went Wrong, Please Try Again Later");
          });
      }, 500);
    });
  };

  choosePhotoFromLibrary = () => {
    this.setState({ isModalVisible: false }, () => {
      setTimeout(() => {
        ImagePicker.openPicker({
          width: 500,
          height: 500,
          multiple: false,
          cropping: true,
          compressImageQuality: 1,
          mediaType: "photo",
          size: 5000000
        })
          .then((response) => {
            //547210
            // console.log(response, "from libary");
            if (response.size > 5000000) {
              Toast.show("Please select image size upto 5MB");
            } else {
              let prescriptionPic = [];
              prescriptionPic.push({
                uri: response.path,
                type: response.mime,
                // name: response.fileName,
                name: response.path.slice(response.path.lastIndexOf("/") + 1)
              });

              this.setState(
                {
                  prescriptionPic: prescriptionPic,
                  prescriptionUri: response.uri,
                  prescriptionName: prescriptionPic[0].name
                },
                () => {
                  this.uploadPrescription();
                }
              );
            }
          })
          .catch((err) => {
            alert(err, "alert messaeg");
            this.setState({
              prescriptionPic: "",
              prescriptionUri: "",
              prescriptionName: ""
            });
          });
      }, 500);
    });
  };

  uploadPrescription = () => {
    var that = this;
    this.setState({ isUploading: true });
    let form = new FormData();

    if (this.state.prescriptionPic.length > 0) {
      form.append("", {
        name: this.state.prescriptionPic[0].name,
        uri:
          Platform.OS === "android"
            ? this.state.prescriptionPic[0].uri
            : "file://" + this.state.prescriptionPic[0].uri,
        // uri:  Platform.OS === "android" ? this.state.prescriptionPic[0].uri : this.state.prescriptionPic[0].uri.replace("file://", ""),
        // uri: 'file://' + this.state.prescriptionPic[0].uri,
        type: this.state.prescriptionPic[0].type
      });
    }
    axios({
      method: "post",
      url: Constants.UPLOAD_PROFILE,
      data: form,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data"
      },
      onUploadProgress(progressEvent) {
        that.setState({
          size: progressEvent.total,
          progresss: progressEvent.loaded / progressEvent.total
        });
      }
    })
      .then((response) => {
        var responseObj = JSON.parse(response.data);
        if (responseObj.Status) {
          this.setState(
            {
              imagePath: responseObj.Path,
              isLoading: false,
              isUploading: false
            },
            () => { }
          );
        } else {
        }
      })
      .catch((e) => {
        Toast.show("Something Went Wrong, Please Try Again Later");
      });
  };
  async getDoctorProfileDetail() {
    try {
      const response = await axios.get(Constants.GET_DOCTOR_PROFILE);
      this.setState({ isLoading: false });
      //Toast.show(response.data.Msg)
      let responseData = this.state.userDetails;
      // console.log(responseData, "@ getting profile pic  ResponaseData");
      response.data.MyDetails.map((item) => {
        responseData.push(item);
      });

      this.setState({
        userDetails: responseData,
        isLoading: false,
        address:
          responseData[0]["Address"] != null ? responseData[0]["Address"] : "",
        city: responseData[0]["City"] != null ? responseData[0]["City"] : "",
        pincode:
          responseData[0]["Pincode"] != null ? responseData[0]["Pincode"] : "",
        imagePath:
          responseData[0]["ProfilePic"] != null
            ? responseData[0]["ProfilePic"]
            : "",
        Aadharnumber:
          responseData[0]["AadharCard"] != null
            ? this.Decrypt(responseData[0]["AadharCard"])
            : "",
        Degree:
          responseData[0]["Degree"] != null ? responseData[0]["Degree"] : "",
        Specialization: responseData[0]["Specialization"],
        Clinic: responseData[0]["Clinic"],
        email: this.Decrypt(responseData[0]["EmailId"])
      });
    } catch (error) {
      // Toast.show(
      //   "Network Error,Please check youre internet connection or try again later"
      // );
      Toast.show("Something Went Wrong, Please Try Again Later");

      this.setState({ isLoading: false });
      console.log(error);
    }
  }

  async getProfileDetail() {
    try {
      const response = await axios.get(Constants.GET_USERPROFILE);
      //console.log(response.data);
      this.setState({ isLoading: false });
      //Toast.show(response.data.Msg)
      let responseData = this.state.userDetails;

      response.data.MyDetails.map((item) => {
        // item.isShow=false;
        responseData.push(item);
      });

      this.setState({
        userDetails: responseData,
        isLoading: false,
        address:
          responseData[0]["Address"] != null ? responseData[0]["Address"] : "",
        city: responseData[0]["City"] != null ? responseData[0]["City"] : "",
        pincode:
          responseData[0]["Pincode"] != null ? responseData[0]["Pincode"] : "",
        imagePath:
          responseData[0]["ProfilePic"] != null
            ? responseData[0]["ProfilePic"]
            : "",
        email:
          responseData[0]["EmailId"] != null
            ? this.Decrypt(responseData[0]["EmailId"])
            : "",
        Aadharnumber:
          responseData[0]["AadharCard"] != null
            ? this.Decrypt(responseData[0]["AadharCard"])
            : "",
        HealthId:
          responseData[0]["HealthId"] != null
            ? this.Decrypt(responseData[0]["HealthId"])
            : ""
      });
    } catch (error) {
      // Toast.show(
      //   "Network Error,Please check youre internet connection or try again later"
      // );
      Toast.show("Something Went Wrong, Please Try Again Later");

      this.setState({ isLoading: false });
      console.log(error);
    }
  }

  handleChange(text) {
    if (isNaN(text)) {
      Toast.show("Please enter only number");
    } else {
      this.setState({ pincode: text });
    }
  }

  ClosePOPup = () => {
    this.setState({ isModalVisible: false }, () => { });
  };
  onSubmit = () => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (this.state.pincode == "") {
      Toast.show("Please enter pincode number");
    } else if (
      this.state.email != "" &&
      reg.test(this.state.email.trimEnd()) === false
    ) {
      Toast.show("Please enter valid email");
    } else if (this.state.pincode.length != 6) {
      Toast.show("Please enter valid pincode number");
    } else if (
      this.state.Aadharnumber != "" &&
      this.state.Aadharnumber.length != 12
    ) {
      Toast.show("Aadharnumber must be 12 digit");
    } else {
      this.setState({ isLoading: true });
      this.updateUserProfile();
    }
  };

  updateUserProfile = async () => {
    if (this.state.activebtn == "doctor") {
      //  http://endpoint.visionarylifescience.com/Doctor/UpdateDoctor
      try {
        let response = await axios.post(Constants.UPDATE_DOCTOR, {
          Address: this.state.address,
          Pincode: this.state.pincode,
          City: this.state.city,
          ProfileIamge: this.state.imagePath,
          Aadharcard: this.state.Aadharnumber,
          Degree: this.state.Degree,
          SpecialistIn: this.state.Specialization,
          Clinic: this.state.Clinic,
          EmailId: this.state.email
        });
        // console.log("data==============", response.data);
        this.setState({ isLoading: false });
        if (response.data.Status) {
          // console.log(response.data.Status, "Navigation ");
          Toast.show(response.data.Msg);
          this.setState({
            //AllMyPatients: this.removeDuplicate(responseData),
            isLoading: false,
            address: "",
            city: "",
            pincode: ""
          });

          this.props.route.params.comeback();
          this.props.navigation.navigate("UserProfile", {
            refresh: true,
            role: this.state.activebtn
          });
        } else {
          Toast.show(response.data.Msg);
          this.setState({
            isLoading: false
          });
        }
      } catch (errors) {
        // Toast.show(
        //   "Network Error,Please check you're internet connection or try again later"
        // );
        Toast.show("Something Went Wrong, Please Try Again Later");
        // Toast.show(errors);
        this.setState({
          isLoading: false
        });
        console.log(errors);
      }
      //
    } else {
      // http://endpoint.visionarylifescience.com/Patient/UpdatePatient
      try {
        let response = await axios.post(Constants.UPDATE_PATIENT, {
          Address: this.state.address,
          Pincode: this.state.pincode,
          City: this.state.city,
          ProfileIamge: this.state.imagePath,
          Aadharcard: this.state.Aadharnumber,
          HealthId: this.state.HealthId,
          EmailId: this.state.email
        });
        this.setState({ isLoading: false });
        if (response.data.Status) {
          // console.log(response.data.Status, "Navigation ");
          Toast.show(response.data.Msg);
          this.setState({
            //AllMyPatients: this.removeDuplicate(responseData),
            isLoading: false,
            address: "",
            city: "",
            pincode: ""
          });

          if (this.props.route.params.comeback != undefined) {
            this.props.route.params.comeback();
          }

          this.props.navigation.navigate("UserProfile", {
            refresh: true,
            role: this.state.activebtn
          });
        } else {
          Toast.show(response.data.Msg);
          this.setState({
            isLoading: false
          });
        }
      } catch (errors) {
        // Toast.show(
        //   "Network Error,Please check you're internet connection or try again later"
        // );
        Toast.show("Something Went Wrong, Please Try Again Later");

        console.log(errors, "user edit proifle erro");
        // Toast.show(errors);
        this.setState({
          isLoading: false
        });
        console.log(errors);
      }
    }
  };

  Decrypt = (encryptStr) => {
    // console.log(encryptStr, 'user edit profile ');

    if (encryptStr) {
      const cipher = new Rijndael("1234567890abcder", "cbc");
      const plaintext = Buffer.from(
        cipher.decrypt(
          new Buffer(encryptStr, "base64"),
          128,
          "1234567890abcder"
        )
      );
      const decrypted = padder.unpad(plaintext, 32);
      const clearText = decrypted.toString("utf8");

      return clearText.toString();
    } else return "";
  };

  render() {
    // console.log(
    //   this.state.userDetails.length,
    //   'user deasl leng',
    //   this.state.imagePath != null
    // );
    return (
      <Container>
        <Loader loading={this.state.isLoading} />

        <CustomeHeader
          title="Edit Profile"
          headerId={1}
          navigation={this.props.navigation}
        />
        <Modal isVisible={this.state.isModalVisible} style={{ margin: 0 }}>
          <View
            style={{
              flexDirection: "column",
              width: "80%",
              height: "25%",
              backgroundColor: "white",
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View
              style={{
                justifyContent: "center",
                backgroundColor: "white",
                marginTop: 10,
                marginLeft: 0,
                marginRight: 0,
                alignItems: "center"
              }}
            >
              <TouchableOpacity onPress={this.takePhotoFromCamera}>
                <Text style={{ textAlign: "center", fontSize: 16, margin: 10 }}>
                  Take Photo
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.choosePhotoFromLibrary}>
                <Text
                  style={{ textAlign: "center", fontSize: 15, margin: 10 }}
                  numberOfLines={1}
                >
                  Choose From Library
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.chooseFile}>
                <Text
                  style={{ textAlign: "center", fontSize: 15, margin: 10 }}
                  numberOfLines={1}
                >
                  Choose From Gallery
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                // style={{
                //   flexDirection: 'column',
                //   height: 65,
                //   width: 50,
                //   backgroundColor: 'white',
                //   // marginLeft: 30,
                // }}
                onPress={this.ClosePOPup}
              >
                <Text style={{ textAlign: "center", fontSize: 15, margin: 10 }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={{ flex: 1, justifyContent: "center", paddingTop: 0 }}>
          {this.state.userDetails.length <= 0 ? (
            <NoDataAvailable onPressRefresh={this.onRefresh} />
          ) : this.state.activebtn == "doctor" ? (
            <>
              <KeyboardAwareScrollView enableOnAndroid={true}>
                <View
                  style={{
                    height: verticalScale(260),
                    // height: 200,
                    backgroundColor: "white",
                    justifyContent: "center",
                    flexDirection: "column"
                  }}
                >
                  <View
                    style={{
                      height: 100,
                      justifyContent: "center",
                      flexDirection: "row"
                    }}
                  >
                    {this.state.isUploading == false &&
                      this.state.imagePath != "" &&
                      this.state.imagePath != null && (
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({ isModalVisible: true });
                          }}
                        >
                          <ImageBackground
                            source={{
                              uri: Constants.PROFILE_PIC + this.state.imagePath
                            }}
                            style={{
                              height: 100,
                              width: 100
                              // marginTop: 22,
                            }}
                            imageStyle={{ borderRadius: 55 }}
                          >
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({ isModalVisible: true });
                              }}
                            >
                              <View
                                style={{
                                  flex: 1,
                                  marginTop: 100,
                                  justifyContent: "flex-end",
                                  alignItems: "flex-end"
                                }}
                              >
                                <Image
                                  source={require("../../icons/camera.png")}
                                  style={{ height: 40, width: 40 }}
                                ></Image>
                              </View>
                            </TouchableOpacity>
                          </ImageBackground>
                        </TouchableOpacity>
                      )}

                    {this.state.isUploading == false &&
                      (this.state.imagePath == null ||
                        this.state.imagePath == "") && (
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({ isModalVisible: true });
                          }}
                        >
                          <ImageBackground
                            source={require("../../icons/Placeholder.png")}
                            style={{
                              height: 100,
                              width: 100
                              // marginTop: 22,
                            }}
                            imageStyle={{ borderRadius: 55 }}
                          >
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({ isModalVisible: true });
                              }}
                            >
                              <View
                                style={{
                                  flex: 1,
                                  marginTop: 100,
                                  justifyContent: "flex-end",
                                  alignItems: "flex-end"
                                }}
                              >
                                <Image
                                  source={require("../../icons/camera.png")}
                                  style={{ height: 40, width: 40 }}
                                ></Image>
                              </View>
                            </TouchableOpacity>
                          </ImageBackground>
                        </TouchableOpacity>
                      )}

                    {this.state.isUploading && (
                      <View
                        style={{
                          flexDirection: "row",
                          height: 20,
                          backgroundColor: "white",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}
                      >
                        <Loader loading={this.state.isUploading} />
                      </View>
                    )}
                  </View>

                  <Text
                    style={{
                      height: 25,
                      textAlign: "center",
                      marginTop: 10,
                      fontSize: 18,
                      fontWeight: "bold",
                      justifyContent: "center"
                    }}
                  >
                    {this.state.userDetails[0]["FullName"]}
                  </Text>
                  <Text
                    style={{
                      height: 25,
                      textAlign: "center",
                      marginTop: 6,
                      fontSize: 16,
                      fontWeight: "normal",
                      color: "gray"
                    }}
                    numberOfLines={1}
                  >
                    {this.Decrypt(this.state.userDetails[0]["EmailId"])}
                  </Text>
                </View>

                <View
                  style={{
                    // height: verticalScale(60),
                    backgroundColor: "white",
                    flexDirection: "column",
                    marginLeft: 15,
                    marginRight: 15
                  }}
                >
                  <Text
                    style={{
                      // height: verticalScale(20),
                      // height: 25,
                      textAlign: "left",
                      marginTop: 6,
                      fontSize: 16,
                      fontWeight: "bold"
                    }}
                  >
                    Email
                  </Text>
                  <TextInput
                    style={{
                      textAlign: "left",
                      flex: 1,
                      paddingLeft: 4,
                      fontSize: 15,
                      height: Platform.OS === "ios" ? 30 : null
                    }}
                    keyboardType={"email-address"}
                    onChangeText={(val) => this.setState({ email: val })}
                    value={this.state.email}
                    underlineColorAndroid="transparent"
                    placeholder="Enter email here.."
                    allowFontScaling={false}
                  />
                </View>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "gray",
                    marginLeft: 15,
                    marginRight: 15,
                    marginTop: 3
                  }}
                ></View>
                <View
                  style={{
                    // height: verticalScale(60),
                    backgroundColor: "white",
                    flexDirection: "column",
                    marginLeft: 15,
                    marginRight: 15
                  }}
                >
                  <Text
                    style={{
                      // height: verticalScale(20),
                      // height: 25,
                      textAlign: "left",
                      marginTop: 6,
                      fontSize: 16,
                      fontWeight: "bold"
                    }}
                  >
                    Aadhar number
                  </Text>
                  <TextInput
                    style={{
                      textAlign: "left",
                      flex: 1,
                      paddingLeft: 4,
                      fontSize: 15,
                      height: Platform.OS === "ios" ? 30 : null
                    }}
                    maxLength={12}
                    keyboardType={"number-pad"}
                    onChangeText={(val) => this.setState({ Aadharnumber: val })}
                    value={this.state.Aadharnumber}
                    underlineColorAndroid="transparent"
                    placeholder="Enter aadhar here.."
                    allowFontScaling={false}
                  />
                </View>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "gray",
                    marginLeft: 15,
                    marginRight: 15,
                    marginTop: 3
                  }}
                ></View>
                <View
                  style={{
                    // height: verticalScale(60),
                    backgroundColor: "white",
                    flexDirection: "column",
                    marginLeft: 15,
                    marginRight: 15
                    // backgroundColor: 'red',
                  }}
                >
                  <Text
                    style={{
                      // height: 25,
                      textAlign: "left",
                      marginTop: 6,
                      fontSize: 16,
                      fontWeight: "bold"
                    }}
                  >
                    Degree
                    <Text style={{ color: "red" }}> *</Text>
                  </Text>
                  <TextInput
                    style={{
                      textAlign: "left",
                      flex: 1,
                      paddingLeft: 4,
                      fontSize: 15,
                      height: Platform.OS === "ios" ? 30 : null
                    }}
                    onChangeText={(val) => this.setState({ Degree: val })}
                    value={this.state.Degree}
                    underlineColorAndroid="transparent"
                    placeholder="Enter Degree here.."
                    allowFontScaling={false}
                  />
                  <View
                    style={{
                      height: 0.5,
                      backgroundColor: "gray",
                      marginLeft: 0,
                      marginRight: 0,
                      marginTop: 3
                    }}
                  ></View>
                </View>
                <View
                  style={{
                    // height: verticalScale(60),
                    backgroundColor: "white",
                    flexDirection: "column",
                    marginLeft: 15,
                    marginRight: 15
                  }}
                >
                  <Text
                    style={{
                      height: 25,
                      textAlign: "left",
                      marginTop: 6,
                      fontSize: 16,
                      fontWeight: "bold"
                    }}
                  >
                    Specialization
                    <Text style={{ color: "red" }}> *</Text>
                  </Text>
                  <TextInput
                    style={{
                      textAlign: "left",
                      flex: 1,
                      paddingLeft: 4,
                      fontSize: 15,
                      height: Platform.OS === "ios" ? 30 : null
                    }}
                    onChangeText={(val) =>
                      this.setState({ Specialization: val })
                    }
                    value={this.state.Specialization}
                    underlineColorAndroid="transparent"
                    placeholder="Enter Specialization here.."
                    allowFontScaling={false}
                  />
                </View>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "gray",
                    marginLeft: 15,
                    marginRight: 15,
                    marginTop: 3
                  }}
                ></View>

                <View
                  style={{
                    // height: verticalScale(60),
                    backgroundColor: "white",
                    flexDirection: "column",
                    marginLeft: 15,
                    marginRight: 15
                  }}
                >
                  <Text
                    style={{
                      height: 25,
                      textAlign: "left",
                      marginTop: 6,
                      fontSize: 16,
                      fontWeight: "bold"
                    }}
                  >
                    Clinic
                  </Text>
                  <TextInput
                    style={{
                      textAlign: "left",
                      flex: 1,
                      paddingLeft: 4,
                      fontSize: 15,
                      height: Platform.OS === "ios" ? 30 : null
                    }}
                    onChangeText={(val) => this.setState({ Clinic: val })}
                    value={this.state.Clinic}
                    underlineColorAndroid="transparent"
                    placeholder="Enter Clinic here.."
                    allowFontScaling={false}
                  />
                </View>

                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "gray",
                    marginLeft: 15,
                    marginRight: 15,
                    marginTop: 3
                  }}
                ></View>

                <View
                  style={{
                    // height: verticalScale(60),
                    backgroundColor: "white",
                    flexDirection: "column",
                    marginLeft: 15,
                    marginRight: 15
                    // backgroundColor: 'red',
                  }}
                >
                  <Text
                    style={{
                      marginLeft: 3,
                      // height: verticalScale(20),
                      // height: 25,
                      textAlign: "left",
                      marginTop: 6,
                      fontSize: 16,
                      fontWeight: "bold"
                      // backgroundColor: 'red',
                    }}
                  >
                    Address
                  </Text>
                  <TextInput
                    style={{
                      textAlign: "left",
                      flex: 1,
                      paddingLeft: 4,
                      fontSize: 15,
                      // backgroundColor: 'red',
                      height: Platform.OS === "ios" ? 30 : null
                    }}
                    onChangeText={(val) => this.setState({ address: val })}
                    value={this.state.address}
                    underlineColorAndroid="transparent"
                    placeholder="Enter address here.."
                    allowFontScaling={false}
                  />
                </View>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "gray",
                    marginLeft: 15,
                    marginRight: 15,
                    marginTop: 3
                  }}
                ></View>
                <View
                  style={{
                    // height: verticalScale(60),
                    backgroundColor: "white",
                    flexDirection: "column",
                    marginLeft: 15,
                    marginRight: 15
                    // backgroundColor: 'red',
                  }}
                >
                  <Text
                    style={{
                      marginLeft: 3,
                      // height: verticalScale(20),
                      // height: 25,
                      textAlign: "left",
                      marginTop: 6,
                      fontSize: 16,
                      fontWeight: "bold"
                    }}
                  >
                    City
                  </Text>
                  <TextInput
                    style={{
                      textAlign: "left",
                      flex: 1,
                      paddingLeft: 4,
                      fontSize: 15,
                      // backgroundColor: 'red',
                      height: Platform.OS === "ios" ? 30 : null
                    }}
                    onChangeText={(val) => this.setState({ city: val })}
                    value={this.state.city}
                    underlineColorAndroid="transparent"
                    placeholder="Enter city here.."
                    allowFontScaling={false}
                  />
                </View>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "gray",
                    marginLeft: 15,
                    marginRight: 15,
                    marginTop: 4
                  }}
                ></View>
                <View
                  style={{
                    // height: verticalScale(60),
                    backgroundColor: "white",
                    flexDirection: "column",
                    marginLeft: 15,
                    marginRight: 15
                    // marginTop: 3,
                  }}
                >
                  <Text
                    style={{
                      marginLeft: 3,
                      // height: verticalScale(20),
                      height: 25,
                      textAlign: "left",
                      marginTop: 6,
                      fontSize: 16,
                      fontWeight: "bold"
                    }}
                  >
                    Pincode <Text style={{ color: "red" }}>*</Text>
                  </Text>
                  <TextInput
                    style={{
                      textAlign: "left",
                      flex: 1,
                      paddingLeft: 4,
                      fontSize: 15,
                      height: Platform.OS === "ios" ? 30 : null
                    }}
                    onChangeText={(text) => {
                      this.handleChange(text);
                    }}
                    // onChangeText={(val) => this.setState({ pincode: val })}
                    value={this.state.pincode}
                    maxLength={6}
                    keyboardType={"number-pad"}
                    underlineColorAndroid="transparent"
                    placeholder="Enter pincode here.."
                    allowFontScaling={false}
                  />
                </View>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "gray",
                    marginLeft: 15,
                    marginRight: 15,
                    marginTop: 3
                  }}
                ></View>

                {/* Update Button */}
                <TouchableOpacity
                  style={{
                    backgroundColor: "#1B2B34",
                    margin: 20,
                    marginTop: 30,
                    borderRadius: 10,
                    height: 40,
                    justifyContent: "center",
                    shadowOffset: { width: 2, height: 3 },
                    shadowColor: "gray",
                    shadowOpacity: 0.9,
                    marginLeft: 50,
                    marginRight: 50,
                    elevation: 5
                  }}
                  onPress={this.onSubmit}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      alignSelf: "center",
                      fontSize: 14,
                      color: "white",
                      fontWeight: "bold"
                    }}
                  >
                    Update Profile
                  </Text>
                </TouchableOpacity>
              </KeyboardAwareScrollView>
            </>
          ) : (
            <>
              <KeyboardAwareScrollView enableOnAndroid={true}>
                <View
                  style={{
                    height: verticalScale(260),
                    // height: 200,
                    backgroundColor: "white",
                    justifyContent: "center",
                    flexDirection: "column"
                  }}
                >
                  <View
                    style={{
                      height: 100,
                      justifyContent: "center",
                      flexDirection: "row"
                    }}
                  >
                    {this.state.isUploading == false &&
                      this.state.imagePath != "" &&
                      this.state.imagePath != null && (
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({ isModalVisible: true });
                          }}
                        >
                          <ImageBackground
                            source={{
                              uri: Constants.PROFILE_PIC + this.state.imagePath
                            }}
                            style={{
                              height: 100,
                              width: 100
                              // marginTop: 22,
                            }}
                            imageStyle={{ borderRadius: 55 }}
                          >
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({ isModalVisible: true });
                              }}
                            >
                              <View
                                style={{
                                  flex: 1,
                                  marginTop: 100,
                                  justifyContent: "flex-end",
                                  alignItems: "flex-end"
                                }}
                              >
                                <Image
                                  source={require("../../icons/camera.png")}
                                  style={{ height: 40, width: 40 }}
                                ></Image>
                              </View>
                            </TouchableOpacity>
                          </ImageBackground>
                        </TouchableOpacity>
                      )}

                    {this.state.isUploading == false &&
                      (this.state.imagePath == null ||
                        this.state.imagePath == "") && (
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({ isModalVisible: true });
                          }}
                        >
                          <ImageBackground
                            source={require("../../icons/Placeholder.png")}
                            style={{
                              height: 100,
                              width: 100
                              // marginTop: 22,
                            }}
                            imageStyle={{ borderRadius: 55 }}
                          >
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({ isModalVisible: true });
                              }}
                            >
                              <View
                                style={{
                                  flex: 1,
                                  marginTop: 100,
                                  justifyContent: "flex-end",
                                  alignItems: "flex-end"
                                }}
                              >
                                <Image
                                  source={require("../../icons/camera.png")}
                                  style={{ height: 40, width: 40 }}
                                ></Image>
                              </View>
                            </TouchableOpacity>
                          </ImageBackground>
                        </TouchableOpacity>
                      )}

                    {this.state.isUploading && (
                      <View
                        style={{
                          flexDirection: "row",
                          height: 20,
                          backgroundColor: "white",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}
                      >
                        <Loader loading={this.state.isUploading} />
                      </View>
                    )}
                  </View>

                  <Text
                    style={{
                      height: 25,
                      textAlign: "center",
                      // marginTop: 10,
                      fontSize: 18,
                      fontWeight: "bold",
                      justifyContent: "center"
                    }}
                  >
                    {this.state.userDetails[0]["FullName"]}
                  </Text>
                  <Text
                    style={{
                      height: 25,
                      textAlign: "center",
                      marginTop: 6,
                      fontSize: 16,
                      fontWeight: "normal",
                      color: "gray"
                    }}
                    numberOfLines={1}
                  >
                    {this.Decrypt(this.state.userDetails[0]["EmailId"])}
                  </Text>
                </View>

                <View
                  style={{
                    // height: verticalScale(60),
                    backgroundColor: "white",
                    flexDirection: "column",
                    marginLeft: 15,
                    marginRight: 15
                  }}
                >
                  <Text
                    style={{
                      // height: verticalScale(20),
                      // height: 25,
                      textAlign: "left",
                      marginTop: 6,
                      fontSize: 16,
                      fontWeight: "bold"
                    }}
                  >
                    Email
                  </Text>
                  <TextInput
                    style={{
                      textAlign: "left",
                      flex: 1,
                      paddingLeft: 4,
                      fontSize: 15,
                      height: Platform.OS === "ios" ? 30 : null
                    }}
                    keyboardType={"email-address"}
                    onChangeText={(val) => this.setState({ email: val })}
                    value={this.state.email}
                    underlineColorAndroid="transparent"
                    placeholder="Enter email here.."
                    allowFontScaling={false}
                  />
                </View>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "gray",
                    marginLeft: 15,
                    marginRight: 15,
                    marginTop: 3
                  }}
                ></View>
                <View
                  style={{
                    // height: verticalScale(60),
                    backgroundColor: "white",
                    flexDirection: "column",
                    marginLeft: 15,
                    marginRight: 15
                  }}
                >
                  <Text
                    style={{
                      // height: verticalScale(20),
                      // height: 25,
                      textAlign: "left",
                      marginTop: 6,
                      fontSize: 16,
                      fontWeight: "bold"
                    }}
                  >
                    Aadhar number
                  </Text>
                  <TextInput
                    style={{
                      textAlign: "left",
                      flex: 1,
                      paddingLeft: 4,
                      fontSize: 15,
                      height: Platform.OS === "ios" ? 35 : null,
                      color: "gray"
                      // fontWeight:'bold'
                    }}
                    maxLength={12}
                    keyboardType={"number-pad"}
                    onChangeText={(val) => this.setState({ Aadharnumber: val })}
                    value={this.state.Aadharnumber}
                    underlineColorAndroid="transparent"
                    placeholder="Enter aadhar here.."
                    placeholderTextColor="gray"
                    allowFontScaling={false}
                  />
                </View>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "gray",
                    marginLeft: 15,
                    marginRight: 15,
                    marginTop: 3
                  }}
                ></View>
                <View
                  style={{
                    // height: verticalScale(60),
                    backgroundColor: "white",
                    flexDirection: "column",
                    marginLeft: 15,
                    marginRight: 15
                  }}
                >
                  <Text
                    style={{
                      height: 25,
                      textAlign: "left",
                      marginTop: 6,
                      fontSize: 16,
                      fontWeight: "bold"
                    }}
                  >
                    ABHA
                  </Text>
                  <TextInput
                    style={{
                      textAlign: "left",
                      flex: 1,
                      paddingLeft: 4,
                      fontSize: 15,
                      height: Platform.OS === "ios" ? 30 : null
                    }}
                    onChangeText={(val) => this.setState({ HealthId: val })}
                    value={this.state.HealthId}
                    underlineColorAndroid="transparent"
                    placeholder="Enter health id here.."
                    placeholderTextColor="gray"
                    allowFontScaling={false}
                  />
                </View>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "gray",
                    marginLeft: 15,
                    marginRight: 15,
                    marginTop: 3
                  }}
                ></View>
                <View
                  style={{
                    // height: verticalScale(60),
                    backgroundColor: "white",
                    flexDirection: "column",
                    marginLeft: 15,
                    marginRight: 15
                    // backgroundColor: 'red',
                  }}
                >
                  <Text
                    style={{
                      marginLeft: 3,
                      // height: verticalScale(20),
                      // height: 25,
                      textAlign: "left",
                      marginTop: 6,
                      fontSize: 16,
                      fontWeight: "bold"
                      // backgroundColor: 'red',
                    }}
                  >
                    Address
                  </Text>
                  <TextInput
                    style={{
                      textAlign: "left",
                      flex: 1,
                      paddingLeft: 4,
                      fontSize: 15,
                      // backgroundColor: 'red',
                      height: Platform.OS === "ios" ? 30 : null
                    }}
                    onChangeText={(val) => this.setState({ address: val })}
                    value={this.state.address}
                    underlineColorAndroid="transparent"
                    placeholder="Enter address here.."
                    placeholderTextColor="gray"
                    allowFontScaling={false}
                  />
                </View>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "gray",
                    marginLeft: 15,
                    marginRight: 15,
                    marginTop: 3
                  }}
                ></View>
                <View
                  style={{
                    // height: verticalScale(60),
                    backgroundColor: "white",
                    flexDirection: "column",
                    marginLeft: 15,
                    marginRight: 15
                    // backgroundColor: 'red',
                  }}
                >
                  <Text
                    style={{
                      marginLeft: 3,
                      // height: verticalScale(20),
                      // height: 25,
                      textAlign: "left",
                      marginTop: 6,
                      fontSize: 16,
                      fontWeight: "bold"
                    }}
                  >
                    City
                  </Text>
                  <TextInput
                    style={{
                      textAlign: "left",
                      flex: 1,
                      paddingLeft: 4,
                      fontSize: 15,
                      // backgroundColor: 'red',
                      height: Platform.OS === "ios" ? 30 : null
                    }}
                    onChangeText={(val) => this.setState({ city: val })}
                    value={this.state.city}
                    underlineColorAndroid="transparent"
                    placeholder="Enter city here.."
                    placeholderTextColor="gray"
                    allowFontScaling={false}
                  />
                </View>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "gray",
                    marginLeft: 15,
                    marginRight: 15,
                    marginTop: 4
                  }}
                ></View>
                <View
                  style={{
                    // height: verticalScale(60),
                    backgroundColor: "white",
                    flexDirection: "column",
                    marginLeft: 15,
                    marginRight: 15
                    // marginTop: 3,
                  }}
                >
                  <Text
                    style={{
                      marginLeft: 3,
                      // height: verticalScale(20),
                      height: 25,
                      textAlign: "left",
                      marginTop: 6,
                      fontSize: 16,
                      fontWeight: "bold"
                    }}
                  >
                    Pincode <Text style={{ color: "red" }}>*</Text>
                  </Text>
                  <TextInput
                    style={{
                      textAlign: "left",
                      flex: 1,
                      paddingLeft: 4,
                      fontSize: 15,
                      height: Platform.OS === "ios" ? 30 : null
                    }}
                    onChangeText={(text) => {
                      this.handleChange(text);
                    }}
                    // onChangeText={(val) => this.setState({ pincode: val })}
                    value={this.state.pincode}
                    maxLength={6}
                    keyboardType={"number-pad"}
                    underlineColorAndroid="transparent"
                    placeholder="Enter pincode here.."
                    placeholderTextColor="gray"
                    allowFontScaling={false}
                  />
                </View>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "gray",
                    marginLeft: 15,
                    marginRight: 15,
                    marginTop: 3
                  }}
                ></View>

                {/* Update Button */}
                <TouchableOpacity
                  style={{
                    backgroundColor: "#1B2B34",
                    margin: 20,
                    marginTop: 30,
                    borderRadius: 10,
                    height: 40,
                    justifyContent: "center",
                    shadowOffset: { width: 2, height: 3 },
                    shadowColor: "gray",
                    shadowOpacity: 0.9,
                    marginLeft: 50,
                    marginRight: 50,
                    elevation: 5
                  }}
                  onPress={this.onSubmit}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      alignSelf: "center",
                      fontSize: 14,
                      color: "white",
                      fontWeight: "bold"
                    }}
                  >
                    Update Profile
                  </Text>
                </TouchableOpacity>
              </KeyboardAwareScrollView>
            </>
          )}
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#FF6347",
    alignItems: "center",
    marginTop: 10
  },
  panel: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    paddingTop: 20
  },
  header: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#333333",
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    // elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  panelHeader: {
    alignItems: "center"
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00000040",
    marginBottom: 10
  },
  panelTitle: {
    fontSize: 27,
    height: 35
  },
  panelSubtitle: {
    fontSize: 14,
    color: "gray",
    height: 30,
    marginBottom: 10
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: "#FF6347",
    alignItems: "center",
    marginVertical: 7
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white"
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a"
  }
});
