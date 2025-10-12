import { Connection } from "@solana/web3.js"
import axios from "axios";

let LAST_UPDATED: number | null = null;
let chachedPrice: any = null;

let prices: {[key: string]: {
    price: string;
}} = {};

const TOKEN_PRICE_REFRESH_INTERVAL = 60 * 1000; // EVERY 60S or 1 minute
export const SUPPORTED_TOKEN: {
    name: string,
    mint: string,
    native: boolean,
    decimals: number
}[] = [{
    name: "USDC",
    mint: "6xTBTqJMBr5m7BKqVxmW2x11DfqUwtD3TJsqpxELx72L",
    native: false,
    decimals: 6
},{
    name: "USDT",
    mint: "89dre8rZjLNft7HoupGiyxu3MNftR577ZYu8bHe2kK7g",
    native: false,
    decimals: 6
}, {
    name: "SOL",
    mint: "So11111111111111111111111111111111111111112",
    native: true,
    decimals: 9
}]

export const connection = new Connection("https://api.mainnet-beta.solana.com");


export async function getSupportedToken() {
    
    
    if ( LAST_UPDATED || new Date().getTime() - LAST_UPDATED < TOKEN_PRICE_REFRESH_INTERVAL) {
        const response = await axios.get("https://price.jup.ag/v6/price?ids=SOL,USDC,USDT");
        // https://api.coingecko.com/api/v3/simple/price?ids=solana,usd-coin,tether&vs_currencies=usd
        const price = response.data.data;
        LAST_UPDATED = new Date().getTime();
    } else {
        
    }

    return SUPPORTED_TOKEN.map(tokens => ({
        ...tokens,
        price: prices[tokens.name].price
        // price: prices[tokens.name].usd
    }) )

}

getSupportedToken();