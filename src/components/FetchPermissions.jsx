import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import ShowResponse from "./ShowResponse";
import Button from "@material-ui/core/Button";
import GetAppRoundedIcon from "@material-ui/icons/GetAppRounded";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
// import { LocalConvenienceStoreOutlined } from "@material-ui/icons";

// import axios from "axios";

function FetchPermissions() {
  // const api_url = "http://localhost:4001/permissions/"; // for local testing..
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
    // sort the objects based on the permission time (in DESC, so recent permissions will be on head)
    obj.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt); /// sort DESC
    });

    // perform polishing..
    for (let i = 0; i < Object.keys(obj).length; i++) {
      // filter out..
      let { Name, passMode, Type, reason, RollNumber, createdAt } = obj[i];
      // permission status
      if (Type === 0) Type = "Lunch Pass";
      else if (Type === 1) Type = "Gate Pass";
      else if (Type === -1) Type = "Permission Expired"; // After student uses the permission..

      // date..
      // let d = new Date(createdAt);
      // // console.log("date: ", d.toLocaleString());
      createdAt = new Date(createdAt).toLocaleString();

      // pass mode
      // if (passMode === 0) passMode = "Lunch Pass";
      // else if (passMode === 1) passMode = "Gate Pass";

      // Place back..
      obj[i] = {
        RollNumber: RollNumber,
        Name: Name,
        createdAt: createdAt,
        // passMode: passMode,
        Type: Type,
        reason: reason,
      };
      // // console.log("REASONNNNNNNNNNNNNNNN: " + reason);
    }
    //// console.log("in polish work..", obj);
    return obj;
  }

  function fetchPermissions(code) {
    fetch(api_url)
      .then((response) => response.json()) //cvt to JSON
      // .then((response) => // console.log(response))
      .then((response) => {
        // console.log(response);
        // const {} = response;
        // some furnishing..
        response = polishResponse(response);
        // console.log("After polishing: ", response);
        setData(response);
        if (code === "fresh")
          handleSnackbarVisibility(true, "info", "Data fetched successfully.!");
        else if (code === "refresh")
          handleSnackbarVisibility(
            true,
            "info",
            "Data refreshed successfully.!"
          );
      })
      .catch((error) => {
        // // console.log("Unable to fetch data" + error);
        handleSnackbarVisibility(
          true,
          "error",
          "Unable to fetch data due to " + error
        );
      });
  }

  // async function fetchPermissionsAsync() {
  //   let json = await axios
  //     .get("https://tutorialzine.com/misc/files/example.json")
  //     .then((response) => // console.log(response))
  //     .catch((error) => // console.log(error));
  //   // console.log("after the call to service", json);
  //   // return json;
  // }

  useEffect(() => {
    fetchPermissions("fresh"); // used for fetch..
    // from: https://stackoverflow.com/a/53932719
    // (async () => {
    //   // let abc = await getJSONAsync();
    //   // await getJSONAsync();
    //   await fetchPermissionsAsync();
    //   // // console.log(">>>>>>>>>>> abc", abc);
    // })();
  }, []);

  const columns = [
    { title: "Student ID", field: "RollNumber" },
    { title: "Reason", field: "reason" },
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
    // console.log("Starting download logs");
    function ConvertToCSV(objArray) {
      var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
      var str = "";

      // // console.log("about to do: " + array);
      // // console.log("length: " + array.length);

      var lunchPassCounter = 0,
        gatePassCounter = 0,
        passExpiredCounter = 0;

      // console.log("field names: " + Object.keys(array[0]));
      const keys = Object.keys(array[0]);
      for (var idx = 0; idx < keys.length; idx++)
        if (keys[idx] !== "tableData") str += keys[idx] + ","; // excluding one column...
      // new line..
      str += "\r\n";

      // place the fields-values..
      for (var i = 0; i < array.length; i++) {
        var line = "";
        for (var index in array[i]) {
          // console.log("index means: " + index);
          if (line !== "") line += ", ";
          if (index !== "tableData") {
            // filter unnecessary column
            line += array[i][index];
            if (index === "Type") {
              // for tracking.. the counts of each pass..
              // // console.log("[INFO] counting for : " + array[i][index]);
              if (array[i][index] === "Lunch Pass") lunchPassCounter++;
              else if (array[i][index] === "Gate Pass") gatePassCounter++;
              else passExpiredCounter++;
            }
          }
        }
        //Lunch Pass,Lunch Pass,

        // 19BD1A051H,User9,5/31/2022, 6:50:24 AM,Gate Pass
        // console.log("Generated: ", line);
        str += line + "\r\n";
      }
      // attach the stats at end..
      // console.log(
      //   "Tracking nums: gatePass: " +
      //     gatePassCounter +
      //     ", lunchPass: " +
      //     lunchPassCounter +
      //     ", expired: " +
      //     passExpiredCounter
      // );
      str +=
        "\r\n\r\nStats for today \r\n" +
        "# Total passes (Lunch + Gate + Expired), " +
        (lunchPassCounter + gatePassCounter + passExpiredCounter) +
        "\r\n" +
        "# Total Lunch Passes, " +
        lunchPassCounter +
        "\r\n" +
        "# Total Gate passes taken, " +
        (passExpiredCounter + gatePassCounter) +
        "\r\n" +
        "# Gate passes used up today, " +
        passExpiredCounter +
        "\r\n" +
        +"# Gate passes unused today, " +
        gatePassCounter;
      return str;
    }
    // const dataCSV = `name, email
    //     ABC, 123@12.com
    //     2312, 43@er.com

    //     Summary
    //     Users allowed: 2
    //     Users pending: 0
    // `;
    function downloadFile(
      obj,
      name = "LogReport_on_" +
        new Date()
          .toLocaleString("en-US", { timeZone: "Asia/Calcutta" })
          .toString()
          .replaceAll(" ", "")
          .replaceAll("/", "_")
          .replace(",", "__") +
        ".csv"
    ) {
      // Generate CSV type data..
      // first row:  Get all the keys..
      // console.log("obj printing: ", JSON.stringify(data));
      // const downloadData = ({ ["tableData"]: tableData, ...data } = data);
      // // console.log(downloadData);
      const dataToDownload = ConvertToCSV(data);
      // console.log("CSV Converted data: " + dataToDownload);
      // Create a blob inside the local memory..
      const blob = new Blob([dataToDownload], { type: "octet-stream" });

      // // create url to it..
      const href = URL.createObjectURL(blob);

      const a = Object.assign(document.createElement("a"), {
        href,
        style: "display:none",
        download: name,
      });

      a.click(); // trigger download..

      // // Clean up..
      URL.revokeObjectURL(href);
      a.remove();
    }

    downloadFile(); // download the file..
  }

  function deleteAllPermissions() {
    fetch(api_url + "", { method: "DELETE" })
      .then((response) => {
        if (response.status === 200)
          handleSnackbarVisibility(true, "info", response.json());
      })
      .catch((error) => {
        handleSnackbarVisibility(true, "error", error);
      });
  }

  return (
    <div className="App">
      <div align="center">
        <h4 style={{ display: "inline" }} align="center">
          Permissions taken on this day
        </h4>
        <div style={{ padding: "0px 10px", flex: "row", display: "inline" }}>
          <Tooltip title="Refresh data">
            <IconButton
              aria-label="refresh"
              // className={classes.margin}
              size="medium"
              onClick={() => fetchPermissions("refresh")}
            >
              <i class="fa-solid fa-arrows-rotate"></i>
            </IconButton>
          </Tooltip>
        </div>
      </div>

      <Button
        variant="outlined"
        color="default"
        // className={classes.button}
        startIcon={<GetAppRoundedIcon />}
        gutterBottom
        onClick={() => {
          if (data.length > 0) {
            if (
              window.confirm(
                "Generation of logs deletes all the permissions. \n Are you sure to continue?"
              )
            ) {
              // if already loaded some data..

              downloadLogs();
              // alert(new Date().toTimeString().toString())
              handleSnackbarVisibility(
                true,
                "info",
                "Logs generated successfully, please download."
              );
              deleteAllPermissions();
              fetchPermissions("refresh"); // to show the empty data..
            }
          } else {
            window.alert("No permissions issued since last log taken.");
          }
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
        localization={{
          pagination: {
            labelDisplayedRows: "{from}-{to} of {count}",
          },
          toolbar: {
            nRowsSelected: "{0} row(s) selected",
          },
          header: {
            actions: "Actions",
          },
          body: {
            emptyDataSourceMessage:
              "No records to display or please try filtering with proper keywords.",
            filterRow: {
              filterTooltip: "Filter",
            },
          },
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
