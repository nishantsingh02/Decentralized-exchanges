import { TokenWithBalance } from "../api/hooks/route"
import { token}


export function TokenList({tokens} : {
    tokens : TokenWithBalance[]
}) {
    return <div>
        {tokens.map(t => <TokenRow token={t} />)}
    </div>
}

function TokenRow({token}: {
    token: TokenWithBalance
}) {
    return <div className="flex justify-between">
        <div className="flex">
            <div>
                <img src={token.image} className="w-10 h-10 rounded-full pr-2" />
            </div>
            <div>
                <div className="font-bold">
                    {token.name}
                </div>
                <div className="font-slim">
                    1 {token.name} = ~${token.price}
                </div>
            </div>
        </div>
        <div>
            {/* user Total balance */}
            <div className="font-black flex justify-end">
                {Number(token.usdBalance).toFixed(2)}
            </div>
            <div className="font-slim flex justify-end">
                {Number(token.balance).toFixed(2)}
            </div>
        </div>
    </div>
}