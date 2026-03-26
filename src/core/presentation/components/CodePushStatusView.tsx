import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scale, verticalScale} from 'react-native-size-matters';

import {COLORS} from '../constants/colors';

export type CodePushPresentationMode = 'interactive' | 'floating' | 'disabled';
export type CodePushPhase =
  | 'idle'
  | 'checking'
  | 'downloading'
  | 'installing'
  | 'ready'
  | 'error'
  | 'up_to_date';

type Props = {
  mode: CodePushPresentationMode;
  phase: CodePushPhase;
  progressPercent: number;
  statusText: string;
};

const INTERACTIVE_VISIBLE_PHASES: CodePushPhase[] = [
  'downloading',
  'installing',
];
const FLOATING_VISIBLE_PHASES: CodePushPhase[] = [
  'downloading',
  'installing',
  'ready',
];

function CodePushStatusView({mode, phase, progressPercent, statusText}: Props) {
  const inset = useSafeAreaInsets();

  if (mode === 'disabled') {
    return null;
  }

  if (mode === 'interactive') {
    if (!INTERACTIVE_VISIBLE_PHASES.includes(phase)) {
      return null;
    }

    return (
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color={COLORS.WHITE} />
        <Text style={styles.overlayText}>
          {statusText}
          {phase === 'downloading' && progressPercent > 0
            ? ` ${progressPercent}%`
            : ''}
        </Text>
      </View>
    );
  }

  if (!FLOATING_VISIBLE_PHASES.includes(phase)) {
    return null;
  }

  return (
    <View
      pointerEvents="none"
      style={[
        styles.floatingWrapper,
        {
          top: inset.top + verticalScale(8),
        },
      ]}>
      <View style={styles.floatingCard}>
        <View style={styles.row}>
          {phase === 'ready' ? (
            <View style={styles.readyDot} />
          ) : (
            <ActivityIndicator size="small" color={COLORS.WHITE} />
          )}
          <Text numberOfLines={2} style={styles.floatingText}>
            {statusText}
          </Text>
          {phase === 'downloading' && progressPercent > 0 && (
            <View style={styles.progressBadge}>
              <Text style={styles.progressBadgeText}>{progressPercent}%</Text>
            </View>
          )}
        </View>

        {phase === 'downloading' && (
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progressPercent}%`,
                },
              ]}
            />
          </View>
        )}
      </View>
    </View>
  );
}

export default CodePushStatusView;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    zIndex: 9999,
  },
  overlayText: {
    marginTop: verticalScale(12),
    color: COLORS.WHITE,
    fontSize: verticalScale(16),
  },
  floatingWrapper: {
    position: 'absolute',
    right: scale(12),
    zIndex: 9999,
  },
  floatingCard: {
    minWidth: scale(156),
    maxWidth: scale(190),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
    borderRadius: scale(14),
    backgroundColor: 'rgba(28, 99, 73, 0.92)',
    shadowColor: COLORS.BLACK,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  floatingText: {
    flex: 1,
    marginLeft: scale(8),
    color: COLORS.WHITE_FBF8CC,
    fontSize: verticalScale(11),
    lineHeight: verticalScale(14),
  },
  readyDot: {
    width: scale(10),
    height: scale(10),
    borderRadius: scale(5),
    backgroundColor: COLORS.GREEN_8DE795,
  },
  progressBadge: {
    marginLeft: scale(8),
    paddingHorizontal: scale(6),
    paddingVertical: verticalScale(2),
    borderRadius: scale(999),
    backgroundColor: COLORS.WHITE_FBF8CC,
  },
  progressBadgeText: {
    color: COLORS.GREEN_1C6349,
    fontSize: verticalScale(10),
    fontWeight: '700',
  },
  progressTrack: {
    marginTop: verticalScale(8),
    width: '100%',
    height: verticalScale(4),
    borderRadius: scale(999),
    backgroundColor: 'rgba(255,255,255,0.22)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: scale(999),
    backgroundColor: COLORS.GREEN_8DE795,
  },
});
