export const updateUserStateMutation = /* GraphQL */ `
  mutation updateUserState($user_state: String!, $user_id: String!) {
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
`

export const getUserStateQuery = /* GraphQL */ `
  query GetUserState($user_id: String!) {
    users_by_pk(id: $user_id) {
      state
    }
  }
`

export const getUserTimesQuery = /* GraphQL */ `
  query GetUserTimes($user_id: String!) {
    attendance(
      where: { user_id: { _eq: $user_id } }
      order_by: { start_time: desc }
      limit: 1
    ) {
      id
      start_time
      end_time
    }
    rest(
      where: { user_id: { _eq: $user_id } }
      order_by: { start_rest: desc }
      limit: 1
    ) {
      id
      start_rest
      end_rest
    }
  }
`

export const get3DaysDataQuery = /* GraphQL */ `
  query Get3DaysData(
    $today: timestamptz!
    $two_days_ago: timestamptz!
    $user_id: String!
  ) {
    attendance(
      where: {
        start_time: { _gte: $two_days_ago, _lte: $today }
        user_id: { _eq: $user_id }
      }
    ) {
      start_time
      end_time
    }
    rest(
      where: {
        start_rest: { _gte: $two_days_ago, _lte: $today }
        user_id: { _eq: $user_id }
      }
    ) {
      start_rest
      end_rest
    }
  }
`

export const getCurrentMonthAttendanceQuery = /* GraphQL */ `
  query getCurrentMonthAttendance($start: timestamptz!, $end: timestamptz!) {
    attendance(where: { start_time: { _gte: $start, _lt: $end } }) {
      start_time
      end_time
    }
    rest(where: { start_rest: { _gte: $start, _lt: $end } }) {
      start_rest
      end_rest
    }
  }
`
