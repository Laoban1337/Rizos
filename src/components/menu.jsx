import { menuItems } from "../components/menu"

export default function Menu() {
  return (
    <>
      

      <div className="menu-list">
        <h1 className="menu-text"> Homemade Creations</h1>
        {menuItems.map((item) => (
          <div key={item.id} className="menu-item">
            <h2>{item.name}</h2>

            <p>
              ${item.price}
              {item.unit ? ` (${item.unit})` : ""}
            </p>

            {item.description && <p>{item.description}</p>}
          </div>
        ))}
      </div>
    </>
  )
}