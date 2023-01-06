import { StyleSheet, Dimensions } from "react-native";
import {
  scale,
  verticalScale,
  moderateScale,
  moderateVerticalScale,
} from "react-native-size-matters";
const screenWidth = Math.round(Dimensions.get("window").width);

export default StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    margin: 10,
    marginTop: 20,
    marginBottom: 10,
  },
  content: {
    padding: 10,
    flex: 1,
  },
  modalView: {
    //  verticalScale(1),
    height: screenWidth <= 360 ? "95%" : "80%",
    flex: screenWidth <= 360 ? 1 : 0.8,
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
    marginBottom: 10,
  },
  title: {
    color: "#515151",
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
    fontWeight: "bold",
  },
  closeBtn: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginVertical: 18,
    marginRight: 3.5,
  },
  closeIcon: {
    fontWeight: "bold",
    color: "red",
    fontSize: 4.3,
  },
});
