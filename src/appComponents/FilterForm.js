import * as React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Button,
  StyleSheet,
  TextInput,
  ImageBackground,
  Dimensions,
} from "react-native";
import { useTheme } from "@react-navigation/native";
// import { Button, Divider } from "react-native-paper";
// import styles from "../styles/AllStyles";
// import Label from "./Label";
import SelectMultiple from "react-native-select-multiple";
// import MultiSlider from "@ptomasroos/react-native-multi-slider";
import MultiSlider from "react-native-slider";
//import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CustomeHeader from "./CustomeHeader";
import { Header, Body, Left, Right, Icon, Input } from "native-base";

export default FilterForm = (props) => {
  const screenWidth = Math.round(Dimensions.get("window").width);

  const { colors } = useTheme();
  const [menuItems, setMenuItems] = React.useState([
    { id: "1", name: "Size" },
    { id: "2", name: "Price" },
    { id: "3", name: "Color" },
    { id: "4", name: "Brand" },
  ]);
  const [size, setSelectedSize] = React.useState({ size: [] });
  const SizeChart = ["S", "M", "XL", "XXL", "L"];
  const [multiSliderValue, setMultiSliderValue] = React.useState([100, 10000]);
  const [color, setColor] = React.useState({ color: [] });
  const ColorChart = [
    "Blue",
    "Black",
    "White",
    "Purple",
    "Pink",
    "Orange",
    "Red",
    "Yellow",
  ];

  const multiSliderValuesChange = (values) => setMultiSliderValue(values);

  const [selectedItem, setSelectedItem] = React.useState("1");

  return (
    <View style={{ backgroundColor: "#fff", flex: 1 }}>
      <View
        style={{
          marginTop: 20,
          height: 60,
          backgroundColor: "red",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
                onPress={props.toggleModal}
                style={{ padding: 5 }}
              >
                <Image
                  style={{ height: 50, width: 50 }}
                  source={require("../../icons/newclose.png")}
                ></Image>
              </TouchableOpacity>
            </Left>

            <Body>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
                >
                  Filter By
                </Text>
              </View>
            </Body>
            <Right></Right>
          </ImageBackground>
        </Header>
      </View>

      <View style={styles.textSign}>
        <Text style={[styles.textSign, { color: "blue", marginBottom: 10 }]}>
          {"   "}
        </Text>
      </View>
      <View
        style={{
          height: 0.5,

          backgroundColor: "gray",
          marginLeft: 10,
          marginRight: 10,
          marginTop: 5,
        }}
      />
      <View style={{ flexDirection: "row", flex: 0.9 }}>
        <View
          style={{
            flex: 0.4,
            flexDirection: "column",
            borderRightColor: "#333",
            borderRightWidth: 1,
            height: "100%",
          }}
        >
          {menuItems.map((item, index) => {
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => setSelectedItem(item.id)}
                style={[
                  {
                    flex: 0,
                    height: "20%",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                  item.id === selectedItem
                    ? {
                        backgroundColor: "#F8F8FF",
                        borderLeftColor: colors.text,
                        borderLeftWidth: 5,
                      }
                    : null,
                ]}
              >
                <Text
                  style={{
                    marginLeft: 10,
                    alignSelf: "flex-start",
                    color: colors.text,
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ flex: 0.6, padding: 15 }}>
          {selectedItem === "3" && (
            <View style={{ flex: 1 }}>
              <SelectMultiple
                selectedItemTextColor={colors.title}
                selectedItemIconColor={colors.text}
                items={ColorChart}
                selectedItems={color.color}
                onSelectionsChange={(itm, ind) => {
                  console.log(itm, "selection");
                  setColor({ ...color, color: itm });
                }}
              />
            </View>
          )}

          {selectedItem === "1" && (
            <View style={styles.container}>
              <SelectMultiple
                items={SizeChart}
                selectedItems={size.size}
                onSelectionsChange={(itm, ind) => {
                  console.log(itm, "selection");
                  setSelectedSize({ ...size, size: itm });
                }}
              />
            </View>
          )}
          {selectedItem === "4" && (
            <View style={styles.container}>
              <Text>No brand </Text>
            </View>
          )}
        </View>
      </View>
      <View
        style={{
          height: 0.5,
          //width: "95%",

          backgroundColor: "gray",
          marginLeft: 10,
          marginRight: 10,
          marginTop: 5,
        }}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          title=" Cancel"
          onPress={props.toggleModal}
          color="#841584"
        ></Button>
        <Button
          title=" Apply"
          onPress={props.toggleModal}
          color="#841584"
        ></Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#fff",
    textAlign: "center",
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 10,
    textAlign: "left",
    fontFamily: "Roboto",
    fontStyle: "normal",
  },
});
