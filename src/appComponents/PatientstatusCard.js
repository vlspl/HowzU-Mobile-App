import React from 'react';
import { TouchableOpacity, View, Image, Text,StyleSheet,Dimensions } from 'react-native';


const PatientstatusCard = (props) => (
    
    <View style={{flex: 1,
        flexDirection:'column',
         padding: 10,
        margin: 8,
        backgroundColor: 'red',  
        width: 135,
        height: 135,
        borderWidth:1,
        borderColor:'lightgray',
        shadowOffset: { width: 2, height: 2 },
        shadowColor: 'lightgray',
        shadowOpacity: 0.9,
        borderRadius:10,
        elevation:5,
        alignItems: 'center',
       justifyContent:'center',}}> 
         
        <TouchableOpacity onPress={props.onPress}>
         
                   
                      
                      
         </TouchableOpacity> 
                   
     </View>
)

const styles = StyleSheet.create({
   
   
       Horizontalcard:{
         flex: 1,
        flexDirection:'column',
         padding: 10,
        margin: 8,
        backgroundColor: 'red',  
        width: 135,
        height: 135,
        borderWidth:1,
        borderColor:'lightgray',
        shadowOffset: { width: 2, height: 2 },
        shadowColor: 'lightgray',
        shadowOpacity: 0.9,
        borderRadius:10,
        alignItems: 'center',
       justifyContent:'center',
       elevation:5

       },
    imageThumbnail:{
         //alignItems: 'center',
         // justifyContent:'center',
          // margin:5,
           height:80,
           width:80,
           alignSelf:'center',
           //padding: 10,
           backgroundColor: 'white',  
          },

          MyhealthcardView:{
            flex: 1,
           flexDirection:'row',
           padding: 8,
           margin: 10,
           backgroundColor: 'white',  
           width: 350,
           height: 100,
           borderWidth:1,
           borderColor:'lightgray',
           shadowOffset: { width: 2, height: 2 },
           shadowColor: 'lightgray',
           shadowOpacity: 0.8,
           borderRadius:5,
           elevation:5
           //alignItems: 'center',
          // justifyContent:'center',

          },
          title: {
           flex: 1,
           fontSize: 20,
           color: '#000',
           flexDirection: 'row',
          // backgroundColor: 'gray',
           marginRight: 10,
           //fontWeight: 'bold'
     
       },
     

  });

export default PatientstatusCard