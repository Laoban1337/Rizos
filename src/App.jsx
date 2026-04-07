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
          Rizo’s Culinary Arts journey began with a deep appreciation for the
          foundations of French cooking, where she developed discipline,
          technique, and a respect for quality ingredients. Over the years, she
          gained experience in a variety of culinary roles, but no matter where
          her path took her, baking remained her true passion. What started as a
          simple love for creating bread and sweet treats at home quickly grew
          into something more. Rizo began sharing her baked goods with family,
          friends, and neighbors—refining her craft with every batch and
          building a reputation for warmth, flavor, and consistency. Today, her
          work reflects both her classical training and her genuine love for
          baking—bringing people together through thoughtfully made, homemade
          creations.
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
          <Route path ="muffinofthemonth" element ={<MuffinOfTheMonth/>}/>
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
