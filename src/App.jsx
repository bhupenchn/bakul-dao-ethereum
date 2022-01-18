import { useEffect, useMemo, useState } from "react";

import { useWeb3 } from "@3rdweb/hooks";

const App = () => {
  // these are hooks provided by 3rdweb 
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("👋 Address: ", address)

  // if wallet not connected
  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to BakulDAO</h1>
        <button onClick={() => connectWallet("injected")} className="btn-hero">
          Connect your Wallet
        </button>
      </div>
    );
  }

  // if wallet connected
  return (
    <div className="landing">
      <h1>👀 wallet connected, now what!</h1>
    </div>
  );
};

export default App;
