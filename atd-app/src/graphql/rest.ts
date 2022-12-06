export const addRestinMutation = /* GraphQL */ `
  mutation addRestinMutation($startRest: timestamptz!) {
    insert_rest_one(object: { start_rest: $startRest }) {
      id
    }
  }
`;

export const addRestoutMutation = /* GraphQL */ `
  mutation addRestoutMutation($endRest: timestamptz!) {
    insert_rest_one(object: { end_rest: $endRest }) {
      id
    }
  }
`;
