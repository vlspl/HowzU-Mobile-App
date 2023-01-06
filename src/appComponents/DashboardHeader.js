import React from "react";

import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from "react-native";

import LifeDisorderCard from "../appComponents/LifeDisorderCard";
import MyHealthCard from "../appComponents/MyHealthCard";
import RecentTestCard from "../appComponents/RecentTestCard";
import RecomendedTestCard from "../appComponents/RecomendedTestCard";

export default class PatientdashboardComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activebtn: "FEET",
    };
  }

  render(props) {
    //const { navigate } = this.props.navigation;
    const screenWidth = Math.round(Dimensions.get("window").width);

    return (
      <View style={styles.MainContainer}>
        {/* 
            <View style = {{height:40,width:200,backgroundColor:'white',flexDirection:'row',alignItems:'center',borderRadius:20,borderWidth:1}}>
                   {
                      this.state.activebtn == 'CM'? <TouchableOpacity style = {{height:40,width:'50%',backgroundColor:'blue',borderRadius:20,justifyContent:'center',alignItems:'center'}}
                      onPress={()=>this.setState({activebtn:'CM'})}>
                       <Text>CM</Text>
                      </TouchableOpacity >:
                      
                      <TouchableOpacity style={{backgroundColor:'white',height:'100%',width:'50%',borderRadius:50,justifyContent:'center',alignItems:'center'}}
                      onPress={()=>this.setState({activebtn:'CM'})}>
                         
          
                      <Text>CM</Text>

                      </TouchableOpacity>
                   }

{
                      this.state.activebtn == 'FEET'? <TouchableOpacity style = {{height:40,width:'50%',backgroundColor:'blue',borderRadius:20,justifyContent:'center',alignItems:'center'}}
                      onPress={()=>this.setState({activebtn:'FEET'})}>
                       <Text>FEET</Text>
                      </TouchableOpacity >:
                      <TouchableOpacity style={{backgroundColor:'white',height:'100%',width:'50%',borderRadius:50,justifyContent:'center',alignItems:'center'}}
                      onPress={()=>this.setState({activebtn:'FEET'})}>
                         
                          <Text>FEET</Text>

                      </TouchableOpacity>
                   }
                 
            </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: "center",
    flex: 1,
    paddingTop: 0,
    backgroundColor: "white",
  },

  container_text: {
    flex: 1,
    flexDirection: "column",
    marginTop: 0,
    marginLeft: 5,
    justifyContent: "center",
    backgroundColor: "white",
  },

  Separator: {
    height: 0.5,
    backgroundColor: "gray",
    marginLeft: 0,
    marginRight: 0,
    marginTop: 10,
  },
});
