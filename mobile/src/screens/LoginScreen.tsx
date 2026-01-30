import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {PrimaryButton} from '../components/PrimaryButton';
import {LabeledInput} from '../components/LabeledInput';
import {useAuth} from '../hooks/useAuth';

const DEMO_TOKEN = 'REPLACE_WITH_DEMO_TOKEN';

export const LoginScreen: React.FC = () => {
  const {setToken} = useAuth();
  const [value, setValue] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Login (Fake)</Text>
        <Text style={styles.subtitle}>Pega un JWT o usa demo.</Text>
        <LabeledInput
          label="Token"
          value={value}
          onChangeText={setValue}
          placeholder="Bearer token"
        />
        <PrimaryButton label="Set token" onPress={() => setToken(value)} />
        <View style={styles.spacer} />
        <PrimaryButton
          label="Use demo token"
          onPress={() => setToken(DEMO_TOKEN)}
        />
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
  },
  subtitle: {
    color: '#97A4B8',
    marginBottom: 16,
  },
  spacer: {
    height: 12,
  },
});
