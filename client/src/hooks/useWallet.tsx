import React, { useState, useEffect, useContext, createContext } from "react";

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
  const [currentAccount, setCurrentAccount] = useState(null);

  async function checkIfWalletIsConnected() {
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
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return {
    loading,
    currentAccount,
    connectWalletAction,
  };
}
