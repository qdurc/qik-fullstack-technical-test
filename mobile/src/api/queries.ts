import {gql} from '@apollo/client/core';

export const HEALTH_QUERY = gql`
  query Health {
    health
  }
`;

export const ACCOUNTS_QUERY = gql`
  query Accounts($pagination: PageInput) {
    accounts(pagination: $pagination) {
      total
      page
      limit
      items {
        id
        userId
        currency
        createdAt
      }
    }
  }
`;

export const ACCOUNT_QUERY = gql`
  query Account($id: String!) {
    account(id: $id) {
      id
      userId
      currency
      createdAt
    }
  }
`;

export const BALANCE_QUERY = gql`
  query BalanceSummary($accountId: String!) {
    balanceSummary(accountId: $accountId) {
      accountId
      credits
      debits
      balance
    }
  }
`;

export const TRANSACTIONS_QUERY = gql`
  query Transactions(
    $accountId: String!
    $filters: LedgerFiltersInput
    $pagination: PageInput
  ) {
    transactions(
      accountId: $accountId
      filters: $filters
      pagination: $pagination
    ) {
      total
      page
      limit
      items {
        id
        accountId
        type
        amount
        description
        createdAt
      }
    }
  }
`;
