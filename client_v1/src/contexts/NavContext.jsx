import { createContext } from "react";

const NavContext = createContext({ open: false, toggle: () => {}, setOpen: () => {} });

export const NavContextProvider = NavContext.Provider
export const NavContextConsumer = NavContext.Consumer

export default  NavContext;