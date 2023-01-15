import { createContext } from "react";

type User = {
  user: any;
  username: string | null;
  loading: boolean;
};
export const UserContext = createContext<User>({
  user: null,
  username: null,
  loading: false,
});

export type Theme = "light" | "dark";
type ThemeContext = { theme: Theme; toggleTheme: () => void };
export const ThemeContext = createContext<ThemeContext>({} as ThemeContext);
