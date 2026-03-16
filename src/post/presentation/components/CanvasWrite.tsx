import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {StyleSheet, View, PanResponder} from 'react-native';
import {
  Canvas,
  Path,
  SkPath,
  Skia,
  Text as TextSkia,
  matchFont,
  useFonts,
} from '@shopify/react-native-skia';

type Props = {
  text?: {
    content: string;
    color?: string;
    opacity?: number;
    font?: {
      name: string;
      require: number;
    };
  };
  matchDistance?: number;
  matchPoints?: {x: number; y: number; passed?: boolean}[];
};

export type CanvasWriteRef = {
  reset(): void;
  getResult(): {
    strokesNumber: number;
    maxDistance: number;
    paths: SkPath[];
    matchPointNumber: number;
  };
};

const CanvasWrite = forwardRef<CanvasWriteRef, Props>((props: Props, ref) => {
  const fontMgr = useFonts({
    SVN_Cherish: [
      props.text?.font?.require ??
        require('assets/fonts/SVN-Cherish Moment.ttf'),
    ],
  });
  const font = fontMgr
    ? matchFont(
        {
          fontFamily: props?.text?.font?.name ?? 'SVN_Cherish',
          fontSize: 140,
        },
        fontMgr,
      )
    : null;
  const [size, setSize] = useState({height: 0, width: 0});

  const positionText = useMemo(() => {
    if (!props.text?.content) {
      return;
    }
    const sizeText = font?.measureText(props.text?.content);
    return (
      sizeText && {
        originX: size.width / 2 - sizeText?.width / 2,
        originY: size.height / 2 - sizeText?.height / 2,
        x: size.width / 2 - sizeText?.width / 2 - sizeText.x,
        y: size.height / 2 - sizeText?.height / 2 - sizeText?.y,
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fontMgr, size, props.text?.content]);

  // ===== FIX: Gộp tất cả stroke vào 1 path duy nhất =====
  // Tránh lỗi nextPaint.assign khi render N <Path> components
  const accumulatedPath = useRef<SkPath>(Skia.Path.Make());
  const currentStroke = useRef<SkPath>(Skia.Path.Make());
  const [renderPath, setRenderPath] = useState<SkPath>(() => Skia.Path.Make());
  // Lưu từng stroke riêng cho getResult()
  const strokesRef = useRef<SkPath[]>([]);

  const points = useRef<{x: number; y: number; passed?: boolean}[]>([]);
  const matchPointNumber = useRef(0);
  const maxDistance = useRef(0);

  const [matchDistance] = useState(props.matchDistance ?? 10);
  const [strokesNumber, setStrokesNumber] = useState(0);

  // Cập nhật renderPath = accumulated + currentStroke gộp lại
  const updateRenderPath = useCallback(() => {
    const combined = accumulatedPath.current.copy();
    combined.addPath(currentStroke.current);
    setRenderPath(combined);
  }, []);

  // Tìm điểm gần nhất để kiểm tra khớp
  const findPointNear = useCallback(
    (x: number, y: number) => {
      const diemGanNhat = points.current.reduce<{
        kc2: number;
        x: number;
        y: number;
        index: number;
      }>(
        (min, value, index) => {
          const khoangCach2 =
            (value.x - x) * (value.x - x) + (value.y - y) * (value.y - y);
          if (khoangCach2 < min.kc2) {
            return {...min, ...value, kc2: khoangCach2, index: index};
          } else {
            return min;
          }
        },
        {x: 0, y: 0, kc2: 999999999, index: -1},
      );

      const kc = Math.sqrt(diemGanNhat.kc2);

      if (kc <= matchDistance && !points.current[diemGanNhat.index].passed) {
        points.current[diemGanNhat.index] = {
          ...points.current[diemGanNhat.index],
          passed: true,
        };
        matchPointNumber.current += 1;
      }
      if (kc > maxDistance.current) {
        maxDistance.current = kc;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // Khi bắt đầu chạm — tạo stroke mới
  const onDrawingStart = useCallback(
    (x: number, y: number) => {
      currentStroke.current = Skia.Path.Make();
      currentStroke.current.moveTo(x, y);
      currentStroke.current.lineTo(x + 1, y + 1);
      setStrokesNumber(pre => pre + 1);
      updateRenderPath();
    },
    [updateRenderPath],
  );

  // Khi di chuyển ngón tay — kéo dài stroke
  const onDrawingActive = useCallback(
    (x: number, y: number) => {
      findPointNear(x, y);
      const lastPt = currentStroke.current.getLastPt();
      const xMid = (lastPt.x + x) / 2;
      const yMid = (lastPt.y + y) / 2;
      currentStroke.current.quadTo(lastPt.x, lastPt.y, xMid, yMid);
      updateRenderPath();
    },
    [findPointNear, updateRenderPath],
  );

  // Khi nhấc tay — gộp stroke vào accumulated
  const onDrawingEnd = useCallback(() => {
    strokesRef.current.push(currentStroke.current.copy());
    accumulatedPath.current.addPath(currentStroke.current);
    currentStroke.current = Skia.Path.Make();
  }, []);

  // Refs để PanResponder luôn gọi phiên bản mới nhất
  const onDrawingStartRef = useRef(onDrawingStart);
  const onDrawingActiveRef = useRef(onDrawingActive);
  const onDrawingEndRef = useRef(onDrawingEnd);
  onDrawingStartRef.current = onDrawingStart;
  onDrawingActiveRef.current = onDrawingActive;
  onDrawingEndRef.current = onDrawingEnd;

  // PanResponder thay thế useTouchHandler — tránh xung đột Skia reconciler
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: evt => {
        const {locationX, locationY} = evt.nativeEvent;
        onDrawingStartRef.current(locationX, locationY);
      },
      onPanResponderMove: evt => {
        const {locationX, locationY} = evt.nativeEvent;
        onDrawingActiveRef.current(locationX, locationY);
      },
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
    points.current = points.current.map(e => ({...e, passed: false}));
    maxDistance.current = 0;
  };

  useImperativeHandle(ref, () => ({
    reset,
    getResult: () => ({
      maxDistance: maxDistance.current,
      paths: strokesRef.current,
      matchPointNumber: matchPointNumber.current,
      strokesNumber: strokesNumber,
    }),
  }));

  useEffect(() => {
    if (props.matchPoints) {
      points.current = props.matchPoints.map(e => ({
        ...e,
        x: e.x + (positionText?.originX ?? 0),
        y: e.y + (positionText?.originY ?? 0),
      }));
    }
  }, [positionText?.originX, positionText?.originY, props.matchPoints]);

  return (
    <View
      style={styles.container}
      onLayout={e => {
        setSize({
          height: e.nativeEvent.layout.height,
          width: e.nativeEvent.layout.width,
        });
      }}>

      {/* Canvas chỉ render, không nhận gesture trực tiếp */}
      <Canvas style={styles.container}>
        {props?.text?.content && (
          <TextSkia
            text={props?.text?.content}
            font={font}
            x={positionText?.x ?? 0}
            y={positionText?.y ?? 200}
            color={props.text.color ?? 'green'}
            opacity={props?.text?.opacity ?? 1}
          />
        )}
        {/* Chỉ 1 Path duy nhất cho tất cả nét vẽ */}
        <Path
          path={renderPath}
          color={'black'}
          style={'stroke'}
          strokeWidth={2}
          strokeCap="round"
          strokeJoin="round"
        />
      </Canvas>

      {/* View trong suốt bắt gesture qua PanResponder */}
      <View style={StyleSheet.absoluteFill} {...panResponder.panHandlers} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
  },
  chiSo: {
    padding: 8,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  space: {
    height: 20,
  },
});

export default CanvasWrite;
