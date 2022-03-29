import React from "react";
import ReactDOM from "react-dom";

import { ProvideWallet } from "./hooks/useWallet";
import App from "./App";

import "./index.css";

ReactDOM.render(
  <ProvideWallet>
    <App />
  </ProvideWallet>,
  document.getElementById("root")
);
