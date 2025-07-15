import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
  withSpring,
} from 'react-native-reanimated';

const {width: screenWidth} = Dimensions.get('window');
const PIECE_SIZE = (screenWidth - 60) / 3; // 3x3 grid with margins

export interface PuzzlePieceData {
  id: number;
  currentPosition: number;
  correctPosition: number;
  color: string;
  content: string;
  icon: string;
}

interface PuzzlePieceProps {
  piece: PuzzlePieceData;
  position: number;
  onSwap: (fromIndex: number, toIndex: number) => void;
  isCorrect: boolean;
}

const PuzzlePiece: React.FC<PuzzlePieceProps> = ({
  piece,
  position,
  onSwap,
  isCorrect,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const zIndex = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onStart: () => {
      zIndex.value = 999;
    },
    onActive: (event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    },
    onEnd: (event) => {
      const dropZoneX = Math.round(event.translationX / PIECE_SIZE);
      const dropZoneY = Math.round(event.translationY / PIECE_SIZE);
      
      const currentRow = Math.floor(position / 3);
      const currentCol = position % 3;
      const newRow = currentRow + dropZoneY;
      const newCol = currentCol + dropZoneX;
      
      if (newRow >= 0 && newRow < 3 && newCol >= 0 && newCol < 3) {
        const newPosition = newRow * 3 + newCol;
        runOnJS(onSwap)(position, newPosition);
      }

      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      zIndex.value = 0;
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {translateX: translateX.value},
      {translateY: translateY.value},
    ],
    zIndex: zIndex.value,
  }));

  // Create puzzle piece shape using borderRadius and cuts
  const getPuzzleShapeStyle = () => {
    const baseStyle = {
      borderTopLeftRadius: position === 0 ? 15 : position === 1 ? 0 : 15,
      borderTopRightRadius: position === 2 ? 15 : position === 1 ? 0 : 15,
      borderBottomLeftRadius: position === 6 ? 15 : position === 7 ? 0 : 15,
      borderBottomRightRadius: position === 8 ? 15 : position === 7 ? 0 : 15,
    };

    // Add notches/tabs for puzzle piece effect
    const notchStyle: any = {};
    
    // Top notch
    if (position >= 3) {
      notchStyle.borderTopWidth = position % 2 === 0 ? 10 : 0;
      notchStyle.borderTopColor = 'transparent';
    }
    
    // Right notch  
    if ((position + 1) % 3 !== 0) {
      notchStyle.borderRightWidth = position % 2 === 1 ? 10 : 0;
      notchStyle.borderRightColor = 'transparent';
    }
    
    // Bottom notch
    if (position < 6) {
      notchStyle.borderBottomWidth = position % 2 === 1 ? 10 : 0;
      notchStyle.borderBottomColor = 'transparent';
    }
    
    // Left notch
    if (position % 3 !== 0) {
      notchStyle.borderLeftWidth = position % 2 === 0 ? 10 : 0;
      notchStyle.borderLeftColor = 'transparent';
    }

    return {...baseStyle, ...notchStyle};
  };

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.pieceContainer, animatedStyle]}>
        <View style={[
          styles.piece, 
          {backgroundColor: piece.color}, 
          getPuzzleShapeStyle(),
          isCorrect && styles.correctPiece
        ]}>
          <View style={styles.content}>
            <Text style={styles.icon}>{piece.icon}</Text>
            <Text style={styles.contentText}>{piece.content}</Text>
          </View>
          
          {/* Corner decorations for puzzle effect */}
          <View style={[styles.cornerDecoration, styles.topLeft]} />
          <View style={[styles.cornerDecoration, styles.topRight]} />
          <View style={[styles.cornerDecoration, styles.bottomLeft]} />
          <View style={[styles.cornerDecoration, styles.bottomRight]} />
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  pieceContainer: {
    width: PIECE_SIZE,
    height: PIECE_SIZE,
    position: 'absolute',
  },
  piece: {
    width: PIECE_SIZE,
    height: PIECE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  correctPiece: {
    borderWidth: 3,
    borderColor: '#4CAF50',
    shadowColor: '#4CAF50',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  icon: {
    fontSize: 28,
    marginBottom: 4,
  },
  contentText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  cornerDecoration: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
  },
  topLeft: {
    top: 8,
    left: 8,
  },
  topRight: {
    top: 8,
    right: 8,
  },
  bottomLeft: {
    bottom: 8,
    left: 8,
  },
  bottomRight: {
    bottom: 8,
    right: 8,
  },
});

export default PuzzlePiece;