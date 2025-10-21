"use client";

import { ReactElement } from "react";

interface ButtonProps {
    children: React.ReactNode,
    onClick: () => void
}

export const PrimaryButton = ({children, onClick}: ButtonProps) => {
    return <button onClick={onClick} className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300">
        {children}
    </button>
}

export const TabButton = ({active, children, onClick}: {
    active: boolean;
    children: React.ReactNode
    onClick: () => void
}) => {
    return <button onClick={onClick} className={`text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ${active ? "bg-blue-700" : "bg-blue-300"}`}>
        {children}
    </button>
}