import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import ShowResponse from "./ShowResponse";
import Button from "@material-ui/core/Button";
import GetAppRoundedIcon from "@material-ui/icons/GetAppRounded";
import { LocalConvenienceStoreOutlined } from "@material-ui/icons";

import axios from "axios";

function FetchPermissions() {
  // const api_url = "http://localhost:4000/api/permission/"; // for local testing..
  const api_url = "https://securitygaurd.herokuapp.com/permissions/"; // as per common API of Shiva and Ganesh
  // const api_url = "https://gatepassapplication.herokuapp.com/api/permission"; /// for deployment..
  const [data, setData] = useState([]);
  // for snack bar -- showing status to the user..
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [operationStatus, setOperationStatus] = useState("");
  const [endOperationMessage, setEndOperationsMessage] = useState("");

  function handleSnackbarVisibility(show, status = "", msg = "") {
    // as when showing is not req, why need those..
    setShowSnackBar(show);
    setOperationStatus(status);
    setEndOperationsMessage(msg);
  }

  function polishResponse(obj) {
    for (let i = 0; i < Object.keys(obj).length; i++) {
      // filter out..
      let { Name, passMode, Type, reason, RollNumber, createdAt } = obj[i];
      // permission status
      if (Type === 0) Type = "Lunch Pass";
      else if (Type === 1) Type = "Gate Pass";
      else if (Type === -1) Type = "Permission Expired"; // After student uses the permission..

      // date..
      let d = new Date(createdAt);
      console.log("date: ", d.toLocaleString());
      createdAt = new Date(createdAt).toLocaleString();

      // pass mode
      if (passMode === 0) passMode = "Lunch Pass";
      else passMode = "Gate Pass";

      // Place back..
      obj[i] = {
        RollNumber: RollNumber,
        Name: Name,
        createdAt: createdAt,
        passMode: passMode,
        Type: Type,
        reason: reason,
      };
      // console.log("REASONNNNNNNNNNNNNNNN: " + reason);
    }
    //console.log("in polish work..", obj);
    return obj;
  }

  function fetchPermissions() {
    fetch(api_url)
      .then((response) => response.json()) //cvt to JSON
      // .then((response) => console.log(response))
      .then((response) => {
        console.log(response);
        // const {} = response;
        // some furnishing..
        response = polishResponse(response);
        console.log("After polishing: ", response);
        setData(response);
        handleSnackbarVisibility(true, "info", "Data fetched");
      })
      .catch((error) => {
        // console.log("Unable to fetch data" + error);
        handleSnackbarVisibility(
          true,
          "error",
          "Network Error: Unable to fetch data"
        );
      });
  }

  // async function fetchPermissionsAsync() {
  //   let json = await axios
  //     .get("https://tutorialzine.com/misc/files/example.json")
  //     .then((response) => console.log(response))
  //     .catch((error) => console.log(error));
  //   console.log("after the call to service", json);
  //   // return json;
  // }

  useEffect(() => {
    fetchPermissions(); // used for fetch..
    // from: https://stackoverflow.com/a/53932719
    // (async () => {
    //   // let abc = await getJSONAsync();
    //   // await getJSONAsync();
    //   await fetchPermissionsAsync();
    //   // console.log(">>>>>>>>>>> abc", abc);
    // })();
  }, []);

  const columns = [
    { title: "Student ID", field: "RollNumber" },
    { title: "Reason", field: "reason" },
    { title: "Pass Mode", field: "passMode" },
    {
      title: "Permission Status",
      field: "Type",
      // lookup: { 0: "Lunch Pass", 1: "Gate Pass", "-1": "Pass Expired" },
    },
    { title: "Granted by Faculty(ID)", field: "Name" },
    { title: "Granted At", field: "createdAt" },
    // profile picture, in next version...
  ];

  function downloadLogs() {
    console.log("Starting download logs");
    function ConvertToCSV(objArray) {
      var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
      var str = "";

      for (var i = 0; i < array.length; i++) {
        var line = "";
        for (var index in array[i]) {
          // for (let j = 0; j < array[i].length; j++) {
          if (line != "") line += ",";

          line += array[i][index];
        }
        console.log("Generated: ", line);
        str += line + "\r\n";
      }

      return str;
    }
    const dataCSV = `name, email
        ABC, 123@12.com
        2312, 43@er.com

        Summary
        Users allowed: 2
        Users pending: 0
    `;
    // function downloadFile(
    //   obj,
    //   name = "Log_on_" +
    //     new Date()
    //       .toLocaleString()
    //       .toString()
    //       .replaceAll(" ", "")
    //       .replaceAll("/", "_")
    //       .replace(",", "__") +
    //     ".csv"
    // ) {
    // Generate CSV type data..
    // first row:  Get all the keys..
    // console.log("obj printing: ", JSON.stringify(data));
    // const downloadData = ({ ["tableData"]: tableData, ...data } = data);
    // console.log(downloadData);
    console.log(ConvertToCSV(data));
    // Create a blob inside the local memory..
    // const blob = new Blob([data], { type: "octet-stream" });

    // // create url to it..
    // const href = URL.createObjectURL(blob);

    // const a = Object.assign(document.createElement("a"), {
    //   href,
    //   style: "display:none",
    //   download: name,
    // });

    // a.click(); // trigger download..

    // // Clean up..
    // URL.revokeObjectURL(href);
    // a.remove();
    // }
  }
  return (
    <div className="App">
      <h4 align="center">Permissions taken on this day</h4>
      <Button
        variant="outlined"
        color="default"
        // className={classes.button}
        startIcon={<GetAppRoundedIcon />}
        gutterBottom
        onClick={() => {
          // downloadLogs();
          // alert(new Date().toTimeString().toString())
          handleSnackbarVisibility(
            true,
            "info",
            "Feature in development, please wait for update."
          );
        }}
      >
        Take Logs for today
      </Button>
      <MaterialTable
        title="Permissions"
        data={data}
        columns={columns}
        options={{
          filtering: true, // Provides MS-Excel like filtering
          exportButton: true, // provides the facility to download as CSV and PDF
          actionsColumnIndex: -1, // Display the actions at right side
          addRowPosition: "first", // Show the option of adding a new row at the start of the table
        }}
      />
      {showSnackBar && (
        <ShowResponse
          severity={operationStatus}
          message={endOperationMessage}
        />
      )}
    </div>
  );
}

export default FetchPermissions;
