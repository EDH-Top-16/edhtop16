
import { createContext } from "react";

const ThemeContext = createContext({ theme: false, toggleTheme: () => {}, setTheme: () => {} });

export const ThemeContextProvider = ThemeContext.Provider
export const ThemeContextConsumer = ThemeContext.Consumer

export default  ThemeContext;