import React, { Component } from "react";

import {
  FlatList,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";

import DynamicallySelectedPicker from "react-native-dynamically-selected-picker";

import { Container } from "native-base";

import CustomeHeader from "../appComponents/CustomeHeader";

export default class BMIPound extends Component {
  state = {
    selectedItemIndex: 60,
    activebtn: "Pounds",
    selectedValue: 60,
  };
  updateSelectedItem(index) {
    this.setState({ selectedItemIndex: index });
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 0.5,
          //width: "92%",
          backgroundColor: "gray",
          marginLeft: 15,
          marginRight: 15,
        }}
      />
    );
  };

  //handling onPress action
  getListViewItem = (item) => {
    Alert.alert(item.key, item.title);
  };

  render() {
    const windowWidth = 100;
    const { navigate } = this.props.navigation;

    return (
      <Container>
        <CustomeHeader
          title="BMI Calculator"
          headerId={1}
          navigation={this.props.navigation}
        />

        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
          }}
        >
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={styles.mainheader}> Please Select Your Weight</Text>
            <View
              style={{
                height: 40,
                width: 200,
                backgroundColor: "white",
                flexDirection: "row",
                alignItems: "center",
                borderRadius: 20,
                borderWidth: 1,
                marginTop: 15,
              }}
            >
              {this.state.activebtn == "KG" ? (
                <TouchableOpacity
                  style={{
                    height: 40,
                    width: "50%",
                    backgroundColor: "#1d303f",
                    borderRadius: 20,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => this.setState({ activebtn: "KG" })}
                >
                  <Text style={{ color: "white" }}>KG</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    backgroundColor: "white",
                    height: "100%",
                    width: "50%",
                    borderRadius: 50,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  //onPress={() => this.setState({ activebtn: 'KG' })}>
                  onPress={() => navigate("BMIWeight")}
                >
                  <Text>KG</Text>
                </TouchableOpacity>
              )}
              {this.state.activebtn == "Pounds" ? (
                <TouchableOpacity
                  style={{
                    height: 40,
                    width: "50%",
                    backgroundColor: "#1d303f",
                    borderRadius: 20,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => this.setState({ activebtn: "Pounds" })}
                >
                  <Text style={{ color: "white" }}>Pounds</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    backgroundColor: "white",
                    height: "100%",
                    width: "50%",
                    borderRadius: 50,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => this.setState({ activebtn: "Pounds" })}
                >
                  <Text>Pounds</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              backgroundColor: "white",
              marginTop: 20,
            }}
          >
            <Image
              style={{
                resizeMode: "center",
                height: 400,
                width: 130,
              }}
              source={require("../../icons/men.png")}
            />
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 100,
              }}
            >
              <Text style={styles.title}> Weight(Pound) </Text>
              <DynamicallySelectedPicker
                items={[
                  { label: "60" },
                  { label: "61" },
                  { label: "62" },
                  { label: "63" },
                  { label: "64" },
                  { label: "65" },
                  { label: "66" },
                  { label: "67" },
                  { label: "68" },
                  { label: "69" },
                  { label: "70" },
                  { label: "71" },
                  { label: "72" },
                  { label: "73" },
                  { label: "74" },
                  { label: "75" },
                  { label: "76" },
                  { label: "77" },
                  { label: "78" },
                  { label: "79" },
                  { label: "80" },
                  { label: "81" },
                  { label: "82" },
                  { label: "83" },
                  { label: "84" },
                  { label: "85" },
                  { label: "86" },
                  { label: "87" },
                  { label: "88" },
                  { label: "89" },
                  { label: "90" },
                  { label: "91" },
                  { label: "92" },
                  { label: "93" },
                  { label: "94" },
                  { label: "95" },
                  { label: "96" },
                  { label: "97" },
                  { label: "98" },
                  { label: "99" },
                  { label: "100" },
                  { label: "END" },
                ]}
                onScroll={({ index, item }) => {
                  this.updateSelectedItem(item.label);
                  // console.log('pound',JSON.stringify(item.label));

                  // console.log('vvvvvvv', JSON.stringify(item));
                }}
                selectedItemBorderColor={"#FAFAFA"}
                allItemsColor={"#2761B3"}
                fontSize={30}
                transparentItemRows={2}
                initialSelectedIndex={10}
                //onMomentumScrollBegin={({index, item}) => {
                //this.updateSelectedItem(index);
                //}}
                //onMomentumScrollEnd={({index, item}) => {
                //this.updateSelectedItem(index);
                //}}
                //onScrollBeginDrag={({index, item}) => {
                // this.updateSelectedItem(index);
                //}}
                //onScrollEndDrag={({index, item}) => {
                //this.updateSelectedItem(index);
                //}}
                height={180}
                width={windowWidth}
              />
            </View>
          </View>

          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "flex-end",
              flexDirection: "row",
              marginRight: 10,
            }}
          >
            <Image
              style={{
                resizeMode: "center",
                height: 15,
                width: 15,
              }}
              source={require("../../icons/next.png")}
            />

            <TouchableOpacity
              //style={styles.loginScreenButton}
              //onPress={() => this.props.navigation.navigate('BMIFeet')}
              onPress={() =>
                this.props.navigation.navigate("BMIFeet", {
                  value: this.state.selectedItemIndex,
                })
              }
              underlayColor="#fff"
            >
              <Text style={styles.loginText}> Next </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  containermain: {
    flex: 1,
    marginTop: 0,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    flexDirection: "row",
    padding: 1,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 5,
    backgroundColor: "white",
    //elevation: 2,
  },
  title: {
    fontSize: 16,
    color: "#000",
    flexDirection: "column",
    backgroundColor: "white",
    fontWeight: "bold",
    marginBottom: 10,
  },
  mainheader: {
    //flex:1,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginTop: 15,
  },
  header: {
    //flex:1,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    fontSize: 100,
    fontWeight: "bold",
    color: "#32CD32",
    marginTop: 40,
    marginRight: 20,
  },
  header1: {
    //flex:1,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#32CD32",
  },
  header2: {
    //flex:1,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginTop: 30,
  },
  header3: {
    //flex:1,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    fontSize: 30,
    color: "#32CD32",
  },
  header4: {
    //flex:1,
    alignItems: "flex-start",
    alignSelf: "center",
    justifyContent: "flex-start",
    fontSize: 35,
    marginTop: 15,
    fontWeight: "bold",
    color: "#000",
  },
  imageWrapper: {
    height: 330,
    width: 330,
    overflow: "hidden",
    marginTop: 25,
  },
  theImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  loginScreenButton: {
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#2e62ae",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
  },
  loginText: {
    color: "#2e62ae",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
});
