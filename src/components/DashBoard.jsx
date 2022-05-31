import React, { useState } from "react";

import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

import FetchPermissions from "./FetchPermissions";
import FetchUsers from "./FetchUsers";

function DashBoard() {
  const [viewUsers, setViewUsers] = useState(true);
  
  function handleChange(event, value) {
    if (value === "permissions") setViewUsers(() => false);
    if (value === "users") setViewUsers(() => true);
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
              <ToggleButton value="users">Users</ToggleButton>
              <ToggleButton value="permissions">Permissions</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
      </div>
      {viewUsers ? <FetchUsers /> : <FetchPermissions />}
    </div>
  );
}

export default DashBoard;

/**
 *
 *
 */
