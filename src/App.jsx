import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import rizoBanner from "./assets/rizo-banner.png";
import Order from "./components/order";
import "./App.css";

function App() {
  return (
    <>
      <div>
        <img src={rizoBanner} className="logo" alt="Rizo Banner" />
      </div>
      <h1>Welcome</h1>
      <div className="card">
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
