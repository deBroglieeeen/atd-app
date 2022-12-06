export const addClockinMutation = /* GraphQL */ `
  mutation addClockinMutation($startTime: timestamptz!) {
    insert_attendance_one(object: { start_time: $startTime }) {
      id
    }
  }
`;

export const addClockoutMutation = /* GraphQL */ `
  mutation addClockoutMutation($endTime: timestamptz!) {
    insert_attendance_one(object: { end_time: $endTime }) {
      id
    }
  }
`;
