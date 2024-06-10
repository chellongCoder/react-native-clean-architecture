import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function IconSoundFill({
  width = 12,
  height = 16,
  color = '#F2B559',
}: {
  width?: number;
  height?: number;
  color?: string;
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 12 16" fill="none">
      <Path
        d="M11.147-.004a.583.583 0 00-.329.1L4.112 4.479H1.009a.304.304 0 00-.303.303v5.448c0 .167.137.303.303.303h3.103l6.706 4.383a.603.603 0 00.937-.507V.603a.607.607 0 00-.608-.607z"
        fill={color}
      />
    </Svg>
  );
}

export default IconSoundFill;
