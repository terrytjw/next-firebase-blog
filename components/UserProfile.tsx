import React from "react";
import Image from "next/image";
import { User } from "../types";

type UserProfileProps = {
  user: User;
};
const UserProfile = ({ user }: UserProfileProps) => {
  return (
    <div className="flex flex-col justify-center items-center mt-10">
      <div className="avatar">
        <div className="w-24 rounded-full">
          <Image src={user.photoURL} alt="" width={30} height={30} priority />
        </div>
      </div>

      <div className="mt-2 text-center">
        <p className="text-gray-500 italic">@{user.username}</p>
        <h1 className="mt-4 text-2xl font-semibold">
          {user.displayName || "Anon user"}
        </h1>
      </div>
    </div>
  );
};

export default UserProfile;
