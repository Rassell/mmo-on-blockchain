import React, {  } from "react";

import SelectCharacter from "./components/SelectCharacter";
import LoadingIndicator from "./components/LoadingIndicator";

import { useArena, useRoster, useWallet } from "./hooks";

// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const { currentAccount, connectWalletAction, loading } =
    useWallet();
  const { boss, goToBattle } = useArena();
  const { roster, selectedChampionId, selectChampion } = useRoster();

  const renderContent = () => {
    if (loading) {
      return <LoadingIndicator />;
    }

    if (!currentAccount) {
      return (
        <>
          <img
            src="https://64.media.tumblr.com/tumblr_mbia5vdmRd1r1mkubo1_500.gifv"
            alt="Monty Python Gif"
          />
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWalletAction}
          >
            Connect Wallet To Get Started
          </button>
        </>
      );
    } else if (currentAccount && roster.length > 0) {
      return (
        <div>
          {roster.map((r, i) => (
            <div>
              <div>{r.name}</div>
              <div>{r.health}</div>
              <div>{r.maxHealth}</div>
              <div>{r.attackPower}</div>
              <div>{r.healPower}</div>
              {i !== selectedChampionId && (
                <button onClick={() => selectChampion(i)}>
                  Select champion
                </button>
              )}
              {i === selectedChampionId && (
                <button onClick={goToBattle}>Go to battle!</button>
              )}
            </div>
          ))}
        </div>
      );
    } else {
      return <SelectCharacter />;
      /*
       * If there is a connected wallet and characterNFT, it's time to battle!
       */
    }
  };

  return (
    <div>
      <div>
        {renderContent()}
        {boss && <div>{boss.name}</div>}
        <div>
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
