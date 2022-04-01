import React, { useEffect, useState } from "react";

import SelectCharacter from "./components/SelectCharacter";
import Arena from "./components/Arena";
import LoadingIndicator from "./components/LoadingIndicator";

import { useWallet } from "./hooks/useWallet";
import { BigNumber } from "ethers";

// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

/*
 * Add this method and make sure to export it on the bottom!
 */
const transformCharacterData = (characterData: any) => {
  console.log("Character Data:", characterData);
  return {
    name: characterData.name,
    health: characterData.health.toNumber(),
    maxHealth: characterData.maxHealth?.toNumber(),
    attackPower: characterData.attackPower.toNumber(),
    healPower: characterData.healPower?.toNumber(),
    gifUris: characterData.gifUris,
  };
};

const App = () => {
  const { currentAccount, contract, connectWalletAction, loading } =
    useWallet();

  /*
   * Right under current account, setup this new state property
   */
  const [characterNFT, setCharacterNFT] = useState<ReturnType<
    typeof transformCharacterData
  > | null>(null);
  const [roster, setRoster] = useState<
    ReturnType<typeof transformCharacterData>[]
  >([]);
  const [arenaBoss, setArenaBoss] =
    useState<ReturnType<typeof transformCharacterData>>();
  const [selected, setSelected] = useState<number | null>(null);

  /*
   * Add this useEffect right under the other useEffect where you are calling checkIfWalletIsConnected
   */
  useEffect(() => {
    /*
     * The function we will call that interacts with out smart contract
     */
    const fetchNFTMetadata = async () => {
      if (!contract) return;
      console.log("Checking for Address roster:", currentAccount);

      if (await contract.userHasRoster()) {
        console.log("User has roster");
        const userHasSelected: BigNumber = await contract.getSelectedChampion();
        console.log("Selected Champion index:", userHasSelected.toNumber());
        setSelected(userHasSelected.toNumber());
        const selected = transformCharacterData(
          await contract.getNFTChampion(userHasSelected)
        );
        console.log("Selected Champion data:", selected);
        const roster = await contract.getUserRoster();
        roster.forEach(async (champId: number) => {
          const getNFTChampion = await contract.getNFTChampion(champId);
          setRoster((r) => r.concat(transformCharacterData(getNFTChampion)));
        });
        const boss = await contract.getArenaBoss();
        setArenaBoss(transformCharacterData(boss));
        if (selected.name) setCharacterNFT(selected);
      } else {
        console.log("No roster found");
      }
    };

    /*
     * We only want to run this, if we have a connected wallet
     */
    if (currentAccount) {
      console.log("CurrentAccount:", currentAccount);
      fetchNFTMetadata();
    }
  }, [currentAccount, contract]);

  async function selectChampion(id: number) {
    console.log("Selecting champion:", id);
    if (contract) {
      await contract.setSelectChampion(id);
      const champ = transformCharacterData(await contract.getNFTChampion(id));
      setCharacterNFT(champ);
      console.log("Success champion selected:", champ);
    }
  }

  async function goToBattle() {
    console.log("Going to battle!");
    if (contract) {
      await contract.addChampionToArena();
    }
  }

  useEffect(() => {
    async function onArenaStarted() {
      if (contract) {
        const arenaBoss = await contract.getArenaBoss();
        setArenaBoss(transformCharacterData(arenaBoss));
      }
    }

    if (contract) {
      contract.on("ArenaStarted", onArenaStarted);
    }

    return () => {
      /*
       * When your component unmounts, let;s make sure to clean up this listener
       */
      if (contract) {
        contract.off("ArenaStarted", onArenaStarted);
      }
    };
  }, [contract]);

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
              {(!selected || i !== selected - 1) && (
                <button onClick={() => selectChampion(i)}>
                  Select champion
                </button>
              )}
              {selected && i === selected - 1 && (
                <button onClick={goToBattle}>Go to battle!</button>
              )}
            </div>
          ))}
        </div>
      );
    } else if (currentAccount && !characterNFT) {
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
        {arenaBoss && <div>{arenaBoss.name}</div>}
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
