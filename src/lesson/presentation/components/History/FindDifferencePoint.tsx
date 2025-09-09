import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  Dimensions,
} from 'react-native';
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {scale, verticalScale} from 'react-native-size-matters';
import {COLORS} from 'src/core/presentation/constants/colors';
import useGlobalStyle from 'src/core/presentation/hooks/useGlobalStyle';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

interface TouchPoint {
  id: number;
  x: number;
  y: number;
  radius: number;
}

interface FindDifferencePointProps {
  imageSource?: any;
  onComplete?: (success: boolean) => void;
  targetPoints?: number;
}

const FindDifferencePoint: React.FC<FindDifferencePointProps> = ({
  imageSource,
  onComplete,
  targetPoints = 5,
}) => {
  const globalStyle = useGlobalStyle();
  const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showFailPopup, setShowFailPopup] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentCircle, setCurrentCircle] = useState<TouchPoint | null>(null);

  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const currentX = useSharedValue(0);
  const currentY = useSharedValue(0);
  const isDrawing = useSharedValue(false);

  const calculateRadius = useCallback((x1: number, y1: number, x2: number, y2: number) => {
    'worklet';
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }, []);

  const createCircle = useCallback((centerX: number, centerY: number, radius: number) => {
    if (isSubmitted || touchPoints.length >= targetPoints) return;

    const newPoint: TouchPoint = {
      id: Date.now(),
      x: centerX,
      y: centerY,
      radius: Math.max(radius, 15), // Minimum radius of 15
    };

    setTouchPoints(prev => [...prev, newPoint]);
  }, [isSubmitted, targetPoints, touchPoints.length]);

  const handleSubmit = useCallback(() => {
    setIsSubmitted(true);
    const success = touchPoints.length === targetPoints;
    
    if (success) {
      setShowSuccessPopup(true);
    } else {
      setShowFailPopup(true);
    }
    
    onComplete?.(success);
  }, [touchPoints.length, targetPoints, onComplete]);

  const handleReset = useCallback(() => {
    setTouchPoints([]);
    setIsSubmitted(false);
    setShowSuccessPopup(false);
    setShowFailPopup(false);
    setCurrentCircle(null);
  }, []);

  const drawCircleGesture = Gesture.Pan()
    .onStart((event) => {
      if (isSubmitted || touchPoints.length >= targetPoints) return;
      
      startX.value = event.x;
      startY.value = event.y;
      currentX.value = event.x;
      currentY.value = event.y;
      isDrawing.value = true;

      // Start with a small initial circle
      runOnJS(setCurrentCircle)({
        id: Date.now(),
        x: event.x,
        y: event.y,
        radius: 15, // Start with minimum visible radius
      });
      
      // Provide haptic feedback when starting to draw
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
    })
    .onUpdate((event) => {
      if (!isDrawing.value) return;
      
      currentX.value = event.x;
      currentY.value = event.y;
      
      // Calculate radius from center to current position
      const radius = Math.sqrt(
        Math.pow(event.x - startX.value, 2) + 
        Math.pow(event.y - startY.value, 2)
      );
      
      // Ensure minimum radius for visibility
      const finalRadius = Math.max(radius, 15);
      
      runOnJS(setCurrentCircle)({
        id: Date.now(),
        x: startX.value,
        y: startY.value,
        radius: finalRadius,
      });
    })
    .onEnd(() => {
      if (!isDrawing.value || !currentCircle) return;
      const radius = calculateRadius(startX.value, startY.value, currentX.value, currentY.value);
      isDrawing.value = false;
      const finalRadius = Math.max(radius, 15); // Minimum radius
      
      // Always create a circle, even if it's small
      runOnJS(createCircle)(startX.value, startY.value, finalRadius);
      runOnJS(setCurrentCircle)(null);
      
      // Provide haptic feedback when circle is completed
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
    })
    .minDistance(0) // Allow immediate response to touch
    .maxPointers(1); // Only allow single finger drawing

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, globalStyle.txtLabel]}>
          Tìm 5 điểm khác nhau.
        </Text>
      </View>

      <View style={styles.imageContainer}>
        <GestureDetector gesture={drawCircleGesture}>
          <View style={styles.touchableImageContainer}>
            <Image
              source={
                imageSource || {
                  uri: 'https://picsum.photos/400/300?random=1',
                }
              }
              style={styles.image}
              resizeMode="contain"
              onError={() => console.log('Image failed to load')}
            />
            
            {/* Render completed circles */}
            {touchPoints.map((point) => (
              <DrawnCircle
                key={point.id}
                x={point.x}
                y={point.y}
                radius={point.radius}
              />
            ))}
            
            {/* Render current circle being drawn */}
            {currentCircle && (
              <DrawnCircle
                x={currentCircle.x}
                y={currentCircle.y}
                radius={currentCircle.radius}
                isPreview={true}
              />
            )}
          </View>
        </GestureDetector>

        <View style={styles.imageInfo}>
          <Text style={styles.imageDimensions}>294 × 196</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          {touchPoints.length}/{targetPoints} điểm đã tìm
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.submitButton,
          touchPoints.length === 0 && styles.submitButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={touchPoints.length === 0 || isSubmitted}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      {/* Success Popup */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showSuccessPopup}
        onRequestClose={() => setShowSuccessPopup(false)}>
        <View style={styles.popupOverlay}>
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>🎉 Chúc mừng!</Text>
            <Text style={styles.popupMessage}>
              Bạn đã tìm được tất cả {targetPoints} điểm khác nhau!
            </Text>
            <TouchableOpacity
              style={styles.popupButton}
              onPress={() => {
                setShowSuccessPopup(false);
                handleReset();
              }}>
              <Text style={styles.popupButtonText}>Tiếp tục</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Fail Popup */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showFailPopup}
        onRequestClose={() => setShowFailPopup(false)}>
        <View style={styles.popupOverlay}>
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>😔 Chưa đủ!</Text>
            <Text style={styles.popupMessage}>
              Bạn mới tìm được {touchPoints.length}/{targetPoints} điểm. 
              Hãy thử lại!
            </Text>
            <TouchableOpacity
              style={styles.popupButton}
              onPress={() => {
                setShowFailPopup(false);
                handleReset();
              }}>
              <Text style={styles.popupButtonText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
};

