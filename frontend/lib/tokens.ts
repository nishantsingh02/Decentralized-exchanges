export interface TokensDetails {
  name: string;
  mint: string;
  native: boolean;
  decimals: number;
  id: string;
  image: string;
  price: string
}

export const SUPPORTED_TOKEN: TokensDetails[] = [
  {
    name: "SOL",
    mint: "So11111111111111111111111111111111111111112",
    native: true,
    decimals: 9,
    price: "180", // hard coded the price of token for just testing
    id: "solana",
    image:
      "https://www.liblogo.com/img-logo/so2809s56c-solana-logo-solana-crypto-logo-png-file-png-all.png",
  },
  {
    name: "USDC",
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // These are MAINNET mint addresses.
    native: false,
    decimals: 6,
    price: "1",
    id: "usd-coin", //The ID used by the CoinGecko API.
    image:
      "https://cdn3.iconfinder.com/data/icons/crypto-coins-7/32/USDC_usd_coin-1024.png",
  },
  {
    name: "USDT",
    mint: "BQCDHdAQr4MpJhb8XVRJHvQ7g5X9Cw4D8D6vCcmEEcB5",
    native: false,
    decimals: 6,
    price: "1",
    id: "tether",
    image:
      "https://tse3.mm.bing.net/th/id/OIP.24sXYHGooqYxUZnZ8ZhctgHaHa?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3",
  },
];