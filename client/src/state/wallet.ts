import { ethers } from "ethers";
import { atom } from "jotai";

import mmoGame from "../assets/MMOGame.json";
const contractAddress = "0x0eaBDC3793200d20Dc2cB023C8fe7DfDb213e44E";

export const LoadingInitWeb3Atom = atom(false);
export const AccountAtom = atom(null);
export const ContractAtom = atom<ethers.Contract | null>(null);

export const initWeb3Atom = atom(null, async (get, set) => {
  if (get(AccountAtom) !== null) return;
  try {
    set(LoadingInitWeb3Atom, true);
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
      set(AccountAtom, account);
    } else {
      console.log("No authorized account found");
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const gameContract = new ethers.Contract(
      contractAddress,
      mmoGame.abi,
      signer
    );

    set(ContractAtom, gameContract);
    set(LoadingInitWeb3Atom, false);
  } catch (error) {
    console.log(error);
  }
});

export const connectWalletAtom = atom(null, async (_, set) => {
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
    set(AccountAtom, accounts[0]);
  } catch (error) {
    console.log(error);
  }
});
