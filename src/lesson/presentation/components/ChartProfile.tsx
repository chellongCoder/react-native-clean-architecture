import {StyleSheet, View} from 'react-native';
import React, {useCallback, useMemo, useState} from 'react';
import {
  Canvas,
  Circle,
  Path,
  Skia,
  Text,
  matchFont,
  useFonts,
} from '@shopify/react-native-skia';

type Props = {
  valuesAxitX: string[];
  valueY: number[];
  rowCount?: number;
};

const ChartProfile = ({rowCount = 6, ...props}: Props) => {
  const paddingH = 16;
  const paddingV = 32;
  const fontSize = 10;
  const hBoxTextAxisX = fontSize + 8;
  const hCanvas = 300;
  const hChart = hCanvas - paddingV * 2 - hBoxTextAxisX;
  const [wCanvas, setWCanvas] = useState(0);
  const xStartChart = 50;
  const yEndChart = hChart + paddingV;
  const wChart = wCanvas - paddingH - xStartChart;

  const fontMgr = useFonts({
    eina01bold: [require('assets/fonts/eina-01-bold.ttf')],
  });
  const font = fontMgr
    ? matchFont(
        {
          fontFamily: 'eina01bold',
          fontSize: fontSize,
        },
        fontMgr,
      )
    : null;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const hRow = useMemo(() => hChart / (rowCount - 1), [rowCount]);

  const maxY = useMemo(() => Math.max(...props.valueY), [props.valueY]);

  const hValuePerRow = useMemo(
    () => roundUpToNearestPowerOfTen(maxY / (rowCount - 1)),
    [maxY, rowCount],
  );

  const createLine = useCallback(
    (h: number) => {
      const path = Skia.Path.Make();
      path.moveTo(xStartChart, h);
      path.lineTo(wCanvas - paddingH, h);
      return path;
    },
    [wCanvas],
  );

  const xPointByIndex = useCallback(
    (i: number) => {
      const ph = 12;
      return (
        xStartChart +
        ph +
        i * ((wChart - ph * 2) / Math.max(props.valuesAxitX.length - 1, 5))
      );
    },
    [props.valuesAxitX.length, wChart],
  );

  const yPointByIndex = useCallback(
    (i: number) => yEndChart - (props.valueY[i] * hRow) / hValuePerRow,
    [yEndChart, props.valueY, hRow, hValuePerRow],
  );

  return (
    <View style={[styles.canvas]}>
      <Canvas
        style={[styles.canvas, {height: hCanvas}]}
        onLayout={e => setWCanvas(e.nativeEvent.layout.width)}>
        {Array.from({length: rowCount}, (_, i) => (
          <Path
            key={i}
            path={createLine(yEndChart - i * hRow)}
            strokeWidth={2}
            color={'#e5eac1'}
            style={'stroke'}
          />
        ))}
        {props.valuesAxitX.map(
          (e, i) =>
            !!props.valueY[i] && (
              <Circle
                key={i}
                cx={xPointByIndex(i)}
                cy={yPointByIndex(i)}
                r={5}
                color={'#F2B559'}
              />
            ),
        )}
        {props.valuesAxitX.map((e, i) => (
          <Text
            key={i}
            font={font}
            text={e}
            color={'#258F78'}
            x={xPointByIndex(i) - fontSize / 2}
            y={yEndChart + hBoxTextAxisX}
          />
        ))}
        {Array.from({length: rowCount}, (_, i) => (
          <Text
            key={i}
            font={font}
            text={`${i * hValuePerRow}`}
            color={'#258F78'}
            x={paddingH}
            y={yEndChart - i * hRow + fontSize / 3}
          />
        ))}
      </Canvas>
    </View>
  );
};

export default ChartProfile;

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  canvas: {
    backgroundColor: '#FBF8CC',
    borderRadius: 30,
    overflow: 'hidden',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const roundUpToNearestPowerOfTen = (number: number) => {
  // Nếu số là 0, trả về 0
  if (number === 0) {
    return 0;
  }

  // Tính số chữ số của số
  const numDigits = Math.floor(Math.log10(Math.abs(number))) + 1;

  // Tìm giá trị làm tròn (10, 100, 1000, v.v.)
  const roundingFactor = Math.pow(10, numDigits - 1);

  // Làm tròn số lên đến bội số gần nhất của roundingFactor
  return Math.ceil(number / roundingFactor) * roundingFactor;
};
