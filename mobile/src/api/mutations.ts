import {gql} from '@apollo/client/core';

export const CREATE_ACCOUNT_MUTATION = gql`
  mutation CreateAccount($input: CreateAccountInput!) {
    createAccount(input: $input) {
      id
      userId
      currency
      createdAt
    }
  }
`;

export const POST_CREDIT_MUTATION = gql`
  mutation PostCredit($input: PostCreditInput!) {
    postCredit(input: $input) {
      id
      accountId
      type
      amount
      description
      createdAt
    }
  }
`;

export const POST_DEBIT_MUTATION = gql`
  mutation PostDebit($input: PostDebitInput!) {
    postDebit(input: $input) {
      id
      accountId
      type
      amount
      description
      createdAt
    }
  }
`;
