export const addRestinMutation = /* GraphQL */ `
  mutation addRestinMutation($startRest: timestamptz!) {
    insert_rest_one(object: { start_rest: $startRest }) {
      id
    }
  }
`;

export const updateRestoutMutation = /* GraphQL */ `
  mutation updateRestoutMutation($restId: uuid!, $endRest: timestamptz!) {
    update_rest(where: { id: { _eq: $restId } }, _set: { end_rest: $endRest }) {
      affected_rows
      returning {
        user_id
        end_rest
        start_rest
      }
    }
  }
`;
