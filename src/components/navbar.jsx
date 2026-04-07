import rizoBanner from "../../public/rizo-banner.png"
import { Link } from "react-router-dom"

export default function Navbar() {
  return (
<nav className="navbar">
  <div className="navbar-container">
    <img src={rizoBanner} className="logo" alt="Rizo Banner" />

    <ul className="nav-links">
      <li><Link to="/">HOME</Link></li>
      <li><Link to="/menu">MENU</Link></li>
      <li><Link to="/order">ORDER</Link></li>
      <li><Link to="/muffinofthemonth">Muffin Of The Month</Link></li>
    </ul>

    <div className="menu-toggle">☰</div>
  </div>
</nav>
  )
}