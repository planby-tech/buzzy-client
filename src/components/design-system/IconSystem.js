import React from 'react';
import Svg, {Path} from 'react-native-svg';

export const CheckIcon = () => {
  return (
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 12L11 14L15 10"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export const ChevronLeftIcon = () => {
  return (
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M15 6L9 12L15 18"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export const LeafIcon = () => {
  return (
    <Svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M5 21C5.5 16.5 7.5 13 12 11"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.99999 18C15.218 18 19.5 14.712 20 6V4H15.986C6.98599 4 3.99999 8 3.98599 13C3.98599 14 3.98599 16 5.98599 18H8.98599H8.99999Z"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export const FlowerIcon = ({size, color}) => {
  return (
    <Svg
      width={`${size}`}
      height={`${size}`}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
        stroke={`${color}`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 2C12.7956 2 13.5587 2.31607 14.1213 2.87868C14.6839 3.44129 15 4.20435 15 5C15 5.562 14.741 6.442 14.224 7.64L13.5 9L15.26 7.107C15.759 6.507 16.182 6.105 16.53 5.902C16.869 5.70519 17.2435 5.57747 17.6321 5.52621C18.0207 5.47495 18.4156 5.50116 18.794 5.60334C19.1724 5.70552 19.5268 5.88163 19.8368 6.12152C20.1468 6.36141 20.4062 6.66032 20.6 7.001C20.9955 7.68975 21.1029 8.50687 20.8987 9.27442C20.6946 10.042 20.1954 10.6978 19.51 11.099C19.136 11.316 18.52 11.495 17.664 11.634L15 12L17.4 12.326C18.395 12.471 19.098 12.663 19.51 12.902C20.1954 13.3032 20.6946 13.959 20.8987 14.7266C21.1029 15.4941 20.9955 16.3113 20.6 17C20.4061 17.3406 20.1466 17.6394 19.8366 17.8792C19.5266 18.119 19.1722 18.295 18.7938 18.3971C18.4154 18.4992 18.0205 18.5253 17.632 18.474C17.2434 18.4226 16.8689 18.2949 16.53 18.098C16.182 17.896 15.759 17.494 15.26 16.893L13.5 15L14.224 16.36C14.74 17.559 15 18.439 15 19C15 19.7956 14.6839 20.5587 14.1213 21.1213C13.5587 21.6839 12.7956 22 12 22C11.2044 22 10.4413 21.6839 9.87868 21.1213C9.31607 20.5587 9 19.7956 9 19C9 18.438 9.259 17.558 9.776 16.36L10.5 15L8.74 16.893C8.241 17.494 7.818 17.896 7.47 18.098C7.1311 18.2949 6.75656 18.4226 6.36802 18.474C5.97947 18.5253 5.5846 18.4992 5.2062 18.3971C4.82781 18.295 4.47338 18.119 4.16337 17.8792C3.85336 17.6394 3.59391 17.3406 3.4 17C3.00448 16.3113 2.8971 15.4941 3.10125 14.7266C3.30541 13.959 3.80456 13.3032 4.49 12.902C4.864 12.684 5.48 12.506 6.336 12.366L9 12L6.6 11.675C5.605 11.53 4.902 11.338 4.49 11.099C3.80429 10.6978 3.30495 10.0418 3.10078 9.27399C2.89661 8.5062 3.00416 7.68884 3.4 7C3.59383 6.65932 3.85321 6.36041 4.16318 6.12052C4.47316 5.88063 4.82757 5.70452 5.20598 5.60234C5.58438 5.50016 5.97927 5.47395 6.36786 5.52521C6.75645 5.57647 7.13104 5.70419 7.47 5.901C7.818 6.104 8.241 6.505 8.74 7.106L10.5 9C9.5 6.708 9 5.375 9 5C9 4.20435 9.31607 3.44129 9.87868 2.87868C10.4413 2.31607 11.2044 2 12 2V2Z"
        stroke={`${color}`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export const CalendarIcon = ({size, color}) => {
  return (
    <Svg
      width={`${size}`}
      height={`${size}`}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M18 5H6C4.89543 5 4 5.89543 4 7V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V7C20 5.89543 19.1046 5 18 5Z"
        stroke={`${color}`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 15V18M16 3V7V3ZM8 3V7V3ZM4 11H20H4ZM11 15H12H11Z"
        stroke={`${color}`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export const MapIcon = ({size, color}) => {
  return (
    <Svg
      width={`${size}`}
      height={`${size}`}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M15 7V20M3 7L9 4L15 7L21 4V17L15 20L9 17L3 20V7ZM9 4V17V4Z"
        stroke={`${color}`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export const MessageIcon = ({size, color}) => {
  return (
    <Svg
      width={`${size}`}
      height={`${size}`}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M16 12V12.01M3 20L4.3 16.1C3.17644 14.4383 2.76999 12.4704 3.15622 10.5623C3.54244 8.65421 4.69506 6.93569 6.39977 5.72629C8.10447 4.51689 10.2453 3.89892 12.4241 3.98726C14.6029 4.0756 16.6715 4.86425 18.2453 6.20658C19.819 7.5489 20.7909 9.35356 20.9801 11.285C21.1693 13.2164 20.563 15.1432 19.2739 16.7071C17.9848 18.271 16.1007 19.3656 13.9718 19.7874C11.8429 20.2091 9.6142 19.9293 7.7 19L3 20ZM12 12V12.01V12ZM8 12V12.01V12Z"
        stroke={`${color}`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export const XIcon = ({size, color}) => {
  return (
    <Svg
      width={`${size}`}
      height={`${size}`}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M6 6L18 18M18 6L6 18L18 6Z"
        stroke={`${color}`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export const PersonIcon = ({size, color = 'white'}) => {
  return (
    <Svg
      width={`${size}`}
      height={`${size}`}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M8.03498 7.66683C9.50774 7.66683 10.7017 6.47292 10.7017 5.00016C10.7017 3.5274 9.50774 2.3335 8.03498 2.3335C6.56222 2.3335 5.36832 3.5274 5.36832 5.00016C5.36832 6.47292 6.56222 7.66683 8.03498 7.66683Z"
        stroke={color}
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3.03497 13.6665V12.3332C3.03497 11.6259 3.38616 10.9477 4.01128 10.4476C4.6364 9.94746 5.48425 9.6665 6.36831 9.6665H9.70164C10.5857 9.6665 11.4335 9.94746 12.0587 10.4476C12.6838 10.9477 13.035 11.6259 13.035 12.3332V13.6665"
        stroke={color}
        strokeLidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export const ClockIcon = ({size, color = 'white'}) => {
  return (
    <Svg
      width={`${size}`}
      height={`${size}`}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M8.03497 14C11.3487 14 14.035 11.3137 14.035 8C14.035 4.68629 11.3487 2 8.03497 2C4.72126 2 2.03497 4.68629 2.03497 8C2.03497 11.3137 4.72126 14 8.03497 14Z"
        stroke={color}
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.03497 4.6665V7.99984L10.035 9.99984"
        stroke={color}
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export const MenuDotsIcon = ({size, color = 'white'}) => {
  return (
    <Svg
      width={`${size}`}
      height={`${size}`}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.895 4.5C11.9745 4.5 11.2283 5.24619 11.2283 6.16667C11.2283 7.08714 11.9745 7.83333 12.895 7.83333C13.8155 7.83333 14.5617 7.08714 14.5617 6.16667C14.5617 5.24619 13.8155 4.5 12.895 4.5ZM11.2283 12C11.2283 11.0795 11.9745 10.3333 12.895 10.3333C13.8155 10.3333 14.5617 11.0795 14.5617 12C14.5617 12.9205 13.8155 13.6667 12.895 13.6667C11.9745 13.6667 11.2283 12.9205 11.2283 12ZM11.2283 17.8333C11.2283 16.9129 11.9745 16.1667 12.895 16.1667C13.8155 16.1667 14.5617 16.9129 14.5617 17.8333C14.5617 18.7538 13.8155 19.5 12.895 19.5C11.9745 19.5 11.2283 18.7538 11.2283 17.8333Z"
        fill={color}
      />
    </Svg>
  );
};
