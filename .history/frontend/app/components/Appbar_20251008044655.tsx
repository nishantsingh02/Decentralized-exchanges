"use client";
import { useSession } from "next-auth/react";
import { PrimaryButton } from "./Button";
import { signOut } from "next-auth/react";

export const Appbar = () => {
  const session = useSession();
  return (
    <div className="border-b px-2 py-2 flex justify-between">
      <div className="text-3xl font-extrabold bg-gradient-to-r from-gray-500 via-black-500 to-gray-500 text-transparent bg-clip-text tracking-wide drop-shadow-md">DCEX</div>
      <div>
        {session.data?.user ? (
          <PrimaryButton onClick={() => signOut()}>SignOut</PrimaryButton>
        ) : (
          <PrimaryButton onClick={() => }>SignIn</PrimaryButton>
        )}
      </div>
    </div>
  );
};
