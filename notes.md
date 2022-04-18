## Routes

- `authenticationRoute`:
  - **For login of all the 3 users.**
- `userRoute`:
  - **For getting the profile details**
  - All the 3 users (Student, Teacher, GateKeeper) can view their personal profile
  - GateKeeper with a extra permission of knowing the student details when scanned the QR code.
    - Basically, the QR code, will be generated in a way to query on this route.
- `permissionRoute`:
  - **This route is used for permissions.**
  - Teacher uses this route, to issue a permission to a student
  - Student uses this route, to know the permission status
  - GateKeeper uses this route to validate the permssion upon scanning the QR code.

## Models

- `User.model.js`
  - `id`:
    - To hold the unique id
      - For student: their rollno
      - for Teacher: facultyID
      - for GateKeeper: GateKeeperID
    - **This is used all over the application for unique identification of each user.**
  - `name`: - To display their name, when needed
    , `password`: as usual
  - `profilePicture`: Used only for student (because of storage limitations). Only for student, as used for verification by GateKeeper
    - But, this feature won't be implemented for now, kept for update version.
  - `role`:
    - This is intended for filtering purpose, which makes the search easier when contained many users.
    - Mostly comes to use for students, as they will be more in number.
- `permission.model.js`
  - `studentId`:
    - To hold the id (rollno) of student.
  - `reason`: (optional)
    - Entered by student.
    - Will be helpful for logging.
  - `passMode`:
    - `true`: denoting GatePass
    - `false`: denotes LunchPass
  - `permissionStatus`:
    - `true`: granted
    - `false`: denied
      - Used in view of future update. The teacher can later deny the permission too. Currently functions as normal.
      - Later teacher, can know by what reason they are given permission.
  - `facultyId`: (termed also as `grantedBy`)
    - Id of teacher who is issuing permission
  - `grantedAt`:
    - The time at which the permission was granted.

## Development flow

    - Create few dummy users
