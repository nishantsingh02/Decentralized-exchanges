import { Connection } from "@solana/web3.js"
import axios from "axios";

let LAST_UPDATED: number | null = null;
let cachedPrices: any = null;

const TOKEN_PRICE_REFRESH_INTERVAL = 60 * 1000; // EVERY 60S or 1 minute

export interface TokensDetails {
    name: string;
    mint: string;
    native: boolean;
    decimals: number;
    id: string;
    image: string
}

export const SUPPORTED_TOKEN: TokensDetails[] = [{
    name: "USDC",
    mint: "6xTBTqJMBr5m7BKqVxmW2x11DfqUwtD3TJsqpxELx72L", // These are MAINNET mint addresses.
    native: false,
    decimals: 6,
    id: "usd-coin", //The ID used by the CoinGecko API.
    image: "https://cdn3.iconfinder.com/data/icons/crypto-coins-7/32/USDC_usd_coin-1024.png"
},{
    name: "USDT",
    mint: "89dre8rZjLNft7HoupGiyxu3MNftR577ZYu8bHe2kK7g",
    native: false,
    decimals: 6,
    id: "tether",
    image: "https://tse3.mm.bing.net/th/id/OIP.24sXYHGooqYxUZnZ8ZhctgHaHa?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3"
}, {
    name: "SOL",
    mint: "So11111111111111111111111111111111111111112",
    native: true,
    decimals: 9,
    id: "solana",
    image: "https://www.liblogo.com/img-logo/so2809s56c-solana-logo-solana-crypto-logo-png-file-png-all.png"
}]

export const connection = new Connection("https://solana-devnet.g.alchemy.com/v2/8y8Hi7MthK7hmykqgbvfg");


export async function getSupportedToken() {

    const isCacheStale = !cachedPrices || !LAST_UPDATED || (new Date().getTime() - LAST_UPDATED > TOKEN_PRICE_REFRESH_INTERVAL)

    if (isCacheStale) {
        console.log("Cache is stale, fetching new prices from CoinGecko...");
        try {
        const response = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=solana,usd-coin,tether&vs_currencies=usd");
        console.log(response);
        // const cachedPrices = response.data; // When the try block finishes, the local cachedPrices. When you declare a variable using const or let, that variable only exists within the "block" of code {...} where it was created.
        cachedPrices = response.data;
          LAST_UPDATED = new Date().getTime();
       } catch(e) {
        console.log("Failed to featch token prices:",e);

        return SUPPORTED_TOKEN.map(token => ({...token, price : 0}));
       }
    } else {
        console.log("RETURNING PRICES FROM CACHE.");
    }

    return SUPPORTED_TOKEN.map(token => ({
        ...token,
        price: cachedPrices[token.id]?.usd || 0
    }) )

}

getSupportedToken();