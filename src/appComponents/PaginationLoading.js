import React from "react";
import { View } from "native-base";

import { SkypeIndicator } from "react-native-indicators";
const PaginationLoading = () => (
  <View
    style={{
      backgroundColor: "white",
      alignItems: "center",
      justifyContent: "center",
      padding: 8,
      marginLeft: 0,
      marginBottom: 0,
      marginRight: 0,
      marginTop: 0,
      height: 50,
    }}
  >
    <SkypeIndicator color="gray" size={35} />
  </View>
);

export default PaginationLoading;
