import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {useMutation} from '@apollo/client/react';
import {PrimaryButton} from '../ui/atoms/PrimaryButton';
import {LabeledInput} from '../ui/atoms/LabeledInput';
import {useAuth} from '../hooks/useAuth';
import {CREATE_DEMO_USER_MUTATION} from '../api/mutations';
import {getGraphQLErrorMessage} from '../api/error';

export const LoginScreen: React.FC = () => {
  const {setAuth} = useAuth();
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [createDemoUser, createState] = useMutation(
    CREATE_DEMO_USER_MUTATION,
  );

  const handleLogin = () => {
    setError('');
    let trimmedToken = token.trim();
    if (!trimmedToken) {
      setError('Debes ingresar un token');
      return;
    }
    if (trimmedToken.toLowerCase().startsWith('bearer ')) {
      trimmedToken = trimmedToken.slice(7).trim();
    }
    if (!trimmedToken) {
      setError('Token inválido');
      return;
    }
    setAuth(trimmedToken, 'me');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Ingresa tu token o crea una cuenta.</Text>
        <LabeledInput
          label="Token"
          value={token}
          onChangeText={setToken}
          placeholder="JWT token"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <PrimaryButton label="Entrar" onPress={handleLogin} />
        <View style={styles.spacer} />
        <PrimaryButton
          label={createState.loading ? 'Creando...' : 'Crear cuenta nueva'}
          onPress={async () => {
            setError('');
            try {
              const result = await createDemoUser();
              const payload = result.data?.createDemoUser;
              if (!payload?.token || !payload?.userId) {
                setError('No se pudo crear la cuenta');
                return;
              }
              setAuth(payload.token, payload.userId);
            } catch (err: any) {
              setError(getGraphQLErrorMessage(err));
            }
          }}
          disabled={createState.loading}
        />
        <Text style={styles.help}>
          O genera un token con: npm run token:dev -- &lt;userId&gt;
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E1116',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    backgroundColor: '#151A22',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1F2633',
  },
  title: {
    color: '#E9EEF5',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#97A4B8',
    marginBottom: 16,
    textAlign: 'center',
  },
  spacer: {
    height: 12,
  },
  help: {
    color: '#97A4B8',
    marginTop: 12,
    fontSize: 12,
  },
  error: {
    color: '#FF7D7D',
    marginBottom: 8,
  },
});
