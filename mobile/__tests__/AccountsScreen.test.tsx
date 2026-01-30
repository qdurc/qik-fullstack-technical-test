import React from 'react';
import {render, waitFor} from '@testing-library/react-native';
import {MockedProvider} from '@apollo/client/testing/react';
import {ACCOUNTS_QUERY} from '../src/api/queries';
import {AccountsScreen} from '../src/screens/AccountsScreen';

const makeMocks = (result: any, error?: Error) => [
  {
    request: {
      query: ACCOUNTS_QUERY,
      variables: {pagination: {page: 1, limit: 10}},
    },
    result,
    error,
  },
];

describe('AccountsScreen', () => {
  it('renders loading state', () => {
    const {getByText} = render(
      <MockedProvider
        mocks={makeMocks({
          data: {accounts: {items: [], total: 0, page: 1, limit: 10}},
        })}>
        <AccountsScreen onSelect={jest.fn()} />
      </MockedProvider>,
    );

    expect(getByText('Cargando...')).toBeTruthy();
  });

  it('renders accounts list', async () => {
    const {getByText} = render(
      <MockedProvider
        mocks={makeMocks({
          data: {
            accounts: {
              total: 1,
              page: 1,
              limit: 10,
              items: [
                {
                  id: 'acc-1',
                  userId: 'user-1',
                  currency: 'USD',
                  createdAt: '2024-01-01',
                },
              ],
            },
          },
        })}>
        <AccountsScreen onSelect={jest.fn()} />
      </MockedProvider>,
    );

    await waitFor(() => expect(getByText('USD')).toBeTruthy());
  });

  it('renders error message', async () => {
    const {getByText} = render(
      <MockedProvider mocks={makeMocks(undefined, new Error('Network error'))}>
        <AccountsScreen onSelect={jest.fn()} />
      </MockedProvider>,
    );

    await waitFor(() => expect(getByText('Network error')).toBeTruthy());
  });
});
