import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing, Radius, Typography } from '../../theme';
import { useAuthStore } from '../../store/authStore';

export const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { continueAsGuest } = useAuthStore();

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.content}>
        
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="construct" size={48} color={Colors.background} />
            <Ionicons name="sync" size={80} color={Colors.primary} style={{ position: 'absolute' }} />
          </View>
          <Text style={styles.appName}>Ustaad<Text style={styles.appVersion}>360</Text></Text>
          <Text style={styles.tagline}>HAR KAAM, EK CLICK</Text>
        </View>

        <View style={styles.trustBox}>
          <Ionicons name="shield-checkmark" size={24} color={Colors.primary} />
          <Text style={styles.trustText}>Multilingual smart service matching with transparent dynamic pricing.</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.btnPrimary} onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.btnPrimaryText}>Create Account</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnOutline} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.btnOutlineText}>Log In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnGhost} onPress={continueAsGuest}>
            <Text style={styles.btnGhostText}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, padding: Spacing.xl, justifyContent: 'space-between', alignItems: 'center' },
  logoContainer: { alignItems: 'center', marginTop: 60 },
  logoCircle: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg },
  appName: { ...Typography.h1, color: '#FFFFFF', letterSpacing: 1 },
  appVersion: { color: Colors.primary },
  tagline: { ...Typography.label, color: Colors.warning, letterSpacing: 3, marginTop: Spacing.sm },
  trustBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.cardElevated, padding: Spacing.lg, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.cardBorder, marginVertical: Spacing.xxl },
  trustText: { ...Typography.bodyMd, color: Colors.textSecondary, marginLeft: Spacing.md, flex: 1 },
  actions: { width: '100%', gap: Spacing.md, marginBottom: 40 },
  btnPrimary: { backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: Radius.full, alignItems: 'center' },
  btnPrimaryText: { ...Typography.label, color: Colors.background, fontSize: 16 },
  btnOutline: { borderColor: Colors.cardBorder, borderWidth: 2, paddingVertical: 16, borderRadius: Radius.full, alignItems: 'center' },
  btnOutlineText: { ...Typography.label, color: Colors.textPrimary, fontSize: 16 },
  btnGhost: { paddingVertical: 16, alignItems: 'center' },
  btnGhostText: { ...Typography.label, color: Colors.textMuted, fontSize: 16 },
});
