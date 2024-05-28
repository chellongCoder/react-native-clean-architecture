import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function IconStar(props: any) {
  return (
    <Svg
      width={18}
      height={17}
      viewBox="0 0 18 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M16.958 6.23l-4.97-.723-2.222-4.504a.629.629 0 00-1.124 0L6.42 5.507l-4.97.722a.625.625 0 00-.346 1.069L4.7 10.804l-.85 4.95a.626.626 0 00.908.66l4.446-2.337 4.446 2.337a.625.625 0 00.908-.66l-.85-4.95 3.596-3.506a.625.625 0 00.182-.358.624.624 0 00-.528-.71z"
        fill="#F9E42D"
      />
    </Svg>
  );
}

export default IconStar;
