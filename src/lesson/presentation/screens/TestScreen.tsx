import React, {useCallback, useMemo, useRef, useState} from 'react';
import {Button, StyleSheet, View, Text, PanResponder} from 'react-native';
import {
  Canvas,
  Path,
  SkPath,
  Skia,
  Text as TextSkia,
  matchFont,
} from '@shopify/react-native-skia';

const initPoinsA = [
  {x: -200 + 340, y: 340},
  {x: -200 + 350.1904296875, y: 315.5429992675781},
  {x: -200 + 360.3808288574219, y: 291.08599853515625},
  {x: -200 + 370.5712585449219, y: 266.6289978027344},
  {x: -200 + 380.76165771484375, y: 242.1719970703125},
  {x: -200 + 390.95208740234375, y: 217.7149963378906},
  {x: -200 + 401.14251708984375, y: 193.25799560546875},
  {x: -200 + 411.3329162597656, y: 168.80099487304688},
  {x: -200 + 421.470947265625, y: 151.67738342285156},
  {x: -200 + 431.31097412109375, y: 176.2774658203125},
  {x: -200 + 441.1510009765625, y: 200.87753295898438},
  {x: -200 + 450.99102783203125, y: 225.47760009765625},
  {x: -200 + 460.8310852050781, y: 250.0776672363281},
  {x: -200 + 470.6711120605469, y: 274.677734375},
  {x: -200 + 480.5111389160156, y: 299.2778015136719},
  {x: -200 + 490.35113525390625, y: 323.87786865234375},
  {x: -200 + 380.5147399902344, y: 244},
  {x: -200 + 407.00982666015625, y: 244},
  {x: -200 + 433.5049133300781, y: 244},
];

