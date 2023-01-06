import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TouchableHighlight,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-community/async-storage";
import Modal from "react-native-modal";

const AddAccount = (props) => {
  const screenWidth = Math.round(Dimensions.get("window").width);

  // console.log(props.CurrentActiveUser.Email, 'Current actiove user');
  const [data, setData] = useState({
    getAllActiveAccounts: [],
    mobile: "",
  });

  const getActiveUser = async () => {
    try {
      await AsyncStorage.getItem("Users", (err, res) => {
        var array = [];
        if (!res) console.log("No Data Found");
        else {
          var items = JSON.parse(res);
          // (items, 'items ');
          items.map((itm, key) => {
            if (itm.Mobile === props.activeNumber) {
              // console.log(itm.Mobile, 'This is the cureent Active Account');
            } else {
              // console.log(itm.Mobile, '**********past active accnt data');

              array.push(itm);
            }
            // console.log(array, 'array is ');
          });
          setData({
            ...data,
            getAllActiveAccounts: array,
          });
        }
      });
    } catch (e) {
      // console.log(e, 'Err ******');
    }
  };

  useEffect(() => {
    getActiveUser();
  }, []);

  const renderAccountData = () => {
    return data.getAllActiveAccounts.map((user, index) => {
      return (
        <View
          style={[styles.container, { backgroundColor: "white" }]}
          key={index}
        >
          {user.Mobile !== props.activeNumber && (
            <View
              style={[
                styles.content,
                {
                  // flex: 1,
                  flexDirection: "row",
                  paddingHorizontal: 0,
                  marginTop: 5,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#FFF",
                  height: 40,
                },
              ]}
            >
              <Image
                source={require("../../icons/Placeholder.png")}
                style={{
                  height: 35,
                  width: 35,
                  marginLeft: 10,
                  marginTop: 0,
                }}
              />
              <View
                style={{
                  marginTop: 0,
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    color: "#515151",
                    fontSize: 15,
                    fontWeight: "bold",
                    textAlign: "left",
                    marginLeft: 12,
                    marginTop: 5,
                    justifyContent: "center",
                  }}
                  numberOfLines={1}
                >
                  {user.Name}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    color: "#515151",
                    fontSize: 12,
                    textAlign: "left",
                    marginLeft: 12,
                    marginTop: 1,
                    justifyContent: "center",
                    alignSelf: "flex-start",
                  }}
                >
                  {user.Email}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  marginTop: 0,
                  marginLeft: 12,
                  margin: 10,
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 17,
                    backgroundColor: "#f9f9f9",
                    width: 120,
                    height: 25,
                    borderWidth: 0.3,
                    marginTop: 1,
                  }}
                  onPress={() => props.switchAccount(user)}
                >
                  <Image
                    source={require("../../icons/switch-account.png")}
                    style={{
                      height: 15,
                      width: 15,
                      marginTop: 0,
                    }}
                  />
                  <Text
                    style={{
                      color: "#353535",
                      fontSize: 12,
                    }}
                  >
                    Switch Accoount
                  </Text>
                </TouchableOpacity>
              </View>
              <Text></Text>
            </View>
          )}

          <View
            style={{
              flex: 0.1,
              height: 0.7,
              backgroundColor: "#dfe1e5",
              // backgroundColor: '#353535',
              marginLeft: 15,
              marginRight: 15,
              marginTop: 5,
            }}
          ></View>
        </View>
      );
    });
  };

  return (
    <Modal
      isVisible={props.visible}
      backdropOpacity={0.7}
      style={{ flex: 1, margin: 0 }}
    >
      <View style={styles.centeredView}>
        <View
          style={[
            styles.modalView,
            {
              flex:
                data.getAllActiveAccounts.length > 0 ||
                data.getAllActiveAccounts.length === 1
                  ? data.getAllActiveAccounts.length > 2
                    ? 0.5
                    : 0.4
                  : 0.3,
              height:
                data.getAllActiveAccounts.length > 2 ? screenWidth / 2 : 0,
            },
          ]}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "flex-end",
              backgroundColor: "#f7f7f7",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 0,
                marginTop: 0,
                height: 80,
                justifyContent: "flex-start",
                alignItems: "center",
                backgroundColor: "#f7f7f7",
                borderColor: "gray",
                borderBottomWidth: 0.5,
              }}
            >
              <Image
                source={require("../../icons/Placeholder.png")}
                style={{
                  height: 35,
                  width: 35,
                  marginLeft: 10,
                  alignSelf: "center",
                  // resizeMode: 'center',
                }}
              />
              <View
                style={{
                  flex: 1,
                  alignSelf: "center",
                }}
              >
                <Text
                  style={{
                    color: "#515151",
                    fontSize: 15,
                    fontWeight: "bold",
                    textAlign: "left",
                    marginLeft: 12,
                    marginTop: 0,
                    justifyContent: "center",
                  }}
                >
                  {props.CurrentActiveUser.Name}
                  {data.getAllActiveAccounts.length}
                </Text>
                <Text
                  style={{
                    color: "#515151",
                    fontSize: 12,
                    textAlign: "left",
                    marginLeft: 12,
                    marginTop: 0.1,
                    justifyContent: "center",
                    alignSelf: "flex-start",
                  }}
                >
                  {props.CurrentActiveUser.Email}
                </Text>
              </View>

              {/* Modal Close Button */}
              <View
                style={{
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  backgroundColor: "#f7f7f7",
                  marginTop: -25,
                  alignSelf: "center",
                }}
              >
                <TouchableOpacity onPress={props.onPress}>
                  <Image
                    source={require("../../icons/CLOSE2.png")}
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

          <View style={styles.container}>
            {data.getAllActiveAccounts.length > 0 && (
              <SafeAreaView style={styles.container}>
                <ScrollView
                  style={styles.scrollView}
                  // contentContainerStyle={styles.contentContainer}
                  scrollEnabled={data.getAllActiveAccounts.length > 2}
                >
                  {renderAccountData()}
                  <Text></Text>
                </ScrollView>
              </SafeAreaView>
            )}

            {data.getAllActiveAccounts.length <= 1 && (
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  marginTop: 10,
                  marginLeft: 12,
                  margin: 10,
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 15,
                    backgroundColor: "#275BB4",
                    width: 150,
                    height: 25,
                    borderWidth: 0.5,
                    marginTop: 0,
                  }}
                  onPress={props.openLoginScreen}
                >
                  <Icon name="plus" size={15} color="#fff" />
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 12,
                    }}
                  >
                    Add Another Accoount
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {data.getAllActiveAccounts.length > 1 && (
            <View
              style={{
                flexDirection: "row",
                marginTop: 0,
                marginLeft: 12,
                margin: 10,
                justifyContent: "flex-start",
                alignItems: "flex-start",
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 15,
                  backgroundColor: "#275BB4",
                  width: 150,
                  height: 25,
                  borderWidth: 0.5,
                  marginTop: 10,
                }}
                onPress={props.openLoginScreen}
              >
                <Icon name="plus" size={15} color="#fff" />
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 12,
                  }}
                >
                  Add Another Accoount
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default AddAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    margin: 10,
  },
  scrollView: {
    height: "5%",
    width: "100%",
    marginTop: 0,
    margin: 0,
    alignSelf: "center",
  },

  modalView: {
    flex: 0.3,
    margin: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  scrollview: {
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: "space-between",
    padding: 10,
  },
});
