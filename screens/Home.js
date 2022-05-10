import React, { useState } from "react";
import {
  View,
  Button,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  ImageBackground,
} from "react-native";
import {
  Table,
  Row,
  Rows,
  TableWrapper,
  Col,
} from "react-native-table-component";
import { useNavigation } from "@react-navigation/native";

// const dotenv = require("dotenv");
// dotenv.config();

import axios from "axios";
import { color } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";
// const api_url = "https://http://gatepassapi.herokuapp.com/api/permission/";    // for hosted
// const api_url = "http://157.48.163.95:4000/api/permission/";                          // for testing purposes: on local
// const api_url = "http://127.0.0.1:4000/api/permission/";
const api_url =
  "https://gatepassapplication.herokuapp.com/api/users/625dab5632bda11dfd2ca774";

const Home = () => {
  const navigation = useNavigation();
  const [fetchedDetails, setFetchedDetails] = useState([]);

  const fetchData = () => {
    axios
      // .get(api_url + "625daeb5e10eea156409c4df")
      // .get(process.env.API_URL)
      .get(api_url)
      // .then((response) => console.log(response.data.movies[0].title))
      // .then((response) => setFetchedDetails(response.permissionStatus))
      .then((response) => console.log(response.data))
      .catch((error) => {
        console.log(error);
      });
    console.log(fetchedDetails);
  };

  const tableKeys = [
    "Student Name:",
    "Roll No:",
    "Granted By:",
    "Granted At:",
    "Pass Type:",
  ];

  return (
    <View style={styles.container}>
      {/* <ImageBackground
        source={require("../assets/background.png")}
        resizeMode="center"
        style={styles.image}
      > */}
      {/* <Button
        title="Scan"
        onPress={() => navigation.navigate("QRCodeScanner")}
      /> */}
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("QRCodeScanner")}
        // onPress={fetchData}    // used for testing purpose..
      >
        <Image
          width={20}
          height={512}
          source={require("../assets/3126504.png")}
          style={styles.btnImage}
        />
        <Text style={styles.text}>{"Scan student's QR code"}</Text>
      </TouchableOpacity>
      {/* <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
        <TableWrapper style={styles.wrapper}>
          {/* <Col
            data={tableKeys}
            style={styles.tableKeys}
            textStyle={styles.tableKeysText}
          /> * /}
          <Row
            data={tableValues}
            style={styles.tableValues}
            textStyle={styles.tableValuesText}
          />
        </TableWrapper>
        {/* <Rows data={tableValues} /> * /}
      </Table> */}
      {/* <TouchableOpacity>
      // used for testing purpose
        <Table>
          <Rows data={tableData} textStyle={styles.valuesText} />
        </Table>
      </TouchableOpacity> */}
      {/* </ImageBackground> */}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#ff3",
    justifyContent: "center",
    // alignItems: "center",
    padding: 50,
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
  },
  text: {
    fontSize: 18,
    color: "dodgerblue",
    fontWeight: "normal",
    alignSelf: "center",
    textTransform: "uppercase",
    paddingTop: 20,
  },
  btn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  btnImage: {
    width: 200,
    height: 200,
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
});
