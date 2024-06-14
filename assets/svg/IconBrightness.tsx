import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function IconBrightness({
  width = 32,
  height = 45,
  color = '#FBF8CC',
}: {
  width?: number;
  height?: number;
  color?: string;
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 32 45" fill="none">
      <Path
        d="M21.805 40.668H10.219a.387.387 0 00-.386.386V42.6c0 .855.69 1.545 1.545 1.545h9.268c.855 0 1.545-.69 1.545-1.545v-1.545a.387.387 0 00-.386-.386zM16.012.891C7.27.89.178 7.982.178 16.724c0 5.86 3.186 10.978 7.917 13.715v5.595c0 .854.69 1.545 1.545 1.545h12.744c.854 0 1.545-.69 1.545-1.545v-5.595c4.73-2.737 7.917-7.854 7.917-13.715 0-8.742-7.092-15.833-15.834-15.833zm6.174 26.54l-1.733 1.005v5.667h-8.882v-5.667L9.838 27.43a12.347 12.347 0 01-6.184-10.707c0-6.826 5.532-12.358 12.358-12.358 6.826 0 12.358 5.532 12.358 12.358 0 4.466-2.385 8.511-6.184 10.707z"
        fill={color}
      />
    </Svg>
  );
}

export default IconBrightness;
