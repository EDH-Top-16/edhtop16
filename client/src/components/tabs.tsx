import { PropsWithChildren } from "react";
import { Tab, TabList, TabListProps, TabProps } from "react-aria-components";
import cn from "classnames";

function Edhtop16TabList({
  children,
  className,
  ...props
}: PropsWithChildren<TabListProps<object>>) {
  return (
    <TabList
      {...props}
      className={cn(
        "space-y flex justify-center space-x-6 border-b border-white/40 py-6",
        className,
      )}
    >
      {children}
    </TabList>
  );
}

function Edhtop16Tab({
  children,
  className,
  ...props
}: PropsWithChildren<TabProps>) {
  return (
    <Tab
      {...props}
      className={cn(
        "cursor-pointer border-white text-lg text-white/60 outline-none transition-colors selected:border-b-2 selected:text-white disabled:border-white/60 disabled:text-white/60",
        className,
      )}
    >
      {children}
    </Tab>
  );
}

export { Edhtop16TabList as TabList, Edhtop16Tab as Tab };
