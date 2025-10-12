"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

type AssetsProps = {
  publickey: string;
};

export const ProfileCard = ({ publickey }: { publickey: string }) => {
  // ✅ Step 1: Call ALL your hooks unconditionally at the top.
  const { data: session, status } = useSession();
  const router = useRouter();

  // This effect hook is also called on every render.
  useEffect(() => {
    // The logic inside the hook is conditional, which is perfectly fine.
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // ✅ Step 2: Now you can have conditional returns.
  if (status === "loading") {
    return <LoadingSpinner />;
  }

  if (status === "authenticated") {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="w-2/3 h-2/3 bg-white rounded-2xl border-gray-300 shadow-2xl flex flex-col justify-start items-start p-8 gap-y-8">
          <Greeting
            image={session.user?.image ?? ""}
            name={session.user?.name ?? ""}
          />
          <Assets publickey={publickey} />
        </div>
      </div>
    );
  }

  return null;
};

function Assets({ publickey }: { publickey: string }) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <div className="text-slate-500 text-xl">Account assets</div>

        <button
          className="bg-slate-500 text-white px-6 py-2 rounded-full uppercase font-semibold hover:bg-slate-600 transition"
          onClick={() => {
            navigator.clipboard.writeText(publickey);
            alert("Wallet address copied!");
          }}
        >
          Your Wallet Address
        </button>
      </div>

      <div className="mt-4">
        <p className="font-mono bg-gray-100 p-2 rounded text-sm text-gray-700 break-all">
          1.9 SOL 
        </p>
      </div>
    </div>
  );
}

function Greeting({ image, name }: { image: string; name: string }) {
  return (
    <div className="flex items-center">
      <img
        src={image}
        className="rounded-full w-16 h-16 p-1 border-2 border-gray-300"
      />
      <div className="font-bold font-serif pl-3 text-3xl flex flex-col justify-center">
        Welcome back, {name}!
      </div>
    </div>
  );
}
