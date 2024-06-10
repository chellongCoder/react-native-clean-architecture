import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function IconLogout({
  width = 15,
  height = 15,
  color = '#FBF8CC',
}: {
  width?: number;
  height?: number;
  color?: string;
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 15 15" fill="none">
      <Path
        d="M.416 2.707h1.032a.15.15 0 00.147-.15V1.35h12.08v12.3H1.592v-1.207a.15.15 0 00-.147-.15H.414a.15.15 0 00-.148.15V14.4c0 .332.263.6.589.6H14.41a.593.593 0 00.589-.6V.6c0-.332-.263-.6-.589-.6H.857a.593.593 0 00-.589.6v1.957c0 .084.067.15.148.15zM.059 7.623L2.78 9.811c.102.082.25.007.25-.123V8.203h6.022c.085 0 .154-.07.154-.156V6.953a.155.155 0 00-.154-.156H3.03V5.313c0-.131-.15-.206-.25-.124L.06 7.377A.156.156 0 000 7.5a.159.159 0 00.059.123z"
        fill={color}
      />
    </Svg>
  );
}

export default IconLogout;
