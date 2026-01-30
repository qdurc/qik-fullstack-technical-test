import React, {useMemo, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {useMutation} from '@apollo/client/react';
import {POST_CREDIT_MUTATION, POST_DEBIT_MUTATION} from '../api/mutations';
import {PrimaryButton} from '../components/PrimaryButton';
import {LabeledInput} from '../components/LabeledInput';
import {getGraphQLErrorMessage} from '../api/error';

export const NewTransactionScreen: React.FC<{
  accountId: string;
  onBack: () => void;
}> = ({accountId, onBack}) => {
  const [type, setType] = useState<'credit' | 'debit'>('credit');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const [postCredit, creditState] = useMutation(POST_CREDIT_MUTATION);
  const [postDebit, debitState] = useMutation(POST_DEBIT_MUTATION);

  const isLoading = creditState.loading || debitState.loading;

  const submit = async () => {
    setError('');
    const amountValue = Number(amount);
    if (!amount.trim() || Number.isNaN(amountValue) || amountValue <= 0) {
      setError('El monto debe ser un número positivo');
      return;
    }
    try {
      if (type === 'credit') {
        await postCredit({
          variables: {input: {accountId, amount, description}},
        });
      } else {
        await postDebit({
          variables: {input: {accountId, amount, description}},
        });
      }
      setAmount('');
      setDescription('');
    } catch (err: any) {
      setError(getGraphQLErrorMessage(err));
    }
  };

  const header = useMemo(
    () => (type === 'credit' ? 'Crédito' : 'Débito'),
    [type],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Nueva transacción</Text>
        <View style={styles.toggleRow}>
          <PrimaryButton label="Crédito" onPress={() => setType('credit')} />
          <View style={styles.spacer} />
          <PrimaryButton label="Débito" onPress={() => setType('debit')} />
        </View>
        <Text style={styles.subtitle}>Tipo: {header}</Text>
        <LabeledInput label="Amount" value={amount} onChangeText={setAmount} />
        <LabeledInput
          label="Description (opcional)"
          value={description}
          onChangeText={setDescription}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <PrimaryButton
          label={isLoading ? 'Enviando...' : 'Enviar'}
          onPress={submit}
          disabled={isLoading}
        />
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
  card: {
    backgroundColor: '#151A22',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1F2633',
  },
  title: {
    color: '#E9EEF5',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: '#97A4B8',
    marginBottom: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  spacer: {
    height: 8,
    width: 8,
  },
  error: {
    color: '#FF7D7D',
    marginBottom: 8,
  },
});
