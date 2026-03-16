import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextStyle,
  PanResponder,
} from 'react-native';
import {
  Canvas,
  Path,
  SkPath,
  Skia,
  PaintStyle,
} from '@shopify/react-native-skia';
import {FontFamily} from 'src/core/presentation/hooks/useFonts';

type Props = {
  text?: {
    content: string;
    style: TextStyle;
    builder?: (text: string, fontSize?: number) => React.ReactNode;
    show?: boolean;
  };
  background?: React.ReactNode;
  disable?: boolean;
  matchDistance?: number;
  backgroundColor?: string;
  matchPoints?: {x: number; y: number; passed?: boolean}[];
};

export type CanvasWriteRef = {
  reset(): void;
  getBytes(): Uint8Array<ArrayBufferLike> | undefined;
  getBase64(): string | undefined;
  getResult(): {
    strokesNumber: number;
    maxDistance: number;
    paths: SkPath[];
    matchPointNumber: number;
  };
};

const CanvasWrite = forwardRef<CanvasWriteRef, Props>((props: Props, ref) => {
  const [size, setSize] = useState({height: 0, width: 0});

  // ===== ROOT CAUSE FIX =====
  // Lỗi "nextPaint.assign is not a function": Skia paint pool bị exhausted
  // khi có nhiều <Path> components cùng lúc (N strokes = N paint contexts).
  // Giải pháp: Tích lũy TẤT CẢ strokes vào 1 SkPath duy nhất → chỉ render 1 <Path>.
  // ==========================

  // Path tích lũy tất cả nét đã hoàn thành
  const accumulatedPath = useRef<SkPath>(Skia.Path.Make());

  // Nét đang vẽ dở (chưa release)
  const currentStroke = useRef<SkPath>(Skia.Path.Make());

  // State để trigger re-render Canvas - chỉ 1 Path component duy nhất
  const [renderPath, setRenderPath] = useState<SkPath>(() => Skia.Path.Make());

  // Lưu từng stroke riêng lẻ cho getResult()
  const strokesRef = useRef<SkPath[]>([]);

  const [strokesNumber, setStrokesNumber] = useState(0);
  const matchPointNumber = useRef(0);
  const maxDistance = useRef(0);
  const points = useRef<{x: number; y: number; passed?: boolean}[]>([]);

  // Tính fontSize dựa trên kích thước canvas
  const fontSize = useMemo(() => {
    if (!props.text?.content?.length) {
      return 0;
    }
    return Math.min((size.width / props.text.content.length) * 1.8, 140);
  }, [size, props.text?.content]);

  // Cập nhật renderPath = accumulated + currentStroke (gộp thành 1 path)
  const updateRenderPath = useCallback(() => {
    const combined = accumulatedPath.current.copy();
    combined.addPath(currentStroke.current);
    setRenderPath(combined);
  }, []);

  // Khi bắt đầu chạm - tạo stroke mới
  const onDrawingStart = useCallback(
    (x: number, y: number) => {
      currentStroke.current = Skia.Path.Make();
      currentStroke.current.moveTo(x, y);
      // Vẽ điểm nhỏ để hiện nét khi chỉ tap
      currentStroke.current.lineTo(x + 1, y + 1);
      setStrokesNumber(pre => pre + 1);
      updateRenderPath();
    },
    [updateRenderPath],
  );

  // Khi di chuyển ngón tay - kéo dài stroke hiện tại
  const onDrawingActive = useCallback(
    (x: number, y: number) => {
      const lastPt = currentStroke.current.getLastPt();
      const xMid = (lastPt.x + x) / 2;
      const yMid = (lastPt.y + y) / 2;
      // quadTo tạo đường cong mượt hơn lineTo
      currentStroke.current.quadTo(lastPt.x, lastPt.y, xMid, yMid);
      updateRenderPath();
    },
    [updateRenderPath],
  );

  // Khi nhấc tay - kết thúc stroke, gộp vào accumulated
  const onDrawingEnd = useCallback(() => {
    // Lưu stroke cho getResult()
    strokesRef.current.push(currentStroke.current.copy());
    // Gộp stroke vừa xong vào accumulated
    accumulatedPath.current.addPath(currentStroke.current);
    // Reset stroke hiện tại
    currentStroke.current = Skia.Path.Make();
  }, []);

  // Dùng refs để luôn gọi phiên bản mới nhất của handlers từ PanResponder
  const onDrawingStartRef = useRef(onDrawingStart);
  const onDrawingActiveRef = useRef(onDrawingActive);
  const onDrawingEndRef = useRef(onDrawingEnd);
  onDrawingStartRef.current = onDrawingStart;
  onDrawingActiveRef.current = onDrawingActive;
  onDrawingEndRef.current = onDrawingEnd;

  // PanResponder thay thế useTouchHandler - tránh xung đột Skia reconciler
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      // Touch bắt đầu
      onPanResponderGrant: evt => {
        const {locationX, locationY} = evt.nativeEvent;
        onDrawingStartRef.current(locationX, locationY);
      },
      // Touch di chuyển
      onPanResponderMove: evt => {
        const {locationX, locationY} = evt.nativeEvent;
        onDrawingActiveRef.current(locationX, locationY);
      },
      // Touch kết thúc (nhấc tay hoặc bị interrupt)
      onPanResponderRelease: () => onDrawingEndRef.current(),
      onPanResponderTerminate: () => onDrawingEndRef.current(),
    }),
  ).current;

  // Reset canvas về trạng thái ban đầu
  const reset = () => {
    accumulatedPath.current = Skia.Path.Make();
    currentStroke.current = Skia.Path.Make();
    strokesRef.current = [];
    setRenderPath(Skia.Path.Make());
    setStrokesNumber(0);
    matchPointNumber.current = 0;
    maxDistance.current = 0;
    points.current = points.current.map(e => ({...e, passed: false}));
  };

  // Render ảnh từ tất cả path (bao gồm cả stroke đang vẽ dở)
  // Gộp accumulatedPath + currentStroke để không bị mất stroke cuối
  const getImage = useCallback(() => {
    // Gộp cả accumulated path và stroke đang vẽ dở (nếu có)
    const fullPath = accumulatedPath.current.copy();
    fullPath.addPath(currentStroke.current);

    // Kiểm tra path có nội dung không (tránh gửi ảnh trắng cho OCR)
    if (fullPath.countPoints() === 0) {
      return null;
    }

    const width = size.width * 2;
    const height = size.height * 2;

    // Kiểm tra kích thước hợp lệ
    if (width <= 0 || height <= 0) {
      return null;
    }

    const surface = Skia.Surface.MakeOffscreen(width, height);
    const canvas = surface?.getCanvas();

    // Nền trắng
    const paintBg = Skia.Paint();
    paintBg.setColor(Skia.Color('white'));
    canvas?.drawRect(Skia.XYWHRect(0, 0, width, height), paintBg);

    // Scale 2x để path (tọa độ ở scale 1x) khớp với canvas (kích thước 2x)
    canvas?.scale(2, 2);

    // Vẽ path màu đen
    const paint = Skia.Paint();
    paint.setColor(Skia.Color('black'));
    paint.setStrokeWidth(8);
    paint.setStyle(PaintStyle.Stroke);
    canvas?.drawPath(fullPath, paint);

    return surface?.makeImageSnapshot();
  }, [size]);

  const getBytes = useCallback(() => {
    return getImage()?.encodeToBytes();
  }, [getImage]);

  const getBase64 = useCallback(() => {
    return getImage()?.encodeToBase64();
  }, [getImage]);

  useImperativeHandle(ref, () => ({
    reset,
    getResult: () => ({
      maxDistance: maxDistance.current,
      paths: strokesRef.current,
      matchPointNumber: matchPointNumber.current,
      strokesNumber: strokesNumber,
    }),
    getBytes,
    getBase64,
  }));

  return (
    <View
      pointerEvents={props.disable ? 'none' : 'auto'}
      style={[styles.container, {opacity: props.disable ? 0.6 : 1}]}
      onLayout={e => {
        setSize({
          height: e.nativeEvent.layout.height,
          width: e.nativeEvent.layout.width,
        });
      }}>

      {/* Lớp nền hiển thị text mẫu */}
      <View
        style={[
          styles.bgText,
          props.backgroundColor ? {backgroundColor: props.backgroundColor} : null,
        ]}>
        {props.background && (
          <View style={{position: 'absolute', width: '100%', height: '100%'}}>
            {props.background}
          </View>
        )}
        {props.text?.show &&
          (props.text?.builder?.(props.text?.content, fontSize) ?? (
            <Text
              style={[
                styles.text,
                {color: 'green', fontSize: fontSize},
                props.text?.style,
              ]}>
              {props?.text?.content}
            </Text>
          ))}
      </View>

      {/* Canvas chỉ có DUY NHẤT 1 <Path> → paint pool không bị exhausted */}
      <Canvas style={styles.container}>
        <Path
          path={renderPath}
          color={'#BA3201'}
          style={'stroke'}
          strokeWidth={8}
          strokeCap="round"
          strokeJoin="round"
        />
      </Canvas>

      {/* View trong suốt nhận gesture qua PanResponder */}
      <View
        style={StyleSheet.absoluteFill}
        {...panResponder.panHandlers}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  bgText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FBF8CC',
    width: '100%',
    height: '100%',
  },
  text: {
    fontFamily: FontFamily.SVNCherishMoment,
    fontSize: 140,
  },
  space: {
    height: 20,
  },
});

export default React.memo(CanvasWrite);
