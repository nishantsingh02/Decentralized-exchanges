"use client"
import { TokensDetails } from "@/lib/constant";
import { useEffect, useState } from "react";
import axios from "axios";

export interface TokenWithBalance extends TokensDetails {
    balance: string,
    usdBalance: string
    price: string
}

export function useTokens(address: string) {
    const [tokenBalances, setTokenBalances] = useState<{
        totalBalance: number,
        tokens: TokenWithBalance[]
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
        loading, tokenBalances
    }
}