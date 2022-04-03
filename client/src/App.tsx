import { useAtom } from "jotai";
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import LoadingIndicator from "./components/LoadingIndicator";

import { Home, Roster, CharacterList, Arena } from "./pages";
import {
  LoadingInitWeb3Atom,
  initWeb3Atom,
  AccountAtom,
  connectWallet,
} from "./state/wallet";

// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

export default function App() {
  const [account] = useAtom(AccountAtom);
  const [loading] = useAtom(LoadingInitWeb3Atom);
  const [, initWeb3] = useAtom(initWeb3Atom);
  const [, connect] = useAtom(connectWallet);

  useEffect(() => {
    initWeb3();
  }, [initWeb3]);

  const renderContent = (childrenToRender: JSX.Element) => {
    if (loading) {
      return <LoadingIndicator />;
    }

    if (!account) {
      return (
        <>
          <img
            src="https://64.media.tumblr.com/tumblr_mbia5vdmRd1r1mkubo1_500.gifv"
            alt="Monty Python Gif"
          />
          <button
            className="cta-button connect-wallet-button"
            onClick={connect}
          >
            Connect Wallet To Get Started
          </button>
        </>
      );
    } else {
      return childrenToRender;
      /*
       * If there is a connected wallet and characterNFT, it's time to battle!
       */
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path="characterList"
            element={renderContent(<CharacterList />)}
          />
          <Route path="roster" element={renderContent(<Roster />)} />
          <Route path="arena" element={renderContent(<Arena />)} />
          <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
                <p>There's nothing here!</p>
              </main>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
