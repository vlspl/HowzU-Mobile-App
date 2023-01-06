import React from "react";
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  Image,
  Button,
  ScrollView
} from "react-native";
import styles from "./styles";
import Cups from "./cups";

const Modal = ({
  visible,
  onCancel,
  title,
  waterinml,
  onpressCups,
  children
}) => {
  return (
    <RNModal visible={visible} style={{ margin: 0 }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View
            style={{
              flex: 1
            }}
          >
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 0,
                marginTop: 0,
                height: 45,
                justifyContent: "flex-start",
                alignItems: "center"
              }}
            >
              <View
                style={{
                  flex: 1,
                  alignSelf: "center",
                  justifyContent: "center",
                  marginTop: 10
                }}
              >
                {title && <Text style={styles.title}>Switch Cup</Text>}
                {children}
              </View>

              {/* Modal Close Button */}
              <View
                style={{
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  marginTop: 10,
                  alignSelf: "center"
                }}
              >
                <TouchableOpacity style={styles.closeBtn} onPress={onCancel}>
                  <Image
                    source={require("../../../icons/CLOSE2.png")}
                    style={{
                      height: 15,
                      width: 15,
                      margin: 15,
                      marginTop: 0,
                      alignSelf: "baseline"
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {/* </View> */}
            <View>
              <View
                style={{
                  height: 0.5,
                  // backgroundColor: 'gray',
                  marginLeft: 15,
                  marginRight: 10,
                  marginTop: 8,
                  backgroundColor: "#d8d8d8",
                  padding: 0.5
                }}
              ></View>

              <ScrollView
                alwaysBounceVertical={true}
                showsHorizontalScrollIndicator={false}
                style={{ backgroundColor: "white", marginTop: 0 }}
              >
                <View
                  style={[
                    styles.content,
                    {
                      flex: 1,
                      flexDirection: "row"
                    }
                  ]}
                >
                  <Cups
                    cupname={"100 ml "}
                    source={require("../../../icons/Switch-Cup-1.png")}
                    onpress={onpressCups}
                  />

                  <Cups
                    cupname={"125 ml "}
                    source={require("../../../icons/Switch-Cup-2.png")}
                    onpress={onpressCups}
                  />
                  <Cups
                    cupname={"150 ml "}
                    source={require("../../../icons/Switch-Cup-3.png")}
                    onpress={onpressCups}
                  />
                </View>

                <View
                  style={[
                    styles.content,
                    {
                      flexDirection: "row",
                      // paddingHorizontal: 0,
                      marginTop: -20,
                      backgroundColor: "#FFF"
                      // height: 40,
                    }
                  ]}
                >
                  <Cups
                    cupname={"175 ml "}
                    source={require("../../../icons/Switch-Cup-4.png")}
                    onpress={onpressCups}
                  />
                  <Cups
                    cupname={"200 ml "}
                    source={require("../../../icons/Switch-Cup-5.png")}
                    onpress={onpressCups}
                  />
                  <Cups
                    cupname={"300 ml "}
                    source={require("../../../icons/Switch-Cup-6.png")}
                    onpress={onpressCups}
                  />
                </View>
                <View
                  style={[
                    styles.content,
                    {
                      flexDirection: "row",
                      paddingHorizontal: 0,
                      marginTop: -20,
                      justifyContent: "flex-start",
                      alignItems: "flex-start"
                    }
                  ]}
                >
                  <Cups
                    cupname={"400 ml "}
                    source={require("../../../icons/Switch-Cup-7.png")}
                    onpress={onpressCups}
                  />
                </View>

                <View
                  style={[
                    styles.content,
                    {
                      flexDirection: "row",
                      paddingHorizontal: 0,
                      marginTop: -20,
                      backgroundColor: "#FFF",

                      justifyContent: "flex-end",
                      alignItems: "baseline"
                    }
                  ]}
                >
                  <View
                    style={{
                      flex: 1,
                      height: 0.5,
                      backgroundColor: "#d8d8d8",
                      marginLeft: 15,
                      marginRight: 10,
                      marginTop: 5,
                      padding: 0.5
                    }}
                  ></View>
                </View>
              </ScrollView>
              <View
                style={{
                  flex: 1,
                  // height: 60,
                  marginBottom: 20,
                  // backgroundColor: "white",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "stretch",
                  marginRight: 40,
                  marginTop: 4
                }}
              >
                <TouchableOpacity
                  style={{
                    height: 30,
                    marginBottom: 20
                  }}
                  onPress={() => onCancel()}
                  // underlayColor="#fff"
                >
                  <Text style={styles.title}> CANCEL </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    height: 30,
                    marginBottom: 20
                  }}
                  onPress={() => onCancel()}
                  // underlayColor="#fff"
                >
                  <Text style={[styles.title, { color: "#2761B3" }]}> OK </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </RNModal>
  );
};

export default Modal;
