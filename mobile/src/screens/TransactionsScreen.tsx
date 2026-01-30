import React, {useEffect, useMemo, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {useQuery} from '@apollo/client/react';
import {TRANSACTIONS_QUERY} from '../api/queries';
import type {LedgerEntry, TransactionsPage} from '../types/models';
import {PrimaryButton} from '../components/PrimaryButton';
import {LabeledInput} from '../components/LabeledInput';
import {getGraphQLErrorMessage} from '../api/error';

export const TransactionsScreen: React.FC<{
  accountId: string;
  onBack: () => void;
}> = ({accountId, onBack}) => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [type, setType] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [items, setItems] = useState<LedgerEntry[]>([]);

  const filters = useMemo(() => {
    const createdFrom = from ? new Date(from) : undefined;
    const createdTo = to ? new Date(to) : undefined;
    return {
      type: type ? type.toUpperCase() : undefined,
      createdFrom:
        createdFrom && !isNaN(createdFrom.getTime()) ? createdFrom : undefined,
      createdTo:
        createdTo && !isNaN(createdTo.getTime()) ? createdTo : undefined,
    };
  }, [from, to, type]);

  const {data, loading, refetch, error} = useQuery<{
    transactions: TransactionsPage;
  }>(TRANSACTIONS_QUERY, {
    variables: {
      accountId,
      filters,
      pagination: {page, limit},
    },
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    const pageItems = data?.transactions?.items ?? [];
    if (page === 1) {
      setItems(pageItems);
    } else if (pageItems.length) {
      setItems(prev => [...prev, ...pageItems]);
    }
  }, [data, page]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Movimientos</Text>
      <View style={styles.filters}>
        <LabeledInput
          label="Type (credit/debit)"
          value={type}
          onChangeText={setType}
        />
        <LabeledInput
          label="Fecha desde (YYYY-MM-DD)"
          value={from}
          onChangeText={setFrom}
        />
        <LabeledInput
          label="Fecha hasta (YYYY-MM-DD)"
          value={to}
          onChangeText={setTo}
        />
        <PrimaryButton
          label="Aplicar filtros"
          onPress={() => {
            setPage(1);
            refetch();
          }}
        />
      </View>
      {loading && <Text style={styles.subtle}>Cargando...</Text>}
      {error && (
        <Text style={styles.error}>{getGraphQLErrorMessage(error)}</Text>
      )}
      {!loading && !error && items.length === 0 && (
        <Text style={styles.subtle}>
          No hay movimientos para estos filtros.
        </Text>
      )}
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.type}</Text>
            <Text style={styles.cardSubtitle}>{item.amount}</Text>
            {item.description ? (
              <Text style={styles.subtle}>{item.description}</Text>
            ) : null}
          </View>
        )}
        contentContainerStyle={styles.list}
      />
      <View style={styles.footer}>
        <PrimaryButton label="Load more" onPress={() => setPage(p => p + 1)} />
        <View style={styles.spacer} />
        <PrimaryButton label="Volver" onPress={onBack} />
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
  title: {
    color: '#E9EEF5',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  filters: {
    backgroundColor: '#151A22',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1F2633',
    marginBottom: 12,
  },
  list: {
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#151A22',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1F2633',
  },
  cardTitle: {
    color: '#E9EEF5',
    fontSize: 16,
    fontWeight: '600',
  },
  cardSubtitle: {
    color: '#97A4B8',
    marginTop: 4,
  },
  subtle: {
    color: '#97A4B8',
    marginTop: 4,
  },
  error: {
    color: '#FF7D7D',
    marginTop: 6,
  },
  footer: {
    paddingVertical: 12,
  },
  spacer: {
    height: 8,
  },
});
