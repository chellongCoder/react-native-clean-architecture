import * as React from 'react';
import {Dimensions} from 'react-native';
import Svg, {Path} from 'react-native-svg';

const widthScreen = Dimensions.get('screen').width;

function IconBookBg({
  width = widthScreen,
  height = 500,
  color = '#DDF598',
}: {
  width?: number;
  height?: number;
  color?: string;
}) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${430} ${(height * 430) / width}`}
      fill="none">
      <Path
        d={`M224.013 6.082L215 14.148l-9.013-8.066c-1.801-1.616-3.941-2.897-6.296-3.772a21.372 21.372 0 00-7.43-1.324H48.737c-12.925 0-25.322 4.595-34.462 12.775C5.135 21.94 0 33.034 0 44.6v${
          (height * 430) / width - 44.601
        }h430V44.601c0-5.73-1.262-11.404-3.713-16.698-2.452-5.294-6.045-10.103-10.575-14.154-4.529-4.05-9.906-7.262-15.824-9.452-5.917-2.19-12.259-3.315-18.662-3.31H237.751a21.37 21.37 0 00-7.436 1.321 19.676 19.676 0 00-6.302 3.774z`}
        fill={color}
      />
    </Svg>
  );
}

export default IconBookBg;
