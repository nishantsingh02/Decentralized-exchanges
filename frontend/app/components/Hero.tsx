"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { GoogleSignInButton } from "./googleSignInButton";
import { useSession } from "next-auth/react";
import { DashboardButton } from "./dashboardButton";
import { useRouter } from "next/navigation";

export const Hero = () => {
  const session = useSession();
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col items-center justify-center text-center space-y-4"
    >
      <div
        className="
    relative inline-flex items-center justify-center py-4 px-10 
    rounded-[3.5rem] 
    bg-gray-400 bg-opacity-40 backdrop-filter backdrop-blur-md 
    border border-white border-opacity-80 
    shadow-2xl shadow-gray-500/80 transition duration-500 hover:shadow-lg hover:shadow-blue-400/80
"
      >
        <span
          className="text-2xl font-extrabold tracking-wider text-transparent bg-clip-text 
                     bg-gradient-to-r from-gray-700 via-gray-900 to-gray-700"
        >
          CRYPTO.IN
        </span>
      </div>

      <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-black text-center mb-4 leading-tight">
        The Indian Crypto Currency{" "}
        <span className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-blue-400">
          Revolution{" "}
        </span>
      </h1>
      <p className="text-xl md:text-2xl font-semibold text-gray-400 text-center mb-8">
        Powering the future of decentralized finance with innovation and trust
      </p>

      {session.data?.user ? (
        <DashboardButton
          onClick={() => {
            router.push("/dashboard");
          }}
        >
          Go to Dashboard
        </DashboardButton>
      ) : (
        <GoogleSignInButton
          onClick={() => {
            signIn("google");
          }}
        />
      )}
    </motion.div>
  );
};