const pathA =
  'M 95.605 185.547 L 95.605 184.571 A 329.036 329.036 0 0 1 95.145 180.619 C 94.861 178.057 94.643 175.82 94.463 173.934 A 2158.662 2158.662 0 0 0 94.238 171.582 A 683.287 683.287 0 0 1 92.969 157.52 A 183.446 183.446 0 0 1 92.956 157.416 C 92.664 155.073 92.275 151.593 91.602 147.071 L 91.406 145.899 A 1915.909 1915.909 0 0 0 88.464 122.974 A 1188.885 1188.885 0 0 0 85.449 101.953 C 83.531 89.437 80.843 75.553 77.466 60.221 A 1052.579 1052.579 0 0 0 76.758 57.032 C 74.278 47.709 66.779 43.331 58.067 42.387 A 35.024 35.024 0 0 0 54.297 42.188 A 31.117 31.117 0 0 0 44.431 43.492 A 20.168 20.168 0 0 0 39.355 45.996 C 24.719 57.31 14.376 97.026 9.617 119.898 A 385.641 385.641 0 0 0 8.496 125.489 A 1253.533 1253.533 0 0 0 7.141 132.285 C 6.285 136.647 5.585 140.373 5.04 143.489 A 227.951 227.951 0 0 0 4.395 147.364 A 449.705 449.705 0 0 0 4.385 147.439 C 4.165 149.257 3.945 151.167 3.707 153.17 A 510.829 510.829 0 0 1 3.125 157.91 C 1.367 170.703 0.293 182.52 0 193.164 A 5.731 5.731 0 0 0 1.077 196.079 C 2.931 198.603 6.774 199.395 9.976 199.5 A 23.45 23.45 0 0 0 10.742 199.512 A 16.865 16.865 0 0 0 13 199.347 C 14.351 199.164 15.869 198.828 17.578 198.34 A 6.71 6.71 0 0 0 19.901 197.271 C 21.146 196.352 21.911 194.998 22.168 193.262 A 81.501 81.501 0 0 1 22.169 192.676 C 22.174 192.05 22.191 191.225 22.255 190.202 A 45.024 45.024 0 0 1 22.266 190.039 A 274.495 274.495 0 0 1 22.272 188.162 C 22.31 182.477 22.581 171.831 24.316 168.36 C 28.492 165.054 39.253 163.996 46.179 163.597 A 184.242 184.242 0 0 1 48.535 163.477 A 419.197 419.197 0 0 0 51.036 163.33 A 446.016 446.016 0 0 0 53.32 163.184 C 55.078 162.989 56.641 162.989 57.91 162.989 A 19.236 19.236 0 0 1 60.01 163.086 C 60.581 163.15 61.116 163.25 61.599 163.403 A 5.504 5.504 0 0 1 61.816 163.477 A 1.919 1.919 0 0 1 62.851 164.237 C 63.344 164.906 63.683 165.971 63.867 167.383 A 141.78 141.78 0 0 0 63.958 168.422 C 64.057 169.503 64.199 170.981 64.385 172.856 A 1244.15 1244.15 0 0 0 64.453 173.535 C 64.648 176.563 64.844 179.59 65.137 182.813 C 65.308 184.785 65.48 186.531 65.585 188.051 A 59.587 59.587 0 0 1 65.625 188.672 C 65.894 192.795 65.998 195.108 70.014 196.668 A 16.104 16.104 0 0 0 71.191 197.071 A 21.744 21.744 0 0 0 76.749 198.015 A 28.897 28.897 0 0 0 78.125 198.047 A 29.759 29.759 0 0 0 81.706 197.832 C 88.656 196.987 95.605 193.536 95.605 185.547 Z M 29.883 150.293 L 29.102 150.293 A 5.821 5.821 0 0 1 27.823 150.168 C 25.796 149.71 25.586 148.036 25.586 145.801 A 20.704 20.704 0 0 1 25.634 144.105 A 11.362 11.362 0 0 1 25.781 142.969 A 2.416 2.416 0 0 0 25.879 142.2 A 21.101 21.101 0 0 0 25.879 142.09 C 27.491 127.772 33.983 85.923 42.583 72.511 A 19.015 19.015 0 0 1 43.359 71.387 A 8.653 8.653 0 0 1 44.164 70.49 C 44.796 69.882 45.42 69.515 46.016 69.387 A 2.232 2.232 0 0 1 46.484 69.336 A 2.356 2.356 0 0 1 47.851 69.846 C 49.059 70.715 50.381 72.693 51.855 75.782 A 19.226 19.226 0 0 1 52.787 78.228 C 54.504 83.661 56.172 94.076 57.91 109.473 C 58.008 110.254 58.105 111.035 58.203 111.719 A 232.697 232.697 0 0 1 59.285 119.258 C 59.931 124.404 60.254 128.705 60.254 132.129 A 78.932 78.932 0 0 1 60.197 135.938 C 59.966 140.535 58.805 143.134 52.946 145.794 A 31.929 31.929 0 0 1 52.93 145.801 C 49.494 147.369 44.174 148.652 37.012 149.562 A 158.154 158.154 0 0 1 29.883 150.293 Z M 64.844 0.977 C 57.129 6.836 51.465 15.332 46.777 23.633 A 136.511 136.511 0 0 1 45.471 25.757 A 345.115 345.115 0 0 0 44.238 27.735 C 43.864 28.482 43.605 29.173 43.504 29.806 A 3.589 3.589 0 0 0 43.457 30.371 A 3.511 3.511 0 0 0 44.043 32.322 A 3.987 3.987 0 0 0 44.727 33.106 A 13.003 13.003 0 0 0 45.436 33.768 C 47.413 35.469 48.958 35.547 51.758 35.547 A 9.569 9.569 0 0 0 57.812 33.594 C 64.181 28.499 75.465 19.082 80.769 12.133 A 28.777 28.777 0 0 0 81.836 10.645 C 81.982 10.303 82.104 9.986 82.19 9.668 A 3.698 3.698 0 0 0 82.324 8.692 A 4.961 4.961 0 0 0 80.993 5.53 C 78.268 2.299 72.023 0 68.652 0 A 8.57 8.57 0 0 0 66.721 0.204 A 5.958 5.958 0 0 0 64.844 0.977 Z';

