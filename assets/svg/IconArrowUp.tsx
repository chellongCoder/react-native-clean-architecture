import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function IconArrowUp({
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
        d="M6.175 12.004h.92c.2 0 .39-.096.507-.259l2.062-2.85 2.062 2.85a.625.625 0 00.508.259h.92a.157.157 0 00.127-.249L9.79 6.933a.156.156 0 00-.252 0l-3.49 4.822a.156.156 0 00.126.249z"
        fill={color}
      />
      <Path
        d="M9.664 18.218A8.782 8.782 0 109.663.653a8.782 8.782 0 00.001 17.565zm0-16.074a7.293 7.293 0 11-7.292 7.292 7.293 7.293 0 017.292-7.292z"
        fill={color}
      />
    </Svg>
  );
}

export default IconArrowUp;
