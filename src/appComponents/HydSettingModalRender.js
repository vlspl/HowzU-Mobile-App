import React from "react";

import {
  Text,
  View,
  TouchableOpacity,
  Modal as RNModal,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { scale } from "react-native-size-matters";
import DynamicallySelectedPicker from "react-native-dynamically-selected-picker";
import Rediobutton from "./Rediobutton";
import Slider from "react-native-slider";
const SettingModalRender = (props) => {
  console.log(props.value, "hydmodal");
  return (
    <RNModal visible={props.visible} transparent style={{ flex: 1, margin: 0 }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View
            style={{
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 0,
                marginTop: 0,
                height: 60,
                justifyContent: "flex-start",
                alignItems: "center",
                // borderColor: "gray",
                // borderBottomWidth: 0.2,
              }}
            >
              <View
                style={{
                  flex: 1,
                  alignSelf: "center",
                  justifyContent: "center",
                }}
              >
                {props.title && (
                  <Text
                    style={[
                      styles.title,
                      { marginLeft: 20, fontWeight: "normal", fontSize: 20 },
                    ]}
                  >
                    {props.title}
                  </Text>
                )}
                {props.children}
              </View>

              {/* Modal top Close Button */}
              <View
                style={{
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  marginTop: -5,
                  alignSelf: "center",
                }}
              >
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={props.onCancel}
                >
                  <Image
                    source={require("../../icons/CLOSE2.png")}
                    // source={require("../../icons/CLOSE2.png")}
                    style={{
                      height: 15,
                      width: 15,
                      margin: 15,
                      marginTop: 0,
                      alignSelf: "baseline",
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View>
            {/* Main content  */}
            <View
              style={{
                height: 0.5,
                marginLeft: 15,
                marginRight: 10,
                marginTop: 8,
                backgroundColor: "#d8d8d8",
                padding: 0.5,
              }}
            ></View>
            <ScrollView
              alwaysBounceVertical={true}
              showsHorizontalScrollIndicator={false}
              style={{ backgroundColor: "white", marginTop: 0 }}
            >
              <View
                style={[
                  {
                    flex: 1,
                    margin: 5,
                  },
                ]}
              >
                {props.title == "Adjust Intake goal" && (
                  <>
                    <View
                      style={[
                        {
                          // height: 40,
                          width: "60%",
                          borderRadius: 16,
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "row",
                          flex: 1,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.header2,
                          {
                            marginTop: 10,
                            color: "#0F52BA",
                            marginLeft: 100,
                            fontSize: 18,
                          },
                        ]}
                      >
                        {props.value}ml
                      </Text>
                      <Image
                        style={{
                          height: 20,
                          width: 20,
                          marginTop: 12,
                          resizeMode: "contain",
                          marginLeft: 0,
                        }}
                        source={require("../../icons/switch-account.png")}
                      ></Image>
                    </View>

                    <Slider
                      step={1}
                      minimumValue={0}
                      maximumValue={5000}
                      value={Number(props.value)}
                      onValueChange={(value) => props.onValueChange(value)}
                      minimumTrackTintColor="#275BB4"
                      maximumTrackTintColor="#d3d3d3"
                      thumbTintColor="#275BB4"
                    />
                    <Text
                      style={[
                        styles.header2,
                        {
                          marginTop: -10,
                          color: "gray",
                          marginLeft: 100,
                          fontSize: 12,
                        },
                      ]}
                    >
                      {"Recommended   "}
                    </Text>
                  </>
                )}

                {props.title == "Gender" && (
                  <>
                    <View
                      style={[
                        {
                          flex: 1,

                          justifyContent: "flex-start",
                          alignItems: "flex-start",
                        },
                      ]}
                    >
                      {props.value == "Male" ? (
                        <Rediobutton
                          // onpress={() => this.setState({ activeGender: "Male" })}
                          onpress={() => {
                            props.onValueChange("Male");
                          }}
                          buttonimg={require("../../icons/radio-on.png")}
                          gender="Male"
                          from="Hyd"
                        ></Rediobutton>
                      ) : (
                        <Rediobutton
                          // onpress={() => this.setState({ activeGender: "Male" })}
                          onpress={() => {
                            props.onValueChange("Male");
                          }}
                          buttonimg={require("../../icons/radio-off.png")}
                          gender="Male"
                          // from="Hyd"
                        ></Rediobutton>
                      )}
                      {props.value == "Female" ? (
                        <Rediobutton
                          onpress={() => props.onValueChange("Female")}
                          buttonimg={require("../../icons/radio-on.png")}
                          gender="Female"
                          from="Hyd"
                        ></Rediobutton>
                      ) : (
                        <Rediobutton
                          onpress={() => props.onValueChange("Female")}
                          buttonimg={require("../../icons/radio-off.png")}
                          gender="Female"
                        ></Rediobutton>
                      )}
                    </View>
                  </>
                )}
                {props.title == "Weight" && (
                  <>
                    <View
                      style={[
                        {
                          flex: 1,

                          justifyContent: "center",
                          alignItems: "center",
                        },
                      ]}
                    >
                      <DynamicallySelectedPicker
                        items={props.wightkg}
                        onScroll={({ index, item }) => {
                          props.onValueChange(item.label);
                        }}
                        selectedItemBorderColor={"lightgray"}
                        allItemsColor={"#2761B3"}
                        fontSize={21}
                        transparentItemRows={1}
                        initialSelectedIndex={props.value - 1}
                        height={85}
                        width={100}
                      />
                    </View>
                  </>
                )}
              </View>
            </ScrollView>
            <View
              style={{
                height: 0.5,
                marginLeft: 15,
                marginRight: 10,
                marginTop: 8,
                backgroundColor: "#d8d8d8",
                padding: 0.5,
              }}
            ></View>
            <View
              style={{
                flex: 1,

                marginBottom: 20,
                // backgroundColor: "white",
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "stretch",
                marginRight: 40,
                marginTop: 15,
              }}
            >
              <TouchableOpacity
                style={{
                  height: 30,
                  // marginBottom: 20,
                }}
                onPress={props.onCancel}
              >
                <Text style={styles.title}> CANCEL </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  height: 30,
                  // marginBottom: 20,
                }}
                onPress={props.onPressOk}
              >
                <Text style={[styles.title, { color: "#2761B3" }]}> OK </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </RNModal>
  );
};
export default SettingModalRender;

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    color: "#000",
    flexDirection: "column",
    backgroundColor: "white",
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalView: {
    flex: 0.4,
    height: "100%",
    paddingTop: 0,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    margin: 20,
  },
  closeBtn: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginVertical: 18,
    marginRight: 3.5,
    alignItems: "flex-end",
  },
  header2: {
    flex: 1,

    fontSize: 18,
    fontWeight: "bold",

    marginTop: 30,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
});
