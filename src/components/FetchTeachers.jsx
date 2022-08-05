import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import axios from "axios";

import ShowResponse from "./ShowResponse";

import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

// import Snackbar from "@material-ui/core/Snackbar";
const timeDelay = 1000;

function FetchTeachers() {
  // const api_url = "http://localhost:4000/api/teachers/"; // as per old API
  const api_url = "http://rakshakapi.herokuapp.com/api/teachers/"; // as per old API
  // const api_url = "https://securitygaurd.herokuapp.com/api/Details/"; // as per common API of Shiva and Ganesh
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

  function FetchTeachers(code) {
    fetch(api_url)
      .then((response) => response.json()) //cvt to JSON
      // // .then((response) => // console.log((response))
      .then((response) => {
        // console.log((response);
        response.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt); // sorting DSEC
        });

        setData(response);
        if (code === "fresh")
          handleSnackbarVisibility(true, "info", "Data fetched successfully");
        else if (code === "refresh")
          handleSnackbarVisibility(true, "info", "Data refreshed successfully");
      })
      .catch((error) => {
        // // console.log(("Unable to fetch data" + error);
        handleSnackbarVisibility(
          true,
          "error",
          "Unable to fetch data due to " + error
        );
      });
  }

  useEffect(() => {
    FetchTeachers("fresh");
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
      title: "e-mail",
      field: "Email",
      validate: (rowData) => {
        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (rowData.role === undefined || rowData.role == "")
          return "Assign a role";
        else if (emailRegex.test(rowData.Email)) return true;
        return "Invalid e-mail";
      },
    },
    // profile picture, in next version...
  ];

  return (
    <div className="App">
      <div align="center">
        <h4 style={{ display: "inline" }} align="center">
          List of users registered in the dashboard
        </h4>
        <div style={{ padding: "0px 10px", flex: "row", display: "inline" }}>
          <Tooltip title="Refresh data">
            <IconButton
              aria-label="refresh"
              // className={classes.margin}
              size="medium"
              onClick={() => FetchTeachers("refresh")}
            >
              <i class="fa-solid fa-arrows-rotate"></i>
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <MaterialTable
        title="Teachers"
        data={data}
        columns={columns}
        editable={{
          onRowAdd: (newlyAddedRow) =>
            new Promise((resolve, reject) => {
              // // console.log((newlyAddedRow);
              const newData = [...data, newlyAddedRow];
              setTimeout(() => {
                axios
                  .post(api_url, newlyAddedRow)
                  .then((response) => {
                    if (response.status === 200) {
                      // // console.log((response.data);
                      setData(newData);
                      handleSnackbarVisibility(
                        true,
                        "success",
                        `New user creation "${newlyAddedRow.Name}" done successfully..!`
                      );
                      FetchTeachers("refresh");
                    }
                  })
                  .catch((error) => {
                    // // console.log(("New user not created.");
                    // // console.log((error);
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
              // // // console.log((selectedRowToDelete._id); // get the mongoID to delte
              const idxToDelete = selectedRowToDelete.tableData.id;
              const rowsAfterDelete = [...data];
              rowsAfterDelete.splice(idxToDelete, 1);
              setTimeout(() => {
                axios
                  .delete(api_url + selectedRowToDelete.id)
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
                    // // console.log(("User deletion failed");
                    // // console.log((error);
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
              // // console.log((rowUpdatedValues);
              const idxUpdatedRow = rowOldValues.tableData.id;
              const rowsAfterUpdate = [...data];
              rowsAfterUpdate[idxUpdatedRow] = rowUpdatedValues; // Update them..
              setTimeout(() => {
                axios
                  .put(api_url + rowUpdatedValues.id, rowUpdatedValues)
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
                    // // console.log(("User updation failed");
                    // // console.log((error);

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

export default FetchTeachers;
