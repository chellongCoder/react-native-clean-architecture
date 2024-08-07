import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function IconTickCircle({
  width = 20,
  height = 21,
  color = '#168F29',
  isTick = true,
}: {
  width?: number;
  height?: number;
  color?: string;
  isTick?: boolean;
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 21" fill="none">
      {isTick && (
        <Path
          d="M14.343 7.161h-1.01a.686.686 0 00-.557.287L9.39 12.142l-1.533-2.128a.689.689 0 00-.558-.286H6.29c-.14 0-.222.16-.14.273l2.683 3.72a.684.684 0 001.113 0l4.535-6.286a.172.172 0 00-.138-.274z"
          fill={color}
        />
      )}
      <Path
        d="M10.316.938C4.99.938.67 5.258.67 10.585s4.32 9.646 9.646 9.646c5.327 0 9.647-4.32 9.647-9.646 0-5.327-4.32-9.647-9.647-9.647zm0 17.657a8.011 8.011 0 01-8.01-8.01 8.011 8.011 0 018.01-8.01 8.011 8.011 0 018.01 8.01 8.011 8.011 0 01-8.01 8.01z"
        fill={color}
      />
    </Svg>
  );
}

export default IconTickCircle;
