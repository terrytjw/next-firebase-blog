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
