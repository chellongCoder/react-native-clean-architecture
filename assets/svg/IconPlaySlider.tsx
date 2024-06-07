import React from 'react';
import Svg, {Path} from 'react-native-svg';

const IconPlaySlider = ({
  width,
  height,
  color,
}: {
  width?: number;
  height?: number;
  color?: string;
}) => (
  <Svg width={width} height={height} viewBox="0 0 10 16" fill="none">
    <Path
      d="M9.17326 0.241955L0.719569 7.53237C0.477591 7.74105 0.477591 8.14287 0.719569 8.35376L9.17326 15.6442C9.48849 15.915 9.95025 15.6708 9.95025 15.2335V0.652652C9.95025 0.215315 9.48849 -0.0288825 9.17326 0.241955Z"
      fill={color ?? '#1C6349'}
    />
  </Svg>
);

export default IconPlaySlider;
