import Rizo from "../public/rizo-banner.png";
import Navbar from "./components/navbar";
import Footer from "./components/footer.jsx";
import Menu from "./components/menu.jsx";
import Order from "./components/order";
import { Routes, Route } from "react-router-dom";
import MuffinOfTheMonth from "./components/muffinofthemonth.jsx";
import "./App.css";

function Home() {
  return (
    <>
      <div className="landingImgContainer">
        <h1 className="welcome text"> Welcome</h1>
        <img src={Rizo} className="landingLogo" alt="Rizo's banner" />
        <p className="landingText">
          Rizo finds joy in the quiet magic of baking, where simple ingredients
          become something warm and meaningful. With every loaf she kneads and
          every batch she pulls from the oven, she pours a little bit of herself
          into the process—patience, care, and a genuine desire to make others
          smile. For her, it’s never just about bread; it’s about the comfort it
          brings, the conversations it sparks, and the happiness she shares one
          loaf at a time.
        </p>
      </div>

      <div className="landingTextContainer"></div>
    </>
  );
}

function App() {
  return (
    <>
      <Navbar />
      <main className="page-shell">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="order" element={<Order />} />
          <Route path="menu" element={<Menu />} />
          <Route path="muffinofthemonth" element={<MuffinOfTheMonth />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
