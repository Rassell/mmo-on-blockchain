import React, { useState, useEffect, useContext, createContext } from "react";
import { Contract, ethers } from "ethers";

import mmoGame from "../assets/MMOGame.json";

const contractAddress = "0x0eaBDC3793200d20Dc2cB023C8fe7DfDb213e44E";
const walletContext = createContext({} as ReturnType<typeof useProviderWallet>);

// Provider container
export function ProvideWallet({ children }: { children: React.ReactNode }) {
  const auth = useProviderWallet();
  return (
    <walletContext.Provider value={auth}>{children}</walletContext.Provider>
  );
}

// Hook for child components from provider container.
export const useWallet = () => {
  return useContext(walletContext);
};

// Hook to provide auth methods to child components.
function useProviderWallet() {
  const [loading, setLoading] = useState(true);
  const [contract, setContract] = useState<Contract | null>(null);
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);

  async function checkIfWalletIsConnected() {
    setLoading(true);

    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have MetaMask!");
        return;
      }

      console.log("We have the ethereum object", ethereum);

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  }

  async function connectWalletAction() {
    setLoading(true);
    
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  }

  async function connectContract() {
    setLoading(true);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const gameContract = new ethers.Contract(
      contractAddress,
      mmoGame.abi,
      signer
    );

    setContract(gameContract);
    setLoading(false);
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    connectContract();
  }, []);

  return {
    loading,
    currentAccount,
    contract,
    connectWalletAction,
  };
}
