import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function IconBlock({
  width = 33,
  height = 33,
  color = '#FBF8CC',
}: {
  width?: number;
  height?: number;
  color?: string;
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 33 33" fill="none">
      <Path
        d="M16.26.517c-8.836 0-16 7.164-16 16s7.164 16 16 16c8.835 0 16-7.164 16-16s-7.165-16-16-16zm0 29.286c-7.336 0-13.286-5.95-13.286-13.286 0-3.178 1.118-6.1 2.982-8.386l18.69 18.69a13.226 13.226 0 01-8.387 2.982zm10.303-4.9L7.873 6.213a13.226 13.226 0 018.386-2.982c7.336 0 13.286 5.95 13.286 13.286 0 3.179-1.118 6.1-2.982 8.386z"
        fill={color}
      />
    </Svg>
  );
}

export default IconBlock;
