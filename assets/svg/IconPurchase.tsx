import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function IconPurchase({
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
        d="M27.481 9.025h-5.475V8.38a7.41 7.41 0 00-14.817 0v.645H1.714C1 9.025.425 9.6.425 10.313v21.58c0 .713.576 1.288 1.289 1.288H27.48c.713 0 1.288-.575 1.288-1.288v-21.58c0-.713-.575-1.288-1.288-1.288zM10.088 8.38a4.507 4.507 0 014.51-4.509 4.507 4.507 0 014.509 4.51v.644h-9.019V8.38zm15.783 21.903H3.324v-18.36H7.19v3.543c0 .178.145.323.322.323h2.255a.323.323 0 00.322-.323v-3.543h9.019v3.543c0 .178.145.323.322.323h2.255a.323.323 0 00.322-.323v-3.543h3.865v18.36z"
        fill={color}
      />
    </Svg>
  );
}

export default IconPurchase;
