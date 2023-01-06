import React, { useState } from "react";
import { AppState } from "react-native";
import { Root, Toast } from "native-base";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, CommonActions } from "@react-navigation/native";
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import AreUDoc from "../screens/AreUDoc";
import Drawer from "../screens/Drawer";
import CheckStatus from "../screens/CheckStatus";
import DoctorRegScreen from "../screens/DoctorRegScreen";
import BMIGender from "../screens/BMIGender";
import BMIWeight from "../screens/BMIWeight";
import BMIFeet from "../screens/BMIFeet";
import Notifications from "../screens/Notifications";
import OTPverification from "../screens/OTPverification";
import RegOTPverification from "../screens/RegOTPverification";
import ForgetPassotpscreen from "../screens/ForgetPassotpscreen";
import ForgetPassReset from "../screens/ForgetPassReset";
import Myhealthgraph from "../screens/Myhealthgraph";
import MyReportGraphscreen from "../screens/MyReportGraphscreen";
import MyReports from "../screens/MyReports";
import CompareReportsList from "../screens/CompareReportsList";
import CompareMyReportGraphScreen from "../screens/CompareMyReportGraphScreen";
import ChooseAddDoctor from "../screens/ChooseAddDoctorr";
import AddNewDoctor from "../screens/AddNewDoctor";
import LoginWithMobileOTP from "../screens/LoginWithMobileOTP";
import LifeDisorderTestList from "../screens/LifeDisorderTestList";
import LabListScreen from "../screens/LabListScreen";
import AllTestList from "../screens/AllTestList";
import BookAppointment from "../screens/BookAppointment";
import AllPatientList from "../screens/AllPatientList";
import SuggestTestList from "../screens/SuggestTestList";
import SuggestedLabList from "../screens/SuggestedLabList";
import DocDashSuggestedList from "../screens/DocDashSuggestedList";
import DocDashSharedList from "../screens/DocDashSharedList";
import SharedReportstatus from "../screens/SharedReportstatus";
import AllDoctorsList from "../screens/AllDoctorsList";
import RescheduleBookAppointment from "../screens/RescheduleBookAppointment";
import PrescriptionLabList from "../screens/PrescriptionLabList";
import PrescriptionBookAppoint from "../screens/PrescriptionBookAppoint";
import PaymentHistory from "../screens/PaymentHistory";
import ChooseAddMember from "../screens/ChooseAddMember";
import ExistingMemberList from "../screens/ExistingMemberList";
import AddNewFamilyMember from "../screens/AddNewFamilyMember";
import NewMemberOtpVerification from "../screens/NewMemberOtpVerification";
import ReportSharedToDoc from "../screens/ReportSharedToDoc";
import FamilyMemberReports from "../screens/FamilyMemberReports";
import MyPatients from "../screens/MyPatients";
import UserProfile from "../screens/UserProfile";
import MedicationTabName from "../screens/MedicationTabName";
import MedicatnTakeFor from "../screens/MedicatnTakeFor";
import MedicineStrenth from "../screens/MedicineStrenth";
import MedicatnOftenTake from "../screens/MedicatnOftenTake";
import MedicatnDose from "../screens/MedicatnDose";
import MedicatnDoseTime from "../screens/MedicatnDoseTime";
import MedicatnDuration from "../screens/MedicatnDuration";
import PatientSharedReport from "../screens/PatientSharedReport";
import MedicationTakenFood from "../screens/MedicationTakenFood";
import MedicationStartDate from "../screens/MedicationStartDate";
import MedicationPermission from "../screens/MedicationPermission";
import MedicationFirstDoseTime from "../screens/MedicationFirstDoseTime";
import MedicationSecDoseTime from "../screens/MedicationSecDoseTime";
import MedicationThirdDoseTime from "../screens/MedicationThirdDoseTime";
import MedicationForSelforOtherScreen from "../screens/MedicationForSelforOtherScreen";
import MedicationHistory from "../screens/MedicationHistory";
import TermnCondition from "../screens/TermnCondition";
import PrivacyPolicy from "../screens/PrivacyPolicy";
import UserEditProfile from "../screens/UserEditProfile";
import ReportManualPunch from "../screens/ReportManualPunch";
//

