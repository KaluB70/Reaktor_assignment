import "./App.css";
import Ongoing from "./Components/Ongoing";
import PlayerData from "./Components/PlayerData";
import Players from "./Components/Players";

function App() {
  return (
    <div className="flex flex-row justify-evenly text-2xl font-mono bg-violet-300 h-screen">
      <Ongoing></Ongoing>
      <Players></Players>
      <PlayerData></PlayerData>
    </div>
  );
}

export default App;
