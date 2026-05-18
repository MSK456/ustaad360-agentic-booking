import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '../theme';

interface ScoreRingProps {
  score: number;   // 0–100
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score, size = 64, strokeWidth = 6, label,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const gap = circumference - progress;

  const getColor = () => {
    if (score >= 75) return Colors.scoreHigh;
    if (score >= 50) return Colors.scoreMid;
    return Colors.scoreLow;
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={Colors.cardBorder} strokeWidth={strokeWidth} fill="none"
        />
        <Circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={getColor()} strokeWidth={strokeWidth} fill="none"
          strokeDasharray={`${progress} ${gap}`}
          strokeLinecap="round"
          rotation={-90} origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.center}>
        <Text style={[styles.score, { color: getColor() }]}>{Math.round(score)}</Text>
        {label && <Text style={styles.label}>{label}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  center: { alignItems: 'center' },
  score: { fontSize: 16, fontWeight: '800' },
  label: { fontSize: 9, color: Colors.textMuted, fontWeight: '600', marginTop: 1 },
});
