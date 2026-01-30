import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';

export const LabeledInput: React.FC<{
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
}> = ({label, value, onChangeText, placeholder, secureTextEntry}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#6F7D93"
        secureTextEntry={secureTextEntry}
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    color: '#C7D2E5',
    marginBottom: 6,
    fontSize: 13,
  },
  input: {
    backgroundColor: '#121720',
    borderWidth: 1,
    borderColor: '#242D3D',
    color: '#E9EEF5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});
