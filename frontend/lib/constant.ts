import { Connection } from "@solana/web3.js";
import axios from "axios";
import { SUPPORTED_TOKEN } from "./tokens";

// Define what the price object looks like
interface PriceData {
  [key: string]: {
    usd: number;
  };
}

let LAST_UPDATED: number | null = null;
let cachedPrices: PriceData;

const TOKEN_PRICE_REFRESH_INTERVAL = 60 * 1000; // EVERY 60S or 1 minute



export const connection = new Connection(
  "https://solana-devnet.g.alchemy.com/v2/8y8Hi7MthK7hmykqgbvfg"
);

export async function getSupportedToken() {
  const isCacheStale =
    !cachedPrices ||
    !LAST_UPDATED ||
    new Date().getTime() - LAST_UPDATED > TOKEN_PRICE_REFRESH_INTERVAL;

  if (isCacheStale) {
    console.log("Cache is stale, fetching new prices from CoinGecko...");
    try {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price?ids=solana,usd-coin,tether&vs_currencies=usd"
      );
      console.log(response);
      // const cachedPrices = response.data; // When the try block finishes, the local cachedPrices. When you declare a variable using const or let, that variable only exists within the "block" of code {...} where it was created.
      cachedPrices = response.data;
      LAST_UPDATED = new Date().getTime();
    } catch (e) {
      console.log("Failed to featch token prices:", e);

      return SUPPORTED_TOKEN.map((token) => ({ ...token, price: 0 }));
    }
  } else {
    console.log("RETURNING PRICES FROM CACHE.");
  }

  return SUPPORTED_TOKEN.map((token) => ({
    ...token,
    price: cachedPrices[token.id]?.usd || 0,
  }));
}

getSupportedToken();
