import React, {useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {useQuery} from '@apollo/client/react';
import {ACCOUNTS_QUERY} from '../api/queries';
import type {AccountsPage, Account} from '../types/models';
import {PrimaryButton} from '../components/PrimaryButton';
import {getGraphQLErrorMessage} from '../api/error';

export const AccountsScreen: React.FC<{
  onSelect: (account: Account) => void;
}> = ({onSelect}) => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const {data, loading, refetch, error} = useQuery<{accounts: AccountsPage}>(
    ACCOUNTS_QUERY,
    {
      variables: {pagination: {page, limit}},
      fetchPolicy: 'cache-and-network',
    },
  );

  const accounts = data?.accounts?.items ?? [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cuentas</Text>
        <PrimaryButton label="Refresh" onPress={() => refetch()} />
      </View>
      {loading && <Text style={styles.subtle}>Cargando...</Text>}
      {error && (
        <Text style={styles.error}>{getGraphQLErrorMessage(error)}</Text>
      )}
      {!loading && !error && accounts.length === 0 && (
        <Text style={styles.subtle}>No hay cuentas para este usuario.</Text>
      )}
      <FlatList
        data={accounts}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({item}) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.currency ?? 'N/A'}</Text>
            <Text style={styles.cardSubtitle}>{item.id}</Text>
            <View style={styles.row}>
              <PrimaryButton label="Ver" onPress={() => onSelect(item)} />
            </View>
          </View>
        )}
      />
      <View style={styles.footer}>
        <PrimaryButton label="Load more" onPress={() => setPage(p => p + 1)} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    color: '#E9EEF5',
    fontSize: 24,
    fontWeight: '700',
  },
  subtle: {
    color: '#97A4B8',
  },
  error: {
    color: '#FF7D7D',
    marginBottom: 8,
  },
  list: {
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#151A22',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1F2633',
  },
  cardTitle: {
    color: '#E9EEF5',
    fontSize: 18,
    fontWeight: '600',
  },
  cardSubtitle: {
    color: '#97A4B8',
    marginTop: 4,
  },
  row: {
    marginTop: 12,
  },
  footer: {
    paddingVertical: 12,
  },
});
