import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function IconTheme({
  width = 46,
  height = 37,
  color = '#FBF8CC',
}: {
  width?: number;
  height?: number;
  color?: string;
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 46 37" fill="none">
      <Path
        d="M43.551.787H1.645A1.61 1.61 0 00.032 2.4v32.236c0 .892.72 1.612 1.612 1.612h41.907a1.61 1.61 0 001.612-1.612V2.4A1.61 1.61 0 0043.552.787zm-2.014 31.834H3.659v-2.01l6.976-8.276 7.56 8.966 11.762-13.942 11.58 13.73v1.532zm0-6.538L30.264 12.715a.4.4 0 00-.614 0l-11.454 13.58-7.254-8.599a.4.4 0 00-.614 0l-6.67 7.908V4.414h37.879v21.669zM12.12 15.697a4.434 4.434 0 001.696-8.528 4.433 4.433 0 10-1.696 8.528zm0-5.843c.78 0 1.41.63 1.41 1.41 0 .78-.63 1.41-1.41 1.41-.78 0-1.41-.63-1.41-1.41 0-.78.63-1.41 1.41-1.41z"
        fill={color}
      />
    </Svg>
  );
}

export default IconTheme;