import ReportManualPunchWithVoice from "../screens/ReportManualPunchWithVoice";
import TechnicianAddReport from "../screens/Technician/TechnicianAddReport";
import ChooseUploadReport from "../screens/ChooseUploadReport";
import ReportPicUpload from "../screens/ReportPicUpload";
import FamilyMemberList from "../screens/FamilyMemberList";
import PayBookingAmount from "../screens/PayBookingAmount";
import Appointments from "../screens/Appointments";
import TestListForBooking from "../screens/TestListForBooking";
import LabListForBooking from "../screens/LabListForBooking";
import analytics from "@react-native-firebase/analytics";
import VaccineScreen from "../screens/VaccineScreen";
import VaccineCertificateScreen from "../screens/VaccineCertificateScreen";
import FilterVaccinationScreen from "../screens/FilterVaccinationScreen";
import NotifactionMainScreen from "../screens/NotifactionMain";
import WeightHydScreen from "../screens/HydrationScreen/WeightHydScreen";
import WakeUpHydScreen from "../screens/HydrationScreen/WakeUpHydScreen";
import HydGenderScreen from "../screens/HydrationScreen/HydGenderScreen";
import BedTimeHydScreen from "../screens/HydrationScreen/BedTimeHydScreen";
import HydrationScreen from "../screens/HydrationScreen/HydrationScreen";
import AboutUs from "../screens/AboutUs";
import AudioScreen from "../screens/AudioScreen";
import AllergiesScreen from "../screens/MedicalProfileScreen/Allergies";
import DrugAllergyScreen from "../screens/MedicalProfileScreen/DrugAllergies";
import FamilyHistoryScreen from "../screens/MedicalProfileScreen/FamilyHistory";
import SelfMedicalConditionScreen from "../screens/MedicalProfileScreen/SelfMedicalCondtion";
import ScanQRcode from "../screens/Technician/ScanQRcode";
import HealthDayScreen from "../screens/HealthDayScreen";
import TechnicianReport from "../screens/Technician/TechnicianReports";
import TechnicianViewReport from "../screens/Technician/TechnicianViewReport";
import TechnicinanRegisteredUsers from "../screens/Technician/TechnicianRegisteredUsers";
import RegUserDetails from "../screens/Technician/RegUserDetails";
import DetailmedHistory from "../screens/DetailmedHistory";
//
import TrendAnagraphScreen from "../screens/TrendAnaGraphChagesToLine";
import ChooseAddPatient from "../screens/ChooseAddPatient";
import AddNewPatient from "../screens/AddNewPatient";

const Stack = createStackNavigator();

