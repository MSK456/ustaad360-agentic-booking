import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors, Spacing, Radius, Typography } from '../../theme';
import { useAuthStore } from '../../store/authStore';

type Nav = NativeStackNavigationProp<any>;

const CITIES = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan'];
const LANGUAGES = [
  { value: 'roman_urdu', label: 'Roman Urdu' },
  { value: 'urdu', label: 'اردو' },
  { value: 'english', label: 'English' },
] as const;

export const SignupScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { signup } = useAuthStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const [language, setLanguage] = useState<'roman_urdu' | 'urdu' | 'english'>('roman_urdu');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) e.name = 'Full name is required (min 2 chars)';
    if (!phone.trim() || phone.trim().length < 8) e.phone = 'Phone or email is required';
    if (!password || password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!city) e.city = 'Please select your city';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await signup({ name: name.trim(), phone: phone.trim(), city, preferredLanguage: language, totalBookings: 0, loyaltyDiscount: false, joinedAt: new Date().toISOString() });
    } catch {
      Alert.alert('Error', 'Could not save account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Ionicons name="construct" size={36} color={Colors.primary} />
        <Text style={styles.brand}>Ustaad<Text style={{ color: Colors.primary }}>360</Text></Text>
        <Text style={styles.subtitle}>Create your account</Text>
      </View>

      {/* Full Name */}
      <View style={styles.field}>
        <Text style={styles.label}>Full Name *</Text>
        <View style={[styles.inputRow, !!errors.name && styles.inputError]}>
          <Ionicons name="person-outline" size={18} color={Colors.textMuted} />
          <TextInput style={styles.input} placeholder="e.g. Ali Raza" placeholderTextColor={Colors.textDisabled} value={name} onChangeText={setName} autoCapitalize="words" />
        </View>
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      </View>

      {/* Phone/Email */}
      <View style={styles.field}>
        <Text style={styles.label}>Phone / Email *</Text>
        <View style={[styles.inputRow, !!errors.phone && styles.inputError]}>
          <Ionicons name="call-outline" size={18} color={Colors.textMuted} />
          <TextInput style={styles.input} placeholder="+92 300 1234567 or email" placeholderTextColor={Colors.textDisabled} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        </View>
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
      </View>

      {/* Password */}
      <View style={styles.field}>
        <Text style={styles.label}>Password *</Text>
        <View style={[styles.inputRow, !!errors.password && styles.inputError]}>
          <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} />
          <TextInput style={styles.input} placeholder="Min 6 characters" placeholderTextColor={Colors.textDisabled} value={password} onChangeText={setPassword} secureTextEntry={!showPass} />
          <TouchableOpacity onPress={() => setShowPass(v => !v)}>
            <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
      </View>

      {/* City */}
      <View style={styles.field}>
        <Text style={styles.label}>City *</Text>
        <View style={styles.chips}>
          {CITIES.map(c => (
            <TouchableOpacity key={c} style={[styles.chip, city === c && styles.chipActive]} onPress={() => setCity(c)}>
              <Text style={[styles.chipText, city === c && styles.chipTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
      </View>

      {/* Language */}
      <View style={styles.field}>
        <Text style={styles.label}>Preferred Language</Text>
        <View style={styles.chips}>
          {LANGUAGES.map(l => (
            <TouchableOpacity key={l.value} style={[styles.chip, language === l.value && styles.chipActive]} onPress={() => setLanguage(l.value)}>
              <Text style={[styles.chipText, language === l.value && styles.chipTextActive]}>{l.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.btn} onPress={handleSignup} disabled={loading}>
        {loading ? <ActivityIndicator color="#08111F" /> : <Text style={styles.btnText}>Create Account →</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login' as any)} style={styles.link}>
        <Text style={styles.linkText}>Already have an account? <Text style={{ color: Colors.primary }}>Log In</Text></Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.xl, paddingTop: Spacing.xxxl, gap: Spacing.lg, paddingBottom: 60 },
  header: { alignItems: 'center', marginBottom: Spacing.md, gap: 6 },
  brand: { ...Typography.h2, color: Colors.textPrimary, fontWeight: '800' },
  subtitle: { ...Typography.body, color: Colors.textMuted },
  field: { gap: 6 },
  label: { ...Typography.label, color: Colors.textSecondary, fontSize: 12 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.inputBg, borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: 12, borderWidth: 1, borderColor: Colors.cardBorder },
  inputError: { borderColor: Colors.danger },
  input: { flex: 1, color: Colors.textPrimary, fontSize: 14 },
  errorText: { ...Typography.caption, color: Colors.danger },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.cardBorder, backgroundColor: Colors.card },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 13, color: Colors.textMuted },
  chipTextActive: { color: '#08111F', fontWeight: '700' },
  btn: { backgroundColor: Colors.primary, borderRadius: Radius.md, paddingVertical: 15, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#08111F', fontWeight: '800', fontSize: 15 },
  link: { alignItems: 'center' },
  linkText: { ...Typography.bodySm, color: Colors.textMuted },
});
