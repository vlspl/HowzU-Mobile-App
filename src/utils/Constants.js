// Live Server
const SERVER = "https://endpoint.visionarylifescience.com/";

// Testing Server
// const SERVER = "http://endpoint.visionarylifesciences.in/";

const PAYMENTSERVER = "https://visionarylifescience.com/";
const AUTH = "Auth/";
const DOCTOR = "Doctor/";
const PATIENT = "Patient/";
const ATOM = "AtomPayment.aspx?Id=";
const PAY_FAIL = "AtomPaymentFail.aspx";
const PAY_SUCCESS = "AtomPaymentSuccess.aspx";
module.exports = {
  PER_PAGE_RECORD: 10,
  RUPEES_SYMBOL: "\u20B9",
  TOKEN_KEY: "TokenStorage_key",
  USER_ROLE: "Role",
  USER_MOBILE: "MobileNumber",
  USER_NAME: "Username",
  BMIDETAIL_KEY: "UserBMI",
  ACCOUNT_ROLE: "AccountRole",
  USER_ID: "UserId",
  REGISTRATION_STATUS: "RegistrationStatus",
  MOBILE_VERIFIED: "MobileVerified",
  ORG_ID: "Org_id",
  PAY_BOOKING_AMOUNT: PAYMENTSERVER + ATOM,
  PAYMENT_FAILED: PAYMENTSERVER + PAY_FAIL,
  PAYMENT_SUCCESS: PAYMENTSERVER + PAY_SUCCESS,
  GET_SIGNIN: SERVER + AUTH + "Signin",
  GET_SIGNUP: SERVER + AUTH + "SignUp",
  GET_OTPVERIFY: SERVER + AUTH + "VerifiedOTP",
  GET_SENDOTP: SERVER + AUTH + "SendOTP/",
  //https://visionarylifescience.com/Images/APP%20FEATURE2.png
  SILDER_IMG_URL: "https://visionarylifescience.com/",
  GET_SLIDER_IMG:
    "http://endpoint.visionarylifescience.com/" + AUTH + "GetSliderPath",

  //Helath grphs

  GET_BMI_GRAPH_DETAILS:
    SERVER + PATIENT + "MyHealthAnaylteDetails?Anayltename=BMI",

  REPORT_DETAILS_FORGRAPH: SERVER + "TestBooking/ReportDetilsForGraph?TestId=",
  ENTERPRSE_LABTESTLIST: SERVER + "Enterprise/EnterPriseLabTestList/",
  ENTERPRSE_LABLIST: SERVER + "Enterprise/EnterPriseLabList/",

  // http://endpoint.visionarylifesciences.in/Enterprise/EnterPriseLabTestList
  MY_UNSHARED_REPORTLIST: SERVER + PATIENT + "MyUnsharedReportReportList",
  // Profile Allergies

  GET_ALLERGIES: SERVER + PATIENT + "GetUserProfileFDMList",

  ADD_ALLERGIES: SERVER + PATIENT + "AddUserProfileDetails",

  GET_ALLERGIES_DETAILS: SERVER + PATIENT + "GetUserProfileDetails",

  //Hydration details api
  SAVE_HYDRATION: SERVER + "Patient/AddHydration",
  GET_HYDRATION_DETAILS: SERVER + PATIENT + "GetUserHydrationDetails",
  GET_WATER_CONSUMTION_DATA: SERVER + PATIENT + "AlluserWaterconsumtiondata",
  HYD_HISTORY: SERVER + PATIENT + "userhydrationhistoryforGraph",

  DELETE_WATER_CONSUMTION_DATA:
    SERVER + PATIENT + "DeleteWaterConsumptionByConsumptionId?",

  ADD_WATER_INTAKE: SERVER + PATIENT + "AddWaterInTake",

  //Medicatiob reminder
  ADD_MEDICINE_REMINDER: SERVER + "Patient/AddReminderDetetails",

  //For frogot PAss
  FORGOTPASS_SENDOTP: SERVER + AUTH + "ForgotPasswordSendOTP/",
  Add_NEWDOC_BY_PATIENT: SERVER + PATIENT + "AddPatientToDoctor",
  GET_SETPASSWORD: SERVER + AUTH + "SetNewPassword",
  GET_UPDATESTATUS: SERVER + AUTH + "UpdateRegistrationStatus",
  GET_DOCREG: SERVER + DOCTOR + "UpdatePatientToDoctor",
  GET_SUGGESTED_TEST: SERVER + PATIENT + "MySuggestedTest",
  GET_USERPROFILE: SERVER + PATIENT + "PatientMyProfile",

  GET_DOCTOR_LIST: SERVER + "Patient/MyDoctorList",
  GET_ALLDOCTOR_LIST: SERVER + "Patient/AllDoctorList",
  ADD_DOCTORLIST: SERVER + "Patient/AddDoctortoMyDoctorList",

  GET_PATIENT_LIST: SERVER + "Doctor/MyPatientList",
  GET_MY_APPOINTMENTS: SERVER + "TestBooking/MyAppointments",

  GET_PENDINGLIST: SERVER + "TestBooking/PendingAppointmentList",
  GET_REPORTLIST: SERVER + "Patient/MyReportList",
  // GET_UNSHAREDPORT_LIST: SERVER + 'Patient/MyUnsharedReportReportList',
  GET_COMPAREREPORTLIST: SERVER + "Patient/MyReportListwithCompair", //Patient/MyReportListwithCompair
  GET_UNSHAREDREPORT_DOCLIST: SERVER + "Patient/MyUnsharedReportReportList",

  GET_SHAREDREPORT_DOCLIST: SERVER + "Patient/MySharedReportDoctorList",
  ADD_BMIRESULT: SERVER + "Shared/AddBMIReport",
  // Add Blood pressure******
  ADD_BLOODPRESURE: SERVER + "Patient/AddBloodpressure",
  GET_BLOODPRESURE_BYDATES:
    SERVER + "Patient/GetHealthParameterBloodpressureByDate",
  ADD_OXYGEN: SERVER + "Patient/AddOxygen",
  GET_OXYGEN: SERVER + "Patient/GetHealthParameterOxygen",
  GET_OXYGEN_BYDATES: SERVER + "Patient/GetHealthParameterOxygenByDate",
  ADD_TEMPERTURE: SERVER + "Patient/AddTemprature",
  GET_TEMP: SERVER + "Patient/GetHealthParameterTemprature",
  GET_TEMP_BYDATES: SERVER + "Patient/GetHealthParameterTempratureByDate",
  GET_HEALTH_PARAMETER_BLOODPRESSURE:
    SERVER + PATIENT + "GetHealthParameterBloodpressure",

  GET_LIFEDISORDER: SERVER + PATIENT + "LifestyleDisorder",
  GET_LIFEDISORDER_TEST: SERVER + PATIENT + "LifestyleDisorder/",
  // Deelte doc API

  // new
  Add_NEW_PATIENT: SERVER + DOCTOR + "AddNewPatient",
  //
  DELETE_DOCFROM_PATIENTLISST:
    SERVER + PATIENT + "DeleteDoctorFromPatientList?",
  GET_MYHEALTH: SERVER + PATIENT + "MyHealth",
  GET_RECENT_TEST: SERVER + PATIENT + "MyRecentTest",
  GET_UPCOMMING_TEST: SERVER + PATIENT + "MyUpcomingTest",
  //Testbooking
  GET_OLDREPORT_LIST: SERVER + "TestBooking/GetOldReportList",
  //for appointemts list which are bookde using the prescriptions
  GET_PRESCRIPTION_APPOINTMENT_LIST:
    SERVER + "TestBooking/PrescriptionAppointmentList",

  GET_LABLIST: SERVER + "TestBooking/GetTestPriceandLabDetails",
  // new changes
  GET_LABLIST_FOR_BOOKING: SERVER + "TestBooking/GetLabListForAppointment",
  GET_TESTLIST_FOR_BOOKING: SERVER + "TestBooking/TestListByLabId",

  GET_PRESCRIPLABLIST: SERVER + "TestBooking/LabList",
  GET_COMPARE_OLDREPORT_LIST: SERVER + "TestBooking/GetOldReportlistCompair",

  GET_REPORT_MANUAL_PUCH_TEST_LIST: SERVER + "TestBooking/FillReportTestList",
  GET_TESTLIST: SERVER + "TestBooking/TestList",
  //new changes  /TestBooking/ReportDetilsForGraph
  BOOK_APPOINTMENT: SERVER + "TestBooking/BookAppointment",
  //new changes after sever migration only in Book Appointmetn

  // BOOK_APPOINTMENT:
  //   "https://endpoint.visionarylifescience.com/TestBooking/BookAppointment",
  // new added
  BOOK_SUGGESTED_APPOINTMENT: SERVER + "TestBooking/SuggestTestBookAppoinment",
  OLD_REPORT_DETAIL: SERVER + "TestBooking/MyOldReportDetails/",
  COMPARE_REPORTGRAPH: SERVER + "TestBooking/ReportDetilsForGraph?",
  COMPARE_OLDREPORTGRAPH: SERVER + "TestBooking/ReportoldDetilsForGraph",

  FAMILYMEBER_VIEW_OLD_REPORT_DETAIL:
    SERVER + "TestBooking/FamilyMemberOldReportDetails",
  // SERVER + "TestBooking/MyfamilymemberOldReportDetails",

  ADD_OLD_REPORT_MANUALPUCNCHING: SERVER + "TestBooking/AddOldReport",
  TEST_STATUS: SERVER + "TestBooking/CheckTestStatus/",
  UPLOAD_PRESCRIPTION: SERVER + "TestBooking/UploadPrescription",
  TESTBOOK_RESCHEDULE: SERVER + "TestBooking/ResheduleTestBooking",
  MANUAL_REPORTPUNCH: SERVER + "TestBooking/ManualReportPunching",
  GET_REPORTVALUE: SERVER + "TestBooking/GetReportValues?",
  //new Get Report values
  GET_REPORTVALUES_UPDATED_ANALYTE_SUBANALYTE:
    SERVER + "TestBooking/GetReportValuesUpdated?BookingId",
  // new due to ref range per results
  GET_REPORTVALUES_REFRANGE_PERRESULT:
    SERVER + "TestBooking/getReportValuesRefRange?BookingId",

  ADD_REPORT: SERVER + "TestBooking/AddReport",
  GET_MANUALREPORTLIST: SERVER + "TestBooking/GetManualPunchedReportlist",
  UPLOAD_REPORTIMG: SERVER + "TestBooking/UploadReportImage",
  UPLOAD_REPORTPUNCH:
    SERVER + "TestBooking/UploadReportforPunchung?ReportPath=",

  LAB_DATASLOT: SERVER + "TestBooking/LabDataSlot",
  //GET_LABLIST: SERVER+"/TestBooking/LabList",
  DOC_REPORTSTATUS: SERVER + "Doctor/GetSharedReportCountStatusvise",
  DOCDASH_COUNT: SERVER + "Doctor/GetDashboardKPICount",
  DOCDASH_SHAREREPORT: SERVER + "Doctor/SharedReportListforDashboard",
  DOCDASH_SUGGESTTEST: SERVER + "Doctor/GetSuggestTestlistForDahsboard",
  DOCDASH_ALLSUGGESTTEST: SERVER + "Doctor/MyAllSuggestedTest",
  DOCDASH_ALLSHAREREPORT: SERVER + "Doctor/AllSharedReportList",
  DOCDASH_STATUSSHAREREPORT: SERVER + "Doctor/SharedReportListwithStatus",
  DOCDASH_UPDATEREPORTSTATUS: SERVER + "Doctor/UpdateSharedReportStatus",
  DOC_VIEWREPORT: SERVER + "Doctor/PatientReportDetails",
  GET_DOCTOR_PROFILE: SERVER + "Doctor/DoctorMyProfile",
  ALL_PATIENTLIST: SERVER + "Doctor/AllPatientList",
  ADD_PATIENTS: SERVER + "Doctor/AddPatientToMyList",
  TESTSUGGEST_PATIENT: SERVER + "Doctor/TestSuggestToPatient",
  //TESTSUGGESTPATIENT: SERVER+"Doctor​/TestSuggestToPatient",​
  //Old report
  DOCDASH_ALLSHARED_OLDREPORT: SERVER + "Doctor/AllOldSharedReportList",
  DOCDASH_OLDSTATUSSHAREREPORT: SERVER + "Doctor/OldSharedReportListwithStatus",
  DOCDASH_UPDATE_OLDREPORTSTATUS: SERVER + "Doctor/UpdateOldSharedReportStatus",
  DOC_VIEW_OLDREPORT: SERVER + "Doctor/PatientOldReportDetails",
  DOC_ADD_COMMENT_TO_OLDREPORTS: SERVER + "Doctor/AddOldReportNote",
  DOCDASH_OLDSHAREREPORT_FORDASH:
    SERVER + "Doctor/OldSharedReportListforDashboard",
  PATIENT_UNSHARED_OLDREPORT: SERVER + "Patient/UnshreadMyOldReport",

  PATIENT_OLD_UNSHAREDR_REPORTLIST:
    SERVER + "Patient/MyOldUnsharedReportReportList",

  PATIENT_SHARED_OLDREPORTTODOC: SERVER + "Patient/AddOldSharedReport",
  PATIENT_SHARED_OLDREPORT: SERVER + "Patient/PatientOldSharedReportList",

  Add_OLDSHAREREPORT: SERVER + "Patient/AddOldSharedReport",
  DOCDASH_SHARED_OLDREPORT: SERVER + "Doctor/AllOldSharedReportList",
  PATIENT_SHAREDREPORT: SERVER + "Patient/PatientSharedReportList",
  PATIENT_UNSHAREDREPORT: SERVER + "Patient/UnshreadMyReport/",
  PAYMENT_HISTORY: SERVER + "Patient/PaymentHistory",

  TESTBOOK_PRESCRIPTION:
    SERVER + "TestBooking/BookAppointmentusingPrescription",
  FAMILY_RELATION: SERVER + "Patient/FamilyRelation",
  ADD_NEWMEMBER: SERVER + "Patient/RegisterFamilyMember",
  FAMILY_MEMBERLIST: SERVER + "Patient/MyFamilyMemberList",
  PENDING_REQUEST: SERVER + "Patient/UserPendingRequest",
  FAMILY_MEMBERSEARCH: SERVER + "Patient/SearchFamilyMember",
  UPDATE_REQUESTSTATUS: SERVER + "Patient/UpdateFamilyRequestStatus",
  VERIFY_FAMILYMEMBER: SERVER + "Patient/VerifiedFamilyMember",

  // new
  RESEND_FAMILYMEMBER_OTP: SERVER + "Patient/ResendFamilymemberOTP?RequestId=",

  REQUEST_ADDMEMBER: SERVER + "Patient/AddFamilyMember",
  DELETE_MEMBER: SERVER + "Patient/DeleteFamilyMember?",
  FAMILY_REPORTLIST: SERVER + "Patient/MyFamilyMemberReportList",
  //new
  MYFAMILY_MEMEBER_OLD_REPORTLIST:
    SERVER + "Patient/MyFamilyMemberOldReportList",

  MYHEALTH_GRAPH: SERVER + "Patient/MyHealthAnaylteDetails?",
  BYDATES_GRAPH: SERVER + "Patient/MyHealthAnaylteDetailsByDates",
  Add_SHAREREPORT: SERVER + "Patient/AddSharedReport", //Chek this @amol
  UPDATE_PATIENT: SERVER + "Patient/UpdatePatient",
  UPLOAD_PROFILE: SERVER + "Patient/UploadPProfilePic",
  ACCESS_MEMBER: SERVER + "Patient/MyReportAccessFamilyMemberList",
  REVOKE_MEMBER: SERVER + "Patient/RevokeReportAccess?",
  DOC_ADD_COMMENT: SERVER + "Doctor/AddNote",

  REPORT_DETAIL: SERVER + "Patient/MyReportDetails/",

  GET_DOCADDED_COMMENT: SERVER + "Patient/GetDoctorNote/",

  // doc
  UPDATE_DOCTOR: SERVER + "Doctor/UpdateDoctor",

  //Enterprise
  GET_MEDICATION_HISORY: SERVER + PATIENT + "MedicationList",
  GET_IN_DETAIL_MEDICATION_HISORY: SERVER + PATIENT + "MedicationDetails",
  DEL_TESTREP_BY_TECH: SERVER + "Enterprise/DeleteTest?",
  GET_EMP_PROFILE: SERVER + "Enterprise/EmployeeMyProfile",
  GET_MEDICATIONDATA: SERVER + PATIENT + "GetMedicineReminderDetails",
  UPDATE_MEDICINE_STATUS: SERVER + PATIENT + "DeleteReminderFromPatient",
  GET_TECH_DASH_COUNT: SERVER + "Enterprise/GetHelthCampDashboardCount",
  TECH_TEST_DONELIST: SERVER + "Enterprise/healthCampTestDoneList",
  GET_REG_LIST: SERVER + "Enterprise/healthCampRegisterUserList",
  PROCESS_SCANNED_USER_REG: SERVER + "Enterprise/HealthCampAdduser",

  //complet Enterprise

  //new
  GET_REPORT_LIST_SHARED_WITH_DOC:
    SERVER + "Doctor/GetReportListSharedwithDoctor/",

  //old report new
  GET_OLDREPORT_LIST_SHARED_WITH_DOC:
    SERVER + "Doctor/GetOldReportListSharedwithDoctor/",

  //  'Patient/RevokeReportAccess',

  //new added
  // Firebase Token
  FIREBASE_REGISTER_TOKEN: SERVER + AUTH + "UpdateDeviceToken/",

  LAB_LOGO: "https://visionarylifescience.com/images/",
  PROFILE_PIC: "https://visionarylifescience.com/images/profileimage/"
};

// http://endpoint.visionarylifescience.com/Auth/UpdateDeviceToken/
