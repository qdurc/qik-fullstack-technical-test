import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useMutation, useQuery} from '@apollo/client/react';
import {ACCOUNTS_QUERY, BALANCE_QUERY} from '../api/queries';
import type {AccountsPage, Account} from '../types/models';
import {PrimaryButton} from '../ui/atoms/PrimaryButton';
import {getGraphQLErrorMessage} from '../api/error';
import {CREATE_ACCOUNT_MUTATION} from '../api/mutations';
import {LabeledInput} from '../ui/atoms/LabeledInput';
import {useAuth} from '../hooks/useAuth';

export const AccountsScreen: React.FC<{
  onSelect: (account: Account) => void;
}> = ({onSelect}) => {
  const {userId, clearAuth} = useAuth();
  const [page, setPage] = useState(1);
  const limit = 10;
  const [currency, setCurrency] = useState('USD');
  const [createAccount, createState] = useMutation(CREATE_ACCOUNT_MUTATION);
  const [createError, setCreateError] = useState('');
  const [items, setItems] = useState<Account[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const {data, loading, refetch, error} = useQuery<{accounts: AccountsPage}>(
    ACCOUNTS_QUERY,
    {
      variables: {pagination: {page, limit}},
      fetchPolicy: 'cache-and-network',
    },
  );

  const accounts = data?.accounts?.items ?? [];
  const total = data?.accounts?.total ?? 0;

  useEffect(() => {
    if (page === 1) {
      const same =
        items.length === accounts.length &&
        items.every((item, index) => item.id === accounts[index]?.id);
      if (!same) {
        setItems(accounts);
      }
      return;
    }
    if (accounts.length) {
      const newOnes = accounts.filter(
        acc => !items.some(existing => existing.id === acc.id),
      );
      if (newOnes.length) {
        setItems(prev => [...prev, ...newOnes]);
      }
    }
  }, [accounts, page, items]);

  const AccountCard: React.FC<{account: Account; onSelect: (a: Account) => void}> = ({
    account,
    onSelect,
  }) => {
    const {data, loading} = useQuery(BALANCE_QUERY, {
      variables: {accountId: account.id},
      fetchPolicy: 'cache-and-network',
    });
    const balance = data?.balanceSummary?.balance;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{account.currency ?? 'N/D'}</Text>
          <Text style={styles.cardBalance}>
            {loading ? '...' : balance ?? '0.00'}
          </Text>
        </View>
        <Text style={styles.cardSubtitle}>{account.id}</Text>
        <View style={styles.row}>
          <PrimaryButton label="Ver" onPress={() => onSelect(account)} />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cuentas</Text>
        <PrimaryButton label="Salir" onPress={clearAuth} />
      </View>
      <Text style={styles.subtle}>UserId: {userId || '—'}</Text>
      <View style={styles.actionsRow}>
        <PrimaryButton
          label="Nueva cuenta bancaria"
          onPress={() => {
            setCreateError('');
            setCreateModalOpen(true);
          }}
        />
      </View>
      {loading && <Text style={styles.subtle}>Cargando...</Text>}
      {error && (
        <Text style={styles.error}>{getGraphQLErrorMessage(error)}</Text>
      )}
      {!loading && !error && items.length === 0 && (
        <Text style={styles.subtle}>No hay cuentas para este usuario.</Text>
      )}
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({item}) => (
          <AccountCard account={item} onSelect={onSelect} />
        )}
      />
      <View style={styles.footer} />
      <Modal
        animationType="slide"
        transparent
        visible={createModalOpen}
        onRequestClose={() => setCreateModalOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Nueva cuenta bancaria</Text>
            <LabeledInput
              label="Moneda (USD/DOP/CAD)"
              value={currency}
              onChangeText={setCurrency}
              placeholder="USD"
            />
            {createError ? (
              <Text style={styles.error}>{createError}</Text>
            ) : null}
            <View style={styles.modalActions}>
              <PrimaryButton
                label="Cancelar"
                onPress={() => setCreateModalOpen(false)}
              />
              <PrimaryButton
                label={createState.loading ? 'Creando...' : 'Crear'}
                onPress={async () => {
                  setCreateError('');
                  if (currency.trim().length !== 3) {
                    setCreateError('La moneda debe tener 3 letras (ej. USD)');
                    return;
                  }
                  try {
                    await createAccount({
                      variables: {
                        input: {
                          currency: currency.trim().toUpperCase(),
                        },
                      },
                    });
                    setCreateModalOpen(false);
                    refetch();
                  } catch (err: any) {
                    setCreateError(getGraphQLErrorMessage(err));
                  }
                }}
                disabled={createState.loading}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  actionsRow: {
    marginBottom: 12,
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardBalance: {
    color: '#E9EEF5',
    fontSize: 16,
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#151A22',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1F2633',
  },
  modalTitle: {
    color: '#E9EEF5',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});
