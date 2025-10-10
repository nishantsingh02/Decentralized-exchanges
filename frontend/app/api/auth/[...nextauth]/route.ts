import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import db from "@/app/db"
import { Keypair } from "@solana/web3.js"

const handler = NextAuth({
   providers: [
     GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
    })
   ],
   callbacks: {
      async signIn({user, account, profile, email, credentials}) {
         if (account?.provider === "google") {
            const email = user.email; 
            console.log({user, account, profile, email, credentials})
            // email can be null or undefined, so check safely
            if (!email) {
               return false
            }

            
            const userDb = await db.user.findFirst({
               where: {
                  username: email
               }
            })

            if(userDb) {
               return true;
            }

            const keypair = Keypair.generate(); // have a publickey and privatekey(publickey)
            const publickey = keypair.publicKey.toString();
            const privatekey = keypair.secretKey
            
            await db.user.create({
               data: {
                  username: email,
                  password: "",
                  provider: "Google",
                  solWallet: {
                     create: {
                        publickey: publickey ,
                        privatekey: privatekey.toString()
                     }
                  }, 
                  inrWallet: {
                     create: {
                        balance: 0
                     }
                  }
               }
            })

            return true;
         }
         
         return true
      }
   }
})

export { handler as GET, handler as POST}



//for test
// console.log({
//    clientId: process.env.GOOGLE_CLIENT_ID ?? "",
//    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
// })