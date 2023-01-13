import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/context";

// Component's children only shown to logged-in users
export default function AuthCheck({ children, fallback }: any) {
  const { username } = useContext(UserContext);

  return username
    ? children
    : fallback || <Link href="/login">You must be signed in</Link>;
}
