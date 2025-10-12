
import { getServerSession } from "next-auth"
import { ProfileCard } from "../components/ProfileCard"
import db from "@/app/db"
import { authConfig } from "@/lib/auth";
import { error } from "console";

async function getUserWallet() {
  const session = await getServerSession(authConfig);  // for server Side

 const userWallet = await db.solWallet.findFirst({
    where: {
      userId: session?.user?.uid // this uid is stor in token in the authConfig function
    },
    select: {
      publickey: true
    }
  })

  console.log( "hi nishu",userWallet) 

  if(!userWallet) {
    return {
      error: "No Solana Wallet Found associated to the user"
    }
  }

  return {error: null, userWallet}

}

export default async function() {
  const userWallet = await getUserWallet();

  if(userWallet.error || !userWallet.userWallet?.publickey) {
    return <div>
      No SOl Wallet found
    </div>
  }

  return <div>
    <ProfileCard publickey = {userWallet.userWallet?.publickey} />
  </div>
}