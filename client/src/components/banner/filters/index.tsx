import Colors from "./colors";
import Standing from "./standing";

type TComponentMap = {
  [key: string]: React.FC;
};

export const componentMap: TComponentMap = {
  colors: Colors,
  standing: Standing,
};