const DrawnCircle: React.FC<{
  x: number; 
  y: number; 
  radius: number; 
  isPreview?: boolean;
}> = ({x, y, radius, isPreview = false}) => {
  const scale = useSharedValue(isPreview ? 1 : 0);
  const opacity = useSharedValue(isPreview ? 0.7 : 0);

  React.useEffect(() => {
    if (!isPreview) {
      scale.value = withSpring(1);
      opacity.value = withSpring(1);
    }
  }, [scale, opacity, isPreview]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
    opacity: opacity.value,
  }));

  const circleSize = Math.max(radius * 2, 30); // Minimum size of 30 for visibility

  return (
    <Animated.View
      style={[
        styles.drawnCircle,
        {
          left: x - circleSize / 2,
          top: y - circleSize / 2,
          width: circleSize,
          height: circleSize,
          borderRadius: circleSize / 2,
          borderColor: isPreview ? COLORS.YELLOW_F2B559 : COLORS.RED_F28759,
          backgroundColor: isPreview 
            ? COLORS.CUSTOM(COLORS.YELLOW_F2B559, 0.8)
            : COLORS.CUSTOM(COLORS.RED_F28759, 0.8),
        },
        animatedStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE_FBF8CC,
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(20),
  },
  header: {
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  title: {
    fontSize: scale(24),
    fontFamily: FontFamily.SVNCherishMoment,
    color: COLORS.GREEN_1C6349,
    textAlign: 'center',
  },
  imageContainer: {
    backgroundColor: COLORS.WHITE_FFFBE3,
    borderRadius: scale(20),
    padding: scale(16),
    marginBottom: verticalScale(20),
    alignItems: 'center',
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  touchableImageContainer: {
    position: 'relative',
    width: scale(294),
    height: scale(196),
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: scale(12),
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE_FFFBE3,
    borderRadius: scale(12),
    padding: scale(16),
  },
  placeholderText: {
    fontSize: scale(18),
    fontWeight: 'bold',
    color: COLORS.GREEN_1C6349,
    textAlign: 'center',
  },
  placeholderSubtext: {
    fontSize: scale(14),
    color: COLORS.GREEN_1C6349,
    textAlign: 'center',
    marginTop: verticalScale(4),
  },
  imageInfo: {
    marginTop: verticalScale(8),
    backgroundColor: COLORS.BLUE_A3F0DF,
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(4),
    borderRadius: scale(12),
  },
  imageDimensions: {
    fontSize: scale(12),
    color: COLORS.WHITE,
    fontWeight: '600',
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  progressText: {
    fontSize: scale(16),
    color: COLORS.GREEN_1C6349,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: COLORS.RED_F28759,
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(40),
    borderRadius: scale(25),
    alignSelf: 'center',
    minWidth: scale(120),
    alignItems: 'center',
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.DISABLED,
  },
  submitButtonText: {
    color: COLORS.WHITE,
    fontSize: scale(18),
    fontWeight: '600',
    fontFamily: FontFamily.SVNNeuzeitBold,
  },
  drawnCircle: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: COLORS.RED_F28759,
    backgroundColor: COLORS.CUSTOM(COLORS.RED_F28759, 0.8),
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  popupOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    backgroundColor: COLORS.WHITE,
    borderRadius: scale(20),
    padding: scale(24),
    alignItems: 'center',
    marginHorizontal: scale(40),
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  popupTitle: {
    fontSize: scale(24),
    fontWeight: 'bold',
    color: COLORS.GREEN_1C6349,
    marginBottom: verticalScale(12),
    textAlign: 'center',
  },
  popupMessage: {
    fontSize: scale(16),
    color: COLORS.GREEN_1C6349,
    textAlign: 'center',
    marginBottom: verticalScale(20),
    lineHeight: scale(24),
  },
  popupButton: {
    backgroundColor: COLORS.GREEN_66C270,
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(32),
    borderRadius: scale(25),
    minWidth: scale(120),
    alignItems: 'center',
  },
  popupButtonText: {
    color: COLORS.WHITE,
    fontSize: scale(16),
    fontWeight: '600',
  },
});

export default FindDifferencePoint;
