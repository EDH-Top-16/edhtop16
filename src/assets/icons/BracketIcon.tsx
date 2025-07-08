import React from 'react';

function BracketIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 29 29"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0.75 0.75V3.5H7.625V9H0.75V11.75H7.625C9.15125 11.75 10.375 10.5263 10.375 9V7.625H17.25V21.375H10.375V20C10.375 18.4737 9.15125 17.25 7.625 17.25H0.75V20H7.625V25.5H0.75V28.25H7.625C9.15125 28.25 10.375 27.0263 10.375 25.5V24.125H17.25C18.7763 24.125 20 22.9013 20 21.375V15.875H28.25V13.125H20V7.625C20 6.09875 18.7763 4.875 17.25 4.875H10.375V3.5C10.375 1.97375 9.15125 0.75 7.625 0.75H0.75Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default BracketIcon;
