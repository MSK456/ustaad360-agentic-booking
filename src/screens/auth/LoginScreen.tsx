import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors, Spacing, Radius, Typography } from '../../theme';
import { useAuthStore } from '../../store/authStore';

type Nav = NativeStackNavigationProp<any>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { login } = useAuthStore();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!phone.trim() || phone.trim().length < 5) e.phone = 'Phone or email is required';
    if (!password || password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      // Demo auth — accept any valid-format credentials
      await login({
        name: 'Demo User',
        phone: phone.trim(),
        city: 'Lahore',
        preferredLanguage: 'roman_urdu',
        totalBookings: 2,
        loyaltyDiscount: false,
        joinedAt: new Date().toISOString(),
      });
    } catch {
      Alert.alert('Error', 'Could not log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Ionicons name="construct" size={36} color={Colors.primary} />
        <Text style={styles.brand}>Ustaad<Text style={{ color: Colors.primary }}>360</Text></Text>
        <Text style={styles.subtitle}>Welcome back! Sign in.</Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Phone / Email *</Text>
        <View style={[styles.inputRow, !!errors.phone && styles.inputError]}>
          <Ionicons name="call-outline" size={18} color={Colors.textMuted} />
          <TextInput style={styles.input} placeholder="+92 300 1234567 or email" placeholderTextColor={Colors.textDisabled} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        </View>
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Password *</Text>
        <View style={[styles.inputRow, !!errors.password && styles.inputError]}>
          <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} />
          <TextInput style={styles.input} placeholder="Your password" placeholderTextColor={Colors.textDisabled} value={password} onChangeText={setPassword} secureTextEntry={!showPass} />
          <TouchableOpacity onPress={() => setShowPass(v => !v)}>
            <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
      </View>

      <View style={styles.demoHint}>
        <Ionicons name="information-circle-outline" size={14} color={Colors.primary} />
        <Text style={styles.demoText}>Demo mode: enter any phone + password (6+ chars)</Text>
      </View>

      <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#08111F" /> : <Text style={styles.btnText}>Sign In →</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup' as any)} style={styles.link}>
        <Text style={styles.linkText}>New to Ustaad360? <Text style={{ color: Colors.primary }}>Create Account</Text></Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.xl, paddingTop: Spacing.xxxl + 20, gap: Spacing.lg, paddingBottom: 60 },
  header: { alignItems: 'center', marginBottom: Spacing.lg, gap: 6 },
  brand: { ...Typography.h2, color: Colors.textPrimary, fontWeight: '800' },
  subtitle: { ...Typography.body, color: Colors.textMuted },
  field: { gap: 6 },
  label: { ...Typography.label, color: Colors.textSecondary, fontSize: 12 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.inputBg, borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: 12, borderWidth: 1, borderColor: Colors.cardBorder },
  inputError: { borderColor: Colors.danger },
  input: { flex: 1, color: Colors.textPrimary, fontSize: 14 },
  errorText: { ...Typography.caption, color: Colors.danger },
  demoHint: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.primary + '11', padding: Spacing.sm, borderRadius: Radius.sm },
  demoText: { ...Typography.caption, color: Colors.primary, flex: 1 },
  btn: { backgroundColor: Colors.primary, borderRadius: Radius.md, paddingVertical: 15, alignItems: 'center', marginTop: 4 },
  btnText: { color: '#08111F', fontWeight: '800', fontSize: 15 },
  link: { alignItems: 'center' },
  linkText: { ...Typography.bodySm, color: Colors.textMuted },
});
