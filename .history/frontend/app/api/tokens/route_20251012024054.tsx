import { NextRequest, NextResponse } from "next/server";
import { getAssociatedTokenAddress, getAccount, getMint } from "@solana/spl-token"
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { connection, getSupportedToken } from "@/lib/constant";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get('address') as unknown as string;

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
    const balances = await Promise.all(supportedTokens.map(token => getAccountBalance(token, address)))
    

    return NextResponse.json({
        token: supportedTokens.map((token, index) => ({
            ...token,
            balance: balances[index]
        }))
    })
}


function getAccountBalance(token: {
    name: string,
    mint: string,
    native: boolean
}, address: string) {
    
}