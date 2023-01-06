import React from "react";
import {
  ImageBackground,
  TouchableOpacity,
  Text,
  Dimensions,
  Image
} from "react-native";
import { Footer, Body, Left, Right, Icon, Input, View } from "native-base";

const CustomeFooter = (props) => {
  const screenWidth = Math.round(Dimensions.get("window").width);

  if (props.footerId == 1) {
    return (
      <Footer style={{ backgroundColor: "white" }}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            backgroundColor: "lightgray",
            justifyContent: "center",
            shadowColor: "white",
            shadowOffset: { width: 5, height: 0 },
            shadowOpacity: 0.9,
            shadowRadius: 0,
            elevation: 5
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: "row",
                backgroundColor: "transparent",
                alignItems: "center",
                justifyContent: "center"
              }}
              onPress={props.onPressHome}
            >
              {props.home == "select" ? (
                <Image
                  source={require("../../icons/home-1.png")}
                  style={{ height: 26, width: 26 }}
                />
              ) : (
                <Image
                  source={require("../../icons/home-11.png")}
                  style={{ height: 26, width: 26 }}
                />
              )}

              <Text
                style={{
                  fontSize: 12,
                  color: "#595858",
                  textAlign: "right",
                  backgroundColor: "white",
                  marginLeft: 10
                }}
              >
                Home
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              backgroundColor: "white",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: "row",
                backgroundColor: "transparent",
                alignItems: "center",
                justifyContent: "center"
              }}
              onPress={props.onPressPatient}
            >
              <View
                style={{
                  flexDirection: "column",
                  zIndex: 5,
                  marginTop: -15,
                  height: 80,
                  width: 80,
                  backgroundColor: "white",
                  borderRadius: 40,
                  borderWidth: 1,
                  borderColor: "lightgray",
                  shadowColor: "lightgray",
                  shadowOffset: { width: 2, height: -3 },
                  shadowOpacity: 0.9,
                  shadowRadius: 3,
                  elevation: 5,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Image
                  source={require("../../icons/Profile-3.png")}
                  style={{ height: 26, width: 26 }}
                />
                <Text
                  style={{
                    fontSize: 11,
                    color: "#595858",
                    textAlign: "center",
                    backgroundColor: "white",
                    marginLeft: 0
                  }}
                >
                  My Patient
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: "row",
                backgroundColor: "transparent",
                alignItems: "center",
                justifyContent: "center"
              }}
              onPress={props.onPressProfile}
            >
              {props.profile == "select" ? (
                <Image
                  source={require("../../icons/Profile-33.png")}
                  style={{ height: 26, width: 26 }}
                />
              ) : (
                <Image
                  source={require("../../icons/Profile-3.png")}
                  style={{ height: 26, width: 26 }}
                />
              )}

              <Text
                style={{
                  fontSize: 12,
                  color: "#595858",
                  textAlign: "right",
                  backgroundColor: "white",
                  marginLeft: 5
                }}
              >
                Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Footer>
    );
  } else if (props.footerId == 2) {
    return (
      <Footer style={{ backgroundColor: "white" }}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            backgroundColor: "lightgray",
            justifyContent: "center",
            shadowColor: "white",
            shadowOffset: { width: 5, height: 0 },
            shadowOpacity: 0.9,
            shadowRadius: 0,
            elevation: 5
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: "row",
                backgroundColor: "transparent",
                alignItems: "center",
                justifyContent: "center"
              }}
              onPress={props.onPressHome}
            >
              {props.home == "select" ? (
                <Image
                  source={require("../../icons/home-1.png")}
                  style={{ height: 26, width: 26 }}
                />
              ) : (
                <Image
                  source={require("../../icons/home-11.png")}
                  style={{ height: 26, width: 26 }}
                />
              )}

              <Text
                style={{
                  fontSize: 12,
                  color: "#595858",
                  textAlign: "right",
                  backgroundColor: "white",
                  marginLeft: 10
                }}
              >
                Home
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              backgroundColor: "white",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: "row",
                backgroundColor: "transparent",
                alignItems: "center",
                justifyContent: "center"
              }}
              onPress={props.onPressProfile}
            >
              <View
                style={{
                  flexDirection: "column",
                  zIndex: 5,
                  marginTop: -15,
                  height: 80,
                  width: 80,
                  backgroundColor: "white",
                  borderRadius: 40,
                  borderWidth: 1,
                  borderColor: "lightgray",
                  shadowColor: "lightgray",
                  shadowOffset: { width: 2, height: -3 },
                  shadowOpacity: 0.9,
                  shadowRadius: 3,
                  elevation: 5,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {/* <Image
                  source={require("../../icons/Profile-3.png")}
                  style={{ height: 26, width: 26 }}
                /> */}
                {props.profile == "select" ? (
                  <Image
                    source={require("../../icons/Profile-33.png")}
                    style={{ height: 26, width: 26 }}
                  />
                ) : (
                  <Image
                    source={require("../../icons/Profile-3.png")}
                    style={{ height: 26, width: 26 }}
                  />
                )}
                <Text
                  style={{
                    fontSize: 11,
                    color: "#595858",
                    textAlign: "center",
                    backgroundColor: "white",
                    marginLeft: 0
                  }}
                >
                  My Profile
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: "row",
                backgroundColor: "transparent",
                alignItems: "center",
                justifyContent: "center"
              }}
              onPress={props.onPressLogout}
            >
              {props.logout == "select" ? (
                <Image
                  source={require("../../icons/logout-b.png")}
                  style={{ height: 26, width: 26 }}
                />
              ) : (
                <Image
                  source={require("../../icons/logout-g.png")}
                  style={{ height: 26, width: 26 }}
                />
              )}

              <Text
                style={{
                  fontSize: 12,
                  color: "#595858",
                  textAlign: "right",
                  backgroundColor: "white",
                  marginLeft: 5
                }}
              >
                Log Out
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Footer>
    );
  } else {
    return (
      <Footer style={{ backgroundColor: "white" }}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            backgroundColor: "lightgray",
            justifyContent: "center",
            shadowColor: "white",
            shadowOffset: { width: 5, height: 0 },
            shadowOpacity: 0.9,
            shadowRadius: 0,
            elevation: 5
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: "row",
                backgroundColor: "transparent",
                alignItems: "center",
                justifyContent: "center"
              }}
              onPress={props.onPressHome}
            >
              {props.home == "select" ? (
                <Image
                  source={require("../../icons/home-1.png")}
                  style={{ height: 26, width: 26 }}
                />
              ) : (
                <Image
                  source={require("../../icons/home-11.png")}
                  style={{ height: 26, width: 26 }}
                />
              )}
              <Text
                style={{
                  fontSize: 12,
                  color: "#595858",
                  textAlign: "right",
                  backgroundColor: "white",
                  marginLeft: 10
                }}
              >
                Home
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              backgroundColor: "white",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: "row",
                backgroundColor: "transparent",
                alignItems: "center",
                justifyContent: "center"
              }}
              onPress={props.onPressBookTest}
            >
              <View
                style={{
                  flexDirection: "column",
                  zIndex: 5,
                  marginTop: -15,
                  height: 80,
                  width: 80,
                  backgroundColor: "white",
                  borderRadius: 40,
                  borderWidth: 1,
                  borderColor: "lightgray",
                  shadowColor: "lightgray",
                  shadowOffset: { width: 2, height: -3 },
                  shadowOpacity: 0.9,
                  shadowRadius: 3,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Image
                  source={require("../../icons/Book-Test-22.png")}
                  style={{ height: 26, width: 26 }}
                />
                <Text
                  style={{
                    fontSize: 11,
                    color: "#595858",
                    textAlign: "center",
                    backgroundColor: "white",
                    marginLeft: 0
                  }}
                >
                  Book test
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: "row",
                backgroundColor: "transparent",
                alignItems: "center",
                justifyContent: "center"
              }}
              onPress={props.onPressProfile}
            >
              {props.profile == "select" ? (
                <Image
                  source={require("../../icons/Profile-33.png")}
                  style={{ height: 26, width: 26 }}
                />
              ) : (
                <Image
                  source={require("../../icons/Profile-3.png")}
                  style={{ height: 26, width: 26 }}
                />
              )}
              <Text
                style={{
                  fontSize: 12,
                  color: "#595858",
                  textAlign: "right",
                  backgroundColor: "white",
                  marginLeft: 5
                }}
              >
                Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Footer>
    );
  }
};

export default CustomeFooter;
