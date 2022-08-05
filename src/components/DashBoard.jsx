import React, { useState } from "react";

import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

import FetchPermissions from "./FetchPermissions";
import FetchTeachers from "./FetchTeachers";
import FetchStudents from "./FetchStudents";

function DashBoard() {
  const [viewUsers, setViewUsers] = useState(true);
  const [viewStudents, setViewStudents] = useState(true);

  function handleChange(event, value) {
    if (value == "teachers" || value === "students") setViewUsers(true);
    else setViewUsers(false);

    if (viewUsers)
      if (value == "teachers") setViewStudents(() => false);
      // update the state..
      else setViewStudents(() => true); /// if (value == "students")
  }

  return (
    <div>
      <div>
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Typography>Show </Typography>
          </Grid>
          <Grid item>
            <ToggleButtonGroup
              color="primary"
              // value={alignment}
              exclusive
              onChange={handleChange}
            >
              <ToggleButton value="teachers">Teachers</ToggleButton>
              <ToggleButton value="students">Students</ToggleButton>
              <ToggleButton value="permissions">Permissions</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
      </div>
      {viewUsers ? (
        viewStudents ? (
          <FetchStudents />
        ) : (
          <FetchTeachers />
        )
      ) : (
        <FetchPermissions />
      )}
    </div>
  );
}

export default DashBoard;
// (viewInfo == "teachers" ? <FetchTeachers /> : <FetchStudents/>)
/**
 *
 *
 */
