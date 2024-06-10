import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function IconEdit({
  width = 16,
  height = 16,
  color = '#1C6349',
}: {
  width?: number;
  height?: number;
  color?: string;
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 16" fill="none">
      <Path
        d="M3.32 12.132a.731.731 0 00.109-.01l3.033-.531a.177.177 0 00.096-.05l7.645-7.646a.18.18 0 000-.254l-2.998-3a.179.179 0 00-.128-.051.178.178 0 00-.128.052L3.304 8.287a.183.183 0 00-.05.095l-.532 3.034a.604.604 0 00.17.537.611.611 0 00.428.179zm1.216-3.145l6.541-6.54L12.4 3.77l-6.541 6.54-1.603.283.28-1.605zm10.007 4.66H1.27a.576.576 0 00-.577.577v.65c0 .079.065.143.144.143h14.14c.079 0 .143-.064.143-.144v-.649a.576.576 0 00-.577-.577z"
        fill={color}
      />
    </Svg>
  );
}

export default IconEdit;
