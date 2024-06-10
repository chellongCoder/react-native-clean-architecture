import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function IconArrowFill({
  width = 10,
  height = 17,
  color = '#1C6349',
  type = 'left',
}: {
  width?: number;
  height?: number;
  color?: string;
  type?: 'left' | 'right';
}) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 10 17"
      fill="none"
      style={{
        transform: [
          {
            rotateY: type === 'left' ? '0deg' : '180deg',
          },
        ],
      }}>
      <Path
        d="M9.018.83L.565 8.12a.555.555 0 000 .822l8.453 7.29c.316.27.777.027.777-.41V1.24c0-.438-.461-.682-.777-.411z"
        fill={color}
      />
    </Svg>
  );
}

export default IconArrowFill;
