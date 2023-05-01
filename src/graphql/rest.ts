export const addRestinMutation = /* GraphQL */ `
  mutation addRestin($startRest: timestamptz!) {
    insert_rest_one(object: { start_rest: $startRest }) {
      id
    }
  }
`

export const updateRestoutMutation = /* GraphQL */ `
  mutation updateRestout($restId: uuid!, $endRest: timestamptz!) {
    update_rest(where: { id: { _eq: $restId } }, _set: { end_rest: $endRest }) {
      affected_rows
      returning {
        user_id
        end_rest
        start_rest
      }
    }
  }
`

export const updateRestMutation = /* GraphQL */ `
  mutation updateRest(
    $id: uuid!
    $startRest: timestamptz!
    $endRest: timestamptz!
  ) {
    update_rest(
      where: { id: { _eq: $id } }
      _set: { start_rest: $startRest, end_rest: $endRest }
    ) {
      affected_rows
      returning {
        id
        end_rest
        start_rest
      }
    }
  }
`
