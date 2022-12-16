export const addClockinMutation = /* GraphQL */ `
  mutation addClockin($startTime: timestamptz!) {
    insert_attendance_one(object: { start_time: $startTime }) {
      id
    }
  }
`;

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
`;
