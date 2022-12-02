export const getUserByIdQuery = /* GraphQL */ `
  query GetUserById($id: String!) {
    users_by_pk(id: $id) {
      created_at
      id
      name
      __typename
      is_host
    }
  }
`;
