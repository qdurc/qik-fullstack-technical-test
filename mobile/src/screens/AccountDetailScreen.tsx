import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {useQuery} from '@apollo/client/react';
import {BALANCE_QUERY} from '../api/queries';
import type {BalanceSummary, Account} from '../types/models';
import {PrimaryButton} from '../ui/atoms/PrimaryButton';
import {getGraphQLErrorMessage} from '../api/error';

export const AccountDetailScreen: React.FC<{
  account: Account;
  onBack: () => void;
  onTransactions: () => void;
  onNewTransaction: () => void;
}> = ({account, onBack, onTransactions, onNewTransaction}) => {
  const {data, loading, error} = useQuery<{balanceSummary: BalanceSummary}>(
    BALANCE_QUERY,
    {variables: {accountId: account.id}, fetchPolicy: 'cache-and-network'},
  );

  const summary = data?.balanceSummary;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Cuenta</Text>
        <Text style={styles.subtitle}>{account.id}</Text>
        <Text style={styles.line}>Moneda: {account.currency ?? 'N/D'}</Text>
        {loading && <Text style={styles.subtle}>Cargando balance...</Text>}
        {error && (
          <Text style={styles.error}>{getGraphQLErrorMessage(error)}</Text>
        )}
        {summary && (
          <View style={styles.balanceBox}>
            <Text style={styles.balanceText}>Balance: {summary.balance}</Text>
            <Text style={styles.subtle}>Créditos: {summary.credits}</Text>
            <Text style={styles.subtle}>Débitos: {summary.debits}</Text>
          </View>
        )}
        <View style={styles.actions}>
          <PrimaryButton label="Ver movimientos" onPress={onTransactions} />
          <View style={styles.spacer} />
          <PrimaryButton label="Nueva transacción" onPress={onNewTransaction} />
          <View style={styles.spacer} />
          <PrimaryButton label="Volver" onPress={onBack} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E1116',
    padding: 16,
  },
  card: {
    backgroundColor: '#151A22',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1F2633',
  },
  title: {
    color: '#E9EEF5',
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: '#97A4B8',
    marginTop: 4,
  },
  line: {
    color: '#E9EEF5',
    marginTop: 10,
  },
  subtle: {
    color: '#97A4B8',
    marginTop: 6,
  },
  error: {
    color: '#FF7D7D',
    marginTop: 6,
  },
  balanceBox: {
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#0F141C',
    borderWidth: 1,
    borderColor: '#1F2633',
  },
  balanceText: {
    color: '#E9EEF5',
    fontSize: 18,
    fontWeight: '600',
  },
  actions: {
    marginTop: 20,
  },
  spacer: {
    height: 10,
  },
});
