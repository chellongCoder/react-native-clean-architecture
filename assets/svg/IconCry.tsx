import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function IconCry(props) {
  return (
    <Svg
      width={23}
      height={23}
      viewBox="0 0 23 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M11.565 22.138h.008c5.834 0 10.565-4.73 10.565-10.565v-.008C22.138 5.73 17.408 1 11.573 1h-.008C5.73 1 1 5.73 1 11.565v.008c0 5.835 4.73 10.565 10.565 10.565z"
        stroke="#1C6349"
        strokeWidth={1.41}
        strokeMiterlimit={10}
      />
      <Path
        d="M6.514 8.352a.919.919 0 111.838 0 .919.919 0 01-1.838 0zM16.623 8.352a.919.919 0 111.838 0 .919.919 0 01-1.838 0z"
        fill="#1C6349"
      />
      <Path
        d="M7.992 13.793l-1.477-2.684-1.477 2.684a1.933 1.933 0 00-.361 1.054c0 .471.193.923.538 1.256.345.333.812.52 1.3.52.487 0 .955-.187 1.3-.52.344-.333.538-.785.538-1.256a1.895 1.895 0 00-.361-1.054z"
        fill="#58B4BF"
      />
      <Path
        d="M9.271 12.767a6.598 6.598 0 013.251-.736c1.149.032 2.259.352 3.183.916"
        stroke="#1C6349"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default IconCry;
