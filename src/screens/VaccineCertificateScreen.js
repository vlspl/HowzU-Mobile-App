import React, { Component } from "react";
import {
  View,
  Linking,
  PermissionsAndroid,
  TouchableOpacity,
  Text
} from "react-native";
import { Container } from "native-base";
import CustomeHeader from "../appComponents/CustomeHeader";
import Loader from "../appComponents/loader";
var RNFS = require("react-native-fs");
import { WebView } from "react-native-webview";
import RNFetchBlob from "rn-fetch-blob";
import TestInputCard from "../appComponents/TextInputCard";
const Rijndael = require("rijndael-js");
//const bufferFrom = require('buffer-from')
global.Buffer = global.Buffer || require("buffer").Buffer;
const padder = require("pkcs7-padding");
import Toast from "react-native-tiny-toast";

export default class VaccineCertificateScreen extends Component {
  constructor(props) {
    super(props);
    //setting default state
    this.state = {
      isLoading: false,
      selectedIds: [],
      userDetails: [],
      pageNo: 1,
      searchString: "",
      paginationLoading: false,
      isNetConnected: true,
      searchLoading: false,
      refreshing: false,
      activebtn: "",
      isDatePickerVisible: false,
      showError: false,
      downloadStart: false,
      showModalLoading: false,
      showFileExplorer: true,
      startFolder: "",
      from: "",
      refid: "",
      iscer: false,
      cowintoken: "",
      newUrl: ""
    };
  }
  componentDidMount() {
    /// this.retrieveData()
    if (this.props.route.params.from == "cowinotp") {
      this.setState({
        from: this.props.route.params.from,
        cowintoken: this.props.route.params.token
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextprops) {
    if (nextprops.route.params.from == "cowinotp") {
      this.setState({
        from: nextprops.route.params.from,
        token: nextprops.route.params.token
      });
    }
  }

  Decrypt = (encryptStr) => {
    if (encryptStr) {
      const cipher = new Rijndael("1234567890abcder", "cbc");
      const plaintext = Buffer.from(
        cipher.decrypt(
          new Buffer(encryptStr, "base64"),
          128,
          "1234567890abcder"
        )
      );
      const decrypted = padder.unpad(plaintext, 32);
      const clearText = decrypted.toString("utf8");

      return clearText.toString();
    } else return "";
  };
  backbtnPress = () => {
    this.props.navigation.goBack();
    // this.props.navigation.navigate('PatientDashboard', {
    //   refresh: 'refresh',
    // });
  };
  checkPermission = async (downloadurl) => {
    console.log(downloadurl, "downloadurl;;;;;");
    if (downloadurl.includes("certifiate")) {
      console.log("======>?>?<?<?downloadurl;;;;;");

      this.webview.stopLoading();
      if (Platform.OS === "ios") {
        this.downloadImage(downloadurl);
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: "Storage Permission Required",
              message: "App needs access to your storage to download Photos"
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            let url = downloadurl.replace("blob:", "");
            this.webview.stopLoading();
            // this.downloadImage(downloadurl);
            this.AndroiddownloadImage(url);
          } else {
            // If permission denied then show alert
            alert("Storage Permission Not Granted");
          }
        } catch (err) {
          Toast.show("Something Went Wrong, Please Try Again Later");

          // To handle permission related exception
          console.warn(err);
        }
      }
    }
  };
  downloadImage = (downloadurl) => {
    // const directoryFile = RNFS.ExternalStorageDirectoryPath + "/DownloadFile/";
    const directoryFile = RNFS.DocumentDirectoryPath + "/DownloadFile/";

    console.log("inside  downlaod", downloadurl, "to downlaod", directoryFile);
    if (RNFS.exists(directoryFile)) {
      RNFS.unlink(directoryFile)
        .then(() => {
          console.log("FOLDER/FILE DELETED");
        })
        // `unlink` will throw an error, if the item to unlink does not exist
        .catch((err) => {
          console.log("CANT DELETE", err.message);
          this.setState({ showError: true });
        });

      RNFS.mkdir(directoryFile);
    }
    if (downloadurl) {
      //Verifing if the url have a .zip file
      if (downloadurl.toLowerCase().includes("certificate")) {
        const urlDownload = downloadurl;
        this.setState({ isLoading: true });
        let fileName;
        try {
          fileName = urlDownload;
        } catch (e) {
          console.log(e);
          fileName = "certificate.pdf";
        }

        //Downloading the file on a folder
        let dirs = directoryFile + "/" + fileName;
        RNFetchBlob.config({
          // response data will be saved to this path if it has access right.
          path: dirs
        })
          .fetch("GET", urlDownload, {
            //some headers ..
          })
          .progress((received, total) => {
            console.log("progress", received / total);
          })
          .then((res) => {
            // the path should be dirs.DocumentDir + 'path-to-file.anything'
            console.log("&*&*&*&*The file saved to ", res.path());

            //Acabou o download do arquivo
            this.setState({
              downloadStart: false,
              showModalLoading: false,
              showFileExplorer: true,
              startFolder: directoryFile,
              isLoading: false
            });
          })
          .catch((err) => {
            this.setState({
              isLoading: false
            });
          });
      }
    }
  };
  AndroiddownloadImage = (downloadurl) => {
    this.setState({ isLoading: true });
    // const directoryFile = RNFS.ExternalStorageDirectoryPath + "/DownloadFile/";
    const directoryFile = RNFS.DocumentDirectoryPath + "/DownloadFile/";

    console.log(downloadurl, "&*&*&*&*&*to downlaod", directoryFile);

    let date = new Date();

    const { config, fs } = RNFetchBlob;
    let PictureDir = fs.dirs;

    let options = {
      fileCache: true,
      path: PictureDir.DownloadDir + "/certificate.pdf"
      // addAndroidDownloads: {
      //   useDownloadManager: true,
      //   notification: true,
      //   path: PictureDir.DownloadDir + "/certificate.pdf",
      //   description: "File downloaded by download manager.",
      //   mime: "application/pdf",
      //   mediaScannable: true,
      //   title: "dowinlaoding the pdf",
      //   notification: true,
      // },
    };
    config(options)
      .fetch("GET", downloadurl)
      // RNFetchBlob.config({
      //   // response data will be saved to this path if it has access right.
      //   path: PictureDir,
      // })
      // .fetch("GET", downloadurl, {
      //   Authorization: `Bearer ${this.state.cowintoken}`,
      //   "Content-Type": "application/pdf",
      // })
      .then((res) => {
        this.setState({ isLoading: false });
        res.path();

        alert("Certificate Downloaded Successfully.");
      })
      .catch((err) => {
        Toast.show("Something Went Wrong, Please Try Again Later");

        this.setState({ isLoading: false });
      });
  };
  getExtention = (filename) => {
    // To get the file extension
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };
  LoadingIndicatorView() {
    return <Loader loading={true} />;
  }

  render() {
    console.log(this.state.newUrl, "new ///");

    // const { data, isLoading } = this.state;
    const uri = "https://selfregistration.cowin.gov.in/";
    let downloadurl =
      "https://cdn-api.co-vin.in/api/v2/registration/certificate/public/download?beneficiary_reference_id=";

    return (
      <Container>
        <Loader loading={this.state.isLoading} />

        <CustomeHeader
          title="Vaccination"
          headerId={2}
          onPressback={this.backbtnPress}
          navigation={this.props.navigation}
        />

        <View
          style={{ flexDirection: "column", flex: 1, backgroundColor: "white" }}
        >
          {this.state.from == "cowinotp" && (
            <>
              <TestInputCard
                keyboardtype={"numeric"}
                inputfield="Enter Beneficiary Reference ID"
                // maxlength={10}
                placeholder="Enter Beneficiary Reference ID"
                icon={require("../../icons/health-id.png")}
                onchangeTxt={(text) =>
                  this.setState({ refid: text, iscer: true })
                }
              />

              <TouchableOpacity
                style={{
                  backgroundColor: "#1B2B34",
                  elevation: 5,
                  marginTop: 50,
                  borderRadius: 10,
                  height: 50,
                  justifyContent: "center",
                  shadowOffset: { width: 2, height: 3 },
                  shadowColor: "gray",
                  shadowOpacity: 0.9
                }}
                onPress={() => {
                  this.checkPermission(downloadurl + this.state.refid);
                  this.setState({ isLoading: true });
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    alignSelf: "center",
                    fontSize: 18,
                    color: "white",
                    fontWeight: "bold"
                  }}
                >
                  GET CERTIFICATE
                </Text>
              </TouchableOpacity>
            </>
          )}

          {this.state.from != "cowinotp" && (
            <WebView
              ref={(ref) => (this.webview = ref)}
              source={{
                uri: "https://selfregistration.cowin.gov.in/"
              }}
              javaScriptEnabled={true}
              renderLoading={this.LoadingIndicatorView}
              startInLoadingState={true}
              onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                this.setState({ isError: true });
              }}
              // onMessage={(event) => {
              //   alert(event.nativeEvent.data);
              // }}
              onNavigationStateChange={(event) => {
                console.log(event, ";;;;;///");

                this.checkPermission(event.url.trim());
                // if (event.url !== uri) {
                //   console.log(" i am in the if ;;;;;///");

                //   this.webview.stopLoading();
                //   this.checkPermission(event.url);
                // }
              }}
              cacheEnabled={true}
              allowUniversalAccessFromFileURLs={true}
              mixedContentMode={"always"}
              originWhitelist={["*"]}
              allowFileAccessFromFileURLs={true}
              allowFileAccess={true}
              allowingReadAccessToURL={true}
              accessible={true}
              allowsBackForwardNavigationGestures={true}
              userAgent={
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"
              }
              dataDetectorTypes={"link"}
              saveFormDataDisabled={true}
            />
          )}
        </View>
      </Container>
    );
  }
}
