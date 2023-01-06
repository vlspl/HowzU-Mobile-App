import React from 'react';
import { TouchableOpacity, View, Image, Text, StyleSheet } from 'react-native';

const SuggestRow = (props) => (
  <View style={styles.container}>
    <View style={styles.container_text}>
      <View style={styles.titlesubview}>
        <View style={styles.DRnamesubview}>
          <Text style={styles.title}>{props.testname}</Text>
        </View>
        <View style={styles.sharebtnview}>
          <TouchableOpacity style={styles.SuggestTesttouch}>
            <Text
              style={styles.suggestbtnTitle}
              onPress={props.onPressCheckStatus}
            >
              Book Test
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.Mobilesubview}>
        <Image
          source={require('../../icons/lab.png')}
          style={{ height: 12, width: 15 }}
        />
        <Text
          style={{
            fontSize: 11,
            color: '#595858',
            textAlign: 'right',
            backgroundColor: 'white',
            paddingLeft: 2,
            marginLeft: 2,
          }}
        >
          {props.Hospital}
        </Text>

        {/* <Text style={styles.description}>
                   {props.BookingDate}  
                 </Text> */}

        {/* { props.status=='Confirm' && (<Text style={{fontSize: 12,marginTop: 0,color: 'green',marginLeft: 2,textAlign:'right',backgroundColor:'white',padding:2}}>
                    {props.status}  
                    </Text>)
                    }
                   { props.status=='Awaiting' && (<Text style={{fontSize: 12,marginTop: 0,color: 'orange',marginLeft: 2,textAlign:'right',backgroundColor:'white',padding:2}}>
                    {props.status}  
                     </Text>)
                    } */}
      </View>
      <View style={styles.emailsubview}>
        <View
          style={{ backgroundColor: 'white', flexDirection: 'row', flex: 1 }}
        >
          <Text style={styles.email}>{props.TestSubtitle}</Text>
        </View>

        {/* <View style = {styles.sharebtnview}>
                     <TouchableOpacity style={styles.SuggestTesttouch}>
                      <Text style={styles.suggestbtnTitle}
                       onPress={props.onPressCheckStatus}>
                       Check Status
                      </Text>  
                      </TouchableOpacity>
                   </View> */}
        <Text style={styles.description}>{props.BookingDate}</Text>
      </View>
    </View>
    <View
      style={{
        height: 0.5,
        //width: "95%",

        backgroundColor: 'gray',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5,
      }}
    />
  </View>
);

const styles = StyleSheet.create({
  containermain: {
    flex: 1,
    marginTop: 0,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 3,
    marginLeft: 10,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 2,
    // borderRadius: 5,
    backgroundColor: 'white',
    //elevation: 2,
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    flexDirection: 'row',
    // backgroundColor: 'gray',
    marginRight: 10,
    fontWeight: 'bold',
  },
  container_text: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 0,
    padding: 5,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  description: {
    fontSize: 10,
    //marginTop: 4,
    padding: 2,
    color: 'gray',
    marginLeft: 0,
    flex: 1,
    textAlign: 'right',
    /// backgroundColor: 'gray',
  },
  suggestbtnTitle: {
    // flex:1,
    fontSize: 9,
    marginRight: 0,
    paddingRight: 0,
    color: 'white',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  photo: {
    height: 68,
    width: 68,
    shadowOffset: { width: 3, height: 3 },
    shadowColor: 'gray',
    shadowOpacity: 0.7,
    elevation: 5,
    borderWidth: 0,
    borderRadius: 34,
  },
  email: {
    fontSize: 12,
    //fontStyle: 'italic',
    marginTop: 3,
    color: 'grey',
    fontWeight: 'bold',
    marginLeft: 4,
    // alignSelf: 'flex-end',

    // backgroundColor: 'gray',
  },
  image: {
    height: 22,
    width: 22,
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginRight: 5,

    // justifyContent: 'center'
  },
  touchable: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  SuggestTesttouch: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  titlesubview: {
    flex: 1,
    flexDirection: 'row',
    //alignSelf: 'flex-end',
    // backgroundColor: 'green',
  },

  DRnamesubview: {
    flex: 1,
    flexDirection: 'row',
    //alignSelf: 'flex-end',
    backgroundColor: 'white',
  },
  sharebtnview: {
    flex: 0.3,
    flexDirection: 'row',
    //alignSelf: 'flex-end',
    height: 22,
    //width: 150,
    //marginTop : 0,
    // paddingTop: 0,
    backgroundColor: '#003484',
    borderRadius: 11,
  },

  Mobilesubview: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 5,
    marginLeft: 3,
    // alignSelf: 'flex-end',
    // backgroundColor:'yellow'
  },
  Icons: {
    height: 15,
    width: 15,
    marginTop: 2,
  },

  emailsubview: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    justifyContent: 'space-between',
    alignContent: 'flex-end',
    marginTop: 4,
    // backgroundColor:'yellow'
  },

  DoctorProfile: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignContent: 'flex-end',
    textAlign: 'right',
    color: 'gray',
    fontSize: 11,
  },

  Separator: {
    height: 0.5,
    backgroundColor: 'gray',
    marginLeft: 0,
    marginRight: 0,
    marginTop: 10,
  },
});

export default SuggestRow;
