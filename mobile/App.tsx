import React, { useMemo, useState } from 'react';
import { ApolloProvider } from '@apollo/client/react';
import { createApolloClient } from './src/api/apolloClient';
import { AuthProvider, useAuth } from './src/hooks/useAuth';
import { LoginScreen } from './src/screens/LoginScreen';
import { AccountsScreen } from './src/screens/AccountsScreen';
import { AccountDetailScreen } from './src/screens/AccountDetailScreen';
import { TransactionsScreen } from './src/screens/TransactionsScreen';
import { NewTransactionScreen } from './src/screens/NewTransactionScreen';
import type { Account } from './src/types/models';

type ScreenState =
  | { name: 'accounts' }
  | { name: 'accountDetail'; account: Account }
  | { name: 'transactions'; account: Account }
  | { name: 'newTransaction'; account: Account };

const AppContent = () => {
  const { token } = useAuth();
  const client = useMemo(() => createApolloClient(token), [token]);
  const [screen, setScreen] = useState<ScreenState>({ name: 'accounts' });

  if (!token) {
    return (
      <ApolloProvider client={client}>
        <LoginScreen />
      </ApolloProvider>
    );
  }

  return (
    <ApolloProvider client={client}>
      {screen.name === 'accounts' && (
        <AccountsScreen
          onSelect={(account) => setScreen({ name: 'accountDetail', account })}
        />
      )}
      {screen.name === 'accountDetail' && (
        <AccountDetailScreen
          account={screen.account}
          onBack={() => setScreen({ name: 'accounts' })}
          onTransactions={() => setScreen({ name: 'transactions', account: screen.account })}
          onNewTransaction={() => setScreen({ name: 'newTransaction', account: screen.account })}
        />
      )}
      {screen.name === 'transactions' && (
        <TransactionsScreen
          accountId={screen.account.id}
          onBack={() => setScreen({ name: 'accountDetail', account: screen.account })}
        />
      )}
      {screen.name === 'newTransaction' && (
        <NewTransactionScreen
          accountId={screen.account.id}
          onBack={() => setScreen({ name: 'accountDetail', account: screen.account })}
        />
      )}
    </ApolloProvider>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
