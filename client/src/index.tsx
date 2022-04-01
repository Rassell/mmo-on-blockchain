import React from "react";
import { createRoot } from "react-dom/client";

import { ProvideWallet } from "./hooks/useWallet";
import App from "./App";

import "./index.css";

const root = createRoot(document.getElementById("root")!);

root.render(
  <ProvideWallet>
    <App />
  </ProvideWallet>
);
