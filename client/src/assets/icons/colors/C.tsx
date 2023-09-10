import React from "react";

function ColorlessIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" {...props}>
      <circle cx="300" cy="300" r="300" fill="#ccc2c0" />
      <path
        d="M300 60A500 500 0 0 0 540 300 500 500 0 0 0 300 540 500 500 0 0 0 60 300 500 500 0 0 0 300 60m0 90A300 300 0 0 1 150 300 300 300 0 0 1 300 450 300 300 0 0 1 450 300 300 300 0 0 1 300 150"
        fill="#130c0e"
      />
    </svg>
  );
}

export default ColorlessIcon;