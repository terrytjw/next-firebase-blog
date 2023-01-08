import { NextPage } from "next";
import React, { useContext } from "react";
import UsernameForm from "../components/LoginPage/UsernameForm";
import { signInAnonymously, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleAuthProvider } from "../lib/firebase";
import { FaGoogle } from "react-icons/fa";
import { UserContext } from "../lib/context";
import Image from "next/image";
import { useRouter } from "next/router";

const LoginPage: NextPage = () => {
  const { user, username, loading } = useContext(UserContext);

  const SignInButton = () => {
    const router = useRouter();

    const signInWithGoogle = async () => {
      await signInWithPopup(auth, googleAuthProvider);

      // need to check if user has a username before redirecting
      if (username) {
        router.push("/");
      }
    };

    return (
      <div className="flex">
        <button
          className="btn btn-accent mx-2 text-white"
          onClick={signInWithGoogle}
        >
          <FaGoogle />
          <span className="ml-2">Sign in with Google</span>
        </button>
        <div
          className="tooltip cursor-not-allowed"
          data-tip="Feature coming soon!"
        >
          <button
            className="btn btn-outline mx-2"
            onClick={() => signInAnonymously(auth)}
            disabled
          >
            Sign in Anonymously
          </button>
        </div>
      </div>
    );
  };

  const SignOutButton = () => (
    <button className="btn" onClick={() => signOut(auth)}>
      Sign Out
    </button>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="p-4 max-w-sm w-full mx-auto">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-6 py-1">
              <div className="h-10 bg-slate-700 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                  <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-slate-700 rounded"></div>
                <div className="h-2 bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col justify-center items-center h-screen">
      <div className="avatar mb-8">
        <div className="w-32 mask mask-squircle">
          {user ? (
            username ? (
              <Image
                src="/images/cute-panda.png"
                alt="photo of a cute panda"
                width={30}
                height={30}
              />
            ) : (
              <Image
                src="/images/shocked-panda.png"
                alt="photo of a cute panda"
                width={30}
                height={30}
              />
            )
          ) : (
            <Image
              src="/images/lovey-panda.png"
              alt="photo of a lovey panda"
              width={30}
              height={30}
            />
          )}
        </div>
      </div>
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  );
};

export default LoginPage;
