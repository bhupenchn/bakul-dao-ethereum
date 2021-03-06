import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App.jsx";

// Import ThirdWeb
import { ThirdwebWeb3Provider } from '@3rdweb/hooks';

// Include what chains you want to support
// 4 = Rinkeby
const supportedChainIds = [4];

// Include what type of wallets you want to support 
// Here we are supporting Metamask which is a "injected wallet"
const connectors = {
  injected: {},
};


// Wrap the App with the third web provider
ReactDOM.render(
  <React.StrictMode>
    <ThirdwebWeb3Provider
      connectors={connectors}
      supportedChainIds={supportedChainIds}
    >

      <App />
    </ThirdwebWeb3Provider>
    
  </React.StrictMode>,
  document.getElementById("root")
);
