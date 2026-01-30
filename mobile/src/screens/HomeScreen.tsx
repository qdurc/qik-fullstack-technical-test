import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';

export const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Qik Mobile</Text>
        <Text style={styles.subtitle}>React Native + GraphQL</Text>
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
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 8,
    color: '#97A4B8',
    fontSize: 16,
  },
});
