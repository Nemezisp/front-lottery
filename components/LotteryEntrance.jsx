import { useWeb3Contract } from "react-moralis"
import {abi, contractAddresses} from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"
import styles from "./LotteryEntrance.module.css"

const LotteryEntrance = () => {

    const [entranceFee, setEntranceFee] = useState("0")
    const [numberOfPlayers, setNumberOfPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

    const {chainId: chainIdHex, isWeb3Enabled} = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const dispatch = useNotification()

    const {runContractFunction: enterRaffle, isLoading, isFetching} = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee
    })

    const {runContractFunction: getEntranceFee} = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    const {runContractFunction: getNumberOfPlayers} = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const {runContractFunction: getRecentWinner} = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    async function updateUI() {
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        setEntranceFee(entranceFeeFromCall)
        const numberOfPlayersFromCall = (await getNumberOfPlayers()).toString()
        setNumberOfPlayers(numberOfPlayersFromCall)
        const recentWinnerFromCall = (await getRecentWinner())
        setRecentWinner(recentWinnerFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled && raffleAddress) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async (tx) => {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUI()
    }

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell"
        })
    }

    return (
        <div>
            <hr></hr>
            {raffleAddress ? (
                <div>
                    <div style={{display: "flex", flexDirection: "column", gap: "10px", marginBottom: "10px"}}>
                        <span><b>Entrance fee:</b> {ethers.utils.formatUnits(entranceFee, "ether")} ETH</span>
                        <span><b>Current number of players:</b> {numberOfPlayers}</span>
                        <span><b>Recent winner:</b> {recentWinner.slice(0,6) + "..." + recentWinner.slice(recentWinner.length-4) }</span>
                    </div>
                    <button onClick={async() => 
                        {await enterRaffle({
                            onSuccess: handleSuccess,
                            onError: (error) => console.log(error) })
                        }}
                        className={styles.enterButton}
                        disabled={isLoading || isFetching}>
                        Enter Raffle
                    </button>
                </div>
            ) : (
                <div>No Raffle Address Detected - Change Network!</div>
            )
            }
        </div>
    )
}

export default LotteryEntrance