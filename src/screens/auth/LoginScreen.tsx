import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors, Spacing, Radius, Typography } from '../../theme';
import { useAuthStore } from '../../store/authStore';

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { login } = useAuthStore();
  const [phone, setPhone] = useState('03001234567');
  const [password, setPassword] = useState('password');

  const handleLogin = () => {
    // Mock login
    login('Ahmed Demo', phone, 'Lahore');
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Log in to continue booking.</Text>

        <View style={styles.form}>
          <View style={styles.inputBox}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput style={styles.input} placeholder="0300 1234567" placeholderTextColor={Colors.textMuted} keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
          </View>
          <View style={styles.inputBox}>
            <Text style={styles.label}>Password</Text>
            <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor={Colors.textMuted} secureTextEntry value={password} onChangeText={setPassword} />
          </View>

          <TouchableOpacity style={[styles.btn, (!phone || !password) && styles.btnDisabled]} onPress={handleLogin} disabled={!phone || !password}>
            <Text style={styles.btnText}>Log In</Text>
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
