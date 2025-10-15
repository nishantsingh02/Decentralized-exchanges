import { TokensDetails } from "@/lib/constant";
import { useEffect, useState } from "react";
import axios from "axios";

interface TokenWithBalance extends TokensDetails {
    balance: string,
    usdBalance: string
}

export function useTokens(address: string) {
    const [tokenBalance, setTokenBalances] = useState<{
        totalBalance: number,
        tokens: TokenWithBalance
    } | null>(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axios.get(`api/tokens?address=${address}`)
        .then(res => {
            setTokenBalances(res.data);
            setLoading(false);
        })
    }, [])

    return {
        loading, tokenBalance
    }
}