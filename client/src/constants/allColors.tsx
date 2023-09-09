import {
  WhiteIcon,
  BlueIcon,
  BlackIcon,
  RedIcon,
  GreenIcon,
  ColorlessIcon,
} from "@/assets/icons";

type Color = {
  [key: string]: JSX.Element;
};

const allColors: Color = {
  white: <WhiteIcon />,
  blue: <BlueIcon />,
  black: <BlackIcon />,
  red: <RedIcon />,
  green: <GreenIcon />,
  colorless: <ColorlessIcon />,
};

export default allColors;
