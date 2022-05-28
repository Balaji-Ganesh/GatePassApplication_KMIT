import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import axios from "axios";

import ShowResponse from "./ShowResponse";
// import Snackbar from "@material-ui/core/Snackbar";
const timeDelay = 1000;

function FetchUsers() {
  // const api_url = "http://localhost:4000/api/users/"; // as per old API
  const api_url = "https://securitygaurd.herokuapp.com/api/Details/"; // as per common API of Shiva and Ganesh
  // const api_url = "https://gatepassapplication.herokuapp.com/api/users/"; /// for deployment..
  //   const api_url = "https://gatepassapplication.herokuapp.com/api/users/";
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

  useEffect(() => {
    // axios
    //   // .get("https://jsonplaceholder.typicode.com/users")
    //   .get(api_url)
    //   .then((response) => console.log(JSON.parse(response.data)))
    //   // .then((response) => console.log(JSON.parse(response)))
    //   .catch((error) => console.log(error));
    fetch(api_url)
      .then((response) => response.json()) //cvt to JSON
      // // .then((response) => console.log(response))
      .then((response) => {
        console.log(response);
        setData(response);
        handleSnackbarVisibility(true, "info", "Data fetched successfully");
      })
      .catch((error) => {
        // console.log("Unable to fetch data" + error);
        handleSnackbarVisibility(
          true,
          "error",
          "Unable to fetch data due to "+error
        );
      });
  }, []);

  const columns = [
    // { title: "Unique ID", field: "_id" },
    {
      title: "Name",
      field: "Name",
      validate: (rowData) => {
        if (rowData.Name === undefined || rowData.Name === "")
          return "Required";
        else if (rowData.Name.length < 3)
          return "Name should be atleast 3 characters";
        // for success cases..
        return true;
      },
    },
    {
      title: "Role",
      field: "role",
      // lookup: {
      //   // In next update, encode these(keys) into numerics, so can save space and bandwidth.
      //   Student: "Student",
      //   Teacher: "Teacher",
      //   GateKeeper: "GateKeeper",
      // },
      validate: (rowData) => {
        if (rowData.role === undefined || rowData.role == "")
          return "Assign a role";
        else if (
          // not required as changed to lookups (dropdown)
          rowData.role == "Student" ||
          rowData.role == "Teacher" ||
          rowData.role == "GateKeeper"
        )
          return true;
        return "Should either be 'Student', 'Teacher' or 'GateKeeper' (Case-Sensitive)";
      },
    },
    // profile picture, in next version...
  ];

  return (
    <div className="App">
      <h4 align="center">List of users registered in the dashboard</h4>
      <MaterialTable
        title="Users"
        data={data}
        columns={columns}
        editable={{
          onRowAdd: (newlyAddedRow) =>
            new Promise((resolve, reject) => {
              // console.log(newlyAddedRow);
              const newData = [...data, newlyAddedRow];
              setTimeout(() => {
                axios
                  .post(api_url, newlyAddedRow)
                  .then((response) => {
                    if (response.status === 200) {
                      // console.log(response.data);
                      setData(newData);
                      handleSnackbarVisibility(
                        true,
                        "success",
                        `New user creation "${newlyAddedRow.Name}" done successfully..!`
                      );
                    }
                  })
                  .catch((error) => {
                    // console.log("New user not created.");
                    // console.log(error);
                    handleSnackbarVisibility(
                      true,
                      "error",
                      `New user creation "${newlyAddedRow.Name}" failed due to ` +
                        error
                    );
                  });
                resolve();
              }, timeDelay); // timeout: As to not prolong than 2seconds.. whatever happens, should happen in this 2sec.
              handleSnackbarVisibility(false);
            }),
          onRowDelete: (selectedRowToDelete) =>
            new Promise((resolve, reject) => {
              // // console.log(selectedRowToDelete._id); // get the mongoID to delte
              const idxToDelete = selectedRowToDelete.tableData.id;
              const rowsAfterDelete = [...data];
              rowsAfterDelete.splice(idxToDelete, 1);
              setTimeout(() => {
                axios
                  .delete(api_url + selectedRowToDelete._id)
                  .then((response) => {
                    if (response.status === 200) {
                      // When success..
                      setData(rowsAfterDelete); // Update in UI too..
                      handleSnackbarVisibility(
                        true,
                        "success",
                        `User "${selectedRowToDelete.Name}" deleted successfully..!`
                      );
                    }
                  })
                  .catch((error) => {
                    // console.log("User deletion failed");
                    // console.log(error);
                    handleSnackbarVisibility(
                      true,
                      "error",
                      `User "${selectedRowToDelete.Name}" Deletion failed due to: ` +
                        error
                    );
                  });

                resolve();
              }, timeDelay); // timeout: As to not prolong than 2seconds.. whatever happens, should happen in this 2sec.
              handleSnackbarVisibility(false);
            }),
          onRowUpdate: (rowUpdatedValues, rowOldValues) =>
            new Promise((resolve, reject) => {
              // console.log(rowUpdatedValues);
              const idxUpdatedRow = rowOldValues.tableData.id;
              const rowsAfterUpdate = [...data];
              rowsAfterUpdate[idxUpdatedRow] = rowUpdatedValues; // Update them..
              setTimeout(() => {
                axios
                  .put(api_url + rowUpdatedValues._id, rowUpdatedValues)
                  .then((response) => {
                    if (response.status === 200) {
                      // When "OK"
                      setData(rowsAfterUpdate); // Update locally too..
                      handleSnackbarVisibility(
                        true,
                        "success",
                        "User  updated successfully"
                      );
                    }
                  })
                  .catch((error) => {
                    // console.log("User updation failed");
                    // console.log(error);

                    handleSnackbarVisibility(
                      true,
                      "error",
                      "Row updation failed due to:" + error
                    );
                  });
                resolve();
              }, timeDelay); // timeout: As to not prolong than 2seconds.. whatever happens, should happen in this 2sec.
              handleSnackbarVisibility(false);
            }),
        }}
        options={{
          filtering: true, // Provides MS-Excel like filtering
          exportButton: true, // provides the facility to download as CSV and PDF
          actionsColumnIndex: -1, // Display the actions at right side
          addRowPosition: "first", // Show the option of adding a new row at the start of the table
          // selection: true,
        }}
        // actions={[
        //   {
        //     tooltip: "Remove All Selected Users",
        //     icon: "delete",
        //     onClick: (evt, data) =>
        //       alert("You want to delete " + data.length + " rows"),
        //   },
        // ]}
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
              "No records to display or please try filtering with proper keyowords.",
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

export default FetchUsers;
