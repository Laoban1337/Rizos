import muffin from "../../public/muffin.png"
export default function MuffinOfTheMonth() {
  return (
    <>
      <h1 className="muffin-text">Muffin the month</h1>
      <div className="muffin-container">
        <p> This month: Pistachio</p>
        <img  className ="muffin-img"src={muffin}/>
        <p className="next-month"> Next Month: Banna Muffin</p>
      </div>
    </>
  );
}
