import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors, Spacing, Radius, Typography } from '../../theme';
import { useAuthStore } from '../../store/authStore';

export const SignupScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { login } = useAuthStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');

  const handleSignup = () => {
    if (name && phone && city) {
      login(name, phone, city);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        
        <Text style={styles.title}>Join Ustaad360</Text>
        <Text style={styles.subtitle}>Get reliable home services at fair prices.</Text>

        <View style={styles.form}>
          <View style={styles.inputBox}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput style={styles.input} placeholder="Ali Khan" placeholderTextColor={Colors.textMuted} value={name} onChangeText={setName} />
          </View>
          <View style={styles.inputBox}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput style={styles.input} placeholder="0300 1234567" placeholderTextColor={Colors.textMuted} keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
          </View>
          <View style={styles.inputBox}>
            <Text style={styles.label}>City</Text>
            <TextInput style={styles.input} placeholder="Lahore" placeholderTextColor={Colors.textMuted} value={city} onChangeText={setCity} />
          </View>

          <TouchableOpacity style={[styles.btn, (!name || !phone || !city) && styles.btnDisabled]} onPress={handleSignup} disabled={!name || !phone || !city}>
            <Text style={styles.btnText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.xl },
  backBtn: { marginTop: Spacing.xl, marginBottom: Spacing.lg },
  title: { ...Typography.h1, color: Colors.textPrimary, marginBottom: Spacing.sm },
  subtitle: { ...Typography.body, color: Colors.textMuted, marginBottom: Spacing.xxl },
  form: { gap: Spacing.lg },
  inputBox: { gap: Spacing.xs },
  label: { ...Typography.label, color: Colors.textSecondary },
  input: { backgroundColor: Colors.inputBg, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.cardBorder, color: Colors.textPrimary, padding: Spacing.md, ...Typography.body },
  btn: { backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: Radius.full, alignItems: 'center', marginTop: Spacing.xl },
  btnDisabled: { backgroundColor: Colors.textDisabled },
  btnText: { ...Typography.label, color: Colors.background, fontSize: 16 },
});
