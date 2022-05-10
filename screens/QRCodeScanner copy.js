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

import axios from "axios";
const api_url = "https://gatepassapplication.herokuapp.com/api/permission/";

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

  const tempValues = [["gfg2"], ["gfg5"], ["gfg8"], ["gfg8"], ["pass"]];
  // const tableValues = ["gfg2", "gfg5", "gfg8", "gfg8", "pass"];
  const tableKeys = [
    ,
    "Roll No:",
    "Reason:",
    "Granted By:",
    "Granted At:",
    "Pass Type:",
  ];

  const getPermissionStatus = (uniqueId) => {
    axios
      // .get(api_url + "625daeb5e10eea156409c4df")
      // .get(process.env.API_URL)
      .get(api_url + uniqueId)
      // .then((response) => console.log(response.data.movies[0].title))
      // .then((response) => setFetchedDetails(response.permissionStatus))
      .then((response) => {
        console.log(response.data);
        setAllowStudent(response.data.permissionStatus);
        const { studentId, reason, passMode, facultyId, grantedAt } =
          response.data;
        setTableValues([
          [{ studentId }],
          [{ reason }],
          [{ facultyId }],
          [{ grantedAt }],
          [{ passMode }],
        ]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleBarCodeScanned = ({ type, data }) => {
    console.log("handle barcode function called");
    setScannedText(true);
    //   alert(`Barcode with type: ${type} and data: ${data}` )
    // alert( `Barcode with type: ${type} and data: ${Linking.openURL( `${data}`
    // alert(`Barcode with type: ${type} and data: ${data} has been scanned`);
    console.log("[INFO] Scanned uniqueId: " + data);
    alert(allowStudent);
  };

  if (hasCameraPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasCameraPermission == false) {
    return <Text>No Access to camera</Text>;
  }
  const tableData = [
    ["1", "2", "3"],
    ["a", "b", "c"],
    ["1", "2", "3"],
    ["a", "b", "c"],
  ];
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/background.png")}
        resizeMode="cover"
        style={styles.image}
      >
        <BarCodeScanner
          onBarCodeScanned={scannedText ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        {scannedText ? (
          // <Button
          //   title="Tap to scan another"
          //   style={styles.btnScanAgain}
          //   onPress={() => setScannedText(false)}
          // />
          <View>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => setScannedText(false)}
            >
              <Text style={styles.text}>{"Tap to scan another"}</Text>
              {/* <Table> */}
              {/* <TableWrapper style={styles.wrapper}>
              <Col
                data={tableKeys}
                style={styles.keys}
                // heightArr={[28, 28]}
                textStyle={styles.titleText}
              />
              <Rows
                data={tableValues}
                flexArr={[1, 1]}
                style={styles.row}
                textStyle={styles.valuesText}
              />
            </TableWrapper> */}
              {/* <Rows data={tableData} />
            </Table> */}
              <View>
                <Table>
                  <Rows data={tableData} textStyle={styles.valuesText} />
                </Table>
              </View>
            </TouchableOpacity>
            <Table>
              <Rows data={tableData} textStyle={styles.valuesText} />
            </Table>
          </View>
        ) : (
          <Image
            width={20}
            height={512}
            source={require("../assets/scan_thin.png")}
            style={styles.btnImage}
          />
        )}
        {/* <Text> HEllo</Text> */}
      </ImageBackground>
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
    // maxWidth: 50,
    borderRadius: 20,
    width: 10,
    color: "red",
  },
  button: {
    backgroundColor: "#859a9b",
    borderRadius: 20,
    padding: 10,
    marginBottom: 20,
    shadowColor: "#303838",
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    shadowOpacity: 0.35,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  btn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(189, 209, 240, 0.8)",
    height: 40,
    borderRadius: 40,
  },

  btnImage: {
    width: 335,
    height: 335,
    paddingLeft: 100,
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
    paddingLeft: 20,
    fontWeight: "bold",
  },
  titleText: {
    fontWeight: "100",
    textAlign: "right",
    color: "black",
    width: 100,
  },
  // tableStyle: {
  //   marginLeft: 30,
  // },
  image: {
    flex: 1,
    justifyContent: "center",
  },
});
