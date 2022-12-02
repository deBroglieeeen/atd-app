export const addClockinMutation = /* GraphQL */ `
  mutation addClockin($startTime: timestamptz!) {
    insert_attendance_one(object: { start_time: $startTime }) {
      id
      __typename
      user_id
    }
  }
`;
