import React, { Component } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
const { width } = Dimensions.get("window");
// const minAge = 1;
// const segmentsLength = 200;
// const segmentsLength1 = 127;
// const segmentWidth = 2;
// const segmentSpacing = 20;
// const spacerWidth = (width - segmentWidth) / 2;
// const snapTo = segmentWidth + segmentSpacing;
// const rulerWidth = width + (segmentsLength - 1) * snapTo;
// const indicatorWrapperWidth = 100;

export class CustomSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    //   console.log(this.props);
    return (
      <View style={this.props.ruler}>
        <View style={this.props.spacer} />
        {this.props.data.map((i) => {
          const tenth = i % 10 === 0;
          return (
            <View
              key={i}
              style={[
                this.props.segment,
                {
                  backgroundColor: tenth ? "#4c3e5c" : "#4c3e5c30",
                  height: tenth ? 40 : 20,
                  marginRight: 20,
                  // marginRight: i === data.length - 1 ? 0 : segmentSpacing,
                },
              ]}
            ></View>
          );
        })}

        <View style={this.props.spacer} />
      </View>
    );
  }
}

// const styles = StyleSheet.create({
//   spacer: {
//     width: 0.1,
//     height: 100,
//   },
//   container: {
//     top: 100,
//   },
//   title: {
//     padding: 20,
//     fontSize: 18,
//   },
//   ruler: {
//     width: rulerWidth,
//     alignItems: "flex-end",
//     justifyContent: "flex-start",
//     flexDirection: "row",
//     flex: 1,
//   },
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   segment: {
//     width: segmentWidth,
//   },

//   indicator: {
//     height: 32,
//     width: segmentWidth + 2,
//     backgroundColor: "#f5afaf",
//   },
// });
