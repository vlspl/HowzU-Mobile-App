import React, { Component } from "react";
//import CustomListview from './Screen/DoctorList'

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
import { Container } from "native-base";

import NotificationRow from "../appComponents/NotificationRow";
import CustomeHeader from "../appComponents/CustomeHeader";

import CustomFooter from "../appComponents/CustomFooter";

export default class Notifications extends Component {
  constructor(props) {
    super(props);
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 0.5,
          //width: "95%",
          backgroundColor: "gray",
          marginLeft: 18,
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
    const { navigate } = this.props.navigation;

    return (
      <Container>
        <CustomeHeader
          title="Notification"
          navigation={this.props.navigation}
        />

        <View
          style={{ flex: 1, flexDirection: "column", backgroundColor: "red" }}
        >
          <View style={styles.containermain}>
            <FlatList
              data={[
                {
                  key: "1",
                  title: "Dr. Amol Wadkar",
                  description: "1234567890 ",
                  email: "test@gmail.com",
                  image_url:
                    "https://tinyfac.es/data/avatars/B0298C36-9751-48EF-BE15-80FB9CD11143-500w.jpeg",
                },
                {
                  key: "2",
                  title: "Dr. Amol Wadkar",
                  description: "1234567890 ",
                  email: "test@gmail.com",
                  image_url: "https://randomuser.me/api/portraits/women/44.jpg",
                },
                {
                  key: "3",
                  title: "Dr. Amol Wadkar",
                  description: "1234567890 ",
                  email: "test@gmail.com",
                  image_url: "https://randomuser.me/api/portraits/women/44.jpg",
                },
                {
                  key: "4",
                  title: "Dr. Amol Wadkar ",
                  description: "1234567890 ",
                  email: "test@gmail.com",
                  image_url: "https://randomuser.me/api/portraits/women/44.jpg",
                },
                {
                  key: "4",
                  title: "Dr. Amol Wadkar ",
                  description: "1234567890 ",
                  email: "test@gmail.com",
                  image_url: "https://randomuser.me/api/portraits/women/44.jpg",
                },
                {
                  key: "4",
                  title: "Dr. Amol Wadkar ",
                  description: "1234567890 ",
                  email: "test@gmail.com",
                  image_url: "https://randomuser.me/api/portraits/women/44.jpg",
                },
                {
                  key: "4",
                  title: "Dr. Amol Wadkar ",
                  description: "1234567890 ",
                  email: "test@gmail.com",
                  image_url: "https://randomuser.me/api/portraits/women/44.jpg",
                },
                {
                  key: "4",
                  title: "Dr. Amol Wadkar ",
                  description: "1234567890 ",
                  email: "test@gmail.com",
                  image_url: "https://randomuser.me/api/portraits/women/44.jpg",
                },
              ]}
              renderItem={({ item }) => (
                // <Text style={styles.item}
                // onPress={this.getListViewItem.bind(this, item)}>{item.title}</Text>

                <NotificationRow
                  title="Your test booking request at shree clinical lab has been accepted. Please visit the lab at 8.00 - 9.00 am on 12/12/2020"
                  date="29 Aug 2020 11:11:11"
                ></NotificationRow>
              )}
              ItemSeparatorComponent={this.renderSeparator}
            />
          </View>
        </View>

        <CustomFooter
          onPressProfile={() => navigate("Notifications")}
          onPressHome={() => navigate("PatientDashboard")}
        />
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
    padding: 3,
    marginLeft: 10,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 2,
    borderRadius: 5,
    backgroundColor: "white",
    elevation: 2,
  },
});
