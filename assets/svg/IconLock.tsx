import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function IconLock({
  width = 29,
  height = 34,
  color = '#FBF8CC',
}: {
  width?: number;
  height?: number;
  color?: string;
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 29 34" fill="none">
      <Path
        d="M27.31 15.144h-2.738V6.126A5.153 5.153 0 0019.419.972H9.434A5.153 5.153 0 004.28 6.126v9.018H1.542c-.712 0-1.288.576-1.288 1.289v15.46c0 .713.576 1.288 1.288 1.288H27.31c.712 0 1.288-.575 1.288-1.288v-15.46c0-.713-.576-1.289-1.288-1.289zM7.179 6.126A2.256 2.256 0 019.434 3.87h9.985a2.256 2.256 0 012.254 2.255v9.018H7.18V6.126zm18.52 24.157H3.153v-12.24h22.546v12.24zm-12.4-5.597v2.134c0 .177.145.322.322.322h1.61a.323.323 0 00.322-.322v-2.134a1.932 1.932 0 10-2.254 0z"
        fill={color}
      />
    </Svg>
  );
}

export default IconLock;
