import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import ShowResponse from "./ShowResponse";

function FetchPermissions() {
  const api_url = "http://localhost:4000/api/permission/";
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
      let {
        facultyId,
        passMode,
        permissionStatus,
        reason,
        studentId,
        grantedAt,
      } = obj[i];
      // permission status
      if (permissionStatus === 0) permissionStatus = "Denied";
      else if (permissionStatus === 1) permissionStatus = "Granted";
      else if (permissionStatus == -1) permissionStatus = "Used Out"; // After student uses the permission..

      // date..
      let d = new Date(grantedAt);
      console.log("date: ", d.toLocaleString());
      grantedAt = new Date(grantedAt).toLocaleString();

      // pass mode
      if (passMode == 0) passMode = "Lunch Pass";
      else passMode = "Gate Pass";

      // Place back..
      obj[i] = {
        studentId: studentId,
        facultyId: facultyId,
        grantedAt: grantedAt,
        passMode: passMode,
        permissionStatus: permissionStatus,
        reason: reason,
      };
    }
    //console.log("in polish work..", obj);
    return obj;
  }

  useEffect(() => {
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
  }, []);
  const columns = [
    { title: "Student ID", field: "studentId" },
    { title: "Reason", field: "reason" },
    { title: "Pass Mode", field: "passMode" },
    { title: "Permission Status", field: "permissionStatus" },
    { title: "Granted by Faculty(ID)", field: "facultyId" },
    { title: "Granted At", field: "grantedAt" },
    // profile picture, in next version...
  ];

  return (
    <div className="App">
      <h4 align="center">Permissions taken on this day</h4>
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
