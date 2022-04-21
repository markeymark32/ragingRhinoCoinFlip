import React, { useState, useEffect } from "react";
import "../Coinflip.css";
import Button from "@mui/material/Button";
import { login, logout } from "../utils";
import {
  utils,
  connect,
  keyStores,
  transactions,
  providers
} from "near-api-js";
import getConfig from "../config";
import Histroy from "./Histroy";

function Coinflip(props) {
  const [deposit, setDeposit] = useState(0);
  const [credits, setCredits] = useState();
  const [lastResult, setLastResult] = useState();
  const [sideSelected, setSideSelected] = useState("Heads");
  const [nearPrice, setNearPrice] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=near&vs_currencies=usd"
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((response) => {
        console.log("Near Price", response);
        setNearPrice(response.near.usd);
      });

    async function getData() {
      let credits = await window.contract
        .get_chance({ account_id: window.accountId })
        .catch((err) => {
          console.log(err);
        });
      setCredits(credits);
    }
    getData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const provider = new providers.JsonRpcProvider(
        "https://archival-rpc.mainnet.near.org"
      );

      const urlSearchParams = new URLSearchParams(window.location.search);
      const params = urlSearchParams.get("transactionHashes");

      const result = await provider.txStatus(
        params,
        window.walletConnection._near.config.contractName
      );

      console.log(result.receipts_outcome[0]);

      setStatus(result.receipts_outcome[0].outcome.logs[3]);
    }
    fetchData();
  });

  const Clear = async () => {
    setDeposit(0);
    setSideSelected("");
  };

  const SetCoin = async (e) => {
    setSideSelected(e.target.value);
  };

  const AddBet = async (e) => {
    setDeposit((prevDeposit) => prevDeposit + Number(e.target.value));
    if ({ deposit } > 10) {
      setDeposit(10);
    }
  };

  const Flip = async () => {
    console.log({ sideSelected });
    const nearConfig = getConfig(process.env.NODE_ENV || "development");
    const near = await connect(
      Object.assign(
        { deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } },
        nearConfig
      )
    );
    const depositValue = { deposit };
    const flippedCoin = { sideSelected };
    const contractId = window.contract.contractId;
    const account = await near.account(window.accountId);

    if (flippedCoin["coin"] !== "") {
      if (depositValue["deposit"] !== 0) {
        await account
          .functionCall({
            contractId: contractId,
            methodName: "play",
            bet_value: flippedCoin["coin"],
            gas: "300000000000000",
            attachedDeposit: utils.format.parseNearAmount(
              depositValue["deposit"]
            )
          })
          .then(async (result) => {
            console.log(result);
            if (result) {
              setLastResult("Win");
            } else {
              setLastResult("Lose");
            }
            let credits = await window.contract
              .get_chance({ account_id: window.accountId })
              .catch((err) => {
                console.log(err);
              });
            setCredits(credits);
          });
      } else {
        alert("You must deposit a bet to play");
      }
    } else {
      alert("You must chose heads or tails");
    }
  };

  const Claim = async () => {};

  return (
    <div className="container-center-horizontal">
      <div className="x2-coinflip screen">
        <div className="nav pixeloidsans-regular-normal-white-16px">
          <img
            className="raging-rhinos"
            src="https://anima-uploads.s3.amazonaws.com/projects/625f543462fd13e687a91026/releases/625fe28395bd0d454b070c27/img/raging-rhinos@2x.svg"
            alt="logo"
          />
          <div className="group-2">
            <img
              className="discord-logo-white-1"
              src="https://anima-uploads.s3.amazonaws.com/projects/625f543462fd13e687a91026/releases/625fe28395bd0d454b070c27/img/discord-logo-white-1@2x.svg"
              alt="discord"
            />
          </div>
          <div className="group-1">
            <img
              className="icon-twitter"
              src="https://anima-uploads.s3.amazonaws.com/projects/625f543462fd13e687a91026/releases/625fe28395bd0d454b070c27/img/twitter-bird-1@2x.svg"
              alt="twitter"
            />
          </div>
          <div className="place">
            <a href="/homepage" className="pixeloidsans-bold-white-16px">
              Home
            </a>
          </div>
          <div className="coin-flip">
            <a href="/" className="pixeloidsans-bold-white-16px">
              Coin Flip
            </a>
          </div>
          <div className="staking">
            <a href="/staking" className="pixeloidsans-bold-white-16px">
              Staking
            </a>
          </div>
          <div className="raffle-and-auction">
            <a href="/raffle" className="pixeloidsans-bold-white-16px">
              Raffle and Auction
            </a>
          </div>
          <div className="overlap-group">
            {window.walletConnection.isSignedIn() && (
              <Button onClick={logout}>
                <div className="connect-wallet pixeloidsans-bold-white-16px">
                  {window.accountId}
                </div>
              </Button>
            )}
            {!window.walletConnection.isSignedIn() && (
              <Button onClick={login}>
                <div className="connect-wallet pixeloidsans-bold-white-16px">
                  Connect Wallet
                </div>
              </Button>
            )}
          </div>
        </div>
        <div className="coinflip">
          <div className="flex-row">
            <img
              className="group-11"
              src="https://anima-uploads.s3.amazonaws.com/projects/625f543462fd13e687a91026/releases/625fe28395bd0d454b070c27/img/group-11@2x.svg"
              alt="coin"
            />
            <h1 className="title">Raging Rhinos Coin Flip</h1>
          </div>
          <div className="overlap-group-container pixeloidsans-regular-normal-white-16px">
            <div className="overlap-group9 border-1px-mortar">
              <div className="side">Side</div>
              <Button
                sx={{ minWidth: "auto" }}
                size="sm"
                onClick={(e) => setSideSelected(e.target.value)}
              >
                <img
                  className="group-11-1"
                  src="https://anima-uploads.s3.amazonaws.com/projects/625f543462fd13e687a91026/releases/625fe28395bd0d454b070c27/img/group-11-1@2x.svg"
                  value="Heads"
                  alt="Heads"
                />
              </Button>
              <Button
                sx={{ minWidth: "auto" }}
                size="sm"
                onClick={(e) => setSideSelected(e.target.value)}
              >
                <img
                  className="group-11-2"
                  src="https://anima-uploads.s3.amazonaws.com/projects/625f543462fd13e687a91026/releases/625fe28395bd0d454b070c27/img/group-11-2@2x.svg"
                  value="Tails"
                  alt="Tails"
                />
              </Button>
            </div>
            <div className="overlap-group10 pixeloidsans-bold-white-16px border-1px-mortar">
              <div className="near">$NEAR</div>
              <div className="text-1">{deposit}</div>
            </div>
            <div className="frame-container border-1px-mortar">
              <div className="frame-14">
                <Button
                  sx={{ minWidth: "auto" }}
                  size="sm"
                  onClick={() => Clear()}
                >
                  <div className="clear">clear</div>
                </Button>
              </div>
              <div className="frame-15">
                <Button
                  sx={{ minWidth: "auto", color: "white" }}
                  size="sm"
                  onClick={(e) => AddBet(e)}
                >
                  <div className="text-1pixeloidsans-regular-normal-white-16px">
                    +0.05
                  </div>
                </Button>
              </div>
              <div className="frame-16">
                <Button
                  sx={{ minWidth: "auto", color: "white" }}
                  size="sm"
                  onClick={(e) => AddBet(e)}
                >
                  <div className="text-1pixeloidsans-regular-normal-white-16px">
                    +0.5
                  </div>
                </Button>
              </div>
              <div className="frame-17">
                <Button
                  sx={{ minWidth: "auto", color: "white" }}
                  size="sm"
                  onClick={(e) => AddBet(e)}
                >
                  <div className="text-1pixeloidsans-regular-normal-white-16px">
                    +1
                  </div>
                </Button>
              </div>
              <div className="frame-18">
                <Button
                  sx={{ minWidth: "auto", color: "white" }}
                  size="sm"
                  onClick={(e) => AddBet(e)}
                >
                  <div className="text-1pixeloidsans-regular-normal-white-16px">
                    +10
                  </div>
                </Button>
              </div>
              <div className="frame-20">
                <Button
                  sx={{ minWidth: "auto", color: "white" }}
                  size="sm"
                  onClick={(e) => AddBet(e)}
                >
                  <div className="text-1pixeloidsans-regular-normal-white-16px">
                    1/2
                  </div>
                </Button>
              </div>
              <div className="frame-19">
                <Button
                  sx={{ minWidth: "auto", color: "white" }}
                  size="sm"
                  onClick={(e) => AddBet(e)}
                >
                  <div className="x2pixeloidsans-regular-normal-white-16px">
                    x2
                  </div>
                </Button>
              </div>
              <div className="frame-21">
                <Button
                  sx={{ minWidth: "auto", color: "white" }}
                  size="sm"
                  onClick={(e) => AddBet(e)}
                >
                  <div className="namepixeloidsans-regular-normal-white-16px">
                    MAX
                  </div>
                </Button>
              </div>
              <div className="frame-14-1">
                <Button
                  sx={{ minWidth: "auto", color: "white" }}
                  size="sm"
                  onClick={(e) => AddBet(e)}
                >
                  <div className="create-gamepixeloidsans-bold-white-16px">
                    Create Game
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="youwon">
          <img
            className="group-24"
            src="https://anima-uploads.s3.amazonaws.com/projects/625f543462fd13e687a91026/releases/625fe28395bd0d454b070c27/img/group-24@2x.svg"
            alt="coin"
          />
          <div className="you-won">You Won!</div>
          <div className="x05-near">{credits}</div>
          <div className="overlap-group-1">
            <div className="claim-reward">
              <Button
                sx={{ minWidth: "auto", color: "white" }}
                size="sm"
                onClick={() => Claim()}
              >
                <div className="connect-wallet pixeloidsans-bold-white-16px">
                  Claim Reward
                </div>
              </Button>
            </div>
          </div>
        </div>
        <div className="history">
          <div className="overlap-group-container-1">
            <Histroy />
          </div>
        </div>
        <div className="footer">
          <div className="flex-col">
            <img
              className="raging-rhinos"
              src="https://anima-uploads.s3.amazonaws.com/projects/625f543462fd13e687a91026/releases/625fe28395bd0d454b070c27/img/raging-rhinos@2x.svg"
              alt="coin"
            />
            <p className="lorem-ipsum-dolor-si pixeloidsans-regular-normal-white-16px">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
              accumsan purus sed lectus.
            </p>
          </div>
          <p className="raging-rhinos-powered-by-near pixeloidsans-regular-normal-white-16px">
            Raging Rhinos Powered By Near
          </p>
        </div>
      </div>
    </div>
  );
}

export default Coinflip;
