import { signOut } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { UserContext } from "../lib/context";
import { auth } from "../lib/firebase";
import CustomLink from "./CustomLink";
import Image from "next/image";
import DarkModeToggle from "./Toggle/DarkModeToggle";

const Navbar = () => {
  const { user, username, loading } = useContext(UserContext);

  const handleSignout = () => {
    signOut(auth);
    // router.reload();
  };

  return (
    <div className="navbar px-6 bg-base-100">
      <div className="flex-1">
        <CustomLink href="/" className="text-xl font-extrabold tracking-widest">
          N F B
        </CustomLink>
      </div>
      <DarkModeToggle />
      {loading ? (
        <div className="h-8 w-40 bg-slate-600 rounded-lg animate-pulse" />
      ) : user ? (
        <div className="flex">
          <Link
            href="/admin"
            className="btn btn-sm mx-2 hover:bg-gray-500 hover:border-gray-500"
          >
            Manage posts
          </Link>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <Image
                  src={user?.photoURL || "https://placeimg.com/80/80/people"}
                  alt=""
                  width={30}
                  height={30}
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <button onClick={() => alert("Profile page")}>Profile</button>
              </li>
              <li>
                <button onClick={handleSignout}>Logout</button>
              </li>
            </ul>
          </div>

          <div className="relative">
            <span className="badge ml-1 text-gray-500 dark:text-gray-300 tracking-wider bg-gray-200 dark:bg-gray-600 border-none rounded">
              {username ? (
                <span>@{username}</span>
              ) : (
                <span className="italic">nil</span>
              )}
            </span>
            <span
              className="absolute top-[-8px] right-[-4px] tooltip tooltip-left tooltip-accent"
              data-tip="Username status: Green means username is present, red means username is not."
            >
              <span
                className={`relative inline-flex rounded-full h-3 w-3 ${
                  username ? `bg-teal-500` : `bg-pink-500`
                }`}
              ></span>
              <span
                className={`animate-ping absolute right-[-2px] top-[2px] inline-flex h-4 w-4 rounded-full ${
                  username ? `bg-teal-400` : `bg-pink-400`
                } opacity-20`}
              />
            </span>
          </div>
        </div>
      ) : (
        <Link href="/login" className="btn btn-sm btn-outline mx-2">
          Login
        </Link>
      )}
    </div>
  );
};

export default Navbar;
