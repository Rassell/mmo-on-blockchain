import { useAtom } from "jotai";
import React, { useEffect } from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import LoadingIndicator from "./components/LoadingIndicator";
import { Home, Roster, CharacterList, Arena } from "./pages";
import { receiverArenaStateAtom } from "./state/arena";
import { receiverBattleAtom } from "./state/battle";
import {
  LoadingInitWeb3Atom,
  initWeb3Atom,
  AccountAtom,
  connectWalletAtom,
} from "./state/wallet";

// Constants
const TWITTER_HANDLE = "aresgonza";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

export default function App() {
  const [account] = useAtom(AccountAtom);
  const [loading] = useAtom(LoadingInitWeb3Atom);
  const [, initWeb3] = useAtom(initWeb3Atom);
  const [, connectWallet] = useAtom(connectWalletAtom);
  const [, receiverArenaState] = useAtom(receiverArenaStateAtom);
  const [, receiverBattle] = useAtom(receiverBattleAtom);

  useEffect(() => {
    async function init() {
      await initWeb3();
      await receiverArenaState();
      await receiverBattle();
    }

    init();
  }, [initWeb3, receiverArenaState, receiverBattle]);

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
            onClick={connectWallet}
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
    <MemoryRouter>
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
    </MemoryRouter>
  );
}
