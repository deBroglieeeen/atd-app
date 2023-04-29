export const addClockinMutation = /* GraphQL */ `
  mutation addClockin($startTime: timestamptz!) {
    insert_attendance_one(object: { start_time: $startTime }) {
      id
    }
  }
`

export const updateClockoutMutation = /* GraphQL */ `
  mutation updateClockout($attendanceId: uuid!, $endTime: timestamptz!) {
    update_attendance(
      where: { id: { _eq: $attendanceId } }
      _set: { end_time: $endTime }
    ) {
      affected_rows
      returning {
        user_id
        end_time
        start_time
      }
    }
  }
`

export const getAttendanceQuery = /* GraphQL */ `
  query getAttendance($start: timestamptz!, $end: timestamptz!) {
    attendance(where: { start_time: { _gte: $start, _lte: $end } }) {
      start_time
      end_time
      user {
        id
        name
      }
    }
    rest(where: { start_rest: { _gte: $start, _lte: $end } }) {
      start_rest
      end_rest
      user {
        id
        name
      }
    }
  }
`

export const getAttendanceByDateQuery = /* GraphQL */ `
  query getAttendanceByDate($start: timestamptz!, $end: timestamptz!) {
    attendance(where: { start_time: { _gte: $start, _lt: $end } }) {
      id
      start_time
      end_time
    }
    rest(where: { start_rest: { _gte: $start, _lt: $end } }) {
      id
      start_rest
      end_rest
    }
  }
`