export default function TestScreen() {
  const font = matchFont({
    fontFamily: 'SVN-Cherish Moment',
    fontSize: 140,
  });

  // Path tích lũy tất cả nét đã hoàn thành — chỉ render 1 <Path> duy nhất
  const accumulatedPath = useRef<SkPath>(Skia.Path.Make());
  // Nét đang vẽ dở (chưa nhấc tay)
  const currentStroke = useRef<SkPath>(Skia.Path.Make());
  // State để trigger re-render Canvas
  const [renderPath, setRenderPath] = useState<SkPath>(() => Skia.Path.Make());

  const pathsTest = useRef<{path: SkPath; color: string}[]>([]);

  const points = useRef<{x: number; y: number; passed?: boolean}[]>([
    ...initPoinsA,
  ]);

  const soDiemDaDiQua = useRef(0);
  const khoangCachXaNhat2 = useRef(0);

  const khoangCachXaNhat = useMemo(
    () => Math.sqrt(khoangCachXaNhat2.current),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [khoangCachXaNhat2.current],
  );

  const [kcThoaMan] = useState(10);
  const [soNetVe, setSoNetVe] = useState(0);
  const [isTest, setIsTest] = useState(false);

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

      if (
        diemGanNhat.kc2 <= kcThoaMan * kcThoaMan &&
        !points.current[diemGanNhat.index].passed
      ) {
        points.current[diemGanNhat.index] = {
          ...points.current[diemGanNhat.index],
          passed: true,
        };
        soDiemDaDiQua.current += 1;
      }
      if (diemGanNhat.kc2 > khoangCachXaNhat2.current) {
        khoangCachXaNhat2.current = diemGanNhat.kc2;
      }
      // Nếu đang test, vẽ đường nối tới điểm gần nhất
      if (isTest) {
        const color =
          diemGanNhat.kc2 <= kcThoaMan * kcThoaMan ? '#FF00FF' : 'red';
        const newPath = Skia.Path.Make();
        newPath.moveTo(x, y);
        newPath.lineTo(diemGanNhat.x, diemGanNhat.y);
        pathsTest.current.push({path: newPath, color: color});
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isTest],
  );

  // Khi bắt đầu chạm — tạo stroke mới
  const onDrawingStart = useCallback(
    (x: number, y: number) => {
      currentStroke.current = Skia.Path.Make();
      currentStroke.current.moveTo(x, y);
      currentStroke.current.lineTo(x + 1, y + 1);
      setSoNetVe(pre => pre + 1);
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

  const styleChiSo = (isWarning: boolean) => {
    return {
      color: isWarning ? 'red' : 'black',
    };
  };

  const reset = () => {
    accumulatedPath.current = Skia.Path.Make();
    currentStroke.current = Skia.Path.Make();
    setRenderPath(Skia.Path.Make());
    setSoNetVe(0);
    soDiemDaDiQua.current = 0;
    points.current = [...initPoinsA];
    pathsTest.current = [];
    khoangCachXaNhat2.current = 0;
  };

  return (
    <View style={styles.container}>
      <View style={styles.chiSo}>
        <Text>Khoảng cách thỏa mãn: {kcThoaMan}</Text>
        <Text style={styleChiSo(soNetVe > 2)}>Số nét vẽ: {soNetVe}</Text>
        <Text>
          Đã đi qua:{' '}
          {((soDiemDaDiQua.current / initPoinsA.length) * 100).toFixed(2)} %
        </Text>
        <Text style={styleChiSo(khoangCachXaNhat > kcThoaMan)}>
          Khoảng cách xa nhất: {khoangCachXaNhat.toFixed(2)}
        </Text>
      </View>

      {/* Canvas chỉ render, không nhận gesture trực tiếp */}
      <Canvas style={styles.container}>
        <TextSkia
          text={'Á'}
          font={font}
          x={-4}
          y={200}
          color={'red'}
          opacity={0.4}
        />
        {/* Path SVG mẫu */}
        <Path
          key={'0987'}
          path={Skia.Path.MakeFromSVGString(pathA)}
          color={'black'}
          style={'stroke'}
          strokeWidth={2}
        />
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

      <Button
        title={!isTest ? 'Bật test' : 'Đóng test'}
        onPress={() => {
          setIsTest(!isTest);
          reset();
        }}
      />
      <View style={styles.space} />
      <Button title="reset" onPress={reset} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  chiSo: {
    padding: 8,
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
  },
  space: {
    height: 20,
  },
});
