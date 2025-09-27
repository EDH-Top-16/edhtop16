export type Manifest = Record<
  string,
  {
    file: string;
    css?: string[];
    assets?: string[];
    isEntry?: boolean;
    imports?: string[];
  }
>;
