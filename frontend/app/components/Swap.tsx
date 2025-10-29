import { SUPPORTED_TOKEN, TokensDetails } from "@/lib/tokens";
import {ReactNode, useEffect, useState, useRef } from "react";
import { TokenWithBalance } from "../api/hooks/route";
import { PrimaryButtonSwap } from "./Button";
import axios from "axios";

export function Swap({
  publickey,
  tokenBalances,
}: {
  publickey: string;
  tokenBalances: {
    tokenBalance: number;
    tokens: TokenWithBalance[];
  };
}) {
  const [baseAsset, setBaseAsset] = useState(SUPPORTED_TOKEN[0]); // by default its SOL
  const [quateAsset, setQuateAsset] = useState(SUPPORTED_TOKEN[1]); // by default its USDC
  const [baseAmount, setBaseAmount] = useState<string>();
  const [quateAmount, setQuateAmount] = useState<string>();

  const isFetching = useRef(false);

  useEffect(() => {
    // We create a function inside the effect that will fetch the quote
    const fetchQuote = () => {
      // 1. Guard against multiple requests
      if (isFetching.current) return;

      // 2. Guard for valid data *at the time of execution*
      // This is the guard that was catching your "token not tradable" error
      // because the mints were correct, but the amount was invalid (0 or NaN).
      if (
        !baseAmount ||
        Number(baseAmount) <= 0 ||
        isNaN(Number(baseAmount)) ||
        !baseAsset?.mint ||
        !quateAsset?.mint ||
        baseAsset.decimals === undefined ||
        quateAsset.decimals === undefined
      ) {
        setQuateAmount(""); // Clear quote if input is invalid
        return;
      }
      
      // 3. Set fetching lock
      isFetching.current = true;
      console.log("SUCCESS: All data present. Calling backend API...");

      const amountInSmallestUnit = (Number(baseAmount) * (10 ** baseAsset.decimals)).toString();

      const params = new URLSearchParams({
        inputMint: baseAsset.mint,
        outputMint: quateAsset.mint, // Read the latest state
        amount: amountInSmallestUnit,
        slippageBps: '50'
      });

      axios.get(`/api/quote?${params.toString()}`)
        .then(res => {
          if (res.data && res.data.outAmount) {
            const amountOut = Number(res.data.outAmount) / (10 ** quateAsset.decimals);
            setQuateAmount(amountOut.toString());
          }
        })
        .catch(err => {
          console.error("Error fetching quote from your backend:", err);
          if (err.response) {
            // This log is what showed us the "TOKEN_NOT_TRADABLE" error
            console.error("Backend error details:", err.response.data);
          }
          setQuateAmount('0'); // Show '0' on error
        })
        .finally(() => {
          // 4. Release fetching lock
          isFetching.current = false;
        });
    };
    
    // 5. Create a 300ms delay (debounce)
    // This prevents firing API calls on every keystroke
    const handler = setTimeout(() => {
      fetchQuote();
    }, 300);

    // 6. Cleanup function
    // This runs if the dependencies change before the 300ms is up
    return () => {
      clearTimeout(handler);
      // We don't reset the fetch lock here, let finally() handle it
    };

  }, [baseAsset, quateAsset, baseAmount]); // This dependency array is correct

  return (
    <div className="p-12">
      <div className="text-2xl  font-bold pb-4">Swap Token</div>

      <SwapInputRow
        amount={baseAmount}
        onAmountChange={(value: string) => {
          setBaseAmount(value);
        }}
        onSelect={(assets) => {
          setBaseAsset(assets);
        }}
        selectedToken={baseAsset}
        title={"You pay:"}
        subtitle={
          <div className="text-slate-500 p-1 font-semibold text-sm">
            Current Balance: ~
            {tokenBalances?.tokens.find((x) => x.name === baseAsset.name)
              ?.balance ?? 0}{" "}
            {baseAsset.name}
          </div>
        }
        topBorderEnabled={true}
        bottomBorderEnabled={false}
      />

      <div className="flex justify-center">
        <div
          onClick={() => {
            let baseAssetTemp = baseAsset;
            setBaseAsset(quateAsset);
            setQuateAsset(baseAssetTemp);
          }}
          className="cursor-pointer rounded-full w-10 h-10 border absolute mt-[-20px] bg-white flex justify-center pt-1.5"
        >
          <SwapIcon />
        </div>
      </div>

      <SwapInputRow
        amount={quateAmount}
        onSelect={(assets) => {
          setQuateAsset(assets);
        }}
        selectedToken={quateAsset}
        title={"You receive:"}
        topBorderEnabled={false}
        bottomBorderEnabled={true}
      />

      {/* // this button causes error div get overflow */}
    <div className="flex justify-end pt-4">
         <PrimaryButtonSwap onClick={() => {
          // trigar swap
        }}>Swap</PrimaryButtonSwap>

    </div>
    </div>
  );
}

function SwapInputRow({
  onSelect,
  selectedToken,
  title,
  subtitle,
  topBorderEnabled,
  bottomBorderEnabled,
  amount,
  onAmountChange
}: {
  onSelect: (asset: TokensDetails) => void;
  selectedToken: TokensDetails;
  subtitle?: ReactNode;
  title: string;
  topBorderEnabled: boolean;
  bottomBorderEnabled: boolean;
  amount?: string;
  onAmountChange?: (value: string) => void
}) {
  return (
    <div
      className={`border flex justify-between p-6 ${
        topBorderEnabled ? "rounded-t-xl" : ""
      } ${bottomBorderEnabled ? "rounded-b-xl" : ""}`}
    >
      <div>
        <div className="text-xs font-semibold mb-1">{title}</div>
        <AssetSelector selectedToken={selectedToken} onSelect={onSelect} />
        {subtitle}
      </div>
      <div className="">
        <input
          type="text"
          className="w-75 border rounded-2xl text-4xl p-6 outline-none"
          dir="rtl"
          value={amount || ""} // that means the input is alwas controlled means it have a value always
          onChange={(e) => {
            onAmountChange?.(e.target.value)
          }}
        ></input>
      </div>
    </div>
  );
}

function AssetSelector({
  selectedToken,
  onSelect,
}: {
  selectedToken: TokensDetails;
  onSelect: (asset: TokensDetails) => void;
}) {
  return (
    <div className="w-30">
      <select
        onChange={(e) => {
          const selectedToken = SUPPORTED_TOKEN.find(
            (x) => x.name === e.target.value
          );
          if (selectedToken) {
            onSelect(selectedToken);
          }
        }}
        id="tokens"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        {SUPPORTED_TOKEN.map((token) => (
          <option selected={selectedToken.name == token.name}>
            {token.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function SwapIcon() {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        className="size-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
        />
      </svg>
    </div>
  );
}
