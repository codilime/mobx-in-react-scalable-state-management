import { gql } from '@apollo/client';

export const GetAllUsers = gql`
  query GetAllUsers {
    allUsers {
      id
      firstName
      lastName
      email
    }
  }
`;
export const CreateUser = gql`
  mutation CreateUser($firstName: String!, $lastName: String!, $email: String!) {
    createUser(firstName: $firstName, lastName: $lastName, email: $email) {
      id
      firstName
      lastName
      email
    }
  }
`;
