import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function IconCloseCircle(props: any) {
  return (
    <Svg
      width={26}
      height={26}
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M13 0C5.82098 0 0 5.82098 0 13C0 20.179 5.82098 26 13 26C20.179 26 26 20.179 26 13C26 5.82098 20.179 0 13 0ZM17.7996 17.9388L15.8844 17.9301L13 14.4915L10.1185 17.9272L8.20045 17.9359C8.07277 17.9359 7.9683 17.8344 7.9683 17.7038C7.9683 17.6487 7.98862 17.5964 8.02344 17.5529L11.7987 13.0551L8.02344 8.56027C7.98837 8.51774 7.96892 8.46449 7.9683 8.40937C7.9683 8.2817 8.07277 8.17723 8.20045 8.17723L10.1185 8.18594L13 11.6246L15.8815 8.18884L17.7967 8.18013C17.9243 8.18013 18.0288 8.2817 18.0288 8.41228C18.0288 8.46741 18.0085 8.51964 17.9737 8.56317L14.2042 13.058L17.9766 17.5558C18.0114 17.5993 18.0317 17.6516 18.0317 17.7067C18.0317 17.8344 17.9272 17.9388 17.7996 17.9388Z"
        fill="#F28759"
      />
    </Svg>
  );
}

export default IconCloseCircle;
