import * as React from 'react';
import Svg, {G, Path, Rect, SvgProps} from 'react-native-svg';

function ICCheckbox({
  width,
  height,
  color,
  ...props
}: {
  width: number;
  height: number;
} & SvgProps) {
  return (
    <Svg
      fill={color}
      height={height}
      width={width}
      viewBox="0 0 512 512"
      {...props}>
      <Path d="M256 0C114.615 0 0 114.615 0 256s114.615 256 256 256 256-114.615 256-256S397.385 0 256 0zm-36.571 367.932L108.606 257.108l38.789-38.789 72.033 72.035L355.463 154.32l38.789 38.789-174.823 174.823z" />
    </Svg>
  );
}

export default ICCheckbox;
