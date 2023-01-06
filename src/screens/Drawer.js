import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AsyncStorage from "@react-native-community/async-storage";
import DrawerComponent from "./DrawerScreen";
import PatientDashboard from "../screens/PatientDashboard";
import Appointments from "../screens/Appointments";
import RescheduleAppoint from "../screens/RescheduleAppoint";
import ShareReport from "./ShareReport";
import SharedDoctorList from "./SharedDoctorList";
import MyDoctors from "./MyDoctors";
import MyPatients from "./MyPatients";
import SuggestTest from "./SuggestTest";
import MyReports from "./MyReports";
import BMIGender from "./BMIGender";
import BMIWeight from "./BMIWeight";
import HealthDiary from "./HealthDiary";
import BMIFeet from "./BMIFeet";
import BMIResult from "./BMIResult";
import BloodPressureScreen from "../screens/BloodPressureScreen";
import OxygenScreen from "../screens/OxygenScreen";
import TempratureScreen from "../screens/TempratureScreen";
import LabListScreen from "../screens/LabListScreen";
import AllTestList from "../screens/AllTestList";
import BookAppointment from "../screens/BookAppointment";
import LifeDisorderTestList from "../screens/LifeDisorderTestList";
import CheckStatus from "../screens/CheckStatus";
import ChooseBookingScreen from "../screens/ChooseBookingScreen";
import PaymentHistory from "../screens/PaymentHistory";
import FamilyMemberList from "../screens/FamilyMemberList";
import ExistingMemberList from "../screens/ExistingMemberList";
import ChooseAddMember from "../screens/ChooseAddMember";
import UserProfile from "../screens/UserProfile";
import MedicationCalendrHome from "../screens/MedicationCalendrHome";
import MedicationPermission from "../screens/MedicationPermission";
import OrganizationTest from "../screens/OrganizationTest";
import MyReportGraphscreen from "../screens/MyReportGraphscreen";
import MyBloodPressuregraph from "../screens/MyBloodPressuregraph";
import MyBodyTempGraph from "../screens/MyBodyTempGraph";
import MyOxygengraph from "./MyOxygengraph";
import CompareReportsList from "./CompareReportsList";
import CompareMyReportGraphScreen from "./CompareMyReportGraphScreen";
import AudioScreen from "./AudioScreen";
import AllergiesScreen from "./MedicalProfileScreen/Allergies";
const DrawerSide = createDrawerNavigator();
var loading = false;
export default class Drawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userrole: "",
      isloading: false,
      activebtn: "doctor",
      isnotification: false,
      isforground: false,
      navigationScreenName: "PatientDashboard",
      screenName: "",
      clickcount: 0,
      iscurrent: true,
      totalcliks: 0,
      appstate: ""
    };
  }
  componentDidMount = () => {};

  componentWillUnmount() {
    //console.log("will wunmount");
    // this.backHandler.remove();
  }

  render() {
    return (
      <DrawerSide.Navigator
        initialRouteName="PatientDashboard"
        drawerContent={(props) => <DrawerComponent {...props} />}
      >
        <DrawerSide.Screen
          name="PatientDashboard"
          component={PatientDashboard}
          options={{}}
        />
        <DrawerSide.Screen
          name="BloodPressure"
          component={BloodPressureScreen}
          options={{}}
        />
        <DrawerSide.Screen
          name="HealthDiary"
          component={HealthDiary}
          options={{}}
        />
        <DrawerSide.Screen
          name="Oxygen"
          component={OxygenScreen}
          options={{}}
        />
        <DrawerSide.Screen
          name="Oxygengraph"
          component={MyOxygengraph}
          options={{}}
        />
        <DrawerSide.Screen
          name="Temprature"
          component={TempratureScreen}
          options={{}}
        />
        <DrawerSide.Screen
          name="TempratureGraph"
          component={MyBodyTempGraph}
          options={{}}
        />
        <DrawerSide.Screen
          name="OrganizationTest"
          component={OrganizationTest}
        ></DrawerSide.Screen>
        <DrawerSide.Screen
          name="Appointments"
          component={Appointments}
          options={{}}
        />
        <DrawerSide.Screen
          name="RescheduleAppoint"
          component={RescheduleAppoint}
          options={{}}
        />
        {/* ShareReports Module Starts */}
        <DrawerSide.Screen
          name="ShareReport"
          component={ShareReport}
          options={{}}
        />
        <DrawerSide.Screen
          name="SharedDoctorList"
          component={SharedDoctorList}
          options={{}}
        />
        {/* ShareReports Module Ends */}
        <DrawerSide.Screen
          name="MyDoctors"
          component={MyDoctors}
          options={{}}
        />
        <DrawerSide.Screen
          name="MyPatients"
          component={MyPatients}
          options={{}}
        />
        <DrawerSide.Screen
          name="SuggestTest"
          component={SuggestTest}
          options={{}}
        />
        <DrawerSide.Screen
          name="MyReports"
          component={MyReports}
          options={{}}
        />

        <DrawerSide.Screen
          name="MyReportGraphscreen"
          component={MyReportGraphscreen}
        />

        <DrawerSide.Screen
          name="CompareReportsList"
          component={CompareReportsList}
          options={{}}
        />

        <DrawerSide.Screen
          name="CompareMyReportGraphscreen"
          component={CompareMyReportGraphScreen}
        />

        <DrawerSide.Screen
          name="MyBloodPressureGraphscreen"
          component={MyBloodPressuregraph}
        />

        {/* BMI Module Starts */}
        <DrawerSide.Screen
          name="BMIGender"
          component={BMIGender}
          options={{}}
        />
        <DrawerSide.Screen
          name="BMIWeight"
          component={BMIWeight}
          options={{}}
        />
        {/* <DrawerSide.Screen name="BMIPound" component={BMIPound} options={{}} /> */}
        <DrawerSide.Screen name="BMIFeet" component={BMIFeet} options={{}} />
        <DrawerSide.Screen
          name="BMIResult"
          component={BMIResult}
          options={{}}
        />
        <DrawerSide.Screen
          name="AllTestList"
          component={AllTestList}
          options={{}}
        />
        <DrawerSide.Screen
          name="LabListScreen"
          component={LabListScreen}
          options={{}}
        />
        <DrawerSide.Screen
          name="BookAppointment"
          component={BookAppointment}
          options={{}}
        />
        <DrawerSide.Screen
          name="LifeDisorderTestList"
          component={LifeDisorderTestList}
          options={{}}
        />
        <DrawerSide.Screen name="CheckStatus" component={CheckStatus} />
        <DrawerSide.Screen
          name="ChooseBookingScreen"
          component={ChooseBookingScreen}
          options={{}}
        />
        <DrawerSide.Screen
          name="PaymentHistory"
          component={PaymentHistory}
          options={{}}
        />
        <DrawerSide.Screen
          name="FamilyMemberList"
          component={FamilyMemberList}
          options={{}}
        />
        <DrawerSide.Screen
          name="ExistingMemberList"
          component={ExistingMemberList}
          options={{}}
        />
        <DrawerSide.Screen
          name="ChooseAddMember"
          component={ChooseAddMember}
          options={{}}
        />
        <DrawerSide.Screen
          name="UserProfile"
          component={UserProfile}
          options={{}}
        />

        <DrawerSide.Screen
          name="Allergy"
          component={AllergiesScreen}
          options={{}}
        />
        <DrawerSide.Screen
          name="MedicationCalendrHome"
          component={MedicationCalendrHome}
          options={{}}
        />
        <DrawerSide.Screen
          name="MedicationPermission"
          component={MedicationPermission}
          options={{}}
        />
        <DrawerSide.Screen name="Audio" component={AudioScreen} options={{}} />
      </DrawerSide.Navigator>
    );
  }
}