export default MainRoutes = () => {
  const routeNameRef = React.useRef();
  const navigationRef = React.useRef();
  React.useEffect(() => {}, []);

  return (
    <Root>
      <NavigationContainer
        ref={navigationRef}
        onReady={() =>
          (routeNameRef.current = navigationRef.current.getCurrentRoute().name)
        }
        onStateChange={async () => {
          // this.setState({ clickcount: 0 });
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.current.getCurrentRoute().name;
          // console.log(currentRouteName, "=========");
          if (previousRouteName !== currentRouteName) {
            await analytics().logScreenView({
              screen_name: currentRouteName,
              screen_class: currentRouteName
            });
          }

          // Save the current route name for later comparision
          routeNameRef.current = currentRouteName;
        }}
      >
        <Stack.Navigator initialRouteName={SplashScreen} headerMode="none">
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="FamilyMemberList" component={FamilyMemberList} />
          <Stack.Screen name="PayBookingAmount" component={PayBookingAmount} />
          <Stack.Screen name="Audio" component={AudioScreen}></Stack.Screen>
          <Stack.Screen
            name="Allergy"
            component={AllergiesScreen}
          ></Stack.Screen>
          <Stack.Screen
            name="DrugAllergy"
            component={DrugAllergyScreen}
          ></Stack.Screen>
          <Stack.Screen
            name="FamilyHis"
            component={FamilyHistoryScreen}
          ></Stack.Screen>
          <Stack.Screen
            name="MedicalCondition"
            component={SelfMedicalConditionScreen}
          ></Stack.Screen>
          {/* Hydration screen start here */}
          <Stack.Screen
            name="WeightHydScreen"
            component={WeightHydScreen}
          ></Stack.Screen>

          <Stack.Screen
            name="HydGenderScreen"
            component={HydGenderScreen}
          ></Stack.Screen>
          <Stack.Screen
            name="WakeUpHydScreen"
            component={WakeUpHydScreen}
          ></Stack.Screen>
          <Stack.Screen
            name="BedTimeHydScreen"
            component={BedTimeHydScreen}
          ></Stack.Screen>
          <Stack.Screen
            name="HydrationScreen"
            component={HydrationScreen}
          ></Stack.Screen>
          <Stack.Screen name="LoginwithOTP" component={LoginWithMobileOTP} />
          <Stack.Screen name="Drawer" component={Drawer} />
          <Stack.Screen name="About" component={AboutUs} />
          <Stack.Screen name="Appointments" component={Appointments} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="AreUDoc" component={AreUDoc} />
          <Stack.Screen name="DoctorRegScreen" component={DoctorRegScreen} />
          <Stack.Screen name="BMIGender" component={BMIGender} />
          <Stack.Screen name="BMIWeight" component={BMIWeight} />
          <Stack.Screen name="BMIFeet" component={BMIFeet} />
          <Stack.Screen name="CheckStatus" component={CheckStatus} />
          <Stack.Screen name="Notifications" component={Notifications} />
          <Stack.Screen name="OTPverification" component={OTPverification} />
          <Stack.Screen name="Vaccination" component={VaccineScreen} />
          <Stack.Screen
            name="VaccinationCertificate"
            component={VaccineCertificateScreen}
          />
          <Stack.Screen
            name="RegOTPverification"
            component={RegOTPverification}
          ></Stack.Screen>
          <Stack.Screen
            name="NotifactionMainScreen"
            component={NotifactionMainScreen}
          ></Stack.Screen>
          <Stack.Screen
            name="ForgetPassotpscreen"
            component={ForgetPassotpscreen}
          />
          <Stack.Screen name="ForgetPassReset" component={ForgetPassReset} />
          <Stack.Screen name="Myhealthgraph" component={Myhealthgraph} />
          <Stack.Screen
            name="MyReportGraphscreen"
            component={MyReportGraphscreen}
          />
          <Stack.Screen name="MyReports" component={MyReports} />
          <Stack.Screen
            name="CompareReportsList"
            component={CompareReportsList}
          ></Stack.Screen>
          <Stack.Screen
            name="CompareMyReportGraphscreen"
            component={CompareMyReportGraphScreen}
          />
          {/* new to line form bar  */}
          <Stack.Screen name="TrenGraph" component={TrendAnagraphScreen} />
          <Stack.Screen
            name="LifeDisorderTestList"
            component={LifeDisorderTestList}
          />
          <Stack.Screen
            name="LabListForBooking"
            component={LabListForBooking}
          />
          <Stack.Screen
            name="TestListForBooking"
            component={TestListForBooking}
          />
          <Stack.Screen name="LabListScreen" component={LabListScreen} />
          <Stack.Screen name="AllTestList" component={AllTestList} />
          <Stack.Screen name="BookAppointment" component={BookAppointment} />
          <Stack.Screen name="AllPatientList" component={AllPatientList} />
          <Stack.Screen name="SuggestTestList" component={SuggestTestList} />
          <Stack.Screen name="SuggestedLabList" component={SuggestedLabList} />
          <Stack.Screen
            name="DocDashSuggestedList"
            component={DocDashSuggestedList}
          />
          <Stack.Screen
            name="DocDashSharedList"
            component={DocDashSharedList}
          />
          <Stack.Screen
            name="SharedReportstatus"
            component={SharedReportstatus}
          />
          <Stack.Screen name="AllDoctorsList" component={AllDoctorsList} />
          <Stack.Screen
            name="RescheduleBookAppointment"
            component={RescheduleBookAppointment}
          />
          <Stack.Screen
            name="PrescriptionLabList"
            component={PrescriptionLabList}
          />
          <Stack.Screen
            name="PrescriptionBookAppoint"
            component={PrescriptionBookAppoint}
          />
          <Stack.Screen name="ChooseAddMember" component={ChooseAddMember} />
          <Stack.Screen name="ChooseAddDoc" component={ChooseAddDoctor} />
          <Stack.Screen name="AddNewDoc" component={AddNewDoctor} />
          {/* Add Patinet */}
          <Stack.Screen name="ChooseAddPatient" component={ChooseAddPatient} />
          <Stack.Screen name="AddNewPatient" component={AddNewPatient} />

          <Stack.Screen
            name="ExistingMemberList"
            component={ExistingMemberList}
          />
          <Stack.Screen
            name="AddNewFamilyMember"
            component={AddNewFamilyMember}
          />
          <Stack.Screen
            name="NewMemberOtpVerification"
            component={NewMemberOtpVerification}
          />
          <Stack.Screen
            name="ReportSharedToDoc"
            component={ReportSharedToDoc}
          />
          <Stack.Screen
            name="FamilyMemberReports"
            component={FamilyMemberReports}
          />
          <Stack.Screen name="MyPatients" component={MyPatients} />
          <Stack.Screen
            name="FilterVaccinationScreen"
            component={FilterVaccinationScreen}
          />
          <Stack.Screen name="UserProfile" component={UserProfile} />
          <Stack.Screen
            name="MedicationTabName"
            component={MedicationTabName}
          />

          <Stack.Screen
            name="MedicatnForSelforOther"
            component={MedicationForSelforOtherScreen}
          />
          <Stack.Screen name="MedicatnTakeFor" component={MedicatnTakeFor} />
          <Stack.Screen name="MedicineStrenth" component={MedicineStrenth} />
          <Stack.Screen
            name="MedicatnOftenTake"
            component={MedicatnOftenTake}
          />
          <Stack.Screen name="MedicatnDose" component={MedicatnDose} />
          <Stack.Screen name="MedicatnDoseTime" component={MedicatnDoseTime} />
          <Stack.Screen name="MedicatnDuration" component={MedicatnDuration} />
          {/*  */}
          <Stack.Screen name="MedicatnHistory" component={MedicationHistory} />
          {/* DetailmedHistory */}
          <Stack.Screen name="MedDetailHis" component={DetailmedHistory} />

          <Stack.Screen
            name="PatientSharedReport"
            component={PatientSharedReport}
          />
          <Stack.Screen
            name="MedicationTakenFood"
            component={MedicationTakenFood}
          />
          <Stack.Screen
            name="MedicationStartDate"
            component={MedicationStartDate}
          />
          <Stack.Screen
            name="MedicationPermission"
            component={MedicationPermission}
          />
          <Stack.Screen
            name="MedicationFirstDoseTime"
            component={MedicationFirstDoseTime}
          />
          <Stack.Screen
            name="MedicationSecDoseTime"
            component={MedicationSecDoseTime}
          />
          <Stack.Screen
            name="MedicationThirdDoseTime"
            component={MedicationThirdDoseTime}
          />
          <Stack.Screen name="TermnCondition" component={TermnCondition} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
          <Stack.Screen name="UserEditProfile" component={UserEditProfile} />
          <Stack.Screen
            name="ReportManualPunch"
            component={ReportManualPunch}
          />

          <Stack.Screen
            name="ReportPunchWithVoice"
            component={ReportManualPunchWithVoice}
          />
          <Stack.Screen
            name="ChooseUploadReport"
            component={ChooseUploadReport}
          />
          <Stack.Screen name="ReportPicUpload" component={ReportPicUpload} />
          {/* tech  */}
          <Stack.Screen name="Scanner" component={ScanQRcode}></Stack.Screen>

          <Stack.Screen
            name="Techreport"
            component={TechnicianReport}
          ></Stack.Screen>
          <Stack.Screen
            name="TechView"
            component={TechnicianViewReport}
          ></Stack.Screen>
          <Stack.Screen
            name="Techregistered"
            component={TechnicinanRegisteredUsers}
          ></Stack.Screen>
          <Stack.Screen
            name="RegUserViewDetails"
            component={RegUserDetails}
          ></Stack.Screen>
          <Stack.Screen
            name="TechAddreport"
            component={TechnicianAddReport}
          ></Stack.Screen>
          {/* health day */}
          <Stack.Screen
            name="HealthDayNoti"
            component={HealthDayScreen}
          ></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </Root>
  );
};
