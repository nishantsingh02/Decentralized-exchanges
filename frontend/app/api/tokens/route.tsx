import { NextRequest, NextResponse } from "next/server";
import { getAssociatedTokenAddress, getAccount, getMint } from "@solana/spl-token"
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { connection, getSupportedToken } from "@/lib/constant";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get('address') as unknown as string;

    // if there is no wallet address
    if(!address) {
        return NextResponse.json({
            error: "Address is requires"
        }, {
            status: 400
        })
    }
    
    // Get the list of supported tokens WITH their current prices
    const supportedTokens = await getSupportedToken()

    // Fetch the balance for each token in parallel for speed
    const balances = await Promise.all(supportedTokens.map(token => getAccountBalance(token, address)));

    const tokens = supportedTokens.map((token, index) => ({
            ...token,
            balance: balances[index],
            usdBalance: balances[index] * token.price
        }))

    return NextResponse.json({
        tokens,
        totalBalance : tokens.reduce((acc, val) => acc + val.usdBalance, 0) 
        // .reduce() is an array method used to combine all values into a single result.
    })
}


async function getAccountBalance(token: {
    name: string,
    mint: string,
    native: boolean,
    decimals: number,
    id: string
}, address: string) {

    try {
        if(token.native) {
            let balance = await connection.getBalance(new PublicKey(address));
            return balance / LAMPORTS_PER_SOL;
        }

        
        const ata = await getAssociatedTokenAddress(new PublicKey(token.mint), new PublicKey(address));

        const account = await getAccount(connection, ata);

        return Number(account.amount) / (10 ** token.decimals)
    
    } catch (error) {
        // if account does not exist (balance is 0), return 0
        return 0;
    } 

}

    // if(token.native) {
    //     let balance = await connection.getBalance(new PublicKey(address));
    //     return balance / LAMPORTS_PER_SOL;
    // }
    // const ata = await getAssociatedTokenAddress(new PublicKey(token.mint), new PublicKey(address)); 
    // const account = await getAccount(connection, ata);
    // const mint = await getMint(connection, new PublicKey(info.mint));
    // return Number(account.amount) / (10 ** mint.decimals)
