export const addClockinMutation = /* GraphQL */ `
  mutation addClockinMutation($startTime: timestamptz!) {
    insert_attendance_one(object: { start_time: $startTime }) {
      id
    }
  }
`;
