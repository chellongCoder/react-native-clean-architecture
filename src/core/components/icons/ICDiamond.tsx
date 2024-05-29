import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

const ICDiamond: ({
  width,
  height,
  ...props
}: {
  width?: number;
  height?: number;
} & SvgProps) => React.ReactNode = ({width, height, ...props}) => {
  return (
    <Svg
      width={width ?? '25'}
      height={height ?? '25'}
      viewBox={`0 0 ${width ?? 25} ${height ?? 25}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M14.2439 15.4377L18.2138 10.9739H16.512L14.2439 15.4377ZM16.6597 10.0077H18.3373L15.8652 6.9182L16.6597 10.0077ZM9.28633 10.9739L12.357 17.0186L15.4277 10.9739H9.28633ZM12.357 0.363525C5.71642 0.363525 0.332031 5.74792 0.332031 12.3885C0.332031 19.0291 5.71642 24.4135 12.357 24.4135C18.9976 24.4135 24.382 19.0291 24.382 12.3885C24.382 5.74792 18.9976 0.363525 12.357 0.363525ZM20.0524 10.5686L12.459 19.1069C12.4321 19.1364 12.3946 19.1525 12.357 19.1525C12.3194 19.1525 12.2818 19.1364 12.255 19.1069L4.66155 10.5686C4.64 10.5444 4.62764 10.5134 4.62666 10.481C4.62568 10.4486 4.63613 10.4169 4.65619 10.3915L8.42741 5.67813C8.45425 5.64592 8.49183 5.62713 8.53477 5.62713H16.1738C16.2168 5.62713 16.2544 5.64592 16.2812 5.67813L20.0524 10.3915C20.0745 10.4157 20.0867 10.4473 20.0867 10.4801C20.0867 10.5128 20.0745 10.5444 20.0524 10.5686ZM14.9391 10.0077L12.357 7.39867L9.77485 10.0077H14.9391ZM9.89563 6.72763L9.2756 9.13799L11.6591 6.72763H9.89563ZM14.8184 6.72763H13.0549L15.4384 9.13799L14.8184 6.72763ZM8.84882 6.9182L6.37672 10.0077H8.05431L8.84882 6.9182ZM6.50019 10.9739L10.47 15.4377L8.20194 10.9739H6.50019Z"
        fill={props.color ?? '#125940'}
      />
    </Svg>
  );
};

export default ICDiamond;
