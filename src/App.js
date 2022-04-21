import "regenerator-runtime/runtime";
import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Coinflip from "./components/Coinflip";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Coinflip {...coinflipData} />} />
      </Routes>
    </Router>
  );
}

export default App;
const frame161Data = {
  children: "+0.5"
};

const frame162Data = {
  children: "1/2",
  className: "frame-20"
};

const coinflipData = {
  place: "home",
  coinFlip: "coin flip",
  staking: "staking",
  raffleAndAuction: "raffle and auction",
  connectWallet: "connect wallet",
  title: "Raging Rhinos Coinflip",
  side: "side:",
  near: "$NEAR:",
  text1: "0.25",
  clear: "clear",
  text2: "+0.05",
  text4: "+1",
  text5: "+10",
  x2: "x2",
  name: "MAX",
  createGame: "create game",
  youWon: "You Won",
  x05Near: "0.5 NEAR",
  claimReward: "claim reward",
  spanText1: "Wallet (9yMP) flipped 0.05 and ",
  spanText2: "doubled",
  spanText3: ".",
  address1: "22 seconds ago",
  spanText4: "Wallet (9yMP) flipped 0.05 and ",
  spanText5: "doubled",
  spanText6: ".",
  address2: "22 seconds ago",
  spanText7: "Wallet (9yMP) flipped 0.05 and got ",
  spanText8: "rugged",
  spanText9: ".",
  address3: "22 seconds ago",
  spanText10: "Wallet (9yMP) flipped 0.05 and ",
  spanText11: "doubled",
  spanText12: ".",
  address4: "22 seconds ago",
  spanText13: "Wallet (9yMP) flipped 0.05 and ",
  spanText14: "doubled",
  spanText15: ".",
  address5: "22 seconds ago",
  spanText16: "Wallet (9yMP) flipped 0.05 and ",
  spanText17: "doubled",
  spanText18: ".",
  address6: "22 seconds ago",
  spanText19: "Wallet (9yMP) flipped 0.05 and ",
  spanText20: "doubled",
  spanText21: ".",
  address7: "22 seconds ago",
  spanText22: "Wallet (9yMP) flipped 0.05 and ",
  spanText23: "doubled",
  spanText24: ".",
  address8: "22 seconds ago",
  loremIpsumDolorSi:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer accumsan purus sed lectus.",
  ragingRhinosPoweredByNear: "Raging Rhinos powered by Near",
  frame161Props: frame161Data,
  frame162Props: frame162Data
};
