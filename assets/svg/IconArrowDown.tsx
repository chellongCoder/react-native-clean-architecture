import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function IconArrowDown({
  width = 19,
  height = 19,
  color = '#258F78',
}: {
  width?: number;
  height?: number;
  color?: string;
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 19 19" fill="none">
      <Path
        d="M13.177 6.868h-.92c-.2 0-.39.096-.507.259l-2.062 2.85-2.062-2.85a.625.625 0 00-.508-.259h-.92a.157.157 0 00-.127.25l3.49 4.821c.062.086.19.086.252 0l3.49-4.822a.156.156 0 00-.126-.249z"
        fill={color}
      />
      <Path
        d="M9.688.654a8.782 8.782 0 100 17.565 8.782 8.782 0 000-17.565zm0 16.074a7.293 7.293 0 010-14.584 7.293 7.293 0 010 14.584z"
        fill={color}
      />
    </Svg>
  );
}

export default IconArrowDown;
