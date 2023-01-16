import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/context";

// Component's children only shown to logged-in users
export default function AuthCheck({ children, fallback }: any) {
  const { username } = useContext(UserContext);

  return username
    ? children
    : fallback || (
        <div className="flex flex-col justify-center items-center h-screen">
          <h1 className="p-4 text-xl font-bold">
            Please login to access this page.
          </h1>
          <Link href="/login" className="btn btn-outline">
            Login
          </Link>
        </div>
      );
}
