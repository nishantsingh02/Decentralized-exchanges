"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "./LoadingSpinner";
// import { useTokens } from "../api/hooks/route";
import { TokenList } from "./TokenList";
import { TabButton } from "./Button";

type AssetsProps = {
  publickey: string;
};

type Tab = "Tokens" | "Send" | "Add Funds" | "Swap" | "Withdraw"
const tabs: Tab[] = ["Tokens", "Swap", "Add Funds", "Withdraw", "Send"]

export const ProfileCard = ({ publickey }: { publickey: string }) => {
  // ✅ Step 1: Call ALL your hooks unconditionally at the top.
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<Tab>("Tokens"); // one is token and onther is swap

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
      <div className="flex justify-center items-center h-screen bg-blue-100 p-4">
        <div className="w-full max-w-3xl h-full md:h-auto bg-white rounded-2xl border-gray-300 shadow-2xl flex flex-col justify-start items-start p-4 md:p-8 gap-y-4 md:gap-y-8 overflow-y-auto">
          <Greeting
            image={session.user?.image ?? ""}
            name={session.user?.name ?? ""}
          />
          <div className="w-full flex flex-wrap justify-center gap-3">
            {tabs.map(tab => <TabButton active={tab === selectedTab} onClick={() => {
            setSelectedTab(tab)
          }}>{tab}</TabButton>)}
          </div>
          
          {/* // this make our component alive, so there is no reloading again and again */}
          <div className={`${selectedTab === "Tokens" ? "visible w-full" : "hidden"}`}>
            <Assets publickey={publickey} />
          </div>

        </div>
      </div>
    );
  }

  return null;
};

function Assets({ publickey }: { publickey: string }) {
  const { tokenBalances, loading } = useTokens(publickey);

  if (loading) {
    return "Loading....";
  }

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="text-slate-500 text-lg md:text-xl">Account assets</div>

        <button
          className="bg-slate-500 text-white px-4 py-2 md:px-6 md:py-2 text-sm md:text-base rounded-full uppercase font-semibold hover:bg-slate-600 transition"
          onClick={() => {
            navigator.clipboard.writeText(publickey);
            alert("Wallet address copied!");
          }}
        >
          Your Wallet Address
        </button>
      </div>

      <h1
        className="font-bold text-4xl md:text-[60px] text-grey-900 mobile:text-6xl css-0 mt-4"
        data-cy="wallet-aggregate-balance"
      >
        ${(tokenBalances?.totalBalance || 0).toFixed(2)}
        <span className="ml-2 text-lg md:text-2xl text-gray-500 mobile:text-4xl css-0">
          USD
        </span>
      </h1>

      <div className="p-4 bg-slate-100 rounded-2xl mt-4 w-full">
        {/* {JSON.stringify(tokenBalances?.tokens)} */}
        <TokenList tokens={tokenBalances?.tokens || []} />
      </div>
    </div>
  );
}

function Greeting({ image, name }: { image: string; name: string }) {
  return (
    <div className="flex items-center">
      <img
        src={image}
        className="rounded-full w-12 h-12 md:w-16 md:h-16 p-1 border-2 border-gray-300"
      />
      <div className="font-bold font-serif pl-3 text-2xl md:text-3xl flex flex-col justify-center">
        Welcome back, {name}!
      </div>
    </div>
  );
}