import {
  BlackIcon,
  BlueIcon,
  ColorlessIcon,
  GreenIcon,
  RedIcon,
  WhiteIcon,
} from "../assets/icons";

type Color = {
  [key: string]: JSX.Element;
};

export const allColors: Color = {
  white: <WhiteIcon />,
  blue: <BlueIcon />,
  black: <BlackIcon />,
  red: <RedIcon />,
  green: <GreenIcon />,
  colorless: <ColorlessIcon />,
};
