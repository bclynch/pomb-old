import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

import { fragments as AccountFragments } from '../fragments/account.fragment';

export const registerUserAccountMutation: DocumentNode = gql`
  mutation registerUserAccount($username: String!, $firstName: String!, $lastName: String!, $password: String!, $email: String!) {
    registerUserAccount(input:{
      username: $username
      firstName: $firstName,
      lastName: $lastName,
      password: $password,
      email: $email,
    })
    {
      account {
        ...AccountByAuthor
      }
    }
  }

  ${AccountFragments['accountByAuthor']}
`;

export const authUserAccountMutation: DocumentNode = gql`
  mutation authUserAccount($email: String!, $password: String!) {
    authenticateUserAccount(input:{
      email: $email,
      password: $password
    }) {
      jwtToken
    }
  }
`;

export const registerAdminAccountMutation: DocumentNode = gql`
  mutation registerAdminAccount($username: String!, $firstName: String!, $lastName: String!, $password: String!, $email: String!) {
    registerAdminAccount(input:{
      username: $username
      firstName: $firstName,
      lastName: $lastName,
      password: $password,
      email: $email,
    })
    {
      account {
        ...AccountByAuthor
      }
    }
  }

  ${AccountFragments['accountByAuthor']}
`;

export const authAdminAccountMutation: DocumentNode = gql`
  mutation authAdminAccount($email: String!, $password: String!) {
    authenticateAdminAccount(input:{
      email: $email,
      password: $password
    }) {
      jwtToken
    }
  }
`;

export const updateAccountByIdMutation: DocumentNode = gql`
  mutation updateAccountById($id: Int!, $firstName: String!, $lastName: String!, $userStatus: String, $heroPhoto: String, $profilePhoto: String, $city: String, $country: String, $autoUpdate: Boolean!) {
    updateAccountById(input:{
      id: $id,
      accountPatch:{
        firstName: $firstName,
        lastName: $lastName,
        userStatus: $userStatus,
        profilePhoto: $profilePhoto,
        heroPhoto: $heroPhoto,
        city: $city,
        country: $country,
        autoUpdateLocation: $autoUpdate
      }
    }) {
      account {
        ...AccountByAuthor
        userStatus,
        heroPhoto,
        profilePhoto,
        city,
        country,
        autoUpdateLocation
      }
    }
  }

  ${AccountFragments['accountByAuthor']}
`;

export const createEmailListEntryMutation: DocumentNode = gql`
  mutation($email: String!) {
    createEmailList(input:{
      emailList: {
        email: $email
      }
    }) {
      clientMutationId
    }
  }
`;

export const resetPasswordMutation: DocumentNode = gql`
  mutation($email: String!) {
    resetPassword(input: {
      email: $email
    }) {
      string
    }
  }
`;

export const updatePasswordMutation: DocumentNode = gql`
  mutation($userId: Int!, $password: String!, $newPassword: String!) {
    updatePassword(
      input: {
        userId: $userId,
        password: $password,
        newPassword: $newPassword
      }
    ) {
      boolean
    }
  }
`;

export const deleteAccountByIdMutation: DocumentNode = gql`
  mutation($userId: Int!) {
    deleteAccountById(input: {
      id: $userId
    }) {
      clientMutationId
    }
  }
`;

export const createUserToCountryMutation: DocumentNode = gql`
  mutation($code: String!, $userId: Int!) {
    createUserToCountry(input: {
      userToCountry: {
        country: $code,
        userId: $userId
      }
    }) {
      clientMutationId
    }
  }
`;
