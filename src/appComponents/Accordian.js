import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  Image
} from "react-native";

import Icon from "react-native-vector-icons/MaterialIcons";
const CustomeDrawerItem = (props) => (
  <TouchableOpacity
    style={{
      flexDirection: "row",
      alignItems: "center",
      height: 50,
      backgroundColor: "white"
    }}
    onPress={props.onPressItem}
  >
    <View
      style={{
        width: 30,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 20
      }}
    >
      {props.itemName == "Add Oxygen" &&
      props.itemName != "Add Body Temperature" ? (
        props.itemName == "Add Oxygen" && (
          <Image style={{ height: 45, width: 45 }} source={props.img} />
        )
      ) : (
        <>
          {props.itemName != "Add Body Temperature" &&
            props.itemName != "My Health Diary" && (
              <Image style={{ height: 27, width: 27 }} source={props.img} />
            )}
        </>
      )}
      {props.itemName == "Add Body Temperature" && (
        <Image style={{ height: 40, width: 40 }} source={props.img} />
      )}
      {props.itemName == "Add My Health Diary" && (
        <Image style={{ height: 30, width: 30 }} source={props.img} />
      )}
      {/* <Image style={{ height: 20, width: 20 }} source={props.img} /> */}
    </View>

    <Text style={{ fontSize: 16, marginLeft: 15 }}>{props.itemName}</Text>
  </TouchableOpacity>
);
export default class Accordian extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      expanded: false
    };

    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  render() {
    return (
      <View>
        <TouchableOpacity
          ref={this.accordian}
          style={styles.row}
          onPress={() => this.toggleExpand()}
        >
          <View
            style={{
              width: 30,
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 10
            }}
          >
            <Image
              source={this.props.icon}
              style={{ height: 35, width: 35 }}
            ></Image>
          </View>
          <Text style={[styles.title]}>{this.props.title}</Text>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              marginEnd: 10
            }}
          >
            <Icon
              name={
                this.state.expanded
                  ? "keyboard-arrow-up"
                  : "keyboard-arrow-down"
              }
              size={30}
              color={"#5E5E5E"}
            />
          </View>
        </TouchableOpacity>
        <View style={styles.parentHr} />
        {this.state.expanded && (
          <View style={styles.child}>
            {/* <Text>{this.props.data}sonali</Text> */}
            {this.props.data.map((itm) => {
              return (
                <CustomeDrawerItem
                  itemName={itm.data}
                  img={itm.img}
                  onPressItem={() => {
                    if (itm.data == "Hydration Reminder") {
                      if (this.props.ishyddetailsExisit) {
                        this.props.navigation.closeDrawer();
                        this.props.navigation.navigate("HydrationScreen", {
                          refresh: true
                        });
                      } else {
                        this.props.navigation.closeDrawer();
                        this.props.navigation.navigate("HydGenderScreen", {
                          refresh: true
                        });
                      }
                    } else {
                      this.props.navigation.closeDrawer();
                      this.props.navigation.navigate(itm.navtoScreen, {
                        refresh: true
                      });
                    }
                  }}
                />
              );
            })}
          </View>
        )}
      </View>
    );
  }

  toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ expanded: !this.state.expanded });
  };
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 15
    // color: "#4169e1"
  },
  row: {
    flexDirection: "row",
    // justifyContent: "space-between",
    height: 50,
    // paddingLeft: 5,
    // paddingRight: 18,
    alignItems: "center",
    backgroundColor: "#fff"
  },
  parentHr: {
    height: 1,
    color: "#ffffff",
    width: "100%"
  },
  child: {
    backgroundColor: "#fff",
    padding: 16
  }
});
