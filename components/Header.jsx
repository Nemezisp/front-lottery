import {ConnectButton} from 'web3uikit'

const Header = () => {
    return (
        <div style={{paddingTop: "20px", paddingBottom: "20px", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
            <h1 style={{margin: "0", fontSize: "30px"}}>Web3 Lottery</h1>
            <ConnectButton moralisAuth={false}/>        
        </div>
    )
}

export default Header