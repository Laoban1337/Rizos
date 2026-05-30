import muffin from "../../public/muffin.png"
import MuffinsOfTheMonth from "./mom"
const muffins = MuffinsOfTheMonth

export default function MuffinOfTheMonth() {
  // const currentMonth = new Date().getMonth();
  // const currentMuffin = muffins[0].month
  // const itemMap = new Map (muffins =>[muffins.id],muffins)
  // function GetMuffins(itemMap){
  //  return itemMap.get(new Date().getMonth)
  // }
  console.log(muffins[9].name)
  
  return (
  
    <>
    
    
      <h1 className="header-text">Muffin the month</h1>
      <div className="muffin-container">
        <p> This month: {muffins[1].name}</p>
        <img  className ="muffin-img"src={muffin}/>
        <p className="next-month"> Next Month: {muffins[2].name}</p>
        {/* {GetMuffins()} */}
      </div>
    </>
  );
}
