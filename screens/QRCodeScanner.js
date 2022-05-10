import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  StyleSheet,
  Button,
  Linking,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import {
  Table,
  Row,
  Rows,
  TableWrapper,
  Col,
} from "react-native-table-component";
import Toast from "react-native-simple-toast";

import axios from "axios";
// const api_url = "https://gatepassapplication.herokuapp.com/api/permission/";
// const api_url = "http://192.168.125.116:4000/permissions/"; // as per common API of Shiva and Ganesh
const api_url = "https://securitygaurd.herokuapp.com/Validate/";

const QRCodeScanner = () => {
  const [hasCameraPermission, sethasCameraPermission] = useState(null);
  const [scannedText, setScannedText] = useState(false);
  const [allowStudent, setAllowStudent] = useState(false);
  const [tableValues, setTableValues] = useState();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      sethasCameraPermission(status === "granted");
      console.log("Permission granted");
    })();
  }, []);

  const getPermissionStatus = async (uniqueId) => {
    console.log("About to fetch..");
    console.log("Received uniqueId: " + uniqueId);
    await axios
      .post(api_url + uniqueId)
      .then((response) => {
        console.log(response.data);
        // const [RollNumber, Type, facultyId] = response.data;
        // console.log(response.data.RollNumber);
        // console.log(response.data.Type);
        // console.log(response.data.facultyId);

        setAllowStudent(response.data.Type != -1); // if not expired, then allow..!!
        let permissionStatus = response.data.Type;
        if (permissionStatus == 0) permissionStatus = "Lunch Pass";
        else permissionStatus = "Gate Pass";
        setTableValues([
          ["Roll No", `${response.data.RollNumber}`],
          ["Granted By", `${response.data.facultyId}`],
          ["Pass type", `${permissionStatus}`],
        ]);
      })
      .catch((error) => console.log("[ERRROR]" + error));
    // await axios
    //   .post(api_url + uniqueId)
    //   .then((response) => {
    //     // console.log("data: "+response.data);
    //     console.log(response.data);
    //     setAllowStudent(response.data.permissionStatus);
    //     console.log(allowStudent);
    //     const { RollNumber, reason, Type, Name, grantedAt } = response.data;
    //     if (Type == 1) Type = "Gate Pass";
    //     else Type = "Lunch Pass";
    //     setTableValues([
    //       ["Roll No", `${RollNumber}`],
    //       ["Reason", `${reason}`],
    //       ["Granted By", `${Name}`],
    //       ["Granted At", `${new Date(createdAt).getDate()}`],
    //       ["Pass type", `${Type}`],
    //     ]);
    //   })
    //   .catch((error) => {
    //     console.log("[ERROR] Unable to make request to API. Reason\n" + error);
    //   });
  };

  const handleBarCodeScanned = ({ type, data }) => {
    console.log("handle barcode function called");
    setScannedText(true);
    //   alert(`Barcode with type: ${type} and data: ${data}` )
    // alert( `Barcode with type: ${type} and data: ${Linking.openURL( `${data}`
    // alert(`Barcode with type: ${type} and data: ${data} has been scanned`);
    console.log("[INFO] Scanned uniqueId: " + data);
    Toast.show(`Scan Result: ${data}`, Toast.LONG);
    getPermissionStatus(data);
    // alert(allowStudent);
  };

  if (hasCameraPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasCameraPermission == false) {
    return <Text>No Access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {/* <ImageBackground
        source={require("../assets/background.png")}
        resizeMode="cover"
        style={styles.image}
      > */}
      <BarCodeScanner
        onBarCodeScanned={scannedText ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scannedText ? (
        <TouchableOpacity
          style={styles.btnScanAgain}
          onPress={() => {
            setScannedText(false);
            setAllowStudent(false);
            setTableValues([]);
            setScannedText("");
          }}
        >
          {allowStudent ? (
            <View>
              <Image
                width={20}
                height={512}
                source={require("../assets/grantedBadge.png")}
                style={styles.permissionBadge}
              />
              <Table style={{ width: 200 }}>
                <TableWrapper>
                  <Rows data={tableValues} textStyle={styles.valuesText} />
                </TableWrapper>
              </Table>
            </View>
          ) : (
            <View>
              <Image
                width={20}
                height={512}
                source={require("../assets/deniedBadge.png")}
                style={styles.permissionBadge}
              />
              <Text style={styles.permissionDeniedTxt}>
                Do not send student outside
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ) : (
        <Image
          width={20}
          height={512}
          source={require("../assets/scan_thin.png")}
          style={styles.btnImage}
        />
      )}
    </View>
  );
};

export default QRCodeScanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    padding: 20,
  },
  btnScanAgain: {
    backgroundColor: "rgba(189, 209, 240, 0.8)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 40,
    borderRadius: 30,
  },
  btnImage: {
    width: 335,
    height: 335,
  },
  permissionBadge: {
    width: 150,
    height: 150,
    alignSelf: "center",
  },
  //table
  wrapper: { flexDirection: "row" },
  text: {
    fontSize: 15,
    color: "white",
    fontWeight: "normal",
    alignSelf: "center",
    textTransform: "uppercase",
    // paddingTop: 20,
  },
  row: { height: 30 },
  valuesText: {
    textAlign: "left",
    color: "black",
    paddingLeft: 18,
    fontWeight: "bold",
  },
  titleText: {
    fontWeight: "100",
    textAlign: "right",
    color: "black",
    width: 100,
  },
  permissionDeniedTxt: {
    alignSelf: "center",
    fontSize: 30,
    textAlign: "center",
    fontWeight: "bold",
    paddingTop: 30,
    textTransform: "uppercase",
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
});
