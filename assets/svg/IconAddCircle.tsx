import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function IconAddCircle({
  width = 33,
  height = 33,
  color = '#FBF8CC',
}: {
  width?: number;
  height?: number;
  color?: string;
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 33 33" fill="none">
      <Path
        d="M22.876 15.755h-5.428v-5.429a.287.287 0 00-.286-.286h-1.714a.287.287 0 00-.286.286v5.429H9.733a.287.287 0 00-.285.285v1.715c0 .157.128.285.285.285h5.429v5.429c0 .157.128.286.285.286h1.715a.287.287 0 00.286-.286V18.04h5.428a.287.287 0 00.286-.285V16.04a.287.287 0 00-.286-.285z"
        fill={color}
      />
      <Path
        d="M16.305.897c-8.836 0-16 7.165-16 16 0 8.836 7.164 16 16 16 8.835 0 16-7.164 16-16 0-8.835-7.165-16-16-16zm0 29.286c-7.336 0-13.286-5.95-13.286-13.285 0-7.336 5.95-13.286 13.286-13.286 7.335 0 13.285 5.95 13.285 13.286 0 7.335-5.95 13.285-13.285 13.285z"
        fill={color}
      />
    </Svg>
  );
}

export default IconAddCircle;
