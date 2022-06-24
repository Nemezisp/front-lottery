import { useMoralis } from 'react-moralis'
import { useEffect } from 'react'

const ManualHeader = () => {
    const { enableWeb3, deactivateWeb3, account, isWeb3Enabled, Moralis, isWeb3EnableLoading } = useMoralis()

    useEffect(() => {
        if (isWeb3Enabled) return
        if (typeof window !== "undefined") {
            if (window.localStorage.getItem("connected")) {
                enableWeb3()
            }
        }
    }, [isWeb3Enabled])

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            if (account == null) {
                window.localStorage.removeItem("connected")
                deactivateWeb3()
            }
        })
    }, [account])

    const onConnect = async () => {
        await enableWeb3()
        if (typeof window !== undefined) {
            window.localStorage.setItem("connected", "injected")
        }
    }

    return (
        <div>
            {account ? <div>Connected to {account.slice(0,6)}...{account.slice(account.length - 4)}</div>
            : <button onClick={onConnect} disabled={isWeb3EnableLoading}>Connect</button>}
        </div>
    )
}

export default ManualHeader