import React from "react";
import {
  ImageBackground,
  TouchableOpacity,
  Text,
  Dimensions,
  Image
} from "react-native";
import { Header, Body, Left, Right, Icon, Input, View } from "native-base";

const CustomeHeader = (props) => {
  // console.log(props, 'Custom header');
  const screenWidth = Math.round(Dimensions.get("window").width);

  if (props.headerId == 1) {
    return (
      <Header
        androidStatusBarColor="#275BB4"
        noShadow
        style={{ backgroundColor: "#275BB4" }}
      >
        <ImageBackground
          source={require("../../icons/bg-all.png")}
          style={{ width: screenWidth, height: "100%", flexDirection: "row" }}
          resizeMode="contain"
        >
          <Left>
            <TouchableOpacity
              onPress={() => props.navigation.goBack()}
              style={{ padding: 5 }}
            >
              <Image
                style={{ height: 25, width: 25 }}
                source={require("../../icons/back.png")}
              ></Image>
            </TouchableOpacity>
          </Left>

          <Body>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
              >
                {props.title}
              </Text>
            </View>
          </Body>
          <Right>
            <TouchableOpacity
              style={{ padding: 5 }}
              onPress={props.onPressRight}
            >
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "bold",
                  color: "white",
                  marginLeft: 15
                }}
              >
                {props.rightTitle}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ padding: 5 }}
              onPress={() => props.navigation.navigate("Audio")}
            >
              <Image
                source={require("../../icons/micheader.png")}
                style={{ height: 30, width: 30 }}
              />
            </TouchableOpacity>
          </Right>
        </ImageBackground>
      </Header>
    );
  } else if (props.headerId == 2) {
    return (
      <Header
        androidStatusBarColor="#275BB4"
        noShadow
        style={{ backgroundColor: "#275BB4" }}
      >
        <ImageBackground
          source={require("../../icons/bg-all.png")}
          style={{ width: screenWidth, height: "100%", flexDirection: "row" }}
          resizeMode="contain"
        >
          <Left>
            <TouchableOpacity
              onPress={props.onPressback}
              style={{ padding: 5 }}
            >
              <Image
                style={{ height: 25, width: 25 }}
                source={require("../../icons/back.png")}
              ></Image>
            </TouchableOpacity>
          </Left>

          <Body>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
              >
                {props.title}
              </Text>
            </View>
          </Body>
          <Right>
            <TouchableOpacity style={{ padding: 5 }} onPress={props.onPressQR}>
              <Image
                source={props.Qricon}
                style={{ height: 30, width: 30, marginTop: 15 }}
              />
              <Text
                style={{ fontSize: 17, fontWeight: "bold", color: "white" }}
              >
                {props.rightTitle}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ padding: 5 }}
              onPress={props.onPressRight}
            >
              <Image
                source={props.Ricon}
                style={{ height: 30, width: 30, marginTop: 15 }}
              />
              <Text
                style={{ fontSize: 17, fontWeight: "bold", color: "white" }}
              >
                {props.rightTitle}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ padding: 5 }}
              onPress={() => props.navigation.navigate("Audio")}
            >
              <Image
                source={require("../../icons/micheader.png")}
                style={{ height: 30, width: 30, marginTop: 15 }}
              />
              <Text
                style={{ fontSize: 17, fontWeight: "bold", color: "white" }}
              >
                {props.rightTitle}
              </Text>
            </TouchableOpacity>
          </Right>
        </ImageBackground>
      </Header>
    );
  } else if (props.headerId == 3) {
    return (
      <Header
        androidStatusBarColor="#275BB4"
        noShadow
        style={{ backgroundColor: "#275BB4" }}
      >
        <ImageBackground
          source={require("../../icons/bg-all.png")}
          style={{ width: screenWidth, height: "100%", flexDirection: "row" }}
          resizeMode="contain"
        >
          <Left>
            <TouchableOpacity
              onPress={props.onPressback}
              style={{ padding: 5 }}
            >
              <Image
                style={{ height: 25, width: 25 }}
                source={require("../../icons/back.png")}
              ></Image>
            </TouchableOpacity>
          </Left>

          <Body>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
              >
                {props.title}
              </Text>
            </View>
          </Body>
          <Right>
            <TouchableOpacity style={{ padding: 5 }} onPress={props.onPressQR}>
              <Image
                source={props.Qricon}
                style={{ height: 30, width: 30, marginTop: 15 }}
              />
              <Text
                style={{ fontSize: 17, fontWeight: "bold", color: "white" }}
              >
                {props.rightTitle}
              </Text>
            </TouchableOpacity>
          </Right>
        </ImageBackground>
      </Header>
    );
  } else {
    return (
      <Header
        androidStatusBarColor="#275BB4"
        noShadow
        style={{ backgroundColor: "#275BB4" }}
      >
        <ImageBackground
          source={require("../../icons/bg-all.png")}
          style={{ width: screenWidth, height: "100%", flexDirection: "row" }}
          resizeMode="contain"
        >
          <Left>
            <TouchableOpacity
              onPress={() => props.navigation.openDrawer()}
              style={{ padding: 5, marginLeft: 10 }}
            >
              <Image
                style={{ height: 25, width: 25 }}
                source={require("../../icons/menu.png")}
              ></Image>
            </TouchableOpacity>
          </Left>

          <Body>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
              >
                {props.title}
              </Text>
            </View>
          </Body>
          <Right>
            <TouchableOpacity
              style={{ padding: 5 }}
              onPress={props.onPress}
            ></TouchableOpacity>
            <TouchableOpacity
              style={{ padding: 5 }}
              onPress={() => props.navigation.navigate("Audio")}
            >
              <Image
                source={require("../../icons/micheader.png")}
                style={{ height: 30, width: 30, marginTop: 15 }}
              />
              <Text
                style={{ fontSize: 17, fontWeight: "bold", color: "white" }}
              >
                {props.rightTitle}
              </Text>
            </TouchableOpacity>
          </Right>
        </ImageBackground>
      </Header>
    );
  }
};

export default CustomeHeader;
