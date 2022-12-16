export const updateUserStateMutation = /* GraphQL */ `
  mutation updateUserStateMutation($user_state: String!, $user_id: String!) {
    update_users(
      _set: { state: $user_state }
      where: { id: { _eq: $user_id } }
    ) {
      returning {
        name
        id
        created_at
      }
    }
  }
`;

export const getUserStateQuery = /* GraphQL */ `
  query GetUserStateQuery($user_id: String!) {
    users_by_pk(id: $user_id) {
      state
    }
  }
`;

export const getUserTimesQuery = /* GraphQL */ `
  query GetUserTimes($user_id: String!) {
    attendance(
      where: { user_id: { _eq: $user_id } }
      order_by: { start_time: desc }
      limit: 1
    ) {
      start_time
      end_time
    }
    rest(
      where: { user_id: { _eq: $user_id } }
      order_by: { start_rest: desc }
      limit: 1
    ) {
      start_rest
      end_rest
    }
  }
`;