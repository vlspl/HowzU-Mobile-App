import React from "react";
import {
  TouchableOpacity,
  View,
  Image,
  Text,
  StyleSheet,
  Platform,
} from "react-native";

const ReportAnalyteCard = (props) => (
  <View style={styles.container}>
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        backgroundColor: "white",
        marginTop: 0,
      }}
    >
      <View style={{ flex: 1, flexDirection: "row", marginTop: 0 }}>
        <Text
          style={{
            fontSize: 12,
            paddingTop: 2,
            color: "gray",
            marginLeft: 5,
            width: 50,
            backgroundColor: "white",
          }}
        >
          Analyte:
        </Text>
        <Text
          style={{
            flex: 1,
            fontSize: 12,
            marginTop: 0,
            color: "black",
            marginRight: 10,
            textAlign: "right",
            backgroundColor: "white",
            padding: 2,
          }}
        >
          {props.analyte}
        </Text>
      </View>
      <View
        style={{
          height: 0.5,
          backgroundColor: "lightgray",
          marginTop: 5,
          padding: 0.5,
        }}
      ></View>
    </View>

    <View
      style={{
        flex: 1,
        flexDirection: "row",
        marginTop: 5,
        // backgroundColor: 'red',
      }}
    >
      <Text
        style={{
          fontSize: 12,
          paddingTop: 2,
          color: "gray",
          marginLeft: 5,
          width: 70,
          backgroundColor: "white",
        }}
      >
        SubAnalyte:
      </Text>
      <Text
        style={{
          flex: 1,
          fontSize: 12,
          marginTop: 0,
          color: "black",
          marginRight: 10,
          textAlign: "right",
          backgroundColor: "white",
          padding: 2,
        }}
      >
        {props.subanalyte}
      </Text>
    </View>
    <View
      style={{ height: 0.5, backgroundColor: "lightgray", marginTop: 5 }}
    ></View>

    <View
      style={{
        flex: 1,
        flexDirection: "row",
        marginTop: 5,
        // backgroundColor: 'red',
      }}
    >
      <Text
        style={{
          fontSize: 12,
          paddingTop: 2,
          color: "gray",
          marginLeft: 5,
          width: 70,
          backgroundColor: "white",
        }}
      >
        Specimen:
      </Text>
      <Text
        style={{
          flex: 1,
          fontSize: 12,
          marginTop: 0,
          color: "black",
          marginRight: 10,
          textAlign: "right",
          backgroundColor: "white",
          padding: 2,
        }}
      >
        {props.specimen}
      </Text>
    </View>
    <View
      style={{
        height: 0.5,
        backgroundColor: "lightgray",
        marginTop: 5,
        padding: 0.5,
      }}
    ></View>

    <View
      style={{
        flex: 1,
        flexDirection: "row",
        marginTop: 0,
        // backgroundColor: 'red',
      }}
    >
      {props.iszero == "No" && (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            marginTop: 5,
            // backgroundColor: 'red',
          }}
        >
          <Text
            style={{
              fontSize: 12,
              paddingTop: 2,
              color: "gray",
              marginLeft: 5,
              width: 50,
              backgroundColor: "white",
            }}
          >
            Value:
          </Text>
          <Text
            style={{
              flex: 1,
              fontSize: 12,
              marginTop: 0,
              color: "black",
              marginRight: 10,
              textAlign: "right",
              backgroundColor: "white",
              padding: 2,
            }}
          >
            {props.value}
          </Text>
        </View>
      )}
      {props.iszero == "No" && (
        <View style={{ flex: 1, flexDirection: "row", marginTop: 5 }}>
          <Text
            style={{
              fontSize: 12,
              paddingTop: 2,
              color: "gray",
              marginLeft: 5,
              width: 50,
              backgroundColor: "white",
            }}
          >
            Range:
          </Text>
          <Text
            style={{
              flex: 1,
              fontSize: 12,
              marginTop: 0,
              color: "black",
              marginRight: 10,
              textAlign: "right",
              backgroundColor: "white",
              padding: 2,
            }}
          >
            {props.range}
          </Text>
        </View>
      )}
    </View>
    {props.iszero == "No" && (
      <View
        style={{
          height: 0.5,
          backgroundColor: "lightgray",
          marginTop: 5,
        }}
      ></View>
    )}
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        marginTop: 5,
        justifyContent: "space-between",
        // backgroundColor: 'red',
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
        }}
      >
        <Text
          style={{
            fontSize: 12,
            paddingTop: 2,
            color: "gray",
            marginLeft: 5,
            width: 100,
            backgroundColor: "white",
          }}
        >
          Result:
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "flex-end",

          position: "relative",
        }}
      >
        <Text
          style={{
            fontSize: 12,
            marginTop: 0,
            color: "black",
            marginLeft: "auto",
            textAlign: "right",
            backgroundColor: "white",
            marginRight: 10,
          }}
        >
          {props.result}
        </Text>
      </View>
    </View>

    <View
      style={{ height: 0.5, backgroundColor: "lightgray", marginTop: 5 }}
    ></View>
    <View style={{ flex: 1, flexDirection: "column", marginTop: 5 }}>
      <Text
        style={{
          fontSize: 12,
          paddingTop: 2,
          color: "gray",
          marginLeft: 5,
          width: 50,
          backgroundColor: "white",
        }}
      >
        Method:
      </Text>
      <Text
        style={{
          flex: 1,
          fontSize: 12,
          marginTop: 10,
          color: "black",
          marginLeft: 5,
          textAlign: "left",
          backgroundColor: "white",
          padding: 2,
        }}
      >
        {props.method}
      </Text>
    </View>
    <View
      style={{
        height: 0.5,
        backgroundColor: "lightgray",
        marginTop: 5,
        padding: 0.5,
      }}
    ></View>
  </View>
);

const styles = StyleSheet.create({
  containermain: {
    flex: 1,
    marginTop: 0,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    flexDirection: "column",
    //padding: 0,
    marginLeft: Platform.OS === "ios" ? 15 : 0,
    marginRight: Platform.OS === "ios" ? 15 : 0,
    marginTop: Platform.OS === "ios" ? 10 : 0,
    marginBottom: Platform.OS === "ios" ? 2 : 0,
    //borderRadius:Platform.OS==="ios"?5:0,
    backgroundColor: "white",
    // elevation: 2,
  },
});

export default ReportAnalyteCard;
