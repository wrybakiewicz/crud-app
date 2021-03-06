import React from "react";
import {ConnectWallet} from "./ConnectWallet";

import CrudArtifact from "../contracts/Crud.json";
import contractAddress from "../contracts/contract-address.json";
import {ethers} from "ethers";
import {AllPosts} from "./AllPosts";
import {CreatePost} from "./CreatePost";

const HARDHAT_NETWORK_ID = '31337';

export class Dapp extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.initialState = {
            selectedAddress: undefined,
            networkError: undefined,
            crud: undefined,
            refreshPosts: undefined
        };

        this.state = this.initialState;
    }

    componentDidMount() {
        this._connectWallet();
    }


    render() {
        if (window.ethereum === undefined) {
            return <h2>Install ethereum wallet wallet</h2>;
        }

        if (!this.state.selectedAddress) {
            return (
                <ConnectWallet
                    connectWallet={() => this._connectWallet()}
                    networkError={this.state.networkError}
                    dismiss={() => this._dismissNetworkError()}
                />
            );
        }

        if (!this.state.crud) {
            return <div>Loading...</div>
        }

        return <div>
            <h2>Welcome: {this.state.selectedAddress}</h2>
            <div>
                <CreatePost crud={this.state.crud} refreshPosts={() => this.setState({refreshPosts: true})}/>
                <AllPosts crud={this.state.crud} selectedAddress={this.state.selectedAddress} refreshPosts={this.state.refreshPosts}/>
            </div>
        </div>;
    }

    async _connectWallet() {
        // This method is run when the user clicks the Connect. It connects the
        // dapp to the user's wallet, and initializes it.

        // To connect to the user's wallet, we have to run this method.
        // It returns a promise that will resolve to the user's address.
        const [selectedAddress] = await window.ethereum.enable();

        // Once we have the address, we can initialize the application.

        // First we check the network
        if (!this._checkNetwork()) {
            return;
        }

        this._initialize(selectedAddress);

        // We reinitialize it whenever the user changes their account.
        window.ethereum.on("accountsChanged", ([newAddress]) => {
            this._stopPollingData();
            // `accountsChanged` event can be triggered with an undefined newAddress.
            // This happens when the user removes the Dapp from the "Connected
            // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
            // To avoid errors, we reset the dapp state
            if (newAddress === undefined) {
                return this._resetState();
            }

            this._initialize(newAddress);
        });

        // We reset the dapp state if the network is changed
        window.ethereum.on("networkChanged", ([networkId]) => {
            this._resetState();
        });
    }

    _resetState() {
        this.setState(this.initialState);
    }

    _initialize(userAddress) {
        // This method initializes the dapp

        // We first store the user's address in the component's state
        this.setState({
            selectedAddress: userAddress,
        });

        // Then, we initialize ethers, fetch the token's data, and start polling
        // for the user's balance.

        // Fetching the token data and the user's balance are specific to this
        // sample project, but you can reuse the same initialization pattern.
        this._intializeEthers();
    }

    async _intializeEthers() {
        // We first initialize ethers by creating a provider using window.ethereum
        this._provider = new ethers.providers.Web3Provider(window.ethereum);

        // When, we initialize the contract using that provider and the token's
        // artifact. You can do this same thing with your contracts.
        const crud = new ethers.Contract(
            contractAddress.Crud,
            CrudArtifact.abi,
            this._provider.getSigner(0)
        );
        this.setState({crud: crud})
    }

    _checkNetwork() {
        if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
            return true;
        }

        this.setState({
            networkError: 'Please connect Metamask to Localhost:8545'
        });

        return false;
    }

    _dismissNetworkError() {
        this.setState({ networkError: undefined });
    }

}