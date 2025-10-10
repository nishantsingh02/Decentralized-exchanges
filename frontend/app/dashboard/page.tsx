"use client"
import { useSession } from "next-auth/react";
import { Router, useRouter } from "next/router";

export default function dashboard() {
    const session = useSession();
    

    if(session.status === "loading") {
        return <div>
            Loading...
        </div>
    }

    if(!session.data?.user) {
        Router.push("/");
        return null
    }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-2/3 h-2/3 bg-white rounded-2xl border-gray-300 shadow-2xl flex justify-start items-start p-8">
        <Greeting image={session.data?.user?.image ?? ""} name={session.data?.user?.name ?? ""} />
      </div>
    </div>
  );
}


function Greeting({
    image, name
}: {
    image: string,
    name: string
}) {
    return <div className="flex items-center">
        <img src={image} className="rounded-full w-16 h-16 p-1 border-2 border-gray-300" />
        <div className="font-bold font-serif pl-3 text-3xl flex flex-col justify-center">
           Welcome back, {name}!
        </div>
    </div>
}